import { AzureFunction, Context } from "@azure/functions";
import csv = require('csv-parser');
import { Readable } from "stream";

const blobTrigger: AzureFunction = async function (context: Context, myBlob: Buffer): Promise<void> {
    context.log('Function triggered:', myBlob.length);

    const blobStream = new Readable();
    blobStream.push(myBlob);

    blobStream
        .pipe(csv())
        .on("data", (data) => {
            context.log("Reading row: ", data);
        })
        .on("error", (error) => {
            context.log("Error parsing CSV: ", error.message);
        })
        .on("end", async () => {
            context.log("Completed reading data");
        });
};

export default blobTrigger;