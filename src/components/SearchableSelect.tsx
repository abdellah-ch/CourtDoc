"use client"
import { SearchIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function SearchableSelect({
    items,
    value,
    onValueChange,
    placeholder,
    searchPlaceholder,
    renderItem
}: {
    items: any[],
    value: string,
    onValueChange: (value: string) => void,
    placeholder: string,
    searchPlaceholder: string,
    renderItem: (item: any) => React.ReactNode
}) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            JSON.stringify(item).includes(searchTerm)
        ).slice(0, 6) // Limit to 6 items
    }, [items, searchTerm])

    return (
        <Select value={value} onValueChange={onValueChange} >
            <SelectTrigger dir='rtl' className='cursor-pointer w-full'>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <div className="relative px-2 py-2">
                    <SearchIcon className="absolute left-4 top-1/2  transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={searchPlaceholder}
                        dir='rtl'
                        className="pl-10 pr-4 py-2 w-full mb-1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()} // ADD THIS LINE
                    />
                </div>
                <div dir='rtl' className="max-h-[300px] overflow-y-auto">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <SelectItem
                                key={item.IdUtilisateur || item.IdFiliere || item.IdGroupeFiliere || item.IdSource || item.IdResponsable}
                                value={item.IdUtilisateur?.toString() || item.IdFiliere?.toString() || item.IdGroupeFiliere?.toString() || item.IdSource?.toString() || item.IdResponsable?.toString() }
                                className='cursor-pointer'
                            >
                                {renderItem(item)}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="py-2 text-center text-sm text-gray-500">
                            لا توجد نتائج
                        </div>
                    )}
                </div>
            </SelectContent>
        </Select>
    )
}