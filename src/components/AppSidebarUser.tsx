// "use client";
// import { useLanguage } from "@/context/LanguageContext";
// import Link from "next/link";
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarGroup,
//     SidebarGroupLabel,
//     SidebarGroupContent,
//     SidebarMenu,
//     SidebarMenuItem,
//     SidebarMenuButton,
//     SidebarHeader,
//     SidebarSeparator,
//     SidebarFooter,
// } from "@/components/ui/sidebar";
// import { BsGearFill, BsPeopleFill, BsBoxArrowLeft, BsShieldLock } from "react-icons/bs";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useEffect, useState } from "react";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
// import { ChevronDown } from "lucide-react";
// import { preconnect } from "react-dom";

// export function AppSidebarUser() {
//     const { language } = useLanguage();
//     const isArabic = language === "ar";

//     const [IdUtilisateur, setIdUtilisateur] = useState("")

//     const [username, setUsername] = useState("")

//     const [groups, setGroups] = useState<any[]>([])

//     const fetchUserRelatedGroupesFilieres = async (IdUtilisateur: string) => {
//         const res = await fetch("/api/getUserGroupesFilieres", {
//             method: "POST",
//             body: JSON.stringify({ IdUtilisateur })
//         })

//         const data = await res.json()

//         console.log("data", data);

//         const arr = data.UtilisateurGroupeFilieres

//         arr.forEach((element: any) => {
//             setGroups(arr)
//         });



//     }
//     useEffect(() => {
//         const username = localStorage.getItem('username') || '';
//         setUsername(username);
//         const IdUtilisateur = localStorage.getItem("userId") || '';
//         setIdUtilisateur(IdUtilisateur)
//         if (IdUtilisateur != "") {
//             fetchUserRelatedGroupesFilieres(IdUtilisateur)
//         }

//         console.log(groups);
//     }, [])


//     const handleLogout = async () => {
//         // Add your logout logic here
//         try {
//             const response = await fetch('/api/logout', { // Adjust the URL to your API route
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 console.log('Logout successful');
//                 localStorage.clear();

//                 // Redirect to login page or handle redirection as needed
//                 window.location.reload()
//             } else {
//                 console.error('Logout failed');
//             }
//         } catch (error) {
//             console.error('Error during logout:', error);
//         }
//         console.log("User logged out");
//     };

//     return (
//         <Sidebar className="w-full text-gray-800 border-r relative h-screen flex flex-col">
//             <SidebarContent className="flex-1 overflow-y-auto">
//                 <SidebarHeader className="px-4 py-6">
//                     <div className="flex items-center space-x-3">
//                         <Avatar className="border-2 border-primary h-fit">
//                             <AvatarImage src="/images/user.jpg" className="w-fit" />
//                             {/* <AvatarFallback>AD</AvatarFallback> */}
//                         </Avatar>
//                         <div className="flex flex-col">
//                             <span className="font-bold">{isArabic ? "لوحة التحكم" : "Administration"}</span>
//                             <span className="text-sm text-gray-500">{username}</span>
//                         </div>
//                     </div>
//                 </SidebarHeader>

//                 <SidebarSeparator className="my-1" />


//                 {
//                     groups.map((item, index) => (

//                         <SidebarGroup key={index}>
//                             <SidebarGroupLabel className="px-4 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
//                                 {item.GroupeFilieres.Libelle}
//                             </SidebarGroupLabel>

//                             <SidebarGroupContent>
//                                 {/* {GetAllFilieresInThisGroupe} */}
//                                 {
//                                     item.GroupeFilieres.Filieres.map((Current: any, index: any) => (
//                                         <div>

//                                             <Collapsible key={index} dir="rtl" defaultOpen={false}>
//                                                 <SidebarGroupLabel asChild>
//                                                     <CollapsibleTrigger className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center justify-between cursor-pointer">
//                                                         <div className="flex items-center">
//                                                             <span>{Current.Libelle}</span>
//                                                         </div>
//                                                         <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
//                                                     </CollapsibleTrigger>
//                                                 </SidebarGroupLabel>
//                                                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
//                                                              <SidebarMenu className="space-y-1 pl-4">

//                                                                     <SidebarMenuItem key={index} >
//                                                                          <Link href="#">
//                                                                            <SidebarMenuButton className="w-full px-4 py-4 text-right text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200">
//                                                                                 سجل {Current.Libelle}  
//                                                                             </SidebarMenuButton>
//                                                                         </Link>
//                                                                     </SidebarMenuItem>

//                                                            </SidebarMenu>
//                                                        </CollapsibleContent>
//                                             </Collapsible>
//                                         </div>
//                                     ))
//                                 }
//                             </SidebarGroupContent>

//                         </SidebarGroup>
//                     ))
//                 }


//             </SidebarContent>

//             {/* Footer with logout button */}
//             <SidebarFooter className=" border-t w-full">
//                 <Button
//                     variant="ghost"
//                     className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
//                     onClick={handleLogout}
//                 >
//                     <BsBoxArrowLeft className="w-5 h-5 " />
//                     تسجيل الخروج
//                 </Button>
//             </SidebarFooter>
//         </Sidebar>
//     );
// }


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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown } from "lucide-react";

export function AppSidebarUser() {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    const [IdUtilisateur, setIdUtilisateur] = useState("");
    const [username, setUsername] = useState("");
    const [groups, setGroups] = useState<any[]>([]);

    const fetchUserRelatedGroupesFilieres = async (IdUtilisateur: string) => {
        const res = await fetch("/api/getUserGroupesFilieres", {
            method: "POST",
            body: JSON.stringify({ IdUtilisateur })
        });

        const data = await res.json();
        setGroups(data.UtilisateurGroupeFilieres);
    };

    useEffect(() => {
        const username = localStorage.getItem('username') || '';
        setUsername(username);
        const IdUtilisateur = localStorage.getItem("userId") || '';
        setIdUtilisateur(IdUtilisateur);
        if (IdUtilisateur != "") {
            fetchUserRelatedGroupesFilieres(IdUtilisateur);
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
        <Sidebar dir="rtl" className="w-full relative bg-white text-gray-800 border-r border-gray-200 h-screen flex flex-col">
            {/* Header Section */}
            <SidebarHeader className="px-5 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-blue-500 h-12 w-12">
                        <AvatarImage src="/images/user.png" className="object-cover" />
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{isArabic ? "لوحة التحكم" : "Dashboard"}</span>
                        <span className="text-sm text-blue-600 font-medium">{username}</span>
                    </div>
                </div>
            </SidebarHeader>

            {/* Scrollable Content */}
            <SidebarContent className="flex-1 overflow-y-auto py-4">
                <div className="space-y-2 ">
                    {groups.map((item, index) => (
                        <SidebarGroup key={index} className="mb-4">
                            {/* Group Header */}
                            <SidebarGroupLabel className="px-3 py-2.5 text-xs font-semibold text-blue-800 uppercase tracking-wider bg-blue-50 rounded-md mb-2">
                                {item.GroupeFilieres.Libelle}
                            </SidebarGroupLabel>

                            {/* Group Content */}
                            <SidebarGroupContent className="space-y-1">
                                {item.GroupeFilieres.Filieres.map((Current: any, index: any) => (
                                    <div key={index} className="ml-2 border-l-2 border-gray-200 pl-3">
                                        <Collapsible defaultOpen={false}>
                                            <SidebarGroupLabel asChild>
                                                <CollapsibleTrigger className="w-full px-3 py-2.5   text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-between cursor-pointer transition-colors">
                                                    <span className="truncate text-xs font-bold">{Current.Libelle}</span>
                                                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-gray-700" />
                                                </CollapsibleTrigger>
                                            </SidebarGroupLabel>
                                            <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                                <SidebarMenu className="mt-1  border-l-2 border-gray-200 space-y-1">
                                                    <SidebarMenuItem >
                                                        <Link href={"/dashboard/" + Current.IdFiliere + "/record"}>
                                                            <SidebarMenuButton className="w-full h-fit   text-xs text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                                                                سجل {Current.Libelle}
                                                            </SidebarMenuButton>
                                                        </Link>
                                                    </SidebarMenuItem>
                                                    <SidebarMenuItem >
                                                        <Link href={"/dashboard/" + Current.IdFiliere + "/searchres"}>
                                                            <SidebarMenuButton className="w-full h-fit   text-xs text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                                                                البحت برقم الجواب
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
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="border-t border-gray-200 bg-gray-50 p-4">
                <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 py-2.5 text-sm font-medium"
                    onClick={handleLogout}
                >
                    <BsBoxArrowLeft className="w-4 h-4" />
                    {isArabic ? "تسجيل الخروج" : "Logout"}
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}