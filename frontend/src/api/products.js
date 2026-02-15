import { apiGet } from './client.js';

export async function fetchAllProducts() {
  return apiGet('/api/products');
}

export async function fetchProducts({ category, q, page, isNewProduct, isNew, isFeatured } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (q) params.set('q', q);
  if (page) params.set('page', String(page));
  const newFlag = isNewProduct ?? isNew;
  if (newFlag != null) {
    params.set('isNewProduct', String(!!newFlag));
  }
  if (isFeatured != null) params.set('isFeatured', String(!!isFeatured));
  const qs = params.toString();
  return apiGet(`/api/products${qs ? `?${qs}` : ''}`);
}
