require('dotenv').config();
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, SASProtocol, BlobSASPermissions } from "@azure/storage-blob";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const { name } = req.query;
    
    if (!name) {
        context.res = {
            status: 400,
            body: "Please pass a file name on the query string"
        };
        return;
    }
    
    try {
        const accountName = process.env.ACCOUNT_NAME;
        const accountKey = process.env.ACCOUNT_KEY;
        const containerName = "upload-container";

        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
        const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);

        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(name);

        const permissions = new BlobSASPermissions();
        permissions.write = true;

        const sasOptions = {
            containerName,
            blobName: name,
            permissions: permissions,
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
            protocol: SASProtocol.Https
        };
        const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

        const sasUrl = `${blobClient.url}?${sasToken}`;

        context.res = {
            body: { sasUrl }
        };
        return
    } catch (error) {
        context.res = {
            status: 500,
            body: error
        }
    }

};

export default httpTrigger;