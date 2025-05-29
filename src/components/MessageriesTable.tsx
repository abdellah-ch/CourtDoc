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
import { Dispatch, SetStateAction, useState } from "react"
import { Input } from "@/components/ui/input"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Eye, FileText, MoreHorizontal, PlusIcon, Printer, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useParams, useRouter } from "next/navigation"
import { DeleteAlert } from "./DeleteAlert"
import { toast } from "sonner"

interface Messagerie {
  IdMessagerie: number
  NumeroOrdre: number // Changed from string to number
  NumeroMessagerie: string
  CodeBarre: string
  AutreLibelleSource: string
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
  participants_courrier: string
  underSupervision: boolean
  prosecutor:string
  Sources?: {
    NomSource: string
  }
  Filieres?: {
    Libelle: string
  }
  TypeMessageries?: {
    Libelle: string
  }
  Reponses?: any[]
  Etude?: any[]
}

interface DataTableProps<TData> {
  setRefresh: Dispatch<SetStateAction<boolean>>
  data: any[]
}

export function MessageriesTable<TData extends Messagerie>({
  setRefresh,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [IdDeleteMessagerie, setIdDeleteMessagerie] = useState<number>(0)
  const { id } = useParams();
  const router = useRouter();

  const handleDelete = (Id: number) => {
    fetch(`/api/delete/${Id}`).then(() => {
      toast.success("تم الحذف بنجاح")
      setRefresh((prev)=>!prev)
    }).catch((err) => {
      toast.error("حدث خطأ أثناء الحذف", err)
    })
  };

  const columns: ColumnDef<TData>[] = [
    {
      accessorKey: "NumeroOrdre",
      header: "الرقم الترتيبي",
      cell: ({ row }) => <div className="text-right">{row.getValue("NumeroOrdre")}</div>,
      filterFn: (row, id, value) => {
        if (value === undefined || value === "") return true;
        return Number(row.getValue(id)) === Number(value);
      }
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
      accessorKey: "NumeroMessagerie",
      header: "رقم الإرسالية",
      cell: ({ row }) => <div className="text-right font-medium">{row.getValue("NumeroMessagerie")}</div>,
      filterFn: (row, id, value) => {
        return value === undefined ||
          String(row.getValue(id)).includes(String(value));
      }
    },
    {
      accessorKey: "CodeBarre",
      header: "رقم المضمون",
      cell: ({ row }) => <div className="text-right">{row.getValue("CodeBarre") || "---"}</div>,
      filterFn: (row, id, value) => {
        return value === undefined ||
          String(row.getValue(id)).includes(String(value));
      }
    },
    {
      accessorKey: "ProcureurResponsable",
      header: "النائب المكلف ",
      cell: ({ row }) => {
        const currentEtude = row.original.Etude ? row.original.Etude[0] : null
        if (currentEtude != null) {
          let Procecuteur = `${currentEtude.ProsecutorResponsables?.nom}  ${currentEtude.ProsecutorResponsables?.prenom}`;
          return (
            <div className="text-right">
              {Procecuteur.toString()}
            </div>
          )
        } else {
          return (
            <div className="text-right">
              {(row.original.prosecutor)}
            </div>
          )
        }

      },
    },

    {
      accessorKey: "participants_courrier",
      header: "أطراف المراسلة ",
      cell: ({ row }) => <div className="text-right">{row.getValue("participants_courrier") || "---"}</div>,
      filterFn: (row, id, value) => {
        return value === undefined ||
          String(row.getValue(id)).includes(String(value));
      }
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
      cell: ({ row }) => <div className="text-right max-w-[300px] truncate">{row.getValue("Sujet")}</div>,
      filterFn: (row, id, value) => {
        if (!value) return true;
        const rowValue = String(row.getValue(id)).toLowerCase();
        return rowValue.includes(String(value).toLowerCase());
      }
    },
    {
      accessorKey: "Sources.NomSource",
      header: "المصدر",
      cell: ({ row }) => (
        <div className="text-right max-w-[200px] truncate ">
          {row.original.Sources?.NomSource || row.original.AutreLibelleSource}
        </div>
      ),
    },
    {
      accessorKey: "ReponsesCount",
      header: "أجوبة",
      cell: ({ row }) => {
        const count = row.original.Reponses?.length || 0;
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-gray-100 font-normal cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/${id}/messagerie/${row.original.IdMessagerie}`);
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{count}</span>
              <span className="text-sm text-muted-foreground">إجابات</span>
              <ChevronLeft className="h-3 w-3 text-muted-foreground" />
            </div>
          </Button>
        );
      },
    },
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
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/${id}/messagerie/${row.original.IdMessagerie}`);
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">عرض التفاصيل</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIdDeleteMessagerie(row.original.IdMessagerie)
                setIsDeleteOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">حذف</span>
            </Button>

            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:bg-gray-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  تصدير PDF
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Printer className="mr-2 h-4 w-4" />
                  طباعة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }
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

  return (
    <div dir="rtl" className="custom-scrollbar">
      <DeleteAlert
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        IdDeleteMessagerie={IdDeleteMessagerie}
      />
      <div className="flex items-center py-2 gap-4 flex-wrap justify-between">
        <div className="flex items-center py-4 gap-4">
          <Input
            placeholder="ابحث الرقم الترتيبي..."
            value={(table.getColumn("NumeroOrdre")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "" || !isNaN(Number(value))) {
                table.getColumn("NumeroOrdre")?.setFilterValue(value ? Number(value) : undefined);
              }
            }}
            className="max-w-xs"
          />
          <Input
            placeholder="ابحث برقم الإرسالية..."
            value={(table.getColumn("NumeroMessagerie")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              table.getColumn("NumeroMessagerie")?.setFilterValue(value || undefined);
            }}
            className="max-w-xs"
          />
          <Input
            placeholder="ابحث برقم المضمون..."
            value={(table.getColumn("CodeBarre")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              table.getColumn("CodeBarre")?.setFilterValue(value || undefined);
            }}
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
          <Input
            placeholder="الطرف المعني..."
            value={(table.getColumn("participants_courrier")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("participants_courrier")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
        </div>

        <Button variant="default" className="gap-2 bg-[#003566] hover:bg-[#ffbc2b] hover:text-[#003566]" onClick={(e) => { e.preventDefault(); router.push(`/dashboard/${id}/newm`) }}>
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
                <TableRow key={row.id} onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/${id}/messagerie/${row.original.IdMessagerie}`);
                }}>
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