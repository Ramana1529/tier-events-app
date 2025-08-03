import { ClerkProvider } from "@clerk/nextjs";
import Header from "./component/header";
import "./globals.css";

export const metadata = {
  title: "Tier Events App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <main className="p-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
