import type { ReactNode } from "react";

export const metadata = {
  title: "롤 내전 팀 자동 매칭",
  description: "LoL team auto-matching",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
