import { CatalogFilters, Product } from '../types/domain';

export const filterProducts = (products: Product[], filters: CatalogFilters): Product[] => {
  const query = filters.query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesQuery =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesCategory = !filters.category || filters.category === 'All' || product.category === filters.category;
    const matchesBrand = !filters.brand || filters.brand === 'All' || product.brand === filters.brand;

    return matchesQuery && matchesCategory && matchesBrand;
  });
};
