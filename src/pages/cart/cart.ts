import { AxiosError } from "axios";
import { getAxios } from "../../utils/axios";
import type {
  CartListRes,
  UpdateCartQtyBody,
  ApiError,
  CartItem,
  CartInfo,
} from "../../utils/types";

const api = getAxios();

// 페이지 진입 시: 장바구니 불러오기 + 수량 버튼 세팅
document.addEventListener("DOMContentLoaded", () => {
  initCartPage();
  setupQtyButtons();
});

// -------------------- 장바구니 목록 조회 --------------------

async function initCartPage() {
  const accessToken = localStorage.getItem("accessToken");
  const cartSection = document.querySelector<HTMLElement>(".cart");
  if (!cartSection) return;

  try {
    const res = await api.get<CartListRes>("/carts/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const data = res.data;

    console.log(data);

    if (data.ok === true) {
      renderCart(data.item);
    } else {
      alert(
        (data as any).message ||
          "장바구니 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  } catch (error) {
    console.error("load cart error:", error);
    alert("장바구니 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
}

function renderCart(items: CartItem[]) {
  const cartCount = document.querySelector<HTMLElement>(".cart__count");
  const cartTotal = document.querySelector<HTMLElement>(".cart__total");
  const orderValue = document.querySelector<HTMLElement>(".order__value");
  const orderTotal = document.querySelector<HTMLElement>(".order__total");
  const cartItemsContainer = document.querySelector<HTMLElement>(".cart-items");

  if (!cartItemsContainer) return;

  // 장바구니 비어있을 때
  if (items.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="py-10 text-center text-gray-500">장바구니에 담긴 상품이 없습니다.</p>';
    if (cartCount) cartCount.textContent = "0 개의 제품";
    if (cartTotal) cartTotal.textContent = "0 원";
    if (orderValue) orderValue.textContent = "0 원";
    if (orderTotal) orderTotal.textContent = "0 원";
    return;
  }

  // 아이템 렌더링
  const html = items
    .map((item) => {
      const { _id, product, quantity, size } = item;
      const linePrice = product.price * quantity;

      return `
        <article class="cart-item " data-cart-id="${_id}">
          <div class="flex gap-3 items-start pt-10">
            
            <!-- 상품 이미지 -->
            <div class="cart-item__media w-[154px] h-[154px] shrink-0 bg-gray-100 overflow-hidden">
              <img src="${product.image?.path || ""}" alt="${product.name}" />
            </div>

            <!-- 상품 정보 -->
            <div class="cart-item__body flex flex-col text-[16px] font-normal space-y-1">
              <div class="cart-item__price">${product.price.toLocaleString("ko-KR")} 원</div>
              <h2 class="cart-item__title">${product.name}</h2>

              <dl class="cart-item__meta text-gray-500 font-light space-y-1">
                <div class="cart-item__meta-row">
                  <dt>사이즈</dt>
                  <dd class="cart-item__size underline">${size}</dd>
                </div>
                <div class="cart-item__meta-row">
                  <dt>수량</dt>
                  <dd class="cart-item__qty flex items-center gap-2">
                    
                    <button
                      type="button"
                      class="qty__btn"
                      aria-label="수량 감소"
                    >
                      <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                        <path d="M10 0V2H0V0H10Z" fill="#A6A6A6" />
                      </svg>
                    </button>

                    <output class="qty__value" aria-live="polite">${quantity}</output>

                    <button
                      type="button"
                      class="qty__btn"
                      aria-label="수량 증가"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M6 0V4H10V6H6V10H4V6H0V4H4V0H6Z" fill="#333333" />
                      </svg>
                    </button>
                  </dd>
                </div>
              </dl>

              <div class="cart-item__actions flex-col space-x-1">
                <button
                  type="button"
                  class="btn-like"
                  aria-label="관심상품에 추가"
                >
                  <svg
                    width="24"
                    height="33"
                    viewBox="0 0 24 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.794 7.75002C18.118 7.75002 19.362 8.26602 20.298 9.20102C21.2262 10.1309 21.7475 11.3911 21.7475 12.705C21.7475 14.0189 21.2262 15.2791 20.298 16.209L12 24.508L3.70096 16.209C2.77307 15.2791 2.25195 14.0192 2.25195 12.7055C2.25195 11.3919 2.77307 10.1319 3.70096 9.20202C4.15999 8.74032 4.70604 8.37425 5.30751 8.12501C5.90897 7.87578 6.5539 7.74832 7.20496 7.75002C8.52896 7.75002 9.77296 8.26602 10.709 9.20102L11.469 9.96102L12 10.492L12.53 9.96102L13.29 9.20102C13.7492 8.73963 14.2953 8.37384 14.8967 8.12478C15.4982 7.87573 16.143 7.74835 16.794 7.75002Z"
                      stroke="#111111"
                      stroke-width="1.5"
                    />
                  </svg>
                </button>
                <button type="button" class="btn-remove" aria-label="상품 삭제">
                  <svg
                    width="24"
                    height="33"
                    viewBox="0 0 24 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.25 11.5V23.5M9.75 11.5V23.5M5.25 10V23.5C5.25 24.74 6.26 25.75 7.5 25.75H16.5C17.74 25.75 18.75 24.74 18.75 23.5V9.25M18.75 9.25H21.5M18.75 9.25H21M9 6.25H14.25C15.08 6.25 15.75 6.92 15.75 7.75C15.75 8.58 15.08 9.25 14.25 9.25H3"
                      stroke="#111111"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                    />
                  </svg>
                </button>
              </div>
              
            </div>
          </div>

          <div class="cart-item__shipping">
            <p class="ship__badge font-normal">무료 배송</p>
          </div>
        </article>
      `;
    })
    .join("");

  cartItemsContainer.innerHTML = html;

  // 합계 계산
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cartCount) cartCount.textContent = `${items.length} 개의 제품`;
  if (cartTotal) cartTotal.textContent = `${total.toLocaleString("ko-KR")} 원`;
  if (orderValue)
    orderValue.textContent = `${total.toLocaleString("ko-KR")} 원`;
  if (orderTotal)
    orderTotal.textContent = `${total.toLocaleString("ko-KR")} 원`;

  // 수량 버튼 색상 다시 세팅
  document.querySelectorAll(".cart-item__qty").forEach((qtyWrapperEl) => {
    const output = qtyWrapperEl.querySelector(".qty__value");
    if (!output) return;
    const value = parseInt(output.textContent || "1", 10);
    updateMinusButtonColor(qtyWrapperEl as HTMLElement, value);
  });
}

// -------------------- 수량 버튼 + PATCH 연동 --------------------

function setupQtyButtons() {
  const cart = document.querySelector<HTMLElement>(".cart");
  if (!cart) return;

  // + / - / 삭제 등 모든 클릭을 cart 한 곳에서 이벤트 위임
  cart.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    // 1) 삭제 버튼인지 확인
    const removeBtn = target.closest<HTMLButtonElement>(".btn-remove");
    if (removeBtn) {
      const cartItemEl = removeBtn.closest<HTMLElement>(".cart-item");
      if (!cartItemEl) return;

      const cartId = cartItemEl.dataset.cartId;
      if (!cartId) return;

      // 사용자 확인
      const ok = confirm("이 상품을 장바구니에서 삭제할까요?");
      if (!ok) return;

      try {
        await deleteCartItem(cartId); // DELETE /carts/{id} 호출
        await initCartPage(); // 최신 상태로 다시 렌더
      } catch (error) {
        console.error("delete cart error:", error);

        const err = error as AxiosError<ApiError>;
        const msg =
          err.response?.data?.message ||
          "장바구니 상품 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        alert(msg);
      }

      return; // 삭제 처리 끝났으면 여기서 종료
    }

    // 2) 삭제 버튼이 아니면 수량 버튼인지 확인
    const button = target.closest<HTMLButtonElement>(".qty__btn");
    if (!button) return;

    // 이 버튼이 속한 cart-item 찾기 → data-cart-id 에서 id 읽기
    const cartItemEl = button.closest<HTMLElement>(".cart-item");
    if (!cartItemEl) return;

    const cartId = cartItemEl.dataset.cartId;
    if (!cartId) return;

    const qtyWrapper = button.closest<HTMLElement>(".cart-item__qty");
    if (!qtyWrapper) return;

    const output = qtyWrapper.querySelector<HTMLOutputElement>(".qty__value");
    if (!output) return;

    // 현재 수량
    let current = parseInt(output.textContent || "1", 10);

    // 증가 or 감소 판별
    const isIncrease = button.getAttribute("aria-label")?.includes("증가");
    const isDecrease = button.getAttribute("aria-label")?.includes("감소");

    if (isIncrease) current += 1;
    if (isDecrease) current = Math.max(1, current - 1);

    // 먼저 화면에 수량/색상 반영
    output.textContent = String(current);
    updateMinusButtonColor(qtyWrapper, current);

    // 서버에 PATCH /carts/{id} 로 수량 반영
    try {
      await updateCartQuantity(cartId, current);

      // 수량 변경이 성공하면, 장바구니 데이터를 다시 불러와서
      // 합계/총금액/수량 등을 즉시 다시 계산해서 화면에 반영
      await initCartPage();
    } catch (error) {
      console.error("update qty error:", error);

      const err = error as AxiosError<ApiError>;
      const msg =
        err.response?.data?.message ||
        "수량을 변경하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      alert(msg);
    }
  });

  // 4) 페이지 진입 시 초기 렌더 → 감소 버튼 색상 세팅
  document
    .querySelectorAll<HTMLElement>(".cart-item__qty")
    .forEach((qtyWrapper) => {
      const output = qtyWrapper.querySelector<HTMLOutputElement>(".qty__value");
      if (!output) return;

      const value = parseInt(output.textContent || "1", 10);
      updateMinusButtonColor(qtyWrapper, value);
    });
}

/** 감소 버튼 색상 변경 함수 */
function updateMinusButtonColor(qtyWrapper: HTMLElement, value: number) {
  const minusBtn = qtyWrapper.querySelector<HTMLButtonElement>(
    'button[aria-label="수량 감소"]'
  );
  if (!minusBtn) return;

  const path = minusBtn.querySelector("path");
  if (!path) return;

  // 수량 1 → 회색(#A6A6A6)
  // 수량 2 이상 → 검정(#333333)
  if (value <= 1) {
    path.setAttribute("fill", "#A6A6A6");
  } else {
    path.setAttribute("fill", "#333333");
  }
}

/** PATCH /carts/{id} : 장바구니 수량 수정 */
async function updateCartQuantity(cartId: string, quantity: number) {
  const body: UpdateCartQtyBody = { quantity };

  const res = await api.patch<{ ok: number; message?: string }>(
    `/carts/${cartId}`,

    body,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (res.data && "ok" in res.data && res.data.ok === 0) {
    throw new Error(res.data.message || "수량 수정에 실패했습니다.");
  }
}

/** DELETE /carts/{id} : 장바구니 상품 한 건 삭제 */
async function deleteCartItem(cartId: string) {
  const res = await api.delete<{ ok: number; message?: string }>(
    `/carts/${cartId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  // 서버에서 ok: 0 으로 내려보내면 에러로 처리
  if (res.data && "ok" in res.data && res.data.ok === 0) {
    throw new Error(res.data.message || "상품 삭제에 실패했습니다.");
  }
}
