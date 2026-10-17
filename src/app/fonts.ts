import { Inter } from "next/font/google";
import localFont from "next/font/local";

/**
 * Inter (Google, variable) — for auth and other product surfaces
 * that call for a neutral UI face instead of the brand font.
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * GT-Walsheim — single definition, imported wherever needed.
 * Defined once here so Next.js hosts it as one instance.
 *
 * Add more weights (Thin 100, Ultra-Light 200, Ultra-Bold 800, Black 900,
 * Condensed variants) by appending entries to `src` below.
 */
export const walsheim = localFont({
  src: [
    {
      path: "../../public/fonts/GT-Walsheim/GT-Walsheim-Light-Trial.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Walsheim/GT-Walsheim-Light-Oblique-Trial.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Walsheim/GT-Walsheim-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Walsheim/GT-Walsheim-Regular-Oblique-Trial.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Walsheim/GT-Walsheim-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Walsheim/GT-Walsheim-Medium-Oblique-Trial.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GT-Walsheim/GT-Walsheim-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GT-Walsheim/GT-Walsheim-Bold-Oblique-Trial.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-walsheim",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial", "sans-serif"],
});
