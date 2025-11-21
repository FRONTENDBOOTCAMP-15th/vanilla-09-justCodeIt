import { getAxios } from "../../utils/axios";
import { deleteAxios } from "../../utils/delete";
import type { ProductDetailRes } from "../../utils/types";
import { codes } from "../../utils/categories";
import type { WishItem } from "../wish-list/wish-list";

// 사용자가 어떤 사이즈 버튼을 눌렀는지 저장하는 변수
let selectedSize: number | null = null;
// 사이즈 선택이 필요한지에 대한 여부 변수
let sizeOption = false;
// 위시리스트 상태 여부 변수
let wishStatus = false;
// 서버에서 받은 북마크 id (_id)
let bookmarkId: number | null = null;

// 위시리스트 하트 아이콘을 그려주는 함수
function renderWishIcon() {
  const iconEl = document.querySelector<HTMLElement>("#wishIcon");
  if (!iconEl) return;

  const likeFalse = `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.794 9.75002C24.118 9.75002 25.362 10.266 26.298 11.201C27.2262 12.1309 27.7475 13.3911 27.7475 14.705C27.7475 16.0189 27.2262 17.2791 26.298 18.209L18 26.508L9.70096 18.209C8.77307 17.2791 8.25195 16.0192 8.25195 14.7055C8.25195 13.3919 8.77307 12.1319 9.70096 11.202C10.16 10.7403 10.706 10.3743 11.3075 10.125C11.909 9.87578 12.5539 9.74832 13.205 9.75002C14.529 9.75002 15.773 10.266 16.709 11.201L17.469 11.961L18 12.492L18.53 11.961L19.29 11.201C19.7492 10.7396 20.2953 10.3738 20.8967 10.1248C21.4982 9.87573 22.143 9.74835 22.794 9.75002Z" stroke="#111111" stroke-width="1.5"/>
    </svg>

  `;

  const likeTrue = `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.794 9.75002C24.118 9.75002 25.362 10.266 26.298 11.201C27.2262 12.1309 27.7475 13.3911 27.7475 14.705C27.7475 16.0189 27.2262 17.2791 26.298 18.209L18 26.508L9.70096 18.209C8.77307 17.2791 8.25195 16.0192 8.25195 14.7055C8.25195 13.3919 8.77307 12.1319 9.70096 11.202C10.16 10.7403 10.706 10.3743 11.3075 10.125C11.909 9.87578 12.5539 9.74832 13.205 9.75002C14.529 9.75002 15.773 10.266 16.709 11.201L17.469 11.961L18 12.492L18.53 11.961L19.29 11.201C19.7492 10.7396 20.2953 10.3738 20.8967 10.1248C21.4982 9.87573 22.143 9.74835 22.794 9.75002Z" fill="#111111" stroke="#111111" stroke-width="1.5"/>
    </svg>

    

  `;

  iconEl.innerHTML = wishStatus ? likeTrue : likeFalse;
}

// 위시리스트 초기 상태 확인 함수
async function initWishState(productId: number) {
  const token = localStorage.getItem("accessToken");

  // 1) 로그인 안 했으면 → 무조건 빈 하트
  if (!token) {
    wishStatus = false;
    bookmarkId = null;
    renderWishIcon();
    return;
  }

  try {
    const axios = getAxios();

    // 서버에 "내가 찜한 상품 목록" 조회 요청
    const response = await axios.get("/bookmarks/product", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data; // 응답에서 data만 꺼내기

    if (!data.ok) {
      console.error("위시리스트 조회 실패:", data);
      wishStatus = false;
      bookmarkId = null;
      renderWishIcon();
      return;
    }

    console.log("북마크 조회 응답:", data);

    // 북마크 목록 꺼내기 (item이 배열 형태)
    const wishLists: WishItem[] = Array.isArray(data.item) ? data.item : [];

    // 이 상세 페이지의 상품이 북마크 목록 안에 있는지 찾기
    let findWishList: WishItem | null = null;

    for (const wishList of wishLists) {
      // bookmark.product 가 없으면 넘어가기
      if (!wishList.product) continue;

      const bookmarkedProductId = Number(wishList.product._id);

      if (bookmarkedProductId === productId) {
        findWishList = wishList;
        break;
      }
    }

    // 찾은 결과에 따라 상태 설정
    if (findWishList) {
      // 이미 찜한 상품
      wishStatus = true;
      bookmarkId = findWishList._id; // 삭제할 때 쓸 북마크 id
    } else {
      // 찜 안 한 상품
      wishStatus = false;
      bookmarkId = null;
    }

    // 하트 아이콘 다시 그리기
    renderWishIcon();
  } catch (err) {
    console.error("위시리스트 초기 상태 조회 에러:", err);
    wishStatus = false;
    bookmarkId = null;
    renderWishIcon();
  }
}

// 상품 상세정보 불러오고 화면에 넣기
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

    await initWishState(Number(productId));

    // 텍스트로 변환해서 #category에 넣기
    let category0 = "";
    let category1 = "";

    // 카테로기 텍스트
    if (item.extra && Array.isArray(item.extra.category)) {
      category0 =
        codes.find((c) => c.code === item.extra.category[0])?.desc || "";

      category1 =
        codes.find((c) => c.code === item.extra.category[1])?.value || "";
    }

    const categoryText = `${category0} ${category1}`.trim();

    categoryEl.textContent = categoryText || "카테고리 정보 없음";

    // 이미지가 없으면 기본 이미지 사용
    const firstImage = images[0];

    imgEl.src = firstImage?.path || "./assets/img/nike.png";
    imgEl.alt = firstImage?.name || item.name;

    // 썸네일 영역 비우기
    if (thumbsEl) {
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
              class="w-20 h-20 object-cover rounded lg:w-[60px] lg:h-[60px]"
            />
          `;

          // 처음 썸네일은 선택 표시
          if (index === 0) {
            btn.classList.add(
              "border-2",
              "border-[#111]",
              "lg:border-0",
              "lg:brightness-80"
            );
          }

          // 썸네일 클릭하면 대표이미지 변경 + 선택 표시 변경
          btn.addEventListener("click", () => {
            imgEl.src = image.path;
            imgEl.alt = image.name || item.name;

            // 모든 썸네일에서 선택 스타일 제거
            thumbsEl
              .querySelectorAll<HTMLButtonElement>(".thumb")
              .forEach((b) =>
                b.classList.remove(
                  "border-2",
                  "border-[#111]",
                  "lg:border-0",
                  "lg:brightness-80"
                )
              );

            // 현재 클릭한 썸네일에만 선택 스타일 추가
            btn.classList.add(
              "border-2",
              "border-[#111]",
              "lg:border-0",
              "lg:brightness-80"
            );
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

      // 사이즈 선택 여부 확인 (사이즈 있는 상품일 때만)
      if (sizeOption && selectedSize === null) {
        alert("사이즈를 선택해 주세요!");
        return;
      }

      // 서버에 보낼 사이즈 값 만들기
      let serverSize = "";
      if (sizeOption && selectedSize !== null) {
        serverSize = String(selectedSize);
      }

      // 4) 장바구니 API 요청
      try {
        const body = {
          product_id: Number(productId),
          quantity: 1,
          size: serverSize,
          color: colors,
        };

        const { data } = await axios.post("/carts", body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data.ok) {
          alert("장바구니 담기 실패");
          console.error("장바구니 실패 응답:", data);
          return;
        }

        alert("장바구니에 담았습니다!");
      } catch (error) {
        console.error("장바구니 에러:", error);
        alert("오류가 발생했습니다. 다시 시도해 주세요.");
      }
    };

    const handleWishClick = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/src/pages/log-in/log-in.html";
        return;
      }

      if (!productId) {
        alert("상품 정보가 없습니다.");
        return;
      }

      try {
        // 아직 찜 안 된 상태 → 추가 (POST)
        if (!wishStatus) {
          const body = {
            target_id: Number(productId),
            memo: "",
            extra: {
              type: item.extra.color,
            },
          };

          const { data } = await axios.post("/bookmarks/product", body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!data.ok) {
            alert("위시리스트 추가 실패");
            console.error("위시리스트 실패 응답:", data);
            return;
          }

          bookmarkId = data.item?._id || null;

          wishStatus = true;
          alert("위시리스트에 추가되었습니다!");
          renderWishIcon();
          return;
        }

        // 이미 찜 된 상태 → 삭제 (DELETE)
        if (wishStatus) {
          if (!bookmarkId) {
            alert("위시리스트 정보가 없습니다. 다시 시도해 주세요.");
            return;
          }

          const { data } = await deleteAxios(`/bookmarks/${bookmarkId}`, token);

          if (!data.ok) {
            alert("위시리스트 삭제 실패");
            console.error("위시리스트 삭제 응답:", data);
            return;
          }

          wishStatus = false;
          bookmarkId = null;
          alert("위시리스트에서 제거되었습니다.");
          renderWishIcon();
        }
      } catch (error) {
        console.error("위시리스트 에러:", error);
        alert("오류가 발생했습니다. 다시 시도해 주세요.");
      }
    };
    // 두 사이즈 버튼 모두에 같은 함수 연결
    cartBtn?.addEventListener("click", handleCartClick);
    cartBtnBottom?.addEventListener("click", handleCartClick);
    // 위시리스트 버튼 연결
    wishBtn?.addEventListener("click", handleWishClick);
  } catch (err) {
    console.error("상품 상세 호출 에러:", err);
    alert("상품 정보를 불러오는 중 오류가 발생했습니다.");
  }
}

productDetail();
