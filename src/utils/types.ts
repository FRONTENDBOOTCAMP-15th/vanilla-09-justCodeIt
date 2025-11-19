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

// - product-detail.ts -
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
// 로그인
export interface UserInfo {
  _id: number;
  email: string;
  name: string;
  type: "user" | "seller" | "admin";
  loginType?: string;
  phone?: string;
  address?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  notifications?: number;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
}

export interface LoginUser extends UserInfo {
  token: TokenInfo;
}

export interface ApiSuccess<T> {
  ok: boolean;
  item: T;
}

export interface ApiError1 {
  ok: boolean;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError1;
export type RegisterRes = ApiResponse<UserInfo>;
export type LoginRes = ApiResponse<LoginUser>;
