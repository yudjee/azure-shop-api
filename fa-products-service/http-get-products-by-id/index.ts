import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { products } from "../__mocks__";
import { error } from "console";

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

    const product = products.find(product => product.id === Number(id));

    if (!product) {
        context.res = {
            status: 404,
            body: { error: "Product not found" }
        }
    }

    context.res = {
        body: product
    };

};

export default httpTrigger;