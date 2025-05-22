import { PrismaClient } from "@/generated/prisma/client"
import { NextRequest, NextResponse } from "next/server"
import * as ExcelJS from 'exceljs'
import { format } from 'date-fns'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { tableData, columns, title = "إحصائيات المراسلات" } = data

        if (!tableData || !columns) {
            return new NextResponse("Missing required data", { status: 400 })
        }

        // Create a new workbook
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Statistics')

        // Add title
        const titleRow = worksheet.addRow([title])
        titleRow.font = { bold: true, size: 16 }
        titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
        titleRow.height = 30 // Increased row height for title
        worksheet.mergeCells(`A1:${String.fromCharCode(64 + columns.length)}1`) // Dynamic merge based on columns count

        // Add empty row for spacing
        worksheet.addRow([])

        // Add headers
        const headerRow = worksheet.addRow(columns.map((col: any) => col.header))

        // Style headers
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F81BD' } // Blue background
            }
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
            cell.alignment = {
                horizontal: 'right',
                vertical: 'middle',
                wrapText: true,
                indent: 1 // This creates some padding effect
            }
        })
        headerRow.height = 25 // Set row height for headers

        // Add data rows
        tableData.forEach((row: any) => {
            const values = columns.map((col: any) => {
                if (col.accessorKey) {
                    return row[col.accessorKey]
                } else if (col.id === 'Masdar') {
                    return row.Etude?.[0]?.Sources?.NomSource || 'N/A'
                } else if (col.header === 'تاريخ الاجراء') {
                    const lastEtude = row.Etude?.[0]
                    return lastEtude?.DateDecision
                        ? format(new Date(lastEtude.DateDecision), 'yyyy-MM-dd')
                        : 'N/A'
                } else if (col.header === 'نائب الوكيل العام المكلف بالدراسة') {
                    const prosecutor = row.Etude?.[0]?.ProsecutorResponsables
                    return prosecutor ? `${prosecutor.prenom} ${prosecutor.nom}` : 'N/A'
                } else if (col.header === 'تاريخ التسجيل') {
                    return row.AddedDate
                        ? format(new Date(row.AddedDate), 'yyyy-MM-dd')
                        : 'N/A'
                } else if (col.header === 'العمر الافتراضي من تاريخ البحث') {
                    const lastEtude = row.Etude?.[0]
                    if (!lastEtude?.DateDecision) return 'N/A'
                    const diff = Math.floor((new Date().getTime() - new Date(lastEtude.DateDecision).getTime()) / (1000 * 60 * 60 * 24))
                    return `${diff} يوم`
                } else if (col.header === 'العمر الافتراضي من تاريخ التسجيل') {
                    if (!row.AddedDate) return 'N/A'
                    const diff = Math.floor((new Date().getTime() - new Date(row.AddedDate).getTime()) / (1000 * 60 * 60 * 24))
                    return `${diff} يوم`
                }
                return ''
            })

            const dataRow = worksheet.addRow(values)

            // Style data cells
            dataRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                cell.alignment = {
                    horizontal: 'right',
                    vertical: 'middle',
                    wrapText: true,
                    indent: 1 // This creates some padding effect
                }
            })
            dataRow.height = 20 // Set row height for data rows
        })

        // Style columns - set width to create padding effect
        worksheet.columns.forEach((column: any) => {
            column.width = 25 // Set column width
        })

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer()

        // Create response
        const response = new NextResponse(buffer)
        response.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        // In your route.ts (API endpoint)
        response.headers.set('Content-Disposition', 'attachment; filename="statistics.xlsx"')
        return response

    } catch (error) {
        console.error('Error generating Excel:', error)
        return new NextResponse("Error generating Excel file", { status: 500 })
    }
}