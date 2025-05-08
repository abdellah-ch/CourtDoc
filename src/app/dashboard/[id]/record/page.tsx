"use client";

import { MessageriesTable } from "@/components/MessageriesTable";
import { fetchFiliereLibelle, fetchMessageriesByFiliere } from "@/lib/FetchMessagerieInfo";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function FiliereArchivePage({ params }: any) {
    const { id } = useParams();
    const [libelle, setLibelle] = useState<string>("");
    const [messageries, setMessageries] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
        const IdFilier = id?.toString();
        if (IdFilier) {
            fetchFiliereLibelle(parseInt(IdFilier), setLibelle);
            fetchMessageriesByFiliere(parseInt(IdFilier), setMessageries);
        }
    }, [id, refresh]);

    useEffect(() => {
        let result = [...messageries];

        // Apply year filter
        if (yearFilter !== "all") {
            result = result.filter(m =>
                new Date(m.DateArrivee).getFullYear().toString() === yearFilter
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter(m => m.Statut == statusFilter);
        }

        setFilteredData(result);

    }, [messageries, yearFilter, statusFilter]);

    // const handleExportExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(filteredData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Messages");
    //     XLSX.writeFile(workbook, `messages_${libelle}_${yearFilter}.xlsx`);
    // };

    // Generate year options (current year and 5 previous years)
    const yearOptions = Array.from({ length: 6 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
    });

    // console.log("messageries", messageries);

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-right">
                    سجل {libelle}
                </h1>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => { }}
                    >
                        <Download className="h-4 w-4" />
                        تصدير Excel
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center mt-7 mb-0">
                {/* Year Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">السنة:</span>
                    <Select
                        dir="rtl"
                        value={yearFilter}
                        onValueChange={setYearFilter}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="السنة" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">الكل</SelectItem>
                            {yearOptions.map(year => (
                                <SelectItem key={year.value} value={year.value}>
                                    {year.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">الحالة:</span>
                    <Select
                        dir="rtl"
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="منجز">منجز</SelectItem>
                            <SelectItem value="غير منجز">غير منجز</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <MessageriesTable data={filteredData} setRefresh={setRefresh} />
        </div>
    );
}