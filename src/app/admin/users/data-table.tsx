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

import { useSelectedUsers } from "@/context/SelectedUsersContext"
import { User } from "./columns"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps< User, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})

    const { setSelectedUsers } = useSelectedUsers()

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            rowSelection
        },
        onRowSelectionChange: (updater) => {
            const updated = typeof updater === "function" ? updater(rowSelection) : updater
            setRowSelection(updated)

            // const selectedUsers: User[] = table
            //     .getSelectedRowModel()
            //     .rows
            //     .map((row) => row.original)

            // setSelectedUsers(selectedUsers)
            const selectedUsers = Object.keys(updated)
                .map((key) => data[parseInt(key)]) // `data` is your original table data
                .filter(Boolean) as User[]

            setSelectedUsers(selectedUsers)
        },
       
    })

    // table.getFilteredSelectedRowModel().rows.map((val)=>console.log(val.original));
    
    return (
        <div >
            <div className="flex items-center py-4">
                <Input
                    placeholder="بحث..."
                    value={(table.getColumn("UserName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("UserName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border p-2 custom-scrollbar">
                <Table >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-center">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        // <TableCell key={cell.id}>
                                        //     {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        // </TableCell>
                                        const columnId = cell.column.id // or accessorKey

                                        const value = cell.getValue()
                                        const isDateField = columnId === "DateEmbauche" || columnId === "DateAffectation"

                                        const displayValue = isDateField && value
                                            ? format(new Date(value as string), "dd/MM/yyyy")
                                            : flexRender(cell.column.columnDef.cell, cell.getContext())

                                        return (
                                            <TableCell key={cell.id} className="text-center" >
                                                {displayValue}
                                            </TableCell>
                                        )
                                    }
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
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
