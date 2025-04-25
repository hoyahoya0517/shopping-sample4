import type { Metadata } from "next";
import "./globals.css";
import ReactQueryClientProvider from "./_config/ReactQueryClientProvider";
import Nav from "./_components/Nav/Nav";
import Footer from "./_components/Footer/Footer";
import AuthSession from "./_config/SessionProvider";
import NavMenu from "./_components/NavMenu/NavMenu";
import SearchMenu from "./_components/SearchMenu/SearchMenu";
import { Analytics } from "@vercel/analytics/next";
import { Noto_Sans_KR } from "next/font/google";

export const metadata: Metadata = {
  title: `스타스프레이`, // 브랜드 이름
  openGraph: {
    title: `스타스프레이`,
    description: `귀여운 것만 팝니다`,
    images: "/images/apple-icon.png",
  },
  description: `귀여운 것만 팝니다`, // 브랜드 설명
  other: {
    "google-site-verification": "z51t_yEWb2JkWC3tHdtTJOowpAhKeiiEdLAfcK2kJrk",
    "naver-site-verification": "3e6288a5a45db0b37299ef3b4859b4f466b98192",
    keywords: "스타스프레이,star spray,소품,소품샵",
    authors: "STAR SPRAY",
  },
};

const font = Noto_Sans_KR({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${font.className}`}>
      <link rel="icon" href="/images/favicon.ico" sizes="48x48" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/images/apple-icon.png"
      />
      <body>
        <ReactQueryClientProvider>
          <AuthSession>
            <Nav />
            {children}
            <Footer />
            <SearchMenu />
            <NavMenu />
            <Analytics />
          </AuthSession>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
