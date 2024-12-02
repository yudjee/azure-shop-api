import { AzureFunction, Context } from "@azure/functions";
import { ServiceBusClient } from "@azure/service-bus";
import csv = require('csv-parser');
require('dotenv').config();
import { Readable } from "stream";

const blobTrigger: AzureFunction = async function (context: Context, myBlob: Buffer): Promise<void> {
    context.log('Function triggered:', myBlob.length);
    const serviceBusConnectionString = process.env.SB_CONNECTION_STRING;
    const queueName = "import_products_queue";
    context.log("BEFORE connect to Service Bus", serviceBusConnectionString, queueName);
    const serviceBusClient = new ServiceBusClient(serviceBusConnectionString);
    context.log("Connected to Service Bus");
    const sender = serviceBusClient.createSender(queueName);

    try {
        const blobStream = Readable.from(myBlob.toString());

        blobStream
            .pipe(csv())
            .on("data", async (data) => {
                context.log("Reading row: ", data);

                await sender.sendMessages({ body: data });

                context.res = {
                    status: 200,
                    body: "Message sent successfully to Service Bus queue.",
                };
            })
            .on("error", (error) => {
                context.log("Error parsing CSV: ", error.message);
            })
            .on("end", async () => {
                context.log("Completed reading data");
            });
    } catch (error) {
        context.log('Error sending message to Service Bus:', error.message);
        context.res = {
            status: 500,
            body: `Error sending message to Service Bus: ${error.message}`,
        };
    } finally {
        await sender.close();
        await serviceBusClient.close();
    }
};

export default blobTrigger;