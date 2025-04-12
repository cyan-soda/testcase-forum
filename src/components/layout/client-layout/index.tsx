"use client";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { usePathname } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import i18n from "@/configs/i18.config";
import AppProvider from "@/providers/app-provider";
import { LanguageProvider } from "@/providers/language-provider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/auth/");

  return (
    <AppProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <div className="relative min-h-[100dvh] w-full bg-white text-black">
            <Header />
            <div className="relative z-0 flex flex-row w-full h-full gap-5">
              {!hideSidebar ? (
                <>
                  <div className="w-1/6">
                    <Sidebar />
                  </div>
                  <div className="w-5/6">{children}</div>
                </>
              ) : (
                <div className="w-full h-full">{children}</div>
              )}
            </div>
          </div>
        </LanguageProvider>
      </I18nextProvider>
    </AppProvider>
  );
}