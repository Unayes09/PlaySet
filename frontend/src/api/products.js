import { apiGet } from './client.js';

export async function fetchAllProducts() {
  return apiGet('/api/products');
}
