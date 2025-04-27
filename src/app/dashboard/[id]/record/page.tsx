"use client";

import { MessageriesTable } from "@/components/MessageriesTable";
import { fetchFiliereLibelle, fetchMessageriesByFiliere } from "@/lib/FetchMessagerieInfo";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
;

export default function FiliereArchivePage({ params }: any) {
    const { id } = useParams();
    const [libelle, setLibelle] = useState<string>("")

    const [messageries, setMessageries] = useState<any[]>([])

    useEffect(() => {
        const IdFilier = id?.toString()
        if (IdFilier) {
            fetchFiliereLibelle(parseInt(IdFilier), setLibelle)
            fetchMessageriesByFiliere(parseInt(IdFilier), setMessageries)
        }
    },[])
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-right">
                سجل {libelle}
            </h1>

            <MessageriesTable data={messageries} />
        </div>
    );
}
