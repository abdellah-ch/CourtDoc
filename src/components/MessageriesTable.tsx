"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useParams, useRouter } from "next/navigation"

interface Messagerie {
  IdMessagerie: number
  NumeroOrdre: string
  CodeComplet: string
  CodeMessagerie: string
  DateMessage: string
  DateArrivee: string | null
  Sujet: string
  Remarques: string | null
  Statut: "منجز" | "غيرمنجز"
  IdType: number | null
  IdProsecutor: number | null
  IdCode: number
  IdSource: number | null
  IdFiliere: number | null
  Sources?: {
    NomSource: string
  }
  Filieres?: {
    Libelle: string
  }
  TypeMessageries?: {
    Libelle: string
  }
}

interface DataTableProps<TData> {
  data: any[]
}

export function MessageriesTable<TData extends Messagerie>({
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { id } = useParams(); // Gets [id] from the URL
  const columns: ColumnDef<TData>[] = [
    {
      accessorKey: "NumeroOrdre",
      header: "الرقم الترتيبي",
      cell: ({ row }) => <div className="text-right">{row.getValue("NumeroOrdre")}</div>,
    },
    {
      accessorKey: "TypeMessageries.Libelle",
      header: "طبيعة المراسلة",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.TypeMessageries?.Libelle || "---"}
        </div>
      ),
    },
    {
      accessorKey: "CodeComplet",
      header: "رقم الملف",
      cell: ({ row }) => <div className="text-right font-medium">{row.getValue("CodeComplet")}</div>,
    },
    {
      accessorKey: "CodeMessagerie",
      header: "رقم المضمون",
      cell: ({ row }) => <div className="text-right">{row.getValue("CodeMessagerie")}</div>,
    },
    {
      accessorKey: "DateMessage",
      header: "تاريخ الرسالة",
      cell: ({ row }) => (
        <div className="text-right">
          {format(new Date(row.getValue("DateMessage")), "dd/MM/yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "DateArrivee",
      header: "تاريخ الوصول",
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue("DateArrivee")
            ? format(new Date(row.getValue("DateArrivee")), "dd/MM/yyyy")
            : "---"}
        </div>
      ),
    },
    {
      accessorKey: "Sujet",
      header: "الموضوع",
      cell: ({ row }) => <div className="text-right">{row.getValue("Sujet")}</div>,
    },
    
    {
      accessorKey: "Sources.NomSource",
      header: "المصدر",
      cell: ({ row }) => (
        <div className="text-right">
          {row.original.Sources?.NomSource || "---"}
        </div>
      ),
    },

    //add Number of Responses
    // {
    //   accessorKey: "Filieres.Libelle",
    //   header: "الشعبة",
    //   cell: ({ row }) => (
    //     <div className="text-right">
    //       {row.original.Filieres?.Libelle || "---"}
    //     </div>
    //   ),
    // },
    
    {
      accessorKey: "Statut",
      header: "الحالة",
      cell: ({ row }) => (
        <Badge variant={row.getValue("Statut") === "منجز" ? "default" : "destructive"}>
          {row.getValue("Statut")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
            <DropdownMenuItem>تعديل</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const router = useRouter()
  return (
    <div dir="rtl" className="custom-scrollbar">
      <div className="flex items-center py-2 gap-4 flex-wrap justify-between">
        <div className="flex items-center py-4 gap-4">
          <Input
            placeholder="ابحث برقم الملف..."
            value={(table.getColumn("CodeComplet")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("CodeComplet")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
          <Input
            placeholder="ابحث برقم المضمون..."
            value={(table.getColumn("CodeMessagerie")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("CodeMessagerie")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
          <Input
            placeholder="ابحث بالموضوع..."
            value={(table.getColumn("Sujet")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("Sujet")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
        </div>
        
        <Button variant="default" className="gap-2" onClick={(e) => { e.preventDefault(); router.push(`/dashboard/${id}/newm`) }}>
          <PlusIcon className="h-4 w-4" />
          إضافة
        </Button>

      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-right">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  لا توجد نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          السابق
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          التالي
        </Button>
      </div>
    </div>
  )
}