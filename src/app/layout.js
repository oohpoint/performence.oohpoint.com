import "./globals.css";
import { Inter } from "next/font/google";
import { MyProvider } from "@/context/MyContext"; // ⬅️ add this

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "OohPoint Dashboard",
  description: "OOH Media Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-white">
        <MyProvider>{children}</MyProvider> {/* ⬅️ wrap here */}
      </body>
    </html>
  );
}