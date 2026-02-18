import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // optional CSS variable
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
        {children}
      </body>
    </html>
  );
}
