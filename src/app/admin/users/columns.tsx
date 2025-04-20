"use client"

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Role = {
    IdRole: number;
    Libelle: string;
};

export type Cadre = {
    IdCadre: number;
    Libelle: string;
};

export type UserFonctionne = {
    IdUserFonctionne: number;
    Libelle: string;
};

export type User = {
    IdUtilisateur: number;
    CodeUtilisateur: string;
    MotDePasse: string;
    Nom: string;
    Prenom: string;
    Tel: string | null;
    Email: string | null;
    DateEmbauche: string; // ISO date string
    DateAffectation: string; // ISO date string
    IdRole: number;
    IsDeleted: boolean;
    IdCadre: number;
    IdUserFonctionne: number;
    UserName: string | null;
    Roles: Role;
    Cadre: Cadre;
    UserFonctionne: UserFonctionne;
}

export type Utilisateurs = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}



export const columns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "UserName",
        header: "اسم المستخدم",
    },
    {
        accessorKey: "Nom",
        header: "الاسم العائلي",
    },
    {
        accessorKey: "Prenom",
        header: "الاسم الشخصي",
    },
    {
        accessorKey: "Tel",
        header: "الهاتف",
    },
    {
        accessorKey: "Email",
        header: "البريد الإلكتروني",
    },

    {
        accessorKey: "Cadre.Libelle",
        header: "التصنيف",
    },
    {
        accessorKey: "UserFonctionne.Libelle",
        header: "الإطار",
    },
    {
        accessorKey: "DateEmbauche",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    تاريخ التوظيف
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    // {
    //     accessorKey: "DateEmbauche",
    //     header: "تاريخ التوظيف",
    // },
    {
        accessorKey: "DateAffectation",
        header: "تاريخ الإلتحاق",
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const user = row.original

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() => navigator.clipboard.writeText(user.CodeUtilisateur)}
    //                     >
    //                         Copy payment ID
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem>View customer</DropdownMenuItem>
    //                     <DropdownMenuItem>View payment details</DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     },
    // },
]
