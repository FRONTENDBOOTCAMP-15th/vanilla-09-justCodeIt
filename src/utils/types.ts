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
    size?: number[];
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

export type LoginRes = {
  accessToken: string;

  user: UserInfo;
};

// ------ 장바구니 관련 타입 ------
export interface CartInfo {
  _id: number;
  product_id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    _id: number;
    name: string;
    price: number;
    seller_id: number;
    quantity: number;
    buyQuantity: number;
    image: {
      url: string;
      name: string;
    };
    extra: {
      isNew: boolean;
      isBest: boolean;
      category: string[];
      sort: number;
    };
  };
}

export interface CartItem {
  _id: number;
  product_id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    _id: number;
    name: string;
    price: number;
    seller_id: number;
    quantity: number;
    buyQuantity: number;
    image: {
      path: string;
      name: string;
    };
    extra: {
      isNew: boolean;
      isBest: boolean;
      category: string[];
      sort: number;
    };
  };
}

// 장바구니 목록 조회 응답
export type CartListRes =
  | {
      ok: boolean;
      item: CartItem[];
    }
  | ApiError;

// 장바구니 수량 수정 요청 body
export interface UpdateCartQtyBody {
  quantity: number;
}

// 장바구니에 상품 추가 요청 body
export interface AddToCartBody {
  product_id: number;
  quantity: number;
  size: number[];
  color: string;
}

export type AddToCartRes =
  | {
      ok: boolean;
      item: CartItem;
    }
  | ApiError;
