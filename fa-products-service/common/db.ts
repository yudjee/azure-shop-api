require('dotenv').config();
import { CosmosClient } from "@azure/cosmos";
import {
  dbEndpoint,
  dbKey,
  databaseName,
  productsContainerName,
  stocksContainerName
} from "./conts";

export const cosmosClient = new CosmosClient({ endpoint: dbEndpoint, key: dbKey });
export const database = cosmosClient.database(databaseName);
export const productsContainer = database.container(productsContainerName);
export const stocksContainer = database.container(stocksContainerName);