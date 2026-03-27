import "./globals.css";
import Header from "./components/header";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";

export const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"] });
export const grotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "Video Calling Powered by AI",
  description: "Video Calling Powered by AI",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {/* <Header /> */}
        {children}</body>
    </html>
  );
}
