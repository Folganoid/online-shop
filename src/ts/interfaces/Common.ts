export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface IProductList {
  products: IProduct[];
}

export interface IfilterData {

  filteredBrands: string[];
  filteredCats: string[];
  searchText: string;
  sortSelect: string;
  minPrice: number;
  maxPrice: number;
  minPriceVal: number;
  maxPriceVal: number;
  minStock: number;
  maxStock: number;
  minStockVal: number;
  maxStockVal: number;
  view: string;
  url: string;
}

export type basketItem = {
  id: number;
  count: number;
}

export interface IbasketData {
  page: number,
  limit: number,
  discounts: string[],
  url: string
}
