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
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        const IdFilier = id?.toString();
        if (IdFilier) {
            setLoading(true); // Set loading to true when starting to fetch
            Promise.all([
                fetchFiliereLibelle(parseInt(IdFilier), setLibelle),
                fetchMessageriesByFiliere(parseInt(IdFilier), setMessageries)
            ]).finally(() => {
                setLoading(false); // Set loading to false when done
            });
        }
    }, [id, refresh]);

    useEffect(() => {
        let result = [...messageries];

        if (yearFilter !== "all") {
            result = result.filter(m =>
                // new Date(m.DateArrivee).getFullYear().toString() ? 
                // new Date(m.DateArrivee).getFullYear().toString() === yearFilter: 
                new Date(m.DateMessage).getFullYear().toString() === yearFilter
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(m => m.Statut == statusFilter);
        }

        setFilteredData(result);
    }, [messageries, yearFilter, statusFilter]);

    const yearOptions = Array.from({ length: 6 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
    });

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-[50vh]">
                <div className="text-center space-y-2">
                    <div className="animate-spin  rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffbc2b] mx-auto"></div>
                    <p className="text-lg text-[#ffbc2b] font-medium">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl text-[#003566] font-bold text-right mb-6 relative inline-block pb-2">
                    سجل {libelle}
                    <span className="absolute bottom-0 right-0 w-16 h-[2px] bg-[#ffbc2b]"></span>
                </h1>

                <div className="flex items-center gap-4">
                    {/* <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => { }}
                    >
                        <Download className="h-4 w-4" />
                        تصدير Excel
                    </Button> */}
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center mt-7 mb-0">
                {/* Year Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#003566]">السنة:</span>
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
                    <span className="text-sm font-medium text-[#003566]">الحالة:</span>
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