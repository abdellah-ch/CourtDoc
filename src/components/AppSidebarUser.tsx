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
import { BsBoxArrowLeft } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

export function AppSidebarUser() {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    const [IdUtilisateur, setIdUtilisateur] = useState("");
    const [username, setUsername] = useState("");
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserRelatedGroupesFilieres = async (IdUtilisateur: string) => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/getUserGroupesFilieres", {
                method: "POST",
                body: JSON.stringify({ IdUtilisateur })
            });

            const data = await res.json();
            setGroups(data.UtilisateurGroupeFilieres);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const username = localStorage.getItem('username') || '';
        setUsername(username);
        const IdUtilisateur = localStorage.getItem("userId") || '';
        setIdUtilisateur(IdUtilisateur);
        if (IdUtilisateur != "") {
            fetchUserRelatedGroupesFilieres(IdUtilisateur);
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.clear();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <Sidebar dir="rtl" className="w-full relative bg-white text-gray-800 border-r border-gray-200 h-screen flex flex-col shadow-lg">
            {/* Logo Section */}
            <SidebarHeader className="px-4 py-4  border-gray-200 bg-gradient-to-r from-[#FFBC2B]/10 to-[#FFBC2B]/20">
                <div className="flex items-center justify-center h-auto">
                    <div className="relative h-full w-full max-w-[180px] mx-auto">
                        <Image
                            src="/logo.svg" // Replace with your logo path
                            alt="Court Logo"
                            width={180} // Adjust based on your logo dimensions
                            height={64} // Adjust based on your logo dimensions
                            className="object-center" // Removed object-contain
                            priority
                        />
                    </div>
                </div>
            </SidebarHeader>

            {/* User Profile Section */}
            {/* <div className="flex justify-center px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FFBC2B]/10 to-[#FFBC2B]/20">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-[#FFBC2B]">
                        <AvatarImage src="/images/user.png" />
                        <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-xl">{isArabic ? "لوحة التحكم" : "Dashboard"}</span>
                        <span className="text-lg text-[#FFBC2B] font-bold">{username}</span>
                    </div>
                </div>
            </div> */}

            {/* Scrollable Content */}
            <SidebarContent className="flex-1 overflow-y-auto py-4">
                {isLoading ? (
                    <div className="space-y-4 px-4">
                        {[...Array(1)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-8 w-full bg-[#FFBC2B]/20 rounded-md" />
                                <div className="space-y-1 ml-4">
                                    {[...Array(2)].map((_, j) => (
                                        <div key={j} className="space-y-2">
                                            <Skeleton className="h-6 w-full bg-gray-200 rounded-md" />
                                            <div className="space-y-1 ml-4">
                                                {[...Array(3)].map((_, k) => (
                                                    <Skeleton key={k} className="h-4 w-full bg-gray-100 rounded-md" />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2 px-0">
                        {groups.map((item, index) => (
                            <SidebarGroup key={index} className="mb-4">
                                {/* Group Header */}
                                <SidebarGroupLabel className="px-4 py-5 text-lg font-bold text-white   bg-[#FFBC2B]  mb-2 shadow-xl">
                                    {item.GroupeFilieres.Libelle}
                                </SidebarGroupLabel>

                                {/* Group Content */}
                                <SidebarGroupContent className="space-y-1">
                                    {item.GroupeFilieres.Filieres.map((Current: any, index: any) => (
                                        <div key={index} className="ml-3 border-l-2 border-[#FFBC2B]/30 pl-3">
                                            <Collapsible defaultOpen={false}>
                                                <SidebarGroupLabel asChild>
                                                    <CollapsibleTrigger className="w-full px-3 py-5 text-gray-700 bg-[#FFBC2B]/10 rounded-md flex items-center justify-between cursor-pointer transition-colors shadow-xl">
                                                        <span className="truncate text-sm font-bold">{Current.Libelle}</span>
                                                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-[#FFBC2B]" />
                                                    </CollapsibleTrigger>
                                                </SidebarGroupLabel>
                                                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                                    <SidebarMenu className="mt-1 border-l-2 border-[#FFBC2B]/30 space-y-1">
                                                        <SidebarMenuItem>
                                                            <Link href={"/dashboard/" + Current.IdFiliere + "/record"}>
                                                                <SidebarMenuButton className="w-full h-fit text-xs text-gray-700 hover:bg-[#FFBC2B]/10 hover:text-gray-900 rounded-md transition-colors cursor-pointer px-4 py-3 mt-1">
                                                                    {isArabic ? `سجل ${Current.Libelle}` : `${Current.Libelle} Record`}
                                                                </SidebarMenuButton>
                                                            </Link>
                                                        </SidebarMenuItem>
                                                        <SidebarMenuItem>
                                                            <Link href={"/dashboard/" + Current.IdFiliere + "/searchres"}>
                                                                <SidebarMenuButton className="w-full h-fit text-xs text-gray-700 hover:bg-[#FFBC2B]/10 hover:text-gray-900 rounded-md transition-colors cursor-pointer px-4 py-3">
                                                                    {isArabic ? "البحت برقم الجواب" : "Search by Reference"}
                                                                </SidebarMenuButton>
                                                            </Link>
                                                        </SidebarMenuItem>
                                                        <SidebarMenuItem>
                                                            <Link href={"/dashboard/" + Current.IdFiliere + "/statistics"}>
                                                                <SidebarMenuButton className="w-full h-fit text-xs text-gray-700 hover:bg-[#FFBC2B]/10 hover:text-gray-900 rounded-md transition-colors cursor-pointer px-4 py-3">
                                                                    {isArabic ? "إحصائيات" : "Statistics"}
                                                                </SidebarMenuButton>
                                                            </Link>
                                                        </SidebarMenuItem>
                                                        <SidebarMenuItem>
                                                            <Link href={"/dashboard/" + Current.IdFiliere + "/control"}>
                                                                <SidebarMenuButton className="w-full h-fit text-xs text-gray-700 hover:bg-[#FFBC2B]/10 hover:text-gray-900 rounded-md transition-colors cursor-pointer px-4 py-3">
                                                                    {isArabic ? "لوائح القيادة الخاصة" : "Control Lists"}
                                                                </SidebarMenuButton>
                                                            </Link>
                                                        </SidebarMenuItem>
                                                        <SidebarMenuItem>
                                                            <Link href={"/dashboard/" + Current.IdFiliere + "/exchange"}>
                                                                <SidebarMenuButton className="w-full h-fit text-xs text-gray-700 hover:bg-[#FFBC2B]/10 hover:text-gray-900 rounded-md transition-colors cursor-pointer px-4 py-3">
                                                                    {isArabic ? "سجل التداول" : "Exchange Record"}
                                                                </SidebarMenuButton>
                                                            </Link>
                                                        </SidebarMenuItem>
                                                    </SidebarMenu>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </div>
                                    ))}
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                    </div>
                )}
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="border-t border-gray-200  p-3">
                <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 py-2 text-sm font-medium rounded-md"
                    onClick={handleLogout}
                >
                    <BsBoxArrowLeft className="w-4 h-4" />
                    {isArabic ? "تسجيل الخروج" : "Logout"}
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}