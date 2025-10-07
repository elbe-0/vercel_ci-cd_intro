import type { ReactNode } from "react";

export const metadata = {
  title: "Next.js Hello",
  description: "Minimal Next.js App Router example deployed on Vercel"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
