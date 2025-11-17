import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 메인 페이지
        index: "index.html",
        home: path.resolve(__dirname, `src/pages/home/home.html`),
        "product-list": path.resolve(
          __dirname,
          `src/pages/product-list/product-list.html`
        ),
        recommend: path.resolve(
          __dirname,
          `src/components/recommend.html`
        ),
        "product-detail": path.resolve(
          __dirname,
          `src/pages/product-detail/product-detail.html`
        ),
        "log-in": path.resolve(__dirname, `src/pages/log-in/log-in.html`),
        cart: path.resolve(__dirname, `src/pages/cart/cart.html`),
      },
    },
  },
  appType: "mpa", // fallback 사용안함

  plugins: [tailwindcss()],
});
