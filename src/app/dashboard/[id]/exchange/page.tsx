'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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
import { SearchableSelect } from "@/components/SearchableSelect"
import { format } from 'date-fns'
import { Printer } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"

export default function ProsecutorExchangeLogPage() {
    const { id } = useParams()
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [searchClicked, setSearchClicked] = useState(false)
    const [dateRange, setDateRange] = useState<any | null>(null)
    const [selectedProsecutor, setSelectedProsecutor] = useState<string>("")
    const [prosecutors, setProsecutors] = useState<any[]>([])
    const [excludedRows, setExcludedRows] = useState<Set<string>>(new Set())
    const [OrdreExchangePrintCounter, setOrdreExchangePrintCounter] = useState<string>("")
    useEffect(() => {
        const getCurrentOrdreNumberPrintExchange = async () => {
            const response = await fetch("/api/getCurrentOrdreNumberExchange");

            const data = await response.json();

            // console.log(data);

            setOrdreExchangePrintCounter(data.OrdreExchangePrintCounter)

        }
        getCurrentOrdreNumberPrintExchange()
    }, [OrdreExchangePrintCounter])

    // Fetch prosecutors list
    useEffect(() => {
        const fetchProsecutors = async () => {
            try {
                const response = await fetch('/api/getResponsableList')
                if (!response.ok) throw new Error('Failed to fetch prosecutors')
                const data = await response.json()
                setProsecutors(data)
            } catch (err) {
                console.error('Error fetching prosecutors:', err)
            }
        }
        fetchProsecutors()
    }, [])

    const handleSearch = async () => {
        if (!selectedProsecutor || !dateRange || !id) return

        setLoading(true)
        setSearchClicked(true)
        setExcludedRows(new Set()) // Reset excluded rows on new search

        try {
            const [start, end] = dateRange
            const response = await fetch(
                `/api/prosecutor-exchange-log?` +
                `idFiliere=${id}&` +
                `prosecutorId=${selectedProsecutor}&` +
                `startDate=${start.toISOString()}&endDate=${end.toISOString()}`
            )

            if (!response.ok) throw new Error('Failed to fetch data')

            const result = await response.json()
            setData(result)
        } catch (err) {
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    const toggleRowExclusion = (id: string) => {
        setExcludedRows(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const handlePrint = () => {
        fetch("/api/getCurrentOrdreNumberExchange",{
            method:"PUT"
        })
        setOrdreExchangePrintCounter("")
        const printWindow = window.open('', '', 'width=800,height=600')
        if (!printWindow) return

        const currentDate = format(new Date(), 'yyyy-MM-dd')
        const prosecutorName = prosecutors.find(p => p.IdResponsable?.toString() === selectedProsecutor)?.nom || ''

        // Filter out excluded rows
        const filteredData = data.filter(item => !excludedRows.has(item.IdMessagerie.toString()))

        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <title>سجل التداول مع السادة النواب</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .ImageHeader {display: flex;justify-content: center;align-items: center;width: 100%;}
                    img {max-width: 100%;height: auto;}
                    .title { text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: right; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    .signature-col { height: 40px; }
                    @media print {
                        body { padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>رقم سجل  التداول : ${OrdreExchangePrintCounter}</div>
                    <div>مراكش بتاريخ ${currentDate}</div>
                </div>
                <div class="ImageHeader">
                    <img src="/header.jpg" />
                </div>

                <div class="title">سجل التداول مع السادة النواب</div>
                <table>
                    <thead>
                        <tr>
                            <th>الرقم الترتيبي</th>
                            <th>موضوع المراسلة</th>
                            <th>تاريخ إحالة المراسلة للدراسة</th>
                            <th>النائب المكلف بالدراسة</th>
                            <th>التوقيع</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map(item => {
            const etude = item.Etude?.[0]
            return `
                                <tr>
                                    <td>${item.NumeroOrdre || '---'}</td>
                                    <td>${item.Sujet || '---'}</td>
                                    <td>${etude?.DateEtude ? format(new Date(etude.DateEtude), 'yyyy-MM-dd') : '---'}</td>
                                    <td>${etude?.ProsecutorResponsables ? `${etude.ProsecutorResponsables.prenom} ${etude.ProsecutorResponsables.nom}` : '---'}</td>
                                    <td class="signature-col"></td>
                                </tr>
                            `
        }).join('')}
                    </tbody>
                </table>
                <button class="no-print" onclick="window.print()">Print</button>
                <button class="no-print" onclick="window.close()">Close</button>
            </body>
            </html>
        `)

        printWindow.document.close()
        printWindow.focus()
    }

    // Table columns
    const columns: ColumnDef<any>[] = [
        {
            id: "exclude",
            header: "استثناء من الطباعة",
            cell: ({ row }) => (
                <Checkbox
                    checked={excludedRows.has(row.original.IdMessagerie.toString())}
                    onCheckedChange={() => toggleRowExclusion(row.original.IdMessagerie.toString())}
                />
            ),
        },
        {
            accessorKey: "NumeroOrdre",
            header: "الرقم الترتيبي",
            cell: ({ row }) => <div className="text-right">{row.getValue("NumeroOrdre") || '---'}</div>
        },
        {
            accessorKey: "Sujet",
            header: "موضوع المراسلة",
            cell: ({ row }) => <div className="text-right">{row.getValue("Sujet") || '---'}</div>
        },
        {
            header: "تاريخ إحالة المراسلة للدراسة",
            cell: ({ row }) => {
                const etude = row.original.Etude?.[0]
                return etude?.DateEtude
                    ? format(new Date(etude.DateEtude), 'yyyy-MM-dd')
                    : '---'
            },
        },
        {
            header: "النائب المكلف بالدراسة",
            cell: ({ row }) => {
                const prosecutor = row.original.Etude?.[0]?.ProsecutorResponsables
                return prosecutor
                    ? `${prosecutor.prenom} ${prosecutor.nom}`
                    : '---'
            },
        },
        {
            header: "التوقيع",
            cell: () => <div className="text-right"></div> // Empty cell
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
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
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">سجل التداول مع السادة النواب</h1>

            {/* Search Form */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">اختيار النائب</label>
                        <SearchableSelect
                            items={prosecutors}
                            value={selectedProsecutor}
                            onValueChange={setSelectedProsecutor}
                            placeholder="اختر النائب"
                            searchPlaceholder="ابحث عن النائب..."
                            renderItem={(prosecutor: any) => (
                                <div>
                                    <span>{prosecutor.prenom} {prosecutor.nom}</span>
                                </div>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">اختيار التاريخ</label>
                        <DatePicker.RangePicker
                            onChange={setDateRange}
                            format="YYYY-MM-DD"
                            placeholder={['تاريخ البدء', 'تاريخ الانتهاء']}
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-end">
                        <Button
                            onClick={handleSearch}
                            disabled={!selectedProsecutor || !dateRange || loading}
                            className="w-full md:w-auto"
                        >
                            {loading ? 'جاري البحث...' : 'بحث'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Results */}
            {searchClicked && (
                <div className="bg-white p-6 rounded-lg shadow">
                    {data.length > 0 ? (
                        <>
                            <div className="rounded-md border mb-4">
                                <Table dir='rtl'>
                                    <TableHeader>
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <TableHead key={header.id} className='text-right bg-gray-50'>
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.map(row => (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    {excludedRows.size} صفوف مستثناة من الطباعة
                                </div>
                                <Button onClick={handlePrint} className="flex gap-2">
                                    <Printer className="h-4 w-4" />
                                    طباعة الجدول
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">لا توجد نتائج مطابقة لبحثك</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}