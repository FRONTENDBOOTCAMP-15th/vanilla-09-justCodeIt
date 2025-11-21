import { AxiosError } from "axios";
import { getAxios } from "../../utils/axios";
import type { ProductList, ProductListRes, ApiCodes } from "../../utils/types";
import imgOn from "/src/assets/img/checkOn.svg";
import imgOff from "/src/assets/img/checkOff.png";

const axios = getAxios();
const params = new URLSearchParams(window.location.search);

async function showList() {
  const custom = params.get("custom");
  const sort = params.get("sort");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const keyword = params.get("keyword");
  const category = params.get("category");
  let query = `products/?page=1&limit=30`;
  if (custom) query += `&custom=${custom}`;
  if (category) {
    query += `&custom={"extra.category": "${category}"}`;
  }
  if (sort) {
    query += `&sort=${sort}`;
  }
  if (keyword) {
    query += `&keyword=${keyword}`;
  }

  if (minPrice) {
    query += `&minPrice=${minPrice}`;
  }
  if (maxPrice) {
    query += `&maxPrice=${maxPrice}`;
  }

  try {
    const { data } = await axios.get<ProductListRes>(query);
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function fetchCodes(): Promise<ApiCodes | null> {
  try {
    const { data } = await axios.get<ApiCodes>("/codes/");
    if (data.ok) console.log("!!!!!!카테고리확인~!!!!!!:", data);
    return data;
  } catch (err) {
    console.error("카테고리 못불러옴", err);
    return null;
  }
}

function render(products: ProductList[]) {
  const productBody = document.querySelector("#productBody");
  if (!productBody) return;

  if (products.length === 0) {
    productBody.innerHTML = `
      <div class="col-span-3 align-center text-center whitespace-nowrap py-10 text-gray-500 text-base md:text-2xl">
        죄송합니다. 조건에 맞는 상품을 찾을 수 없습니다.
      </div>
    `;
    return;
  }

  const result = products.map((product) => {
    const color = product.extra?.color
      ? product.extra.color.split(" ").length
      : 1;

    const category0 = findCategory(product.extra.category[0])?.value ?? "";
    const category1 = findCategory(product.extra.category[1])?.value ?? "";

    return `
          <div class="flex flex-col items-start cursor-pointer" data-id="${product._id}">
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

  if (productBody) {
    productBody.innerHTML = result.join("");

    productBody.querySelectorAll("div[data-id]").forEach((div) => {
      div.addEventListener("click", () => {
        const id = div.getAttribute("data-id");
        console.log(id);
        if (id) {
          window.location.href = `/src/pages/product-detail/product-detail.html?id=${id}`;
        }
      });
    });
  }
}

const codesData = await fetchCodes();
const data = await showList();

if (data?.ok) {
  render(data?.item);
}

function findCategory(code?: string) {
  if (!code || !codesData) return null;

  const groups = Object.values(codesData.item);

  for (const group of groups) {
    if (!group || !group.codes) continue;

    const found = group.codes.find((c) => c.code === code);
    if (found) return found;
  }

  return null;
}

const categoryButtons = document.querySelectorAll("[data-category]");

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const code = btn.getAttribute("data-category");
    if (!code) return;

    // 현재 페이지 이동
    const url = `/src/pages/product-list/product-list.html?category=${code}`;
    window.location.href = url;
  });
});

// 정렬 버튼
const sortBtn = document.getElementById("sort-btn");
const sortMenu = document.getElementById("sort-menu");

if (sortBtn && sortMenu) {
  sortBtn.addEventListener("click", () => {
    // class에 hidden 추가/삭제로 토글
    if (sortMenu.className.includes("hidden")) {
      sortMenu.className = sortMenu.className.replace("hidden", "");
    } else {
      sortMenu.className += "hidden";
    }
  });
}

function setSort(value: string) {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (!value) {
    params.delete("sort");
  } else {
    params.set("sort", value);
  }

  // 브라우저 새로고침해서 정렬 ㄱㄱ
  window.location.href = url.pathname + "?" + params.toString();
}

document.getElementById("recommend")?.addEventListener("click", () => {
  setSort('{"extra.isNew": -1, "extra.isBest": -1}');
});

document.getElementById("isNew")?.addEventListener("click", () => {
  setSort('{"extra.isNew": -1}');
});

document.getElementById("highPrice")?.addEventListener("click", () => {
  setSort('{"price": -1}');
});

document.getElementById("lowPrice")?.addEventListener("click", () => {
  setSort('{"price": 1}');
});

// 필터 숨기기로 사이드바 숨기기
const hiddenFilterBtn = document.getElementById("hidden-filter");
const desktopSidebar = document.getElementById("desktop-sidebar");

if (hiddenFilterBtn && desktopSidebar) {
  hiddenFilterBtn.addEventListener("click", () => {
    // class에 hidden 추가/삭제로 토글
    // 수정: md:를 안붙이고 hidden만 없애려고 함..
    // 수정2: 앞에 공백을 안줘서 사이드바가 안들어간거였음
    if (desktopSidebar.className.includes(" md:hidden")) {
      desktopSidebar.className = desktopSidebar.className.replace(
        " md:hidden",
        ""
      );
    } else {
      desktopSidebar.className += " md:hidden";
    }
  });
}
function initPriceCheckbox() {
  const url = new URL(window.location.href);
  const minPrice = Number(url.searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(url.searchParams.get("maxPrice") ?? 0);

  const checkboxMap: Record<string, [number, number]> = {
    "under-5": [0, 50000],
    "under-10": [50000, 100000],
    "under-15": [100000, 150000],
    "under-20": [150000, 200000],
  };

  Object.entries(checkboxMap).forEach(([id, [min, max]]) => {
    const checkbox = document.getElementById(id) as HTMLInputElement | null;
    const img = document.querySelector(
      `.checkbox-img[data-target="${id}"]`
    ) as HTMLImageElement | null;
    if (!checkbox || !img) return;

    if (minPrice === min && maxPrice === max) {
      checkbox.checked = true;
      img.setAttribute("src", imgOn);
    } else {
      checkbox.checked = false;
      img.setAttribute("src", imgOff);
    }
  });
}

// 페이지 로드 시 실행
initPriceCheckbox();

// checkbox img로 on/off
const checkboxImgs = document.querySelectorAll(".checkbox-img");

checkboxImgs.forEach((img) => {
  // data-target으로 특정 체크박스 가져오기
  const checkbox = document.getElementById(
    img.getAttribute("data-target")!
  ) as HTMLInputElement;

  img.addEventListener("click", () => {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
      img.setAttribute("src", imgOn);
    } else {
      img.setAttribute("src", imgOff);
    }

    let minPrice = 0;
    let maxPrice = 0;

    if (checkbox.id === "under-5") {
      minPrice = 0;
      maxPrice = 50000;
    } else if (checkbox.id === "under-10") {
      minPrice = 50000;
      maxPrice = 100000;
    } else if (checkbox.id === "under-15") {
      minPrice = 100000;
      maxPrice = 150000;
    } else if (checkbox.id === "under-20") {
      minPrice = 150000;
      maxPrice = 200000;
    }

    const url = new URL(window.location.href);
    const params = url.searchParams;

    params.set("minPrice", minPrice.toString());
    params.set("maxPrice", maxPrice.toString());

    window.location.href = url.pathname + "?" + params.toString();
  });
});
