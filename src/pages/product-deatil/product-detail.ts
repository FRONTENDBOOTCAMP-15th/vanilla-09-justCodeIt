function enableDragScroll(container: HTMLElement): void {
  let isDown = false;
  let startX = 0;
  let startLeft = 0;

  container.addEventListener("pointerdown", (e: PointerEvent) => {
    if (e.button !== 0) return; // 좌클릭만 허용
    isDown = true;
    container.setPointerCapture?.(e.pointerId);
    startX = e.clientX;
    startLeft = container.scrollLeft;
  });

  container.addEventListener("pointermove", (e: PointerEvent) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    container.scrollLeft = startLeft - dx;
  });

  const end = (): void => {
    isDown = false;
  };

  container.addEventListener("pointerup", end);
  container.addEventListener("pointerleave", end);
  container.addEventListener("pointercancel", end);

  // 트랙패드 수평 휠 스크롤 지원
  container.addEventListener(
    "wheel",
    (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        container.scrollLeft += e.deltaX;
      }
    },
    { passive: false }
  );
}

// 사용 예시
const detailCarousel = document.getElementById("detailCarousel");
if (detailCarousel) enableDragScroll(detailCarousel);

const colorCarousel = document.getElementById("colorCarousel");
if (colorCarousel) enableDragScroll(colorCarousel);
