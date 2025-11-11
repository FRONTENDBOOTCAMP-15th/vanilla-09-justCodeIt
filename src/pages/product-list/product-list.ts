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
