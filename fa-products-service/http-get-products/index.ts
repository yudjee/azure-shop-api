require('dotenv').config();
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { productsContainer } from "../common/db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const response: any = await productsContainer.items
        .readAll()
        .fetchAll();

    if (!response.resources) {
        context.res = {
            status: 404,
            body: {
                error: "No products found"
            }
        }

        return
    }

    context.res = {
        body: response.resources
    };
};

export default httpTrigger;