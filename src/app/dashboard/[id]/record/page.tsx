"use client"
import { useParams } from 'next/navigation';

export default function RecordPage() {
    const params = useParams();
    const id = params.id;

    return (
        <div>
            <h1>Record Page for ID: {id}</h1>
        </div>
    );
}

