import { AxiosError } from "axios";
import { getAxios } from "../../utils/axios";
import type {
  SignupBody,
  SignupRes,
  ApiError,
  LoginBody,
  LoginRes,
} from "../../utils/types";

const api = getAxios();

let currentEmail = "";

// 로그인 API
async function loginRequest(
  email: string,
  password: string
): Promise<LoginRes> {
  const body: LoginBody = { email, password };
  const res = await api.post<LoginRes>("/users/login", body);
  return res.data;
}

const HOME_URL = "/"; // 홈 경로. 실제 홈 페이지 주소에 맞게 바꿔도 됨.

// 로그인 성공 시 공통 처리: 토큰 저장 + 홈으로 이동
function handleLoginSuccess(data: LoginRes) {
  // localStorage.setItem("accessToken", data.accessToken);
  // 필요하면 유저 정보도 저장 가능
  // localStorage.setItem("user", JSON.stringify(data.user));
  window.location.href = HOME_URL;
}

// =========
// 이메일 체크
// =========

// ------------------  이메일 중복 체크 API 함수 ------------------

async function checkEmailExists(email: string): Promise<boolean> {
  const res = await api.get<{ ok: number; message?: string }>("/users/email", {
    params: { email },
    // 200, 409 둘 다 "성공"으로 취급 (인터셉터 에러 X)
    validateStatus(status) {
      return status === 200 || status === 409;
    },
  });

  // 존재하는 이메일(기존 회원)
  if (res.status === 409) {
    return true;
  }

  // 중복되지 않은 이메일(신규 회원)
  return false;
}

// 데이터 API로 보내는 함수
async function submitSignup() {
  // STEP 3의 입력 요소들
  const firstNameInput = document.getElementById(
    "firstName"
  ) as HTMLInputElement | null;
  const lastNameInput = document.getElementById(
    "lastName"
  ) as HTMLInputElement | null;
  const newPasswordInput = document.getElementById(
    "newPassword"
  ) as HTMLInputElement | null;
  const birthInput = document.getElementById(
    "birth"
  ) as HTMLInputElement | null;
  const policyInput = document.getElementById(
    "policy"
  ) as HTMLInputElement | null;

  if (
    !firstNameInput ||
    !lastNameInput ||
    !newPasswordInput ||
    !birthInput ||
    !policyInput
  ) {
    alert("회원가입 정보를 다시 확인해 주세요.");
    return;
  }

  if (!currentEmail) {
    alert("이메일 정보가 없습니다. 처음부터 다시 진행해 주세요.");
    return;
  }

  const body: SignupBody = {
    email: currentEmail,
    password: newPasswordInput.value,
    name: `${lastNameInput.value}${firstNameInput.value}`,
    type: "user",
  };

  try {
    // 회원가입 요청
    const res = await api.post<SignupRes>("/users", body);

    // 서버 응답 로그 (디버깅용)
    console.log("signup response:", res.status, res.data);

    // 혹시 ok:0 형태로 에러를 주는 경우
    const data: any = res.data;
    if (typeof data?.ok === "number" && data.ok === 0) {
      alert(data.message || "회원가입 중 오류가 발생했습니다. (서버 응답)");
      return;
    }

    // 여기까지 왔으면 "회원가입은 성공" 이라고 보고 자동 로그인 진행
    alert("회원가입이 완료되었습니다.");

    try {
      const loginData = await loginRequest(
        currentEmail,
        newPasswordInput.value
      );

      // 자동 로그인 성공 → 토큰 저장 + 홈으로 이동
      handleLoginSuccess(loginData);
    } catch (error) {
      // 회원가입은 되었지만 자동 로그인 실패한 경우
      console.error("auto login error after signup:", error);
      alert(
        "회원가입은 완료되었지만 자동 로그인에 실패했어요.\n로그인 화면에서 다시 로그인해 주세요."
      );

      // 자동 로그인 실패 시, 로그인 스텝으로 돌려보내고 싶으면:
      hide(stepSignup);
      hide(stepConsent);
      show(stepPassword);
    }
  } catch (error) {
    // 진짜로 회원가입 요청 자체가 실패한 경우
    console.error("signup request error:", error);
    const err = error as AxiosError<ApiError>;
    const msg =
      err.response?.data?.message ||
      "회원가입 중 오류가 발생했습니다. (요청 실패)";
    alert(msg);
  }
}

// ------------------ 로그인 비밀번호 토글 ------------------

// 요소 참조 (null 가능성 포함)
const pwdInput = document.getElementById("password") as HTMLInputElement | null;
const pwdToggle = document.getElementById(
  "pwdToggle"
) as HTMLButtonElement | null;
const eyeIcon = document.getElementById("eyeIcon") as HTMLElement | null;

const eyeOpen = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.9196 11.6C19.8996 6.91 16.0996 4 11.9996 4C7.89958 4 4.09958 6.91 2.07958 11.6C1.96827 11.8551 1.96827 12.1449 2.07958 12.4C4.09958 17.09 7.89958 20 11.9996 20C16.0996 20 19.8996 17.09 21.9196 12.4C22.0309 11.8551 22.0309 11.6 21.9196 11.6ZM11.9996 18C8.82958 18 5.82958 15.71 4.09958 12C5.82958 8.29 8.82958 6 11.9996 6C15.1696 6 18.1696 8.29 19.8996 12C18.1696 15.71 15.1696 18 11.9996 18ZM11.9996 8C9.79044 8 7.99958 9.79086 7.99958 12C7.99958 14.2091 9.79044 16 11.9996 16C14.2087 16 15.9996 14.2091 15.9996 12C15.9996 10.9391 15.5782 9.92172 14.828 9.17157C14.0779 8.42143 13.0604 8 11.9996 8ZM11.9996 14C10.895 14 9.99958 13.1046 9.99958 12C9.99958 10.8954 10.895 10 11.9996 10C13.1041 10 13.9996 10.8954 13.9996 12C13.9996 13.1046 13.1041 14 11.9996 14Z" fill="black"/>
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

// ------------------ 이메일/비밀번호/회원가입/동의 스텝 ------------------
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
  el.setAttribute("inert", "");
}

// 이메일 → 비밀번호 스텝
const stepSignup = document.getElementById("step-signup") as HTMLElement | null; // STEP 3
const stepConsent = document.getElementById(
  "step-consent"
) as HTMLElement | null; // STEP 4
const formSignup = document.getElementById(
  "form-signup"
) as HTMLFormElement | null;
const formConsent = document.getElementById(
  "form-consent"
) as HTMLFormElement | null;

formEmail?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!emailInput) return;

  // HTML5 유효성 체크
  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  const v = emailInput.value.trim();
  if (!v) return;

  // 전역에 현재 이메일 저장
  currentEmail = v;

  // 화면에 이메일 보여주는 부분 (비밀번호 화면 상단)
  if (emailEcho) {
    emailEcho.textContent = v;
  }

  try {
    // 1) 이메일이 가입되어 있는지 서버에 물어보기
    const exists = await checkEmailExists(v);

    if (exists) {
      // 2-1) 기존 회원이면 → 비밀번호 화면으로
      hide(stepEmail);
      show(stepPassword);

      const pwd = document.getElementById(
        "password"
      ) as HTMLInputElement | null;
      pwd?.focus();
    } else {
      // 2-2) 신규 회원이면 → 회원가입 기본정보 화면으로
      hide(stepEmail);
      show(stepSignup);
      const firstName = document.getElementById(
        "firstName"
      ) as HTMLInputElement | null;
      firstName?.focus();
    }
  } catch (error) {
    // checkEmailExists 안에서 alert 띄웠으니까 여기선 로그 정도만
    console.error(error);
  }
});

// '이전' 버튼 → 이메일 스텝으로
btnPrev?.addEventListener("click", () => {
  hide(stepPassword);
  show(stepEmail);
  emailInput?.focus();
});

// 회원가입
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

// 규칙 상태 업데이트  함수
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

// 비밀번호 입력 이벤트 ------------
pwd?.addEventListener("input", () => {
  const v = pwd.value;
  const isLong = v.length >= 8;
  const isMixed = /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v);

  if (ruleLen) updateRule(ruleLen, isLong);
  if (ruleMix) updateRule(ruleMix, isMixed);
});

//생년월일 ------------
// 생년월일 입력 & 표시
const birthInput = document.getElementById("birth") as HTMLInputElement | null;
const birthField = birthInput?.closest(".field") as HTMLElement | null;
const birthLabel = birthField?.querySelector("span") as HTMLElement | null;

if (birthField && birthInput) {
  birthField.addEventListener("click", (e) => {
    if (e.target === birthInput) return;
    birthInput.focus();
    (birthInput as any).showPicker?.();
  });
}

if (birthInput && birthLabel) {
  const originalLabelText = birthLabel.textContent || "생년월일";

  birthInput.addEventListener("change", () => {
    const value = birthInput.value;
    if (!value) {
      birthLabel.textContent = originalLabelText;
      birthLabel.classList.remove("text-gray-700");
      birthLabel.classList.add("text-gray-400");
      return;
    }

    const [year, month, day] = value.split("-");
    const formatted = `${year}. ${month}. ${day}.`;

    birthLabel.textContent = formatted;
    birthLabel.classList.remove("text-gray-400");
    birthLabel.classList.add("text-gray-700");
  });
}

// 체크박스 아이콘 ------------------------------

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
  if (icon && icon.classList.contains("icon")) {
    icon.innerHTML = input.checked ? checkedIcon : uncheckedIcon;
  }
}

// 모든 체크박스 선택 (policy 포함, consent 포함)
const checkboxes = document.querySelectorAll<HTMLInputElement>(
  'input[type="checkbox"]'
);

// 초기 상태 & 이벤트 연결
checkboxes.forEach((input) => {
  updateCheckboxIcon(input);
  input.addEventListener("change", () => updateCheckboxIcon(input));
});

// --- 전체 동의 & 필수 동의 연동 -----------------------------

// "모든 약관에 동의합니다" 체크박스
const allAgree = document.getElementById("allAgree") as HTMLInputElement | null;

// consent 단계 필수 체크박스들
const requiredChecks = document.querySelectorAll<HTMLInputElement>(
  "#reqAgree1, #reqAgree2, #reqAgree3"
);

// 전체동의 → 아래 3개 함께 on/off
allAgree?.addEventListener("change", () => {
  requiredChecks.forEach((chk) => {
    chk.checked = allAgree.checked;
    updateCheckboxIcon(chk);
  });
});

// 아래 3개 상태에 따라 전체동의 자동 업데이트
requiredChecks.forEach((chk) => {
  chk.addEventListener("change", () => {
    if (!allAgree) return;
    const allChecked = Array.from(requiredChecks).every((c) => c.checked);
    allAgree.checked = allChecked;
    updateCheckboxIcon(allAgree);
  });
});

// 기본정보 입력 후 동의항목으로 이동
formSignup?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!formSignup.checkValidity()) {
    // 브라우저 기본 유효성 에러 표시
    formSignup.reportValidity();
    return;
  }

  hide(stepSignup);
  show(stepConsent);
});

// 필수 동의 체크 확인
formConsent?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 필수 항목이 모두 체크되어 있는지 확인
  const allRequiredChecked = Array.from(requiredChecks).every((c) => c.checked);
  if (!allRequiredChecked) {
    alert("필수 약관에 모두 동의해야 회원가입을 완료할 수 있어요.");
    return;
  }

  // 여기서 실제 회원가입 API 호출
  await submitSignup();
});

// 로그인
const passwordInput = document.getElementById(
  "password"
) as HTMLInputElement | null;

formPassword?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!passwordInput) return;

  // 브라우저 자체 유효성 검사
  if (!passwordInput.checkValidity()) {
    passwordInput.reportValidity();
    return;
  }

  if (!currentEmail) {
    alert("이메일 정보가 없습니다. 처음부터 다시 진행해 주세요.");
    return;
  }

  try {
    // 1) 로그인 API 호출
    const data = await loginRequest(currentEmail, passwordInput.value);

    // 로그인 성공 알림
    alert("로그인이 완료되었습니다.");

    // 2) 공통 처리: 토큰 저장 + 홈으로 이동
    handleLoginSuccess(data);
  } catch (error: any) {
    console.error(error);

    const err = error as AxiosError<any>;
    const msg =
      err.response?.data?.message ||
      "이메일 또는 비밀번호를 다시 확인해 주세요.";
    alert(msg);
  }
});
