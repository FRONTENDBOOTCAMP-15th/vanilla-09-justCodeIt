// import style from "../style.css?inline";
// 웹 컴포넌트(Web Components)”로 헤더를 만들기 위한 커스텀 엘리먼트 클래스
class NikeHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  // UI를 렌더링
  render() {
    this.innerHTML = `
      <style>
        @import "../src/style.css";
      </style>
      <!-- 유틸바 -->
      <!-- 유틸바: 모바일 숨김 -->
      <div class="w-full bg-[#f5f5f5] hidden md:block">
        <div class="max-w-1280px mx-auto px-6">
          <div class="h-9 flex items-center">
            <div class="flex-1"></div>
            <nav aria-label="유틸리티" class="ml-auto">
              <ul class="flex gap-0 list-none p-0 m-0 text-xs text-black/70">
                <li class="flex items-center"><a href="#" class="hover:underline underline-offset-4">매장 찾기</a></li>
                <li class="flex items-center px-3 text-black/20 select-none">|</li>
                <li class="flex items-center"><a href="#" class="hover:underline underline-offset-4">고객센터</a></li>
                <li class="flex items-center px-3 text-black/20 select-none">|</li>
                <li class="flex items-center"><a href="#" class="hover:underline underline-offset-4">가입하기</a></li>
                <li class="flex items-center px-3 text-black/20 select-none">|</li>
                <li class="flex items-center"><a href="#" class="hover:underline underline-offset-4">로그인</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- 메인 헤더 -->
      <div class="w-full bg-white md:bg-[#f7f7f7]">
        <div class="max-w-1280px mx-auto px-6">
          <div class="h-16 flex items-center justify-between">
            <!-- 좌: 로고 -->
            <a href="/index.html" aria-label="나이키 홈페이지" class="inline-flex items-center shrink-0">
              <img src="./src/assets/icons/logo.svg" alt="" class="w-60px h-28px block" />
            </a>

            <!-- 가운데: 카테고리 (모바일 숨김) -->
            <nav aria-="주요 카테고리" class="hidden md:block">
              <ul class="flex items-center gap-10 text-base leading-5 text-[#111]">
                <li><a href="#" class="hover:underline underline-offset-4">New &amp; Featured</a></li>
                <li><a href="#" class="hover:underline underline-offset-4">Men</a></li>
                <li><a href="#" class="hover:underline underline-offset-4">Women</a></li>
                <li><a href="#" class="hover:underline underline-offset-4">Kids</a></li>
                <li><Sale</a></li>
              </ul>
            </nav>

            <!-- 우측 아이콘들 -->
            <div class="flex items-center gap-5 text-black/80">
              <!-- 모바일 전용: 검색 아이콘, 사용자, 장바구니(뱃지), 햄버거 -->
              <div class="flex items-center gap-6 md:hidden">
                <button aria-label="검색" class="inline-flex items-center p-0 bg-transparent border-0 cursor-pointer">
                  <img src="./src/assets/icons/Property 1=IconSearch.svg" class="w-6 h-6 block" alt="" />
                </button>

                <button aria-label="내 계정" class="inline-flex items-center p-0 bg-transparent border-0 cursor-pointer">
                  <!-- 사용자 아이콘 경로는 프로젝트에 맞게 교체 -->
                  <img src="./src/assets/icons/login.svg" class="w-6 h-6 block" alt="" />
                </button>

                <button aria-label="장바구니" class="relative inline-flex items-center p-0 bg-transparent border-0 cursor-pointer">
                  <img src="./src/assets/icons/cart.svg" class="w-7 h-7 block" alt="" />
                  <!-- 카운트 뱃지 -->
               
                </button>

                <button aria-label="메뉴 열기" class="inline-flex items-center p-0 bg-transparent border-0 cursor-pointer">
                  <!-- 햄버거 아이콘 경로는 프로젝트에 맞게 교체 -->
                  <img src="./src/assets/icons/Icon36px.svg" class="w-6 h-6 block" alt="" />
                </button>
              </div>

              <!-- 데스크톱 전용: 검색 인풋 + 위시/장바구니 -->
              
              <label aria-label="검색" class="hidden md:flex items-center gap-2 bg-white rounded-full py-6px px-3 ring-1 ring-black/10">
                <img src="./src/assets/icons/Property 1=IconSearch.svg" class="w-4 h-4" alt="" />
                <input placeholder="검색" class="border-none outline-none bg-transparent text-sm placeholder-black/40" />
              </label>

              <button aria-label="위시리스트" class="hidden md:inline-flex items-center cursor-pointer bg-transparent border-0 p-0 hover:opacity-70">
                <img src="./src/assets/icons/img.svg" class="w-6 h-6 block" alt="" />
              </button>

              <button aria-label="장바구니" class="hidden md:inline-flex items-center cursor-pointer bg-transparent border-0 p-0 hover:opacity-70">
                <img src="./src/assets/icons/cart.svg" class="w-6 h-6 block" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("nike-header", NikeHeader);

export class FooterBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `

      <style>
        @import "../src/style.css";
      </style>
      <footer class="absolute bottom-0 w-full text-black/80">
        <div>
          <div class="max-w-1280px mx-auto px-6">
          <hr class="border-t border-black/10" />
            <!-- 링크 섹션 -->
            <section class="grid grid-cols-1 gap-10 py-10 text-[13px] text-[#111] md:grid-cols-3" aria-label="푸터 링크">
              <nav class="space-y-3" aria-labelledby="g-help bg-red-400">
                <h3 id="g-help" class="mb-3 font-semibold text-black/80">안내</h3>
                <ul class="m-0 list-none p-0 space-y-3">
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">멤버가입</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">매장찾기</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">나이키 저널</a></li>
                </ul>
              </nav>

              <nav class="space-y-3" aria-labelledby="g-support">
                <h3 id="g-support" class="mb-3 font-semibold text-black/80">고객센터</h3>
                <ul class="m-0 list-none p-0 space-y-3">
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">주문/배송조회</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">반품 정책</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">결제 방법</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">공지사항</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">문의하기</a></li>
                </ul>
              </nav>

              <nav class="space-y-3" aria-labelledby="g-about">
                <h3 id="g-about" class="mb-3 font-semibold text-black/80">회사소개</h3>
                <ul class="m-0 list-none p-0 space-y-3">
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">About Nike</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">소식</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">채용</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">투자자</a></li>
                  <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">지속가능성</a></li>
                </ul>
              </nav>
            </section>

            <!-- 정책/저작권 -->
            <section class="flex flex-col gap-3 py-4 text-xs text-black/70 md:flex-row md:items-center md:justify-start" aria-label="정책 및 저작권">
              <p class="m-0">© 2024 Nike, Inc. All Rights Reserved</p>
              <ul class="m-0 list-none p-0 flex flex-wrap gap-x-5 gap-y-2">
                <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">이용약관</a></li>
                <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">개인정보처리방침</a></li>
                <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">위치정보이용약관</a></li>
                <li><a class="no-underline text-inherit hover:underline underline-offset-4" href="#">영상정보처리기기 운영 방침</a></li>
              </ul>
            </section>

            <hr class="border-t border-black/10" />

            <!-- 회사 정보 -->
            <section class="w-[690px] py-4 pb-6 text-xs leading-[1.7] text-black/70" aria-label="회사 정보">
              <p class="m-0">
                (유)나이키코리아 대표 Kimberly Lynn Chang Mendes, 케네디 정 멘데스 | 서울 강남구 테헤란로 152 강남파이낸스센터 30층 | 통신판매업신고번호 2011-서울강남-03461 | 등록번호 220-88-09068 | 사업자정보 확인
              </p>
              <p class="m-0">
                고객센터 전화: 080-022-0182 | FAX: 02-6744-5880 | 이메일:
                <a href="mailto:service@nike.co.kr" class="hover:underline underline-offset-4">service@nike.co.kr</a> | 호스팅서비스사업자: (유)나이키코리아
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
