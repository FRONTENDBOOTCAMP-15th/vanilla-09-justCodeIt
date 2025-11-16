import { AxiosError } from "axios";
import { getAxios } from "../../utils/axios";
import type { ProductList, ProductListRes } from "../../utils/types";
import { codes } from "../../utils/categories";

async function showList() {
  const axios = getAxios();

  try {
    const { data } = await axios.get<ProductListRes>(
      "/products?page=1&limit=50"
    );
    console.log(data);

    return data;
  } catch (err) {
    console.log(err);
  }
}

function render(products: ProductList[]) {
  const result = products.map((product) => {
    const color = product.extra?.color
      ? product.extra.color.split(" ").length
      : 1;

    // category[0] desc 반환, [1]은 value 반환
    const category0 = codes.find(
      (c) => c.code === product.extra.category[0]
    )?.desc;
    const category1 = codes.find(
      (c) => c.code === product.extra.category[1]
    )?.value;

    return `
          <div class="flex flex-col items-start ">
            <img
              class="w-full aspect-square overflow-hidden"
              src="${product.mainImages?.[0]?.path || "/src/assets/img/default.png"}"
              alt="${product.name}"
            />
            ${
              product.extra?.isNew
                ? `<span class="text-sm md:text-base text-orange-800 mt-2">신제품</span>`
                : ""
            }
            <span class="text-sm md:text-base font-semibold">${product.name}</span>
            <span class="text-sm md:text-base text-gray-400">${category0} ${category1}</span>
            <span class="text-sm md:text-base text-gray-400">${color}개 색상</span>
            <span class="text-base mt-2">${product.price.toLocaleString()} 원</span>
          </div>
        `;
  });
  const productBody = document.querySelector("#productBody");
  if (productBody) {
    productBody.innerHTML = result.join("");
  }
}

const data = await showList();
if (data?.ok) {
  render(data?.item);
}

// 정렬 버튼
const sortBtn = document.getElementById("sort-btn") as HTMLButtonElement | null;
const sortMenu = document.getElementById("sort-menu") as HTMLDivElement | null;

if (sortBtn && sortMenu) {
  sortBtn.addEventListener("click", () => {
    sortMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!sortBtn.contains(target) && !sortMenu.contains(target)) {
      sortMenu.classList.add("hidden");
    }
  });
}

// checkbox img로 on/off
const imgOn = "/src/assets/img/Property 1=On.svg";
const imgOff = "/src/assets/img/Property 1=Off.png";

const checkboxImgs = document.querySelectorAll(".checkbox-img");

checkboxImgs.forEach((img) => {
  const targetId = img.getAttribute("data-target");
  const checkbox = document.getElementById(targetId!) as HTMLInputElement;

  img.addEventListener("click", () => {
    checkbox.checked = !checkbox.checked;
    updateCheckboxImage(checkbox, img as HTMLImageElement);
  });

  checkbox.addEventListener("change", () =>
    updateCheckboxImage(checkbox, img as HTMLImageElement)
  );
});

function updateCheckboxImage(
  checkbox: HTMLInputElement,
  img: HTMLImageElement
) {
  img.src = checkbox.checked ? imgOn : imgOff;
}
