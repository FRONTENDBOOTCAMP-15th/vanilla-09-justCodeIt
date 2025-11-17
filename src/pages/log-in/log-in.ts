// 패스워드 토글
// 요소 참조 (null 가능성 포함)
const pwdInput = document.getElementById("password") as HTMLInputElement | null;
const pwdToggle = document.getElementById(
  "pwdToggle"
) as HTMLButtonElement | null;
const eyeIcon = document.getElementById("eyeIcon") as HTMLElement | null;

const eyeOpen = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.9196 11.6C19.8996 6.91 16.0996 4 11.9996 4C7.89958 4 4.09958 6.91 2.07958 11.6C1.96827 11.8551 1.96827 12.1449 2.07958 12.4C4.09958 17.09 7.89958 20 11.9996 20C16.0996 20 19.8996 17.09 21.9196 12.4C22.0309 12.1449 22.0309 11.8551 21.9196 11.6ZM11.9996 18C8.82958 18 5.82958 15.71 4.09958 12C5.82958 8.29 8.82958 6 11.9996 6C15.1696 6 18.1696 8.29 19.8996 12C18.1696 15.71 15.1696 18 11.9996 18ZM11.9996 8C9.79044 8 7.99958 9.79086 7.99958 12C7.99958 14.2091 9.79044 16 11.9996 16C14.2087 16 15.9996 14.2091 15.9996 12C15.9996 10.9391 15.5782 9.92172 14.828 9.17157C14.0779 8.42143 13.0604 8 11.9996 8ZM11.9996 14C10.895 14 9.99958 13.1046 9.99958 12C9.99958 10.8954 10.895 10 11.9996 10C13.1041 10 13.9996 10.8954 13.9996 12C13.9996 13.1046 13.1041 14 11.9996 14Z" fill="black"/>
</svg>
`;

const eyeClosed = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9402 6.08003C11.291 6.02626 11.6453 5.99951 12.0002 6.00003C15.1802 6.00003 18.1702 8.29002 19.9102 12C19.6441 12.5646 19.3435 13.1123 19.0102 13.64C18.9044 13.8038 18.8488 13.995 18.8502 14.19C18.8548 14.6385 19.1574 15.0291 19.5906 15.1455C20.0237 15.262 20.4814 15.0758 20.7102 14.69C21.1761 13.958 21.5808 13.1887 21.9202 12.39C22.0286 12.1379 22.0286 11.8522 21.9202 11.6C19.9002 6.91003 16.1002 3.99993 12.0002 3.99993C11.5309 3.99766 11.0623 4.03782 10.6002 4.12003C10.2429 4.18076 9.94522 4.42748 9.81918 4.76725C9.69315 5.10702 9.75795 5.48822 9.98918 5.76725C10.2204 6.04628 10.5829 6.18076 10.9402 6.12003V6.08003ZM3.71021 2.29003C3.45655 2.03637 3.08683 1.9373 2.74033 2.03015C2.39383 2.12299 2.12318 2.39364 2.03033 2.74015C1.93748 3.08665 2.03655 3.45637 2.29021 3.71003L5.39021 6.80003C3.97578 8.16155 2.85007 9.79401 2.08021 11.6C1.9689 11.8551 1.9689 12.145 2.08021 12.4C4.10021 17.09 7.90021 20 12.0002 20C13.7973 19.9876 15.552 19.4525 17.0502 18.46L20.2902 21.71C20.478 21.8993 20.7336 22.0058 21.0002 22.0058C21.2668 22.0058 21.5224 21.8993 21.7102 21.71C21.8995 21.5223 22.006 21.2667 22.006 21C22.006 20.7334 21.8995 20.4778 21.7102 20.29L3.71021 2.29003ZM10.0702 11.48L12.5202 13.93C12.3512 13.9785 12.176 14.0021 12.0002 14C10.8956 14 10.0002 13.1046 10.0002 12C9.99816 11.8242 10.0217 11.649 10.0702 11.48ZM12.0002 18C8.82021 18 5.83021 15.71 4.10021 12C4.7463 10.5738 5.66328 9.2866 6.80021 8.21003L8.57021 10C7.71623 11.5586 7.99304 13.4938 9.24973 14.7505C10.5064 16.0072 12.4416 16.284 14.0002 15.43L15.5902 17C14.5013 17.6409 13.2636 17.9857 12.0002 18Z" fill="#111111"/>
</svg>
`;

// 모든 요소가 있을 때만 이벤트 연결
if (pwdInput && pwdToggle && eyeIcon) {
  let visible = false;

  pwdToggle.addEventListener("click", () => {
    visible = !visible;

    if (pwdInput.type === "password") {
      pwdInput.type = "text";
      eyeIcon.innerHTML = eyeOpen;
    } else {
      pwdInput.type = "password";
      eyeIcon.innerHTML = eyeClosed;
    }
  });
}

// 이메일 입력 후 계속 클릭 시 비밀번호 입력하는 화면으로 전환
const formEmail = document.getElementById(
  "form-email"
) as HTMLFormElement | null;
const formPassword = document.getElementById(
  "form-password"
) as HTMLFormElement | null;
const stepEmail = (document.getElementById("setp-email") ||
  document.getElementById("step-email")) as HTMLElement | null; // 오타 대응
const stepPassword = document.getElementById(
  "step-password"
) as HTMLElement | null;
const emailInput = document.getElementById("email") as HTMLInputElement | null;
const emailEcho = document.getElementById("emailEcho") as HTMLElement | null;
const btnPrev = document.querySelector<HTMLButtonElement>(
  "#step-password .btn.ghost"
); // '이전' 버튼

function show(el?: HTMLElement | null) {
  if (!el) return;
  el.classList.remove("hidden");
  el.removeAttribute("inert");
}
function hide(el?: HTMLElement | null) {
  if (!el) return;
  el.classList.add("hidden");
  el.setAttribute("inert", ""); // 접근성: 포커스 막기
}

// 이메일 → 비밀번호 스텝
formEmail?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!emailInput) return;

  // HTML5 유효성 체크
  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  // 이메일 표시(선택: 마스킹)
  const v = emailInput.value.trim();
  if (emailEcho) {
    emailEcho.textContent = v;
  }

  hide(stepEmail);
  show(stepPassword);

  // 포커스 이동
  const pwd = document.getElementById("password") as HTMLInputElement | null;
  pwd?.focus();
});

// '이전' 버튼 → 이메일 스텝으로
btnPrev?.addEventListener("click", () => {
  hide(stepPassword);
  show(stepEmail);
  emailInput?.focus();
});
