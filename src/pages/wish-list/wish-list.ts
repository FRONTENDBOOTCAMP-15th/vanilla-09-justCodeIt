import { AxiosError } from "axios";
import { getAxios } from "../../utils/axios";
import { deleteAxios } from "../../utils/delete";

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
  extra: Extra;
}

interface Extra {
  color: string;
}

let editMode = false;
const token = localStorage.getItem("accessToken");

document.querySelector("#edit-btn")?.addEventListener("click", () => {
  editMode = !editMode;

  const buttons = document.querySelectorAll(".delete-btn");
  buttons.forEach((btn) => {
    if (editMode) {
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const emptyBox = document.querySelector("#wishlist-empty");
  const container = document.querySelector("#wishlist-container");
  const axiosInstance = getAxios();

  async function loadWishList() {
    try {
      const res = await axiosInstance.get<WishItemResponse>(
        "/bookmarks/product",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const items = res.data.item;
      console.log(items);

      if (!container) return;

      if (items.length === 0) {
        emptyBox?.classList.remove("hidden");
        container.classList.add("hidden");
        return;
      } else {
        emptyBox?.classList.add("hidden");
        container.classList.remove("hidden");
      }

      items.forEach((wish) => {
        const product = wish.product;

        const imgUrl = product.mainImages?.[0]?.path;

        const card = document.createElement("div");
        card.className = "flex flex-col";

        card.innerHTML = `
          <div class="relative w-full aspect-square overflow-hidden bg-gray-100 px-[9px]">
            <img
              src="${imgUrl}"
              alt="${product.name}"
              class="absolute inset-0 w-full h-full object-cover"
            />
             <button
              class="delete-btn hidden absolute top-2 right-2 z-10 hover:scale-110"
              data-id="${wish._id}"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C13.084 0 10.4 0.710667 7.94667 2.13333C5.52763 3.52127 3.52127 5.52763 2.13333 7.94667C0.710667 10.4 0 13.084 0 16C0 18.916 0.710667 21.6 2.13333 24.0533C3.52127 26.4724 5.52763 28.4787 7.94667 29.8667C10.4 31.2893 13.084 32 16 32C18.916 32 21.6 31.2893 24.0533 29.8667C26.4724 28.4787 28.4787 26.4724 29.8667 24.0533C31.2893 21.6 32 18.916 32 16C32 13.084 31.2893 10.4 29.8667 7.94667C28.4787 5.52763 26.4724 3.52127 24.0533 2.13333C21.6 0.710667 18.916 0 16 0ZM22.9333 20.3733L20.3733 22.9333L16 18.4533L11.6267 22.9333L9.06667 20.3733L13.5467 16L9.06667 11.6267L11.6267 9.06667L16 13.44L20.3733 9.06667L22.9333 11.6267L18.56 16L22.9333 20.3733Z" fill="#111111"/>
              </svg>
            </button>
          </div>

          <p class="mt-2 text-sm font-medium">${product.name}</p>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <p class="text-sm text-gray-500 md:text-base">${product.extra.color}</p>
            <p class="text-base font-medium mt-1 md:mt-0 md:text-base">
              ${product.price.toLocaleString()} 원
            </p>
          </div>

          <button
            class="block w-fit mt-4 px-4 py-1.5 border border-gray-300 rounded-full text-base text-gray-700 hover:bg-[#E5E5E5]"
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

  container?.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest(".delete-btn") as HTMLElement;

    if (!btn) return;

    const id = btn.dataset.id;
    console.log("삭제할 위시리스트 ID:", id);

    if (!id) return;

    try {
      await deleteAxios("/bookmarks/" + id, token);
      console.log("삭제 성공");
      container.innerHTML = "";
      loadWishList();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  });
});
