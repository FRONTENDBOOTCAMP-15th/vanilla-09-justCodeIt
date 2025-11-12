const sortBtn = document.getElementById("sort-btn");
const sortMenu = document.getElementById("sort-menu");
if (sortBtn && sortMenu) {
    sortBtn.addEventListener("click", () => {
        sortMenu.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
        const target = e.target;
        if (!sortBtn.contains(target) && !sortMenu.contains(target)) {
            sortMenu.classList.add("hidden");
        }
    });
}
export {};
