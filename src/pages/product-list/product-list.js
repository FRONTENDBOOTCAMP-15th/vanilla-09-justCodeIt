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
document.addEventListener("DOMContentLoaded", () => {
    const hiddenFilterBtn = document.getElementById("hidden-filter");
    const desktopSidebar = document.getElementById("desktop-sidebar");
    hiddenFilterBtn?.addEventListener("click", () => {
        if (desktopSidebar?.classList.contains("lg:flex")) {
            desktopSidebar.classList.remove("lg:flex");
        }
        else {
            desktopSidebar?.classList.add("lg:flex");
        }
    });
});
const imgOn = "/src/assets/img/Property 1=On.svg";
const imgOff = "/src/assets/img/Property 1=Off.png";
const checkboxImgs = document.querySelectorAll(".checkbox-img");
checkboxImgs.forEach((img) => {
    const targetId = img.getAttribute("data-target");
    const checkbox = document.getElementById(targetId);
    // 클릭 시 상태 변경
    img.addEventListener("click", () => {
        checkbox.checked = !checkbox.checked;
        updateCheckboxImage(checkbox, img);
    });
    // 체크박스 직접 눌렀을 때도 이미지 갱신
    checkbox.addEventListener("change", () => updateCheckboxImage(checkbox, img));
});
function updateCheckboxImage(checkbox, img) {
    img.src = checkbox.checked ? imgOn : imgOff;
}
export {};
