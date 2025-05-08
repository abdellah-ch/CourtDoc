"use client";

import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function EtudeWorkflow({ message, refreshData, prosecutors }: {
  message: any;
  refreshData: Dispatch<SetStateAction<boolean>>;
  prosecutors: any[]; // Array of ProsecutorResponsables
}) {
  const [newStudyDate, setNewStudyDate] = useState<string>("");
  const [selectedProsecutor, setSelectedProsecutor] = useState<string>("");
  const [decision, setDecision] = useState<string>("");
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
        // Mark as returned - require decision
        if (!decision) {
          toast.warning("يجب إدخال قرار الدراسة");
          return;
        }

        await fetch(`/api/etude/${currentEtude.IdEtude}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            DateRetour: newStudyDate,
            decision
          })
        });
      } else {
        // Create new study record - require prosecutor selection
        if (!selectedProsecutor) {
          toast.warning("يجب اختيار النائب المكلف بالدراسة");
          return;
        }

        await fetch('/api/etude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            IdMessagerie: message.IdMessagerie,
            DateEtude: newStudyDate,
            IdProsecutor: selectedProsecutor
          })
        });
      }

      refreshData((prev: boolean) => !prev);
      setNewStudyDate("");
      setSelectedProsecutor("");
      setDecision("");
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
        <CardDescription>إدارة عملية دراسة المراسلة</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Current Status */}
        <div className="border p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">تاريخ الإرسال</Label>
                <p className="font-medium">{format(new Date(currentEtude.DateEtude), "dd/MM/yyyy")}</p>
              </div>

              {currentEtude.ProsecutorResponsables && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">النائب المكلف</Label>
                  <p className="font-medium">
                    {currentEtude.ProsecutorResponsables.prenom} {currentEtude.ProsecutorResponsables.nom}
                  </p>
                </div>
              )}

              {currentEtude.DateRetour && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">تاريخ الإرجاع</Label>
                  <p className="font-medium">{format(new Date(currentEtude.DateRetour), "dd/MM/yyyy")}</p>
                </div>
              )}

              {currentEtude.decision && (
                <div className="col-span-full space-y-1 pt-2">
                  <Label className="text-muted-foreground">قرار </Label>
                  <p className="font-medium whitespace-pre-line">{currentEtude.decision}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Study History */}
        <div className="space-y-4">
          <h3 className="font-medium">سجل الدراسات السابقة</h3>
          <div className="space-y-3">
            {message.Etude?.length > 0 ? (
              [...message.Etude]
                .sort((a: any, b: any) => new Date(b.DateEtude).getTime() - new Date(a.DateEtude).getTime())
                .map((etude) => (
                  <div key={etude.IdEtude} className="border p-4 rounded-lg space-y-3">
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

                    {etude.ProsecutorResponsables && (
                      <div className="space-y-1">
                        <Label className="text-muted-foreground text-sm">النائب المكلف</Label>
                        <p>
                          {etude.ProsecutorResponsables.prenom} {etude.ProsecutorResponsables.nom}
                        </p>
                      </div>
                    )}

                    {etude.decision && (
                      <div className="space-y-1">
                        <Label className="text-muted-foreground text-sm">قرار الدراسة</Label>
                        <p className="whitespace-pre-line">{etude.decision}</p>
                      </div>
                    )}
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
        <div className="border p-4 rounded-lg space-y-4">
          <h3 className="font-medium">
            {currentEtude?.Etude ? "تسجيل إرجاع المراسلة" : "إرسال المراسلة للدراسة"}
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studyDate">
                {currentEtude?.Etude ? "تاريخ الإرجاع *" : "تاريخ الإرسال  *"}
              </Label>
              <Input
                id="studyDate"
                type="date"
                value={newStudyDate}
                onChange={(e) => setNewStudyDate(e.target.value)}
                required
              />
            </div>

            {!currentEtude?.Etude ? (
              <div className="space-y-2">
                <Label>اختيار النائب المكلف  *</Label>
                <Select
                  value={selectedProsecutor}
                  onValueChange={setSelectedProsecutor}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="اختر النائب..." />
                  </SelectTrigger>
                  <SelectContent>
                    {prosecutors.map((prosecutor) => (
                      <SelectItem
                        key={prosecutor.IdResponsable}
                        value={prosecutor.IdResponsable.toString()}
                      >
                        {prosecutor.prenom} {prosecutor.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>قرار  *</Label>
                <Textarea
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  placeholder="أدخل قرار الدراسة..."
                  className="min-h-[100px]"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNewStudyDate("");
                  setSelectedProsecutor("");
                  setDecision("");
                }}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleStudyAction}
                disabled={(!newStudyDate || isLoading ||
                  (!currentEtude?.Etude && !selectedProsecutor) ||
                  (currentEtude?.Etude && !decision))}
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