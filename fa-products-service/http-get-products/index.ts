import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { products } from "../__mocks__";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    context.res = {
        body: products
    };

};

export default httpTrigger;