import { AxiosError } from "axios";
import { getAxios } from "../../utils/axios";

interface WishItemResponse {
  ok: boolean;
  item: WishItem[];
}

interface WishItem {
  _id: number;
  memo: string;
  createdAt: string;
  user_id: number;
  product: Product;
}

interface Product {
  _id: number;
  name: string;
  price: number;
  quantity: number;
  buyQuantity: number;
  mainImages: { path: string }[];
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#wishlist-container");
  const axiosInstance = getAxios();

  async function loadWishList() {
    try {
      const res = await axiosInstance.get<WishItemResponse>(
        "https://fesp-api.koyeb.app/market/bookmarks/product",
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjQsInR5cGUiOiJ1c2VyIiwibmFtZSI6IuygnOydtOyngCIsImVtYWlsIjoidTFAZ21haWwuY29tIiwiaW1hZ2UiOiJodHRwczovL3Jlcy5jbG91ZGluYXJ5LmNvbS9kZGVkc2xxdnYvaW1hZ2UvdXBsb2FkL3YxNzYyOTI0OTg3L2ZlYmMxNS12YW5pbGxhMDktZWNhZC9pMklRZ2FRNm4ud2VicCIsImxvZ2luVHlwZSI6ImVtYWlsIiwiaWF0IjoxNzYzNDMxNTMwLCJleHAiOjE3NjM1MTc5MzAsImlzcyI6IkZFQkMifQ.ZaEtt5ULKuEiTdZLC-2B5GmnfZOt2x6CJSDjZ_nX4lU",
          },
        }
      );
      const items = res.data.item;
      console.log(items);

      if (!container) return;

      items.forEach((wish) => {
        const product = wish.product;

        const imgUrl =
          product.mainImages?.[0]?.path ?? "/src/assets/img/no-image.png";

        const card = document.createElement("div");
        card.className = "flex flex-col";

        card.innerHTML = `
          <div class="relative w-full aspect-square overflow-hidden bg-gray-100 px-[9px]">
            <img
              src="${imgUrl}"
              alt="${product.name}"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <p class="mt-2 text-sm font-medium">${product.name}</p>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <p class="text-sm text-gray-500 md:text-base">${wish.memo}</p>
            <p class="text-base font-medium mt-1 md:mt-0 md:text-base">
              ${product.price.toLocaleString()} 원
            </p>
          </div>

          <button
            class="block w-fit mt-4 px-4 py-1.5 border border-gray-300 rounded-full text-base text-gray-700"
          >
            장바구니에 추가
          </button>
        `;

        container.appendChild(card);
      });
    } catch (error) {
      const err = error as AxiosError;

      console.error("위시리스트 API 오류:", err);

      if (err.response) {
        console.error("응답 코드:", err.response.status);
        console.error("응답 내용:", err.response.data);
      }
    }
  }

  loadWishList();
});
