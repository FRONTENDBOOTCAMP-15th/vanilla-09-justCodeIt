import { getAxios } from "../../utils/axios";
import type { ProductDetailRes } from "../../utils/types";

// async function testAxios() {
//   const axios = getAxios();
//   try {
//     const res = await axios.get("/carts");
//     console.log("서버 연결 성공:", res.data);
//   } catch (err) {
//     console.error("서버 연결 실패:", err);
//   }
// }

// testAxios();
// 1) 상품 상세정보 불러오고 화면에 넣기
async function productDetail() {
  try {
    // URL id 꺼내기
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    const axios = getAxios();

    const { data } = await axios.get<ProductDetailRes>(
      `/products/${productId}`
    );

    console.log("응답 데이터:", data);

    if (!data.ok) {
      alert("상품 정보를 불러오지 못했습니다.");
      return;
    }

    // 2) HTML 요소 찾기
    const imgEl = document.querySelector<HTMLImageElement>("#productImg");
    const thumbsEl = document.querySelector<HTMLDivElement>("#thumbs");
    const nameEl = document.querySelector<HTMLElement>("#productName");
    const categoryEl = document.querySelector<HTMLElement>("#category");
    const priceEl = document.querySelector<HTMLElement>("#productPrice");
    const contentEl = document.querySelector<HTMLElement>("#productContent");
    const colorEl = document.querySelector<HTMLElement>("#currentColor");
    const styleNoEl = document.querySelector<HTMLElement>("#styleNo");
    const sizeBtnEl = document.querySelector<HTMLElement>("#sizeBtn");

    if (
      !imgEl ||
      !nameEl ||
      !priceEl ||
      !contentEl ||
      !colorEl ||
      !styleNoEl ||
      !categoryEl
    ) {
      console.error("요소를 찾지 못했습니다.");
      return;
    }

    // 3) 데이터 넣기
    const item = data.item;
    const images = item.mainImages || [];

    // 이미지가 없으면 기본 이미지 사용

    const firstImage = images[0];

    imgEl.src = firstImage?.path || "./assets/img/nike.png";
    imgEl.alt = firstImage?.name || item.name;

    // 3) 썸네일 영역 비우기
    if (thumbsEl) {
      // thumbsEl.innerHTML = "";

      // 이미지가 2개 이상일 때만 썸네일 표시
      if (images.length > 1) {
        images.forEach((image, index) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "thumb rounded overflow-hidden";

          btn.innerHTML = `
            <img
              src="${image.path}"
              alt="${image.name || item.name}"
              class="w-20 h-20 object-cover rounded"
            />
          `;

          // 처음 썸네일은 선택 표시
          if (index === 0) {
            btn.classList.add("border-2", "border-[#111]");
          }

          // 썸네일 클릭하면 대표이미지 변경 + 선택 표시 변경
          btn.addEventListener("click", () => {
            imgEl.src = image.path;
            imgEl.alt = image.name || item.name;

            // 모든 썸네일에서 선택 스타일 제거
            thumbsEl
              .querySelectorAll<HTMLButtonElement>(".thumb")
              .forEach((b) => b.classList.remove("border-2", "border-[#111]"));

            // 현재 클릭한 썸네일에만 선택 스타일 추가
            btn.classList.add("border-2", "border-[#111]");
          });

          thumbsEl.appendChild(btn);
        });
      }
    }
    nameEl.textContent = item.name;
    priceEl.textContent = item.price.toLocaleString() + "원";
    contentEl.textContent = item.content.toLocaleString();
    if (item.extra.color && item.extra.color.trim() !== "") {
      colorEl.textContent = `현재 컬러: ${item.extra.color}`;
    } else {
      colorEl.textContent = "현재 컬러 : 정보 없음";
    }
    if (item.extra.styleNo && item.extra.styleNo.trim() !== "") {
      styleNoEl.textContent = `스타일 번호: ${item.extra.styleNo}`;
    } else {
      styleNoEl.textContent = "스타일 번호: 정보 없음";
    }

    if (sizeBtnEl) {
      let selectedSize: number | null = null;

      sizeBtnEl.innerHTML = "";

      const sizes = item.extra.size || [];

      sizes.forEach((size) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = String(size);
        btn.className = "size-btn";

        // 버튼 클릭 시 선택 상태 표시 + 값 저장
        btn.addEventListener("click", () => {
          selectedSize = size;

          // 모든 버튼에서 선택 스타일 제거
          sizeBtnEl
            .querySelectorAll<HTMLButtonElement>(".size-btn")
            .forEach((b) => b.classList.remove("ring-1", "ring-[#111]"));

          // 클릭한 버튼에만 선택 스타일 추가
          btn.classList.add("ring-1", "ring-[#111]");
        });

        sizeBtnEl.appendChild(btn);
      });
    }
  } catch (err) {
    console.error("상품 상세 호출 에러:", err);
    alert("상품 정보를 불러오는 중 오류가 발생했습니다.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  productDetail(); // API 즉시 호출
});
