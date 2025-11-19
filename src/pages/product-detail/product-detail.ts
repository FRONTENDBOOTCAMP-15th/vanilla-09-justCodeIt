import { getAxios } from "../../utils/axios";
import type { ProductDetailRes } from "../../utils/types";

const axios = getAxios(); // axios 연결 완료

// async function testAxios() {
//   try {
//     const { data } = await axiosInstance.get<ProductListRes>("/products/1");

//     console.log("API 응답 확인:", data);
//   } catch (err) {
//     console.error("요청 에러:", err);
//   }
// }

// testAxios();

// 1) 상품 상세정보 불러오고 화면에 넣기
async function productDetail() {
  try {
    // URL id 꺼내기
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id") || 2;

    // if (productId) {
    //   console.log(`상품 ID: ${productId}`);
    // } else {
    //   console.log("상품 ID를 찾을 수 없습니다.");
    // }

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
    const nameEl = document.querySelector<HTMLElement>("#productName");
    const priceEl = document.querySelector<HTMLElement>("#productPrice");
    const contentEl = document.querySelector<HTMLElement>("#productContent");
    const colorEl = document.querySelector<HTMLElement>("#currentColor");
    const styleNoEl = document.querySelector<HTMLElement>("#styleNo");
    const sizeBtnEl = document.querySelector<HTMLElement>("#sizeBtn");

    if (!imgEl || !nameEl || !priceEl || !contentEl || !colorEl || !styleNoEl) {
      console.error("요소를 찾지 못했습니다.");
      return;
    }

    // 3) 데이터 넣기
    const item = data.item;

    imgEl.src = item.mainImages?.[0]?.path || "";
    imgEl.alt = item.name;
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
  } catch (err) {
    console.error("상품 상세 호출 에러:", err);
    alert("상품 정보를 불러오는 중 오류가 발생했습니다.");
  }
}

productDetail();
