import type { ProductList, ProductListRes } from "../utils/types";
import { getAxios } from "../utils/axios";

async function showRecommend() {
  const axios = getAxios();

  try {
    const { data } = await axios.get<ProductListRes>(
      "/products?page=1&limit=50"
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}

class RecommendProducts extends HTMLElement {
  async connectedCallback() {
    const data = await showRecommend();
    if (data?.ok) {
      this.render(data.item);
    }
  }

  render(products: ProductList[]) {
    // FIXME 버튼 클릭하면 제품이 넘어가야 하는데,, 3개로 국한되면 안됨...
    const top3 = products.slice(0, 3);
    const recommend = top3
      .map((product) => {
        const color = product.extra?.color
          ? product.extra.color.split(" ").length
          : 1;

        return `
          <div class="flex flex-col">
            <img
              class="object-cover aspect-square w-full"
              src="${product.mainImages?.[0]?.path}"
              alt="${product.name}"
            />
            ${
              product.extra?.isNew
                ? `<span class="text-sm lg:text-base text-orange-800 mt-2">신제품</span>`
                : ""
            }
            <span class="text-sm font-semibold mt-1">${product.name}</span>
            <span class="text-sm lg:text-base text-gray-400">${color}개 색상</span>
            <span class="text-base mt-3">${product.price.toLocaleString()} 원</span>
          </div>
        `;
      })
      .join("");

    this.innerHTML = `
      <div class="mx-auto max-w-[1920px] px-6">
        <div class="p-4 flex justify-between items-center">
          <span class="text-3xl">추천제품</span>

          <div class="flex gap-2">
            <img class="w-12" src="/src/assets/icons/Button-left.svg" alt="왼쪽 버튼" />
            <img class="w-12" src="/src/assets/icons/Button-right.svg" alt="오른쪽 버튼" />
          </div>
        </div>
        <div id="recommendBody" class="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          ${recommend}
        </div>
      </div>
    `;
  }
}

customElements.define("recommend-products", RecommendProducts);
