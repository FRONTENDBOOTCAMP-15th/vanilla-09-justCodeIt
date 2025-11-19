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
  const cartSection = document.querySelector<HTMLElement>(".cart");
  if (!cartSection) return;

  try {
    const res = await api.get<CartListRes>("/carts/", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjYsInR5cGUiOiJ1c2VyIiwibmFtZSI6IuuwleyngOydgCIsImVtYWlsIjoidGVzdDFAbmF2ZXIuY29tIiwibG9naW5UeXBlIjoiZW1haWwiLCJpYXQiOjE3NjM1MTg4MjgsImV4cCI6MTc2MzYwNTIyOCwiaXNzIjoiRkVCQyJ9.fsu0ucwueSxpFjsxyJ8jB-p5djJfl4zJ6pNWrnTXgX4",
      },
    });
    const data = res.data;

    console.log(data);

    if ("ok" in data && data.ok === true) {
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
      const { _id, product, quantity } = item;
      const linePrice = product.price * quantity;

      return `
        <article class="cart-item border-t border-b border-gray-300 pb-10" data-cart-id="${_id}">
          <div class="flex gap-3 items-start pt-10">
            
            <!-- 상품 이미지 -->
            <div class="cart-item__media w-[154px] h-[154px] shrink-0 bg-gray-100 overflow-hidden">
              <img src="${product.image?.[0]?.path || ""}" alt="${product.name}" />
            </div>

            <!-- 상품 정보 -->
            <div class="cart-item__body flex flex-col text-[16px] font-normal space-y-1">
              <div class="cart-item__price">${product.price.toLocaleString("ko-KR")} 원</div>
              <h2 class="cart-item__title">${product.name}</h2>

              <dl class="cart-item__meta text-gray-500 font-light space-y-1">
                <div class="cart-item__meta-row">
                  <dt>사이즈</dt>
                  <dd class="cart-item__size underline">${product.extra?.sort ?? "-"}</dd>
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

              <!-- 삭제 버튼 -->
              <button type="button" class="btn-remove mt-2" aria-label="상품 삭제">
                🗑 삭제
              </button>
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

  // 1) + / - / 삭제 등 모든 클릭을 cart 한 곳에서 이벤트 위임
  cart.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    // svg 내부를 눌러도 버튼으로 타겟 고정
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

    // 2) 먼저 화면에 수량/색상 반영
    output.textContent = String(current);
    updateMinusButtonColor(qtyWrapper, current);

    // 3) 서버에 PATCH /carts/{id} 로 수량 반영
    try {
      await updateCartQuantity(cartId, current);
      // 필요하면 여기서 총합/금액 다시 계산하려면 initCartPage() 한 번 더 호출
      // await initCartPage();
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
    body
  );

  if (res.data && "ok" in res.data && res.data.ok === 0) {
    throw new Error(res.data.message || "수량 수정에 실패했습니다.");
  }
}
