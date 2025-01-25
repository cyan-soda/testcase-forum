import type { Metadata } from "next";
import { SourceSansPro } from "@/lib/fonts"
import { Public_Sans, Inter } from 'next/font/google'

import "./globals.css";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

const APP_NAME = "Testcase Forum"
const APP_DESCRIPTION = "A forum designed for sharing testcases and discussions among HCMUT students."

const inter= Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        <div className='relative min-h-[100dvh] w-full bg-white text-black'>
          <Header />
          <div className='relative z-0 flex flex-row w-full h-full gap-5'>
            <div className='w-1/6'>
              <Sidebar />
            </div>
            <div className="w-5/6">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
