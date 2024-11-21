import { randomUUID } from 'crypto';
import { AzureFunction, Context } from "@azure/functions"
import { productsContainer, stocksContainer } from "../common/db";
require('dotenv').config();

const serviceBusQueueTrigger: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    context.log('ServiceBus queue trigger function processed message', mySbMsg);
    const id = randomUUID();

    await productsContainer.items.create({
        id,
        title: mySbMsg.title,
        price: mySbMsg.price,
        description: mySbMsg.description,
    });
    await stocksContainer.items.create({
        id,
        count: mySbMsg.count,
        product_id: id
    });
};

export default serviceBusQueueTrigger;
