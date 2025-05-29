'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format, differenceInDays } from 'date-fns'
import { Download } from 'lucide-react'

export default function MessageriesStatisticsPage() {
    const { id } = useParams()
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
    const [stats, setStats] = useState({
        over100: 0,
        under100: 0,
        total: 0
    })


    const handleExport = async () => {
        try {
            const response = await fetch('/api/export-excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tableData: data,
                    title: "إحصائيات المراسلات - لوائح القيادة الخاصة",
                    columns: [
                        { header: "الرقم الترتيبي", accessorKey: "NumeroOrdre" },
                        { header: "رقم المراسلة", accessorKey: "NumeroMessagerie" },
                        { header: "تاريخ التسجيل" },
                        { header: "نائب الوكيل العام المكلف بالدراسة" },
                        { header: "الموضوع" ,accessorKey: "Sujet" },
                        { header: "تاريخ الاجراء" },
                        { header: "الجهة المحال عليها الاجراء", id: "Masdar" },
                        { header: "العمر الافتراضي من تاريخ التسجيل" },
                        { header: "العمر الافتراضي من تاريخ البحث" },
                    ]
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to export')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'messageries-statistics.xlsx'
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            a.remove()
        } catch (error) {
            console.error('Export error:', error)
            alert('حدث خطأ أثناء تصدير البيانات')
        }
    }
    // Fetch data with date filter
    useEffect(() => {
        if (!id) return

        const fetchData = async () => {
            setLoading(true)
            try {
                let url = `/api/control?idFiliere=${id}`

                // Add date range to API call if exists
                if (dateRange) {
                    const [start, end] = dateRange
                    url += `&startDate=${start.toISOString()}&endDate=${end.toISOString()}`
                }

                const response = await fetch(url)
                const result = await response.json()
                console.log(result);

                setData(result)

                // Calculate statistics
                const today = new Date()
                const over100 = result.filter((m: any) => {
                    // const lastEtude = m.Etude?.[0]
                    // if (!lastEtude?.DateDecision) return false
                    return differenceInDays(today, new Date(m.AddedDate)) > 100
                }).length

                const under100 = result.filter((m: any) => {
                    // const lastEtude = m.Etude?.[0]
                    // if (!lastEtude?.DateDecision) return false
                    return differenceInDays(today, new Date(m.AddedDate)) <= 100
                }).length

                setStats({
                    over100,
                    under100,
                    total: result.length
                })
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, dateRange])

    // Table columns with filter functions
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "NumeroOrdre",
            header: "الرقم الترتيبي",
            cell: ({ row }) => <div className="text-right">{row.getValue("NumeroOrdre")}</div>,
            filterFn: (row, id, value) => {
                if (value === undefined || value === "") return true
                return String(row.getValue(id)).includes(String(value))
            }
        },
        {
            accessorKey: "NumeroMessagerie",
            header: "رقم المراسلة",
            cell: ({ row }) => <div className="text-right">{row.getValue("NumeroMessagerie")}</div>,
            filterFn: (row, id, value) => {
                if (value === undefined || value === "") return true
                return String(row.getValue(id)).includes(String(value))
            }
        },
        {
            header: "تاريخ التسجيل",
            cell: ({ row }) => {
                return row.original.AddedDate
                    ? format(new Date(row.original.AddedDate), 'yyyy-MM-dd')
                    : '---'
            },
        },
        {
            header: " النائب المكلف",
            cell: ({ row }) => {
                const prosecutor = row.original.Etude?.[0]?.ProsecutorResponsables
                return prosecutor ? `${prosecutor.prenom} ${prosecutor.nom}` : (row.original.prosecutor || "---")
            },
        },
        {
            accessorKey: "Sujet",
            header: "الموضوع",
            cell: ({ row }) => {
                const sujet = row.original.Sujet
                return (<div className='max-w-[300px] truncate'>  {sujet  ||  "---"}</div>) 
            },
        },
        {
            header: "تاريخ الاجراء",
            cell: ({ row }) => {
                const lastEtude = row.original.Etude?.[0]
                return lastEtude?.DateDecision
                    ? format(new Date(lastEtude.DateDecision), 'yyyy-MM-dd')
                    : '---'
            },
        },


        {
            id: "Masdar",
            header: "الجهة المحال عليها ",
            cell: ({ row }) => {
                return row.original.Etude?.[0]?.Sources?.NomSource || '---'
            },
            filterFn: (row, id, value) => {
                if (value === undefined || value === "") return true
                const sourceName = row.original.Etude?.[0]?.Sources?.NomSource || ''
                return sourceName.includes(value)
            }
        },
        {
            header: "العمر الافتراضي \n  من تاريخ التسجيل  ",
            
            cell: ({ row }) => {
                if (!row.original.AddedDate) return '---'

                const diff = differenceInDays(new Date(), new Date(row.original.AddedDate))
                return `${diff} `
            },
            meta: {
                className: "whitespace-pre-line" // This will make text break at \n
            }
        },
        {
            header: " العمر الافتراضي \n تاريخ البحث  ",
            
            cell: ({ row }) => {
                const lastEtude = row.original.Etude?.[0]
                if (!lastEtude?.DateDecision) return '---'

                const diff = differenceInDays(new Date(), new Date(lastEtude.DateDecision))
                return `${diff} `
            },
        },

    ]

    // Initialize table with filtering
    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-[50vh]">
                <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="text-lg font-medium">جاري التحميل...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">لوائح القيادة الخاصة</h1>
                <div className="flex items-center gap-4">
                    <DatePicker.RangePicker
                        onChange={(dates: any) => setDateRange(dates)}
                        format="YYYY-MM-DD"
                        placeholder={['تاريخ البدء', 'تاريخ الانتهاء']}

                    />
                    <Button onClick={handleExport} className="flex gap-2">
                        <Download className="h-4 w-4" />
                        تصدير إلى Excel
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-red-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-right">المساطر التي تجاوزت 100 يوم</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{stats.over100}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-right">المساطر التي عمرها أقل من 100 يوم</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{stats.under100}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-right">المجموع</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{stats.total}</p>
                </div>
            </div>

            {/* Search inputs */}
            <div className="flex items-center py-4 gap-4 flex-wrap">
                <Input
                    placeholder="ابحث بالرقم الترتيبي..."
                    value={(table.getColumn("NumeroOrdre")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("NumeroOrdre")?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs"
                />
                <Input
                    placeholder="ابحث برقم المراسلة..."
                    value={(table.getColumn("NumeroMessagerie")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("NumeroMessagerie")?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs"
                />
                <Input
                    placeholder="ابحث بالجهة المحال عليها..."
                    value={(table.getColumn("Masdar")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("Masdar")?.setFilterValue(event.target.value)
                    }
                    className="max-w-xs"
                />
            </div>

            <div className="rounded-md border custom-scrollbar">
                <Table dir='rtl' >
                    <TableHeader >
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} className='text-right p-2 whitespace-pre-line'>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody >
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
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