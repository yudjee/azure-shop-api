require('dotenv').config();
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { productsContainer } from "../common/db";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const id = req.params.id;

    if (!id) {
        context.res = {
            status: 400,
            body: {
                error: "Please pass an id in the query string",
            }
        }
    }

    try {
        const { resource: item } = await productsContainer.item(id, id).read();

        if (!item) {
            context.log("Product not found");

            context.res = {
                status: 404,
                body: { error: "Product not found" }
            }

            return
        }

        context.res = {
            body: item
        };
    } catch (error) {
        const errorMessage = "Error reading item: " + error.message;
        context.log(errorMessage);

        context.res = {
            status: 500,
            body: { error: errorMessage }
        }
    }
};

export default httpTrigger;