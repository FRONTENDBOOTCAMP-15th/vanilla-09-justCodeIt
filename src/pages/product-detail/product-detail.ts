import { getAxios } from "../../utils/axios";
import type { ProductDetailRes } from "../../utils/types";
import { codes } from "../../utils/categories";

// 사용자가 어떤 사이즈 버튼을 눌렀는지 저장하는 변수
let selectedSize: number | null = null;
// 사이즈 선택이 필요한지에 대한 여부 변수
let sizeOption = false;

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
    const cartBtn = document.querySelector<HTMLButtonElement>("#btnCart");
    const cartBtnBottom =
      document.querySelector<HTMLButtonElement>("#btnCartBottom");
    const wishBtn = document.querySelector<HTMLButtonElement>("#btnWish");
    const priceEl = document.querySelector<HTMLElement>("#productPrice");
    const contentEl = document.querySelector<HTMLElement>("#productContent");
    const colorEl = document.querySelector<HTMLElement>("#currentColor");
    const styleNoEl = document.querySelector<HTMLElement>("#styleNo");
    const sizeBtnEl = document.querySelector<HTMLElement>("#sizeBtn");

    // 이 중에 하나라도 못 찾으면 콘솔에 에러 찍고 함수 종료
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

    // item : 상품의 모든 정보
    const item = data.item;
    // images : 상품 이미지 리스트 -> 이미지 없으면 빈 배열
    const images = item.mainImages || [];

    // 텍스트로 변환해서 #category에 넣기
    let category0 = "";
    let category1 = "";

    if (item.extra && Array.isArray(item.extra.category)) {
      category0 =
        codes.find((c) => c.code === item.extra.category[0])?.desc || "";

      category1 =
        codes.find((c) => c.code === item.extra.category[1])?.value || "";
    }

    // "남성 Shoes" 이런 식으로 붙이기
    const categoryText = `${category0} ${category1}`.trim();

    // categoryEl에 넣기
    categoryEl.textContent = categoryText || "카테고리 정보 없음";

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
      sizeBtnEl.innerHTML = "";

      const sizes = item.extra.size || [];

      if (sizes.length === 0) {
        // 사이즈 없는 상품
        sizeOption = false;
        selectedSize = null;
      } else {
        // 사이즈 있는 상품
        sizeOption = true;

        sizes.forEach((size) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = String(size);
          btn.className = "size-btn";

          btn.addEventListener("click", () => {
            selectedSize = size;

            sizeBtnEl
              .querySelectorAll<HTMLButtonElement>(".size-btn")
              .forEach((b) => b.classList.remove("ring-1", "ring-[#111]"));

            btn.classList.add("ring-1", "ring-[#111]");
          });

          sizeBtnEl.appendChild(btn);
        });
      }
    }

    // 공통으로 사용할 장바구니 클릭 함수
    const handleCartClick = async () => {
      // 0) 토큰 꺼내기
      const token = localStorage.getItem("accessToken");

      // 1) 로그인 체크
      if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/src/pages/log-in/log-in.html";
        return;
      }

      // color 문자열 추출
      const colors =
        item.extra.color && item.extra.color.trim() !== ""
          ? item.extra.color
          : "정보 없음";

      // 2) 사이즈 선택 여부 확인 (사이즈 있는 상품일 때만)
      if (sizeOption && selectedSize === null) {
        alert("사이즈를 선택해 주세요!");
        return;
      }

      // 3) 서버에 보낼 사이즈 값 만들기
      let sizeToSend = "";
      if (sizeOption && selectedSize !== null) {
        sizeToSend = String(selectedSize);
      }

      // 4) 장바구니 API 요청
      try {
        const body = {
          product_id: Number(productId),
          quantity: 1,
          size: sizeToSend, // 프리사이즈면 "", 사이즈 상품이면 실제 값
          color: colors,
        };

        const { data: cartRes } = await axios.post("/carts", body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cartRes.ok) {
          alert("장바구니 담기 실패");
          console.error("장바구니 실패 응답:", cartRes);
          return;
        }

        alert("장바구니에 담았습니다!");
      } catch (error) {
        console.error("장바구니 에러:", error);
        alert("오류가 발생했습니다. 다시 시도해 주세요.");
      }
    };
    // 두 버튼 모두에 같은 함수 연결
    cartBtn?.addEventListener("click", handleCartClick);
    cartBtnBottom?.addEventListener("click", handleCartClick);
  } catch (err) {
    console.error("상품 상세 호출 에러:", err);
    alert("상품 정보를 불러오는 중 오류가 발생했습니다.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  productDetail(); // API 즉시 호출
});
