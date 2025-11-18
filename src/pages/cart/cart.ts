//  수량 추가 감소 기능

document.addEventListener("DOMContentLoaded", () => {
  const cart = document.querySelector(".cart");
  if (!cart) return;

  cart.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    // svg 내부를 눌러도 버튼으로 타겟 고정
    const button = target.closest<HTMLButtonElement>(".qty__btn");
    if (!button) return;

    const qtyWrapper = button.closest(".cart-item__qty");
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

    // 수량 반영
    output.textContent = String(current);

    // 감소 버튼 색상 업데이트
    updateMinusButtonColor(qtyWrapper as HTMLElement, current);
  });

  // 페이지 진입 시 초기 렌더 → 감소 버튼 색상 세팅
  document.querySelectorAll(".cart-item__qty").forEach((qtyWrapper) => {
    const output = qtyWrapper.querySelector(".qty__value");
    if (!output) return;

    const value = parseInt(output.textContent || "1", 10);
    updateMinusButtonColor(qtyWrapper as HTMLElement, value);
  });
});

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
