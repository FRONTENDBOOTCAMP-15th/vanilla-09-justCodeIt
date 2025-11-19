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

// product-detail.ts - test용
export interface ProductItem {
  _id: number;
  seller_id: number;
  price: number;
  content: string;
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
    styleNo: string;
    size: number[];
  };
}

export type ProductDetailRes =
  | {
      ok: 1;
      item: ProductItem;
    }
  | ApiError;

// ------회원가입/로그인 관련 타입------
export interface UserInfo {
  _id: number;
  email: string;
  name: string;
  type: "user" | "seller";

  password?: string;
  phone?: string;
  address?: string;
  image?: string;
}

export interface SignupBody {
  email: string;
  password: string;
  name: string;
  type: "user" | "seller";

  phone?: string;
  address?: string;
  image?: string;
}

export type SignupRes =
  | {
      ok: 1;
      item: UserInfo;
    }
  | ApiError;

export interface LoginBody {
  email: string;
  password: string;
}

export type LoginRes = {
  accessToken: string;

  user: UserInfo;
};
