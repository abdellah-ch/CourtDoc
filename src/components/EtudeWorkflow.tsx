"use client";

import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EtudeWorkflow({ message, refreshData, prosecutors }: {
  message: any;
  refreshData: Dispatch<SetStateAction<boolean>>;
  prosecutors: any[];
}) {
  const [newStudyDate, setNewStudyDate] = useState<string>("");
  const [selectedProsecutor, setSelectedProsecutor] = useState<string>("");
  const [decision, setDecision] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEtude, setCurrentEtude] = useState<any>(null);
  const [dateDecision, setDateDecision] = useState<string>("");
  const [sourceTypes, setSourceTypes] = useState<any[]>([]);
  const [selectedSourceType, setSelectedSourceType] = useState<string>("");
  const [sources, setSources] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("");

  // Fetch source types on component mount
  useEffect(() => {
    const fetchSourceTypes = async () => {
      try {
        const response = await fetch('/api/source-types');
        if (!response.ok) throw new Error('Failed to fetch source types');
        const data = await response.json();
        setSourceTypes(data);
      } catch (error) {
        console.error('Error fetching source types:', error);
        toast.error('حدث خطأ أثناء جلب أنواع المصادر');
      }
    };

    fetchSourceTypes();
  }, []);

  // Fetch sources when source type is selected
  useEffect(() => {
    const fetchSourcesByType = async () => {
      if (!selectedSourceType) {
        setSources([]);
        return;
      }

      try {
        const response = await fetch(`/api/sources?typeId=${selectedSourceType}`);
        if (!response.ok) throw new Error('Failed to fetch sources');
        const data = await response.json();
        setSources(data);
      } catch (error) {
        console.error('Error fetching sources:', error);
        toast.error('حدث خطأ أثناء جلب المصادر');
      }
    };

    fetchSourcesByType();
  }, [selectedSourceType]);

  useEffect(() => {
    const activeEtude = message.Etude?.find((e: any) => e.Etude) ||
      (message.Etude?.length > 0 ? message.Etude[message.Etude.length - 1] : null);
    setCurrentEtude(activeEtude);
  }, [message.Etude]);

  const handleStudyAction = async () => {
    if (!newStudyDate) return;

    setIsLoading(true);
    try {
      if (currentEtude?.Etude) {
        if (!decision) {
          toast.warning("يجب إدخال قرار الدراسة");
          return;
        }

        await fetch(`/api/etude/${currentEtude.IdEtude}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            DateDecision: dateDecision,
            DateRetour: newStudyDate,
            decision,
            IdSource: selectedSource || null
          })
        });
      } else {
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
      setSelectedSourceType("");
      setSelectedSource("");
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
        <CardTitle className="text-xl">القرارات</CardTitle>
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
              {currentEtude.DateDecision && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">تاريخ القرار</Label>
                  <p className="font-medium">{format(new Date(currentEtude.DateDecision), "dd/MM/yyyy")}</p>
                </div>
              )}
              {currentEtude.Sources && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">المصدر</Label>
                  <p className="font-medium">
                    {currentEtude.Sources.NomSource} ({currentEtude.Sources.TypeSource?.Libelle})
                  </p>
                </div>
              )}
              {currentEtude.decision && (
                <div className="space-y-1 pt-2">
                  <Label className="text-muted-foreground">القرار</Label>
                  <p className="font-medium whitespace-pre-line">{currentEtude.decision}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Form */}
        <div className="border p-4 rounded-lg space-y-4">
          <h3 className="font-medium">
            {currentEtude?.Etude ? "تسجيل إرجاع المراسلة" : "إرسال المراسلة للدراسة"}
          </h3>
          <div>
            <div className={currentEtude?.Etude ? "flex gap-11 w-fit space-y-4" : "flex gap-11 w-full space-y-4"}>
              <div className={currentEtude?.Etude ? "space-y-2 w-fit mb-6" : "space-y-2 w-full mb-6"}>
                <Label htmlFor="studyDate">
                  {currentEtude?.Etude ? "تاريخ الإرجاع *" : "تاريخ الإرسال *"}
                </Label>
                <Input
                  id="studyDate"
                  type="date"
                  className={currentEtude?.Etude ? 'w-fit' : 'w-[20%]'}
                  value={newStudyDate}
                  onChange={(e) => setNewStudyDate(e.target.value)}
                  required
                />
              </div>
              {currentEtude?.Etude && (
                <>

                  <div className="space-y-2 w-fit">
                    <Label htmlFor="DecisionDate">
                      تاريخ القرار
                    </Label>
                    <Input
                      id="DecisionDate"
                      type="date"
                      value={dateDecision}
                      onChange={(e) => setDateDecision(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 w-fit">
                    <Label>اختيار نوع المصدر</Label>
                    <Select
                      value={selectedSourceType}
                      onValueChange={(value) => {
                        setSelectedSourceType(value);
                        setSelectedSource(""); // Reset source when type changes
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر نوع المصدر..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceTypes.map((type) => (
                          <SelectItem
                            key={type.IdTypeSource}
                            value={type.IdTypeSource.toString()}
                          >
                            {type.Libelle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSourceType && (
                    <div className="space-y-2 w-fit">
                      <Label>اختيار المصدر</Label>
                      <SearchableSelect
                        items={sources}
                        value={selectedSource}
                        onValueChange={setSelectedSource}
                        placeholder="اختر مصدر "
                        searchPlaceholder="ابحث عن مصدر..."
                        renderItem={(source: any) => (
                          <div>
                            <span>{source.NomSource}</span>
                          </div>
                        )}
                      />
                    </div>
                  )}



                </>
              )}
            </div>
            {
              currentEtude?.Etude && (
                <div className="space-y-2">
                  <Label>قرار *</Label>
                  <Textarea
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    placeholder="أدخل قرار الدراسة..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
              )
            }

            {!currentEtude?.Etude ? (
              <div className="space-y-2 w-full">
                <Label>اختيار النائب المكلف *</Label>
                <Select
                  value={selectedProsecutor}
                  onValueChange={setSelectedProsecutor}
                >
                  <SelectTrigger className='w-[20%]'>
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
            ) : null}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNewStudyDate("");
                  setSelectedProsecutor("");
                  setDecision("");
                  setSelectedSourceType("");
                  setSelectedSource("");
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