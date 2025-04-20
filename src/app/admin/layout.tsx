"use client";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster, toast } from 'sonner';
import { SelectedUsersProvider } from "@/context/SelectedUsersContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    // const isArabic = false;

    return (
        <div
            dir={isArabic ? "rtl" : "ltr"} // Set text direction dynamically
            className={`flex ${isArabic ? "flex-row-reverse" : "flex-row"}  w-full h-full hidden md:block`}
        >
            <Toaster />

            {/* Sidebar */}
            <div className={`xl:w-[15%] lg:w-[20%] md:w-[25%]  h-full absolute ${isArabic ? "right-0  border-l-2" : "left-0 border-r-2"} hidden md:block overflow-y-hidden`}>
                {/* Sidebar content */}
                <AppSidebar />
            </div>

            {/* Main Content */}
            <main className={`xl:w-[85%] lg:w-[80%] md:w-[75%] md:p-4 h-full   bg-gray-50 absolute ${isArabic ? " left-0" : "right-0"} overflow-y-scroll`}>
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