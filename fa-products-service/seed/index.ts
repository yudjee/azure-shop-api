import { randomUUID } from 'crypto';
import { products as mockProducts } from '../__mocks__'
import { productsContainer, stocksContainer } from '../common/db';

const seed = async () => {
  const products = mockProducts.map((product) => ({
    ...product,
    id: randomUUID()
  }))

  const stocks = products.map((product) => ({
    id: randomUUID(),
    count: 0,
    product_id: product.id
  }))

  await productsContainer.items.bulk(products.map((product) => ({
    operationType: "Create",
    resourceBody: product
  })));
  await stocksContainer.items.bulk(stocks.map((stock) => ({
    operationType: "Create",
    resourceBody: stock
  })));
}

async function root() {
  await seed();
}

root()
  .then(() => console.log("Seed passed"))
  .catch((e) => console.log("Seed error - ", e));