// 비밀번호 규칙 관련 로직
const pwd = document.getElementById("newPassword") as HTMLInputElement | null;
const ruleLen = document.getElementById("ruleLen") as HTMLElement | null;
const ruleMix = document.getElementById("ruleMix") as HTMLElement | null;

// X 아이콘
const iconCross = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3L13 13" stroke="#707072" />
    <path d="M13 3L3 13" stroke="#707072" />
  </svg>`;

// 체크 아이콘
const iconCheck = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6.88462L6.61538 11.5L14.1154 4" stroke="#007D48" stroke-width="1.15385"/>
  </svg>`;

// 규칙 상태 업데이트 함수
function updateRule(ruleElem: HTMLElement, ok: boolean): void {
  const icon =
    (ruleElem.querySelector(".icon") as HTMLElement | null) ||
    (ruleElem.querySelector("svg")?.parentElement as HTMLElement | null) ||
    ruleElem;

  const text =
    (ruleElem.querySelector(".text") as HTMLElement | null) || ruleElem;

  if (ok) {
    if (icon) icon.innerHTML = iconCheck;
    if (text) text.style.color = "#007D48";
  } else {
    if (icon) icon.innerHTML = iconCross;
    if (text) text.style.color = "#707072";
  }
}

// 비밀번호 입력 이벤트
pwd?.addEventListener("input", () => {
  const v = pwd.value;
  const isLong = v.length >= 8;
  const isMixed = /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v);

  if (ruleLen) updateRule(ruleLen, isLong);
  if (ruleMix) updateRule(ruleMix, isMixed);
});

// 체크박스 아이콘
// SVG 정의
const uncheckedIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#707072"/>
  </svg>`;

const checkedIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="#111111"/>
    <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#111111"/>
    <path d="M3.99529 9.99602C4.41211 9.63369 5.04373 9.67786 5.40606 10.0947L8.68635 13.8682L7.17693 15.1803L3.89664 11.4068C3.53431 10.99 3.57848 10.3584 3.99529 9.99602Z" fill="white"/>
    <path d="M6.25 14.34L14.1227 5.28345C14.485 4.86663 15.1167 4.82247 15.5335 5.1848C15.9503 5.54713 15.9945 6.17875 15.6321 6.59557L7.75942 15.6521L6.25 14.34Z" fill="white"/>
  </svg>`;

// 아이콘 업데이트 함수
function updateCheckboxIcon(input: HTMLInputElement) {
  const icon = input.nextElementSibling as HTMLElement | null;
  if (icon) {
    icon.innerHTML = input.checked ? checkedIcon : uncheckedIcon;
  }
}

// 모든 체크박스 선택 (policy 포함)
const checkboxes = document.querySelectorAll<HTMLInputElement>(
  'input[type="checkbox"]'
);

// 초기 상태 & 이벤트 연결
checkboxes.forEach((input) => {
  updateCheckboxIcon(input);
  input.addEventListener("change", () => updateCheckboxIcon(input));
});
