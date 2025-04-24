"use client";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster, toast } from 'sonner';
import { SelectedUsersProvider } from "@/context/SelectedUsersContext";
import { AppSidebarUser } from "@/components/AppSidebarUser";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    // const isArabic = false;

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"} // Set text direction dynamically
            className={`flex flex-row-reverse  w-full h-full md:block`}
        >
            <Toaster />

            {/* Sidebar */}
            <div className={`xl:w-[15%] lg:w-[20%] md:w-[25%]  h-full absolute right-0  border-l-2 hidden md:block overflow-y-hidden`}>
                {/* Sidebar content */}
                <AppSidebarUser />
            </div>

            {/* Main Content */}
            <main className={`xl:w-[85%] lg:w-[80%] md:w-[75%] md:p-4 h-full   bg-gray-50 absolute left-0 overflow-y-scroll`}>
                {children}
            </main>
        </div>
    );
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <SelectedUsersProvider>
                <LanguageProvider>
                    <LayoutContent>{children}</LayoutContent>
                </LanguageProvider>
            </SelectedUsersProvider>
        </SidebarProvider>
    );
}