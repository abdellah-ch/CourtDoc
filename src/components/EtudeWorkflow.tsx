"use client";

import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';

export function EtudeWorkflow({ message, refreshData }: { 
  message: any;
  refreshData:  Dispatch<SetStateAction<boolean>>;
}) {
  const [newStudyDate, setNewStudyDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEtude, setCurrentEtude] = useState<any>(null);

  useEffect(() => {
    // Find current active study (where Etude = true) or most recent
    const activeEtude = message.Etude?.find((e: any) => e.Etude) || 
                      (message.Etude?.length > 0 ? message.Etude[message.Etude.length - 1] : null);
    setCurrentEtude(activeEtude);
  }, [message.Etude]);

  const handleStudyAction = async () => {
    if (!newStudyDate) return;
    
    setIsLoading(true);
    try {
      if (currentEtude?.Etude) {
        // Mark as returned
        await fetch(`/api/etude/${currentEtude.IdEtude}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            DateRetour: newStudyDate,
            Etude: false
          })
        });
      } else {
        // Create new study record
        await fetch('/api/etude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            IdMessagerie: message.IdMessagerie,
            DateEtude: newStudyDate,
            Etude: true
          })
        });
      }
      
      refreshData((prev:boolean)=>!prev);
      setNewStudyDate("");
      toast.success("تم تحديث حالة الدراسة بنجاح");
    } catch (error) {
      console.error('Error:', error);
      toast.error("حدث خطأ أثناء حفظ التغييرات");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-xl">سجل الدراسة</CardTitle>
        <CardDescription>إدارة عملية دراسة المراسلة  </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Current Status */}
        <div className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">الحالة الحالية</h3>
            {currentEtude ? (
              <Badge variant={currentEtude.Etude ? "default" : "destructive"}>
                {currentEtude.Etude ? "قيد الدراسة" : "تم الإرجاع"}
              </Badge>
            ) : (
              <Badge variant="outline">لم يتم الدراسة بعد</Badge>
            )}
          </div>

          {currentEtude && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">تاريخ الإرسال</Label>
                <p>{format(new Date(currentEtude.DateEtude), "dd/MM/yyyy")}</p>
              </div>
              {currentEtude.DateRetour && (
                <div>
                  <Label className="text-muted-foreground">تاريخ الإرجاع</Label>
                  <p>{format(new Date(currentEtude.DateRetour), "dd/MM/yyyy")}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Study History */}
        <div>
          <h3 className="font-medium mb-3">سجل الدراسات السابقة</h3>
          <div className="space-y-2">
            {message.Etude?.length > 0 ? (
              [...message.Etude]
                .sort((a:any, b:any) => new Date(b.DateEtude).getTime() - new Date(a.DateEtude).getTime())
                .map((etude) => (
                  <div key={etude.IdEtude} className="border p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {format(new Date(etude.DateEtude), "dd/MM/yyyy")}
                        </span>
                        {etude.DateRetour && (
                          <>
                            <span className="text-muted-foreground">→</span>
                            <span className="font-medium">
                              {format(new Date(etude.DateRetour), "dd/MM/yyyy")}
                            </span>
                          </>
                        )}
                      </div>
                      <Badge variant={etude.Etude ? "default" : "destructive"}>
                        {etude.Etude ? "دراسة" : "إرجاع"}
                      </Badge>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                لا يوجد سجل دراسات سابقة
              </p>
            )}
          </div>
        </div>

        {/* Action Form */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-4">
            {currentEtude?.Etude ? "تسجيل إرجاع المراسلة" : "إرسال المراسلة للدراسة"}
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="studyDate">
                {currentEtude?.Etude ? "تاريخ الإرجاع *" : "تاريخ الإرسال للدراسة *"}
              </Label>
              <Input
                id="studyDate"
                type="date"
                value={newStudyDate}
                onChange={(e) => setNewStudyDate(e.target.value)}
                className="mt-3"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setNewStudyDate("")}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleStudyAction}
                disabled={!newStudyDate || isLoading}
              >
                {isLoading ? "جاري الحفظ..." : 
                 currentEtude?.Etude ? "تسجيل الإرجاع" : "إرسال للدراسة"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}