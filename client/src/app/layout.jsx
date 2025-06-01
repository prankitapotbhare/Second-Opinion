import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { PatientProvider } from '@/contexts/PatientContext';
import ToastProvider from '@/components/common/ToastProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Second Opinion",
  description: "Get a second opinion from a doctor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        {/* Optional: Add PNG or SVG version */}
        {/* <link rel="icon" type="image/png" href="/favicon.png" /> */}
        {/* <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> */}
      </head>
      <body className={inter.className}>
        <AuthProvider>
            <PatientProvider>
              {children}
            </PatientProvider>
        </AuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
