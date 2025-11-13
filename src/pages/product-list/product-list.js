import { AxiosError } from "axios";
import { getAxios } from "../../utils/axios";
import { codes } from "../../utils/\bcategories";
const axiosInstance = getAxios();
async function showList() {
    try {
        const { data } = await axiosInstance.get("/products?page=1&limit=50");
        if ((data.ok === true || data.ok === 1) && Array.isArray(data.item)) {
            const container = document.querySelector("#productList");
            if (!container)
                return;
            container.innerHTML = "";
            data.item.forEach((product) => {
                const colorCount = product.extra?.color
                    ? product.extra.color.trim().split(/\s+/).length
                    : 1;
                const genderMap = {
                    Men: "남성",
                    Women: "여성",
                    Kids: "키즈",
                };
                // 카테고리 뽑아내기
                const categoryNames = product.extra?.category
                    ?.map((code) => genderMap[codes.find((c) => c.code === code)?.value || ""] ||
                    codes.find((c) => c.code === code)?.value)
                    .filter(Boolean)
                    .join(" ");
                const html = `
          <div class="flex flex-col items-start ">
            <img
              class="w-full aspect-square overflow-hidden"
              src="${product.mainImages?.[0]?.path || "/src/assets/img/default.png"}"
              alt="${product.name}"
            />
            ${product.extra?.isNew
                    ? `<span class="text-sm lg:text-base text-orange-800 mt-2">신제품</span>`
                    : ""}
            <span class="text-sm lg:text-base font-semibold">${product.name}</span>
             <span class="text-sm lg:text-base text-gray-400">${categoryNames}</span>
             <span class="text-sm lg:text-base text-gray-400">${colorCount}개 색상</span>
            <span class="text-base mt-2">${product.price.toLocaleString()} 원</span>
          </div>
        `;
                container.insertAdjacentHTML("beforeend", html);
            });
        }
        else {
            console.error("상품 데이터가 없습니다:", data);
        }
    }
    catch (err) {
        console.error("에러:", err);
    }
}
showList();
// 필터 숨기기 -> 사이드바 숨겨짐
const sortBtn = document.getElementById("sort-btn");
const sortMenu = document.getElementById("sort-menu");
if (sortBtn && sortMenu) {
    sortBtn.addEventListener("click", () => {
        sortMenu.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
        const target = e.target;
        if (!sortBtn.contains(target) && !sortMenu.contains(target)) {
            sortMenu.classList.add("hidden");
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const hiddenFilterBtn = document.getElementById("hidden-filter");
    const desktopSidebar = document.getElementById("desktop-sidebar");
    hiddenFilterBtn?.addEventListener("click", () => {
        if (desktopSidebar?.classList.contains("lg:flex")) {
            desktopSidebar.classList.remove("lg:flex");
        }
        else {
            desktopSidebar?.classList.add("lg:flex");
        }
    });
});
// checkbox img로 on/off
const imgOn = "/src/assets/img/Property 1=On.svg";
const imgOff = "/src/assets/img/Property 1=Off.png";
const checkboxImgs = document.querySelectorAll(".checkbox-img");
checkboxImgs.forEach((img) => {
    const targetId = img.getAttribute("data-target");
    const checkbox = document.getElementById(targetId);
    img.addEventListener("click", () => {
        checkbox.checked = !checkbox.checked;
        updateCheckboxImage(checkbox, img);
    });
    checkbox.addEventListener("change", () => updateCheckboxImage(checkbox, img));
});
function updateCheckboxImage(checkbox, img) {
    img.src = checkbox.checked ? imgOn : imgOff;
}
