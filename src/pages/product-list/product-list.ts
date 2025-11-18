import { AxiosError } from "axios";
import { getAxios } from "../../utils/axios";
import type { ProductList, ProductListRes } from "../../utils/types";
import { codes } from "../../utils/categories";

async function showList() {
  const axios = getAxios();
  const params = new URLSearchParams(window.location.search);
  const custom = params.get("custom");
  const sort = params.get("sort");
  let query = `products/?custom=${custom}&page=1&limit=30`;
  if (sort) {
    query += `&sort=${sort}`;
  }

  try {
    const { data } = await axios.get<ProductListRes>(query);
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

  window.location.href = url.pathname + "?" + params.toString();
}
document.getElementById("recommend")?.addEventListener("click", () => {
  setSort("");
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

// 필터 숨기기로 사이드바 숨기기!!! 하기싫다
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

// checkbox img로 on/off
const imgOn = "/src/assets/img/Property 1=On.svg";
const imgOff = "/src/assets/img/Property 1=Off.png";

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
  });
});
