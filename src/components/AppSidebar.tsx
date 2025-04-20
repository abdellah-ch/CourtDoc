"use client";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarSeparator,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { BsGearFill, BsPeopleFill, BsBoxArrowLeft, BsShieldLock } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    const links = [
        {
            href: "/admin/users",
            label: isArabic ? "إدارة المستخدمين" : "Gestion des utilisateurs",
            icon: <BsPeopleFill className="w-5 h-5" />
        },
        {
            href: "/admin/parameters",
            label: isArabic ? "الإعدادات" : "Paramètres",
            icon: <BsGearFill className="w-5 h-5" />
        },
    ];

    const accessDropdownLinks = [
        {
            href: "/admin/access/interfaces",
            label: isArabic ? "صلاحيات الواجهات" : "Accès interfaces",
            icon: <BsShieldLock className="w-5 h-5" />
        },
        {
            href: "/admin/access/filieres",
            label: isArabic ? "صلاحيات الشعب" : "Accès filières",
            icon: <BsShieldLock className="w-5 h-5" />
        },
    ];

    const handleLogout = async () => {
        // Add your logout logic here
        try {
            const response = await fetch('/api/logout', { // Adjust the URL to your API route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Logout successful');
                // Redirect to login page or handle redirection as needed
                window.location.href = '/login'; // Or use any other logic
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
        console.log("User logged out");
    };

    return (
        <Sidebar className="w-full text-gray-800 border-r relative h-screen flex flex-col">
            <SidebarContent className="flex-1 overflow-y-auto">
                {/* Header with admin info */}
                <SidebarHeader className="px-4 py-6">
                    <div className="flex items-center space-x-3">
                        <Avatar className="border-2 border-primary">
                            {/* <AvatarImage src="/admin-avatar.png" /> */}
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-bold">{isArabic ? "لوحة التحكم" : "Administration"}</span>
                            <span className="text-xs text-gray-500">Admin</span>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarSeparator className="my-2" />

                {/* Main navigation */}
                <SidebarGroup>
                    <SidebarMenu>
                        {links.map((link) => (
                            <SidebarMenuItem key={link.href}>
                                <SidebarMenuButton asChild>
                                    <Link href={link.href} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                                        {link.icon}
                                        <span>{link.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarSeparator className="my-2" />

                {/* Access permissions section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {isArabic ? "إدارة الصلاحيات" : "Gestion des accès"}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accessDropdownLinks.map((link) => (
                                <SidebarMenuItem key={link.href}>
                                    <SidebarMenuButton asChild>
                                        <Link href={link.href} className="flex items-center gap-3 px-4 py-2  hover:bg-gray-100 rounded-lg transition-colors">
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer with logout button */}
            <SidebarFooter className=" border-t w-full">
                <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={handleLogout}
                >
                    <BsBoxArrowLeft className="w-5 h-5 " />
                    {isArabic ? "تسجيل الخروج" : "Déconnexion"}
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}