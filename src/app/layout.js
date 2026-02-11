import "./globals.css";


export const metadata = {
  title: "OohPoint Dashboard",
  description: "OOH Media Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
