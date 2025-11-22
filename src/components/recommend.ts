import type { ProductList, ProductListRes } from "../utils/types";
import { getAxios } from "../utils/axios";
import btnLeft from "/src/assets/icons/Button-left.svg";
import btnRight from "/src/assets/icons/Button-right.svg";

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
  private products: ProductList[] = [];
  private currentIndex = 0;
  private resizeHandler = () => this.render();
  private clickHandler = (e: Event) => this.onClick(e as MouseEvent);

  async connectedCallback() {
    const data = await showRecommend();
    if (!data?.ok) return;
    this.products = data.item ?? [];
    this.render();

    this.addEventListener("click", this.clickHandler);
    window.addEventListener("resize", this.resizeHandler);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.clickHandler);
    window.removeEventListener("resize", this.resizeHandler);
  }

  private getVisibleCount() {
    return window.innerWidth < 768 ? 2 : 3;
  }

  private getVisibleProducts() {
    const visibleCount = this.getVisibleCount();
    const total = this.products.length;
    if (total === 0) return [];

    const start = ((this.currentIndex % total) + total) % total;

    if (start + visibleCount <= total) {
      return this.products.slice(start, start + visibleCount);
    }

    const firstPart = this.products.slice(start);
    const secondPart = this.products.slice(0, visibleCount - firstPart.length);
    return [...firstPart, ...secondPart];
  }

  private render() {
    const visibleProducts = this.getVisibleProducts();
    const recommend = visibleProducts
      .map((product) => {
        const color = product.extra?.color
          ? product.extra.color.split(" ").length
          : 1;
        return `
          <div class="flex flex-col min-w-0 flex-1 cursor-pointer" data-id="${product._id}">
            <img
              class="object-cover aspect-square w-full h-auto"
              src="${product.mainImages?.[0]?.path ?? ""}"
              alt="${product.name ?? ""}"
            />
            ${
              product.extra?.isNew
                ? `<span class="text-sm lg:text-base text-orange-800 mt-2">신제품</span>`
                : ""
            }
            <span class="text-sm font-semibold mt-1">${product.name ?? ""}</span>
            <span class="text-sm lg:text-base text-gray-400">${color}개 색상</span>
            <span class="text-base mt-3">${(product.price ?? 0).toLocaleString()} 원</span>
          </div>
        `;
      })
      .join("");

    this.innerHTML = `
      <div class="mx-auto max-w-[1920px] px-6">
        <div class="p-4 flex justify-between items-center">
          <span class="text-2xl lg:text-[30px]">추천제품</span>
          <div class="flex gap-2">
            <button id="btnLeft" aria-label="이전"><img class="w-12" src="${btnLeft}" alt="왼쪽 버튼"/></button>
            <button id="btnRight" aria-label="다음"><img class="w-12" src="${btnRight}" alt="오른쪽 버튼"/></button>
          </div>
        </div>

        <!-- 한 줄에 visibleCount 만큼만 보이게 하려면 flex로 처리 -->
        <div id="recommendBody" class="flex gap-4 p-4 overflow-hidden">
          ${recommend}
        </div>
      </div>
    `;

    const cards = this.querySelectorAll("div[data-id]");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        if (id) {
          window.location.href = `/src/pages/product-detail/product-detail.html?id=${id}`;
        }
      });
    });
  }

  private onClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const btn = target.closest("button");
    if (!btn) return;

    const visibleCount = this.getVisibleCount();
    const total = this.products.length;
    if (total === 0) return;

    if (btn.id === "btnRight") {
      this.currentIndex = (this.currentIndex + visibleCount) % total;
      this.render();
    } else if (btn.id === "btnLeft") {
      this.currentIndex = (this.currentIndex - visibleCount + total) % total;
      this.render();
    }
  }
}

customElements.define("recommend-products", RecommendProducts);
