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
