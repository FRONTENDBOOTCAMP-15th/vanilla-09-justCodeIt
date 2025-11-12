const sortBtn = document.getElementById("sort-btn") as HTMLButtonElement | null;
const sortMenu = document.getElementById("sort-menu") as HTMLDivElement | null;

if (sortBtn && sortMenu) {
  sortBtn.addEventListener("click", () => {
    sortMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;

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
    } else {
      desktopSidebar?.classList.add("lg:flex");
    }
  });
});

const imgOn = "/src/assets/img/Property 1=On.svg";
const imgOff = "/src/assets/img/Property 1=Off.png";

const checkboxImgs = document.querySelectorAll(".checkbox-img");

checkboxImgs.forEach((img) => {
  const targetId = img.getAttribute("data-target");
  const checkbox = document.getElementById(targetId!) as HTMLInputElement;

  // 클릭 시 상태 변경
  img.addEventListener("click", () => {
    checkbox.checked = !checkbox.checked;
    updateCheckboxImage(checkbox, img as HTMLImageElement);
  });

  // 체크박스 직접 눌렀을 때도 이미지 갱신
  checkbox.addEventListener("change", () =>
    updateCheckboxImage(checkbox, img as HTMLImageElement)
  );
});

function updateCheckboxImage(
  checkbox: HTMLInputElement,
  img: HTMLImageElement
) {
  img.src = checkbox.checked ? imgOn : imgOff;
}
