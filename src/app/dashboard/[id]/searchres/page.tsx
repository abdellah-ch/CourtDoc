"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { format } from "date-fns";

interface ResponseData {
  IdReponse: number;
  DateReponse: string;
  Contenu: string;
  NumeroReponse: string;
  Messageries: {
    NumeroOrdre: number;
    Sujet: string;
    DateMessage: string;
  };
}

export default function ResponseSearchPage() {
  const params = useParams();
  const idFiliere = Number(params.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("الرجاء إدخال رقم الجواب");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/filieres/${idFiliere}/responses?numero=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        // Try to parse error message
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || "حدث خطأ أثناء البحث");
        } catch {
          throw new Error(`خطأ في الشبكة: ${response.status}`);
        }
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">البحث عن جواب</h1>

        <div className="flex gap-2 mb-8">
          <Input
            placeholder="أدخل رقم الجواب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 text-right"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "جاري البحث..." : (
              <>
                <Search className="ml-2 h-4 w-4" />
                بحث
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-1/2" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        )}

        {response && !loading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>تفاصيل الجواب</span>
                
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">رقم الجواب</Label>
                  <p className="font-medium">{response.NumeroReponse}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">تاريخ الجواب</Label>
                  <p className="font-medium">
                    {format(new Date(response.DateReponse), 'yyyy/MM/dd')}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground"> رقم الإرسالية الترتيبي</Label>
                  <p className="font-medium">{response.Messageries.NumeroOrdre}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">تاريخ الإرسالية</Label>
                  <p className="font-medium">
                    {format(new Date(response.Messageries.DateMessage), 'yyyy/MM/dd')}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">موضوع الإرسالية</Label>
                <p className="font-medium">{response.Messageries.Sujet}</p>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">الموضوع</Label>
                <div className="p-4 bg-muted/50 rounded-md text-right">
                  <p className="whitespace-pre-wrap">{response.Contenu}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}