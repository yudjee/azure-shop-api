import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { randomUUID } from "crypto";
import { productsContainer, stocksContainer } from "../common/db";
import { isValidProduct } from "../common/utils";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const productData = req.body;

    if (!productData || !isValidProduct(productData)) {
        context.log('Invalid product');

        context.res = {
            status: 400,
            body: {
                error: "Invalid product"
            }
        };

        return;
    }

    const { count, ...product } = productData;
    const id = randomUUID();

    await productsContainer.items.upsert({ ...product, id });
    context.log("Product created");

    await stocksContainer.items.upsert({ id, count, product_id: id });
    context.log("Stock created");

    context.res = {
        status: 200,
        body: { productData, id }
    };

};

export default httpTrigger;