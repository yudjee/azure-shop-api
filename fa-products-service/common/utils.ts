const requiredFields = [
  'count',
  'price',
  'title',
  'description'
];

export const isValidProduct = (product: any) => {
  for (const field of requiredFields) {
      if (!product[field]) {
          return false;
      }
  }

  return true;
}