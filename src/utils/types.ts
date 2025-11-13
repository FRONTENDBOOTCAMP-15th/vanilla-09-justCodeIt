export interface ProductInfo {
  _id: number;
  seller_id: number;
  price: number;
  shippingFees: number;
  show: boolean;
  active: boolean;
  name: string;
  quantity: number;
  buyQuantity: number;

  mainImages: {
    path: string;
    name: string;
  }[];

  createdAt: string;
  updatedAt: string;

  extra: {
    color: string;
    gender: string;
    isNew: boolean;
    isBest: boolean;
    category: string[];
    sort: number;
  };
}

export type ProductList = Omit<ProductInfo, "content">;
export type ProductListRes =
  | {
      ok: 1;
      item: ProductList[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }
  | ApiError;

export interface CategoryItem {
  sort: number;
  code: string;
  value: string;
  desc?: string;
  parent?: string;
  depth: number;
}

export interface ApiError {
  ok: 0;
  message: string;
}
