class NikeHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    setTimeout(() => this.updateLoginStatus(), 0);
    this.addSearchEvent();
    this.addSearchEvent();
  }

  render() {
    const token = localStorage.getItem("accessToken");

    // 토큰 있을 때 위시리스트 아이콘
    const profileOrWishlist = token
      ? `
      <a href="/src/pages/wish-list/wish-list.html" class="rounded-3xl hover:bg-[#E5E5E5] -translate-y-0.5">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M22.794 9.75002C24.118 9.75002 25.362 10.266 26.298 11.201C27.2262 12.1309 27.7475 13.3911 27.7475 14.705C27.7475 16.0189 27.2262 17.2791 26.298 18.209L18 26.508L9.70096 18.209C8.77307 17.2791 8.25195 16.0192 8.25195 14.7055C8.25195 13.3919 8.77307 12.1319 9.70096 11.202C10.16 10.7403 10.706 10.3743 11.3075 10.125C11.909 9.87578 12.5539 9.74832 13.205 9.75002C14.529 9.75002 15.773 10.266 16.709 11.201L17.469 11.961L18 12.492L18.53 11.961L19.29 11.201C19.7492 10.7396 20.2953 10.3738 20.8967 10.1248C21.4982 9.87573 22.143 9.74835 22.794 9.75002Z"
            stroke="#111111" stroke-width="1.5"
          />
        </svg>
      </a>`
      : // 토큰 없을 때 프로필(로그인) 아이콘
        `
      <a href="/src/pages/log-in/log-in.html" class="rounded-3xl hover:bg-[#E5E5E5] -translate-y-0.5">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M9.75 27V24C9.75 23.0054 10.1451 22.0516 10.8483 21.3483C11.5516 20.6451 12.5054 20.25 13.5 20.25H22.5C23.4946 20.25 24.4484 20.6451 25.1517 21.3483C25.8549 22.0516 26.25 23.0054 26.25 24V27M18 9.75C17.0054 9.75 16.0516 10.1451 15.3483 10.8483C14.6451 11.5516 14.25 12.5054 14.25 13.5C14.25 14.4946 14.6451 15.4484 15.3483 16.1517C16.0516 16.8549 17.0054 17.25 18 17.25C18.9946 17.25 19.9484 16.8549 20.6517 16.1517C21.3549 15.4484 21.75 14.4946 21.75 13.5C21.75 12.5054 21.3549 11.5516 20.6517 10.8483C19.9484 10.1451 18.9946 9.75 18 9.75Z"
            stroke="#111111" stroke-width="1.5"
          />
        </svg>
      </a>
    `;

    this.innerHTML = `
      <header class="w-full">
        <!-- 모바일 헤더 (로고 + 검색/프로필/장바구니/햄버거) -->
        <div class="w-full bg-[#ffffff] lg:hidden">
          <!-- 햄버거 토글용 체크박스 -->
          <input id="mobile-menu-toggle" type="checkbox" class="peer hidden" />
          <div class="mx-auto max-w-[1920px] px-4">
            <div class="h-[60px] flex items-center justify-between">
              <!-- 로고 (왼쪽) -->
              <a href="/src/pages/home/home.html" class="flex items-center">
                <svg
                  width="76"
                  height="60"
                  viewBox="0 0 76 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M67.854 20L24.8132 38.2574C21.2297 39.7777 18.2152 40.5363 15.7859 40.5363C13.0525 40.5363 11.0613 39.5717 9.83849 37.6459C8.25274 35.1611 8.94589 31.1656 11.6662 26.9479C13.2814 24.4826 15.3347 22.22 17.3356 20.0556C16.8648 20.8207 12.7092 27.7358 17.2539 30.9923C18.153 31.6463 19.4314 31.9667 21.0041 31.9667C22.2662 31.9667 23.7146 31.7607 25.3069 31.3455L67.854 20Z"
                    fill="#111111"
                  />
                </svg>
              </a>

              <!-- 오른쪽 아이콘들 -->
              <div class="flex items-center gap-1">
                <!-- 검색 아이콘 -->
                <a href="/src/pages/home/home.html">
                  <button
                    type="button"
                    class="w-9 h-9 rounded-full hover:bg-[#E5E5E5]"
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.962 22.296C18.916 22.9224 17.7192 23.2521 16.5 23.25C15.6134 23.2512 14.7353 23.0772 13.9162 22.7379C13.0971 22.3986 12.3531 21.9008 11.727 21.273C11.0992 20.6469 10.6014 19.9029 10.2621 19.0838C9.92284 18.2647 9.7488 17.3866 9.75001 16.5C9.75001 14.636 10.505 12.949 11.727 11.727C12.3531 11.0992 13.0971 10.6014 13.9162 10.2621C14.7353 9.92284 15.6134 9.7488 16.5 9.75001C18.364 9.75001 20.051 10.505 21.273 11.727C21.9008 12.3531 22.3986 13.0971 22.7379 13.9162C23.0772 14.7353 23.2512 15.6134 23.25 16.5C23.2517 17.6974 22.9338 18.8736 22.329 19.907C21.812 20.789 21.895 21.895 22.618 22.618L26.471 26.471"
                        stroke="#111111"
                        stroke-width="1.5"
                      />
                    </svg>
                  </button>
                </a>

                <!-- 토큰 유무에 따른 프로필 or 위시리스트 아이콘-->
                ${profileOrWishlist}
                
                <!-- 장바구니 아이콘 -->
                <a href="/src/pages/cart/cart.html">
                  <button
                    type="button"
                    class="w-9 h-9 rounded-full hover:bg-[#E5E5E5]"
                  >
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.25 14.25V12C14.25 11.4033 14.4871 10.831 14.909 10.409C15.331 9.98705 15.9033 9.75 16.5 9.75H19.5C20.0967 9.75 20.669 9.98705 21.091 10.409C21.5129 10.831 21.75 11.4033 21.75 12C21.75 12.5967 21.5129 13.169 21.091 13.591C20.669 14.0129 20.0967 14.25 19.5 14.25H9.75V22.5C9.75 23.4946 10.1451 24.4484 10.8483 25.1517C11.5516 25.8549 12.5054 26.25 13.5 26.25H22.5C23.4946 26.25 24.4484 25.8549 25.1517 25.1517C25.8549 24.4484 26.25 23.4946 26.25 22.5V14.25H23.5" stroke="#111111" stroke-width="1.5"/>
                    </svg>

                  </button>
                </a>

                <!-- 햄버거 메뉴 아이콘 (체크박스 토글) -->
                <label
                  for="mobile-menu-toggle"
                  class="w-9 h-9 rounded-full hover:bg-[#E5E5E5] flex items-center justify-center cursor-pointer"
                >
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27 11.25H9M27 18H9M27 24.75H9" stroke="#111111" stroke-width="1.5"/>
                  </svg>

                </label>
              </div>
            </div>
          </div>

          <!-- 오버레이: 부드럽게 페이드 인/아웃 -->
          <div
            class="fixed inset-0 bg-black/40 opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto transition-opacity duration-300"
          ></div>

          <!-- 오른쪽에서 나오는 사이드 메뉴 -->
          <nav
            class="fixed top-0 right-0 h-full w-80 bg-[#FFFFFF] pl-10 translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-out"
          >
            <div class="flex items-start justify-end mb-9 p-4">
              <!-- 닫기 버튼 -->
              <label
                for="mobile-menu-toggle"
                class="w-9 h-9 rounded-full hover:bg-[#E5E5E5] flex items-center justify-center cursor-pointer ml-4"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="18" cy="18" r="14.5" fill="#E5E5E5" />
                  <path d="M11 11L25 25" stroke="#111111" stroke-width="2" />
                  <path d="M25 11L11 25" stroke="#111111" stroke-width="2" />
                </svg>
              </label>
            </div>
            <!-- 상단: 가입하기 / 로그인 버튼 -->
            <div class="flex gap-6 mb-11">
              <a
                href="/src/pages/log-in/log-in.html"
                class="inline-flex items-center justify-center h-11 px-6 rounded-4xl hover:bg-[#9E9EA0] bg-[#111111] text-white text-base font-normal"
              >
                가입하기
              </a>
              <a
                href="/src/pages/log-in/log-in.html"
                class="inline-flex items-center justify-center h-11 px-6 rounded-4xl hover:bg-[#707072] border border-[#D4D4D4] bg-[#FFFFFF] text-base font-medium text-[#111111]"
              >
                로그인
              </a>
            </div>

            <ul class=" space-y-5 text-2xl font-medium text-[#111]">
            <li>
                <a
                  class="mobileBtn"
                  href="/src/pages/product-list/product-list.html?custom=%7B%22extra.isNew%22%3Atrue%7D&"
                >
                  <span>New &amp; Featured</span>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4854 10L22.9706 18.4853L14.4854 26.9706"
                      stroke="#111111"
                      stroke-width="2"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  class="mobileBtn"
                  href="/src/pages/product-list/product-list.html?custom=%7B%22extra.gender%22%3A%22men%22%7D&"
                >
                  <span>Men</span>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4854 10L22.9706 18.4853L14.4854 26.9706"
                      stroke="#111111"
                      stroke-width="2"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  class="mobileBtn"
                  href="/src/pages/product-list/product-list.html?custom=%7B%22extra.gender%22%3A%22women%22%7D&"
                >
                  <span>Women</span>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4854 10L22.9706 18.4853L14.4854 26.9706"
                      stroke="#111111"
                      stroke-width="2"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  class="mobileBtn"
                  href="/src/pages/product-list/product-list.html?custom=%7B%22extra.gender%22%3A%22kids%22%7D&"
                >
                  <span>Kids</span>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4854 10L22.9706 18.4853L14.4854 26.9706"
                      stroke="#111111"
                      stroke-width="2"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  class="mobileBtn"
                  href="/src/pages/product-list/product-list.html?custom=%7B%22extra.isBest%22%3Atrue%7D&"
                >
                  <span>Sale</span>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4854 10L22.9706 18.4853L14.4854 26.9706"
                      stroke="#111111"
                      stroke-width="2"
                    />
                  </svg>
                </a>
              </li>
            </ul>
            
            <div class="mt-12 space-y-6 text-base text-[#111111]">
              <a href="#" class="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.99 18V16.5M9 9.75C9.00027 9.21339 9.14447 8.68668 9.41756 8.22476C9.69065 7.76284 10.0826 7.38262 10.5527 7.12373C11.0227 6.86485 11.5536 6.73678 12.0899 6.75286C12.6263 6.76895 13.1485 6.9286 13.6022 7.21519C14.0559 7.50177 14.4244 7.9048 14.6693 8.38225C14.9142 8.85971 15.0266 9.39411 14.9947 9.92978C14.9628 10.4654 14.7878 10.9827 14.488 11.4278C14.1882 11.8728 13.7745 12.2293 13.29 12.46C12.51 12.83 12 13.62 12 14.49V15M21.75 12C21.75 17.385 17.385 21.75 12 21.75C6.615 21.75 2.25 17.385 2.25 12C2.25 6.615 6.615 2.25 12 2.25C17.385 2.25 21.75 6.615 21.75 12Z" stroke="#111111" stroke-width="1.5" stroke-miterlimit="10"/>
                </svg>
                <span>고객센터</span>
              </a>

              <a href="/src/pages/cart/cart.html" class="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.25 8.25V6C8.25 5.40326 8.48705 4.83097 8.90901 4.40901C9.33097 3.98705 9.90326 3.75 10.5 3.75H13.5C14.0967 3.75 14.669 3.98705 15.091 4.40901C15.5129 4.83097 15.75 5.40326 15.75 6C15.75 6.59674 15.5129 7.16903 15.091 7.59099C14.669 8.01295 14.0967 8.25 13.5 8.25H3.75V16.5C3.75 17.4946 4.14509 18.4484 4.84835 19.1517C5.55161 19.8549 6.50544 20.25 7.5 20.25H16.5C17.4946 20.25 18.4484 19.8549 19.1517 19.1517C19.8549 18.4484 20.25 17.4946 20.25 16.5V8.25H17.5" stroke="#111111" stroke-width="1.5"/>
                </svg>
                <span>장바구니</span>
              </a>

              <a href="#" class="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 13.5V6.5C12 4.76 13.01 3.75 14.25 3.75H18.64L20.25 9.75M20.25 9.75H3.75M20.25 9.75V20.25H3.75V9.75M3.75 9.75L5.36 3.75H10.5" stroke="#111111" stroke-width="1.5" stroke-miterlimit="10"/>
                </svg>
                <span>주문</span>
              </a>

              <a href="#" class="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.25 5.25V16.5C20.25 17.74 19.24 18.75 18 18.75H6C4.76 18.75 3.75 17.74 3.75 16.5V5.25M8.25 18.5V11.25H15.75V18.5M12 11.25V18.5M1.5 5.25H22.5" stroke="#111111" stroke-width="1.5" stroke-miterlimit="10"/>
                </svg>
                <span>매장 찾기</span>
              </a>
            </div>
          </nav>
        </div>

        <!-- 유틸바 -->
        <div class="w-full bg-[#f5f5f5] hidden lg:block">
          <div class="mx-auto max-w-[1920px] px-6">
            <div class="h-[36px] flex items-center justify-end">
              <ul class="flex items-center text-xs text-[#111]">
                <li class="flex items-center">
                  <a href="#" class="hover:underline underline-offset-4"
                    >매장 찾기</a
                  >
                </li>
                <li class="px-3">
                  <svg
                    width="1"
                    height="12"
                    viewBox="0 0 1 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask id="path-1-inside-1_3180_44" fill="white">
                      <path d="M0 0H1V12H0V0Z" />
                    </mask>
                    <path
                      d="M0 0V12H2V0H0Z"
                      fill="#111111"
                      mask="url(#path-1-inside-1_3180_44)"
                    />
                  </svg>
                </li>
                <li class="flex items-center">
                  <a href="#" class="hover:underline underline-offset-4"
                    >고객센터</a
                  >
                </li>
                <li class="px-3" id="section-bar">
                  <svg
                    width="1"
                    height="12"
                    viewBox="0 0 1 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    
                  >
                    <mask id="path-1-inside-1_3180_44" fill="white">
                      <path d="M0 0H1V12H0V0Z" />
                    </mask>
                    <path
                      d="M0 0V12H2V0H0Z"
                      fill="#111111"
                      mask="url(#path-1-inside-1_3180_44)"
                    />
                  </svg>
                </li>
                <!-- 가입하기 링크 -->
                <li id="signup-link" class="flex items-center">
                  <a href="/src/pages/log-in/log-in.html" class="hover:underline underline-offset-4">가입하기</a>
                </li>
                

                <li id="section-bar" class="px-3">
                  <svg width="1" height="12" viewBox="0 0 1 12" fill="none">
                    <path d="M0 0V12H2V0H0Z" fill="#111111"/>
                  </svg>
                </li>

                <!-- 로그인 / 로그아웃 -->
                <li id="login-link" class="flex items-center">
                  <a href="/src/pages/log-in/log-in.html" class="hover:underline underline-offset-4">로그인</a>
                </li>
                <li id="logout-link" class="flex items-center hidden">
                  <button class="hover:underline underline-offset-4 text-xs bg-transparent border-none cursor-pointer">로그아웃</button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 메인 내비게이션 바 -->
        <div class="w-full bg-[#ffffff] hidden lg:block">
          <div class="mx-auto max-w-[1920px] px-6">
            <div class="h-[60px] flex items-center">
              <!-- 로고 (왼쪽) -->
              <div class="flex-1 flex items-center">
                <a href="/src/pages/home/home.html" class="flex items-center">
                  <svg
                    width="79"
                    height="79"
                    viewBox="0 0 79 79"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M68.6701 28.5074L25.6238 46.7648C22.0399 48.2852 19.0249 49.0437 16.5953 49.0437C13.8616 49.0437 11.8702 48.0792 10.6472 46.1534C9.06124 43.6685 9.75448 39.6731 12.4751 35.4553C14.0905 32.99 16.1441 30.7275 18.1453 28.563C17.6744 29.3281 13.5183 36.2433 18.0636 39.4998C18.9628 40.1537 20.2414 40.4741 21.8142 40.4741C23.0765 40.4741 24.5251 40.2681 26.1176 39.8529L68.6701 28.5074Z"
                      fill="#111111"
                    />
                  </svg>
                </a>
              </div>

              <!-- 카테고리 (가운데 정렬) -->
              <div class="flex-1 flex justify-center">
                <nav class="flex justify-center">
                  <ul
                    class="flex justify-center gap-8 text-base text-[#111] font-normal whitespace-nowrap"
                  >
                    <li><a class="categoryBtn" href="/src/pages/product-list/product-list.html?custom=%7B%22extra.isNew%22%3Atrue%7D&">New & Featured</a></li>
                    <li><a class="categoryBtn" href="/src/pages/product-list/product-list.html?custom=%7B%22extra.gender%22%3A%22men%22%7D&">Men</a></li>
                    <li><a class="categoryBtn" href="/src/pages/product-list/product-list.html?custom=%7B%22extra.gender%22%3A%22women%22%7D&">Women</a></li>
                    <li><a class="categoryBtn" href="/src/pages/product-list/product-list.html?custom=%7B%22extra.gender%22%3A%22kids%22%7D&">Kids</a></li>
                    <li><a class="categoryBtn" href="/src/pages/product-list/product-list.html?custom=%7B%22extra.isBest%22%3Atrue%7D&">Sale</a></li>
                  </ul>
                </nav>
              </div>

              <!-- 검색 + 아이콘 (오른쪽) -->
              <div class="flex-1 flex justify-end items-center gap-2">
                <!-- 검색 박스 -->
                <form class="w-[160px]">
                  <label for="search" class="sr-only">검색</label>
                  <div
                    class="flex items-center gap-2 h-10 rounded-3xl bg-[#f5f5f5] px-4 text-sm text-[#707072]"
                  >
                    <!-- 돋보기 아이콘 -->
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.962 16.296C12.916 16.9224 11.7192 17.2521 10.5 17.25C9.6134 17.2512 8.7353 17.0772 7.91618 16.7379C7.09707 16.3986 6.35308 15.9008 5.72701 15.273C5.09924 14.6469 4.6014 13.9029 4.26212 13.0838C3.92284 12.2647 3.7488 11.3866 3.75001 10.5C3.75001 8.63601 4.50501 6.94901 5.72701 5.72701C6.35308 5.09924 7.09707 4.6014 7.91618 4.26212C8.7353 3.92284 9.6134 3.7488 10.5 3.75001C12.364 3.75001 14.051 4.50501 15.273 5.72701C15.9008 6.35308 16.3986 7.09707 16.7379 7.91618C17.0772 8.7353 17.2512 9.6134 17.25 10.5C17.2517 11.6974 16.9338 12.8736 16.329 13.907C15.812 14.789 15.895 15.895 16.618 16.618L20.471 20.471"
                        stroke="#111111"
                        stroke-width="1.5"
                      />
                    </svg>

                    <input
                      id="search"
                      type="search"
                      placeholder="검색"
                      class="w-full bg-[#F5F5F5] outline-none placeholder:text-[#707072]"
                    />
                  </div>
                </form>

                <!-- 위시리스트 아이콘 -->
                <a href="/src/pages/wish-list/wish-list.html" class="rounded-3xl hover:bg-[#E5E5E5]">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.794 9.75002C24.118 9.75002 25.362 10.266 26.298 11.201C27.2262 12.1309 27.7475 13.3911 27.7475 14.705C27.7475 16.0189 27.2262 17.2791 26.298 18.209L18 26.508L9.70096 18.209C8.77307 17.2791 8.25195 16.0192 8.25195 14.7055C8.25195 13.3919 8.77307 12.1319 9.70096 11.202C10.16 10.7403 10.706 10.3743 11.3075 10.125C11.909 9.87578 12.5539 9.74832 13.205 9.75002C14.529 9.75002 15.773 10.266 16.709 11.201L17.469 11.961L18 12.492L18.53 11.961L19.29 11.201C19.7492 10.7396 20.2953 10.3738 20.8967 10.1248C21.4982 9.87573 22.143 9.74835 22.794 9.75002Z"
                      stroke="#111111"
                      stroke-width="1.5"
                    />
                  </svg>
                </a>

                <!-- 장바구니 아이콘 -->
                <a type="button" href="/src/pages/cart/cart.html" class="rounded-3xl hover:bg-[#E5E5E5]">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.25 14.25V12C14.25 11.4033 14.4871 10.831 14.909 10.409C15.331 9.98705 15.9033 9.75 16.5 9.75H19.5C20.0967 9.75 20.669 9.98705 21.091 10.409C21.5129 10.831 21.75 11.4033 21.75 12C21.75 12.5967 21.5129 13.169 21.091 13.591C20.669 14.0129 20.0967 14.25 19.5 14.25H9.75V22.5C9.75 23.4946 10.1451 24.4484 10.8483 25.1517C11.5516 25.8549 12.5054 26.25 13.5 26.25H22.5C23.4946 26.25 24.4484 25.8549 25.1517 25.1517C25.8549 24.4484 26.25 23.4946 26.25 22.5V14.25H23.5"
                      stroke="#111111"
                      stroke-width="1.5"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  updateLoginStatus() {
    const signupLink = this.querySelector<HTMLLIElement>("#signup-link")!;
    const loginLink = this.querySelector<HTMLLIElement>("#login-link")!;
    const logoutLink = this.querySelector<HTMLLIElement>("#logout-link")!;
    const logoutButton = logoutLink.querySelector<HTMLButtonElement>("button")!;
    const sectionBar = this.querySelector<HTMLLIElement>("#section-bar")!;

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      signupLink.style.display = "none";
      sectionBar.style.display = "none";
      loginLink.style.display = "none";
      logoutLink.classList.remove("hidden");
    } else {
      signupLink.style.display = "flex";
      sectionBar.style.display = "flex";
      loginLink.style.display = "flex";
      logoutLink.classList.add("hidden");
    }
    logoutButton.addEventListener("click", () => {
      localStorage.clear();
      signupLink.style.display = "flex";
      sectionBar.style.display = "flex";
      loginLink.style.display = "flex";
      logoutLink.classList.add("hidden");
    });
  }
  addSearchEvent() {
    const searchInput = this.querySelector(
      "#search"
    ) as HTMLInputElement | null;
    if (!searchInput) return;

    searchInput.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();

        const keyword = searchInput.value.trim();
        if (!keyword) return;

        const url = `/src/pages/product-list/product-list.html?keyword=${encodeURIComponent(keyword)}`;
        window.location.href = url;
      }
    });
  }
}

customElements.define("nike-header", NikeHeader);

export class FooterBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer class="mt-auto">
        <div class="w-full bg-[#ffffff]">
          <div class="max-w-[1920px] mx-auto px-6">
            <div class="hidden lg:block h-px bg-[#E5E5E5]"></div>
            <!-- 모바일 전용 : 링크 섹션 -->
            <section class="block lg:hidden py-6 text-xs text-[#111] space-y-2">
              <!-- 안내 -->
              <details class="group border-b border-[#E5E5E5] py-3">
                <summary
                  class="flex items-center justify-between cursor-pointer select-none"
                >
                  <span class="font-normal text-sm text-[#111]">안내</span>
                  <!-- 화살표 SVG -->
                  <svg
                    class="w-4 h-4 transition-transform group-open:rotate-180"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9662 8.47595L12.0002 15.443L5.0332 8.47595"
                      stroke="#111111"
                      stroke-width="1.5"
                    />
                  </svg>
                </summary>
                <ul
                  class="mt-6 m-0 list-none p-0 space-y-3 text-sm text-[#707072]"
                >
                  <li><a class="no-underline" href="#">멤버가입</a></li>
                  <li><a class="no-underline" href="#">매장찾기</a></li>
                  <li><a class="no-underline" href="#">나이키 저널</a></li>
                </ul>
              </details>

              <!-- 고객센터 -->
              <details class="group border-b border-[#E5E5E5] py-3">
                <summary
                  class="flex items-center justify-between cursor-pointer select-none"
                >
                  <span class="font-normal text-sm text-[#111]">고객센터</span>
                  <svg
                    class="w-4 h-4 transition-transform group-open:rotate-180"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9662 8.47595L12.0002 15.443L5.0332 8.47595"
                      stroke="#111111"
                      stroke-width="1.5"
                    />
                  </svg>
                </summary>
                <ul
                  class="mt-6 m-0 list-none p-0 space-y-3 text-sm text-[#707072]"
                >
                  <li><a class="no-underline" href="#">주문/배송조회</a></li>
                  <li><a class="no-underline" href="#">반품 정책</a></li>
                  <li><a class="no-underline" href="#">결제 방법</a></li>
                  <li><a class="no-underline" href="#">공지사항</a></li>
                  <li><a class="no-underline" href="#">문의하기</a></li>
                </ul>
              </details>

              <!-- 회사소개 -->
              <details class="group border-b border-[#E5E5E5] py-3">
                <summary
                  class="flex items-center justify-between cursor-pointer select-none"
                >
                  <span class="font-normal text-sm text-[#111]">회사소개</span>
                  <svg
                    class="w-4 h-4 transition-transform group-open:rotate-180"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9662 8.47595L12.0002 15.443L5.0332 8.47595"
                      stroke="#111111"
                      stroke-width="1.5"
                    />
                  </svg>
                </summary>
                <ul
                  class="mt-6 m-0 list-none p-0 space-y-3 text-sm text-[#707072]"
                >
                  <li><a class="no-underline" href="#">About Nike</a></li>
                  <li><a class="no-underline" href="#">소식</a></li>
                  <li><a class="no-underline" href="#">채용</a></li>
                  <li><a class="no-underline" href="#">투자자</a></li>
                  <li><a class="no-underline" href="#">지속가능성</a></li>
                </ul>
              </details>
            </section>

            <!-- 데스크탑 전용 : 링크 섹션 -->
            <section
              class="hidden lg:grid lg:grid-cols-3 grid-cols-1 gap-10 py-10"
            >
              <nav class="space-y-3">
                <h3 class="mb-8 font-normal text-sm text-[#111]">안내</h3>
                <ul class="list-none p-0 space-y-3 text-sm text-[#707072]">
                  <li>
                    <a class="no-underline" href="#">멤버가입</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">매장찾기</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">나이키 저널</a>
                  </li>
                </ul>
              </nav>

              <nav class="space-y-3">
                <h3 class="mb-8 font-normal text-sm text-[#111]">고객센터</h3>
                <ul class="m-0 list-none p-0 space-y-3 text-sm text-[#707072]">
                  <li>
                    <a class="no-underline" href="#">주문/배송조회</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">반품 정책</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">결제 방법</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">공지사항</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">문의하기</a>
                  </li>
                </ul>
              </nav>

              <nav class="space-y-3">
                <h3 class="mb-8 font-normal text-sm text-[#111]">회사소개</h3>
                <ul class="m-0 list-none p-0 space-y-3 text-sm text-[#707072]">
                  <li>
                    <a class="no-underline" href="#">About Nike</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">소식</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">채용</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">투자자</a>
                  </li>
                  <li>
                    <a class="no-underline" href="#">지속가능성</a>
                  </li>
                </ul>
              </nav>
            </section>

            <!-- 정책/저작권 -->
            <section
              class="flex flex-col gap-6 py-4 text-sm text-[#707072] lg:flex-row lg:items-center lg:justify-start"
            >
              <p class="m-0">© 2024 Nike, Inc. All Rights Reserved</p>

              <ul
                class="m-0 list-none p-0 flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:gap-x-5 lg:gap-y-2"
              >
                <li>
                  <a class="no-underline" href="#">이용약관</a>
                </li>
                <li>
                  <a class="no-underline font-bold" href="#">개인정보처리방침</a>
                </li>
                <li>
                  <a class="no-underline" href="#">위치정보이용약관</a>
                </li>
                <li>
                  <a class="no-underline" href="#">영상정보처리기기 운영 방침</a>
                </li>
              </ul>
            </section>

            <div class="h-px bg-[#E5E5E5]"></div>

            <!-- 회사 정보 -->
            <section class="lg:w-1/2 py-6 lg:pb-10 text-sm text-[#707072]">
              <p class="m-0">
                (유)나이키코리아 대표 Kimberly Lynn Chang Mendes, 케네디 정 멘데스
                | 서울 강남구 테헤란로 152 강남파이낸스센터 30층 |
                통신판매업신고번호 2011-서울강남-03461 | 등록번호 220-88-09068 |
                사업자정보 확인
              </p>
              <p class="m-0">
                고객센터 전화: 080-022-0182 | FAX: 02-6744-5880 | 이메일:
                <a
                  href="mailto:service@nike.co.kr"
                  class="hover:underline underline-offset-4"
                  >service@nike.co.kr</a
                >
                | 호스팅서비스사업자: (유)나이키코리아
              </p>
            </section>
          </div>
        </div>
      </footer>
    `;
  }
}

// 이걸 실행해야 브라우저가 <nike-header></nike-header>를 인식
customElements.define("footer-bar", FooterBar);
