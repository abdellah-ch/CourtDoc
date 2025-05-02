"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Download,
  Printer,
  Mail,
  FileText,
  MessageSquareText,
  BookMarked,
  Paperclip,
  Trash2,
  Edit,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MessageFormModal } from "@/components/MessageFormModal";
import { DeleteAlert } from "@/components/DeleteAlert";
import { toast } from "sonner";

export default function MessageDetailPage() {
  const { idMessagerie } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("message");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [IdDeleteReponse,setIdDeleteReponse] = useState<number>(0)
  const [refresh,setRefresh] = useState<boolean>(false);
  
  const handleDelete = (IdDeleteResponse: number) => {
    // Your delete logic here
    console.log("Item deleted", IdDeleteReponse);
    setIsDeleteOpen(false);
    fetch(`/api/delete/reponse/${IdDeleteReponse}`).then((res) => {
      console.log("");
      console.log(res);
      
      res.json()
    })
    .then((data)=>{
     console.log(data);
      
      toast.success("تم")
    })
    .catch((err) => {
      toast.error("error", err)
    })
  };
  useEffect(() => {
    fetch(`/api/messageries/${idMessagerie}`)
      .then(res => res.json())
      .then(data => {
        setMessage(data); console.log(data);
      });
  }, [idMessagerie,isDeleteOpen,refresh]);

  if (!message) return <div className="flex justify-center items-center h-64">Loading...</div>;

  const handleUpdateMessage = async () => {
    // Implement update logic
    setIsEditing(false);
  };

  return (
    <div className="h-full space-y-6" dir="rtl">
      <DeleteAlert
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        IdDeleteMessagerie={Number(IdDeleteReponse)}
      />
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          العودة إلى القائمة
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4" />
            {isEditing ? 'إلغاء التعديل' : 'تعديل'}
          </Button>
        </div>
      </div>

      {/* Message Header */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">رقم الإرسالية : {message.NumeroMessagerie}</CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span>
                  <span className="font-medium">تاريخ الإرسال:</span> {format(new Date(message.DateMessage), "dd/MM/yyyy")}
                </span>
                <span>
                  <span className="font-medium">تاريخ الوصول:</span> {message.DateArrivee ? format(new Date(message.DateArrivee), "dd/MM/yyyy") : "---"}
                </span>
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <Select defaultValue={message.Statut}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="منجز">منجز</SelectItem>
                    <SelectItem value="غير منجز">غير منجز</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant={message.Statut === "منجز" ? "default" : "destructive"}
                  className="text-sm"
                >
                  {message.Statut}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="text-muted-foreground">المصدر</Label>
              <p className="font-medium mt-1">{message.Sources?.NomSource || "---"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">الشعبة</Label>
              <p className="font-medium mt-1">{message.Filieres?.Libelle || "---"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">طبيعة المراسلة </Label>
              <p className="font-medium mt-1">{message.TypeMessageries?.Libelle || "---"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">رقم المضمون</Label>
              <p className="font-medium mt-1">{message.CodeBarre}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">الموضوع</Label>
              {isEditing ? (
                <Input defaultValue={message.Sujet} />
              ) : (
                <p className="font-medium mt-1">{message.Sujet || "---"}</p>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">النائب الموكل</Label>
              <p className="font-medium mt-1">
                {message.ProsecutorResponsables?.prenom} {message.ProsecutorResponsables?.nom || "---"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab System */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="message" className="gap-2 cursor-pointer">
            <Mail className="h-4 w-4" />
            النتيجة
          </TabsTrigger>
          <TabsTrigger value="responses" className="gap-2 cursor-pointer">
            <MessageSquareText className="h-4 w-4" />
            أجوبة ({message.Reponses?.filter((response: any) => response?.IsDeleted === false).length || 0})

          </TabsTrigger>
          <TabsTrigger value="etude" className="gap-2 cursor-pointer">
            <BookMarked className="h-4 w-4" />
            الدراسة
          </TabsTrigger>
          <TabsTrigger value="attachments" className="gap-2 cursor-pointer">
            <Paperclip className="h-4 w-4" />
            المرفقات ({message.PiecesJointes?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Result Content */}
        <TabsContent value="message" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>النتيجة</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  className="min-h-[150px]"
                  defaultValue={message.Resultats[0]?.Libelle || ""}
                  placeholder=" النتيجة..."
                />
              ) : (
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{message.Resultats[0]?.Libelle || "لا يوجد محتوى"}</p>
                </div>
              )}
            </CardContent>
            {isEditing && (
              <CardContent className="border-t pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>إلغاء</Button>
                <Button onClick={handleUpdateMessage}>حفظ التغييرات</Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Responses */}
        <TabsContent value="responses" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>سجل الأجوبة</CardTitle>
                <CardDescription>جميع الأجوبة المرتبطة بهذه الرسالة</CardDescription>
              </div>
              <MessageFormModal setRefresh={setRefresh} idMessagerie={idMessagerie?.toString() || ""} />
            </CardHeader>
            <CardContent>
              {message.Reponses?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المصدر</TableHead>
                      <TableHead className="text-right">المحتوى</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {message.Reponses.map((response: any) => {
                      if (response.IsDeleted == false) {
                        return (<TableRow key={response.IdReponse} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium text-right">
                            {response.Sources?.NomSource || response.AutreLibelleSource}
                          </TableCell>
                          <TableCell className="text-right">{response.Contenu}</TableCell>
                          <TableCell className="text-right">
                            {response.DateReponse && format(new Date(response.DateReponse), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell className="flex gap-2 justify-start">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Delete functionality would go here
                                setIdDeleteReponse(response.IdReponse)
                                setIsDeleteOpen(true)
                              }}
                              variant="ghost" size="sm" className="h-8 gap-1">
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                حذف
                              </span>
                            </Button>
                          </TableCell>
                        </TableRow>)

                      } else {
                        null
                      }
                    }
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                  <MessageSquareText className="h-8 w-8" />
                  <p>لا توجد ردود مسجلة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Etude */}
        <TabsContent value="etude" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>حالة الدراسة</CardTitle>
              <CardDescription>تتبع حالة دراسة هذه الرسالة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>الحالة</Label>
                    <Select defaultValue={message.Etude?.Statut || "pending"}>
                      <SelectTrigger>
                        <SelectValue placeholder="الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد الدراسة</SelectItem>
                        <SelectItem value="completed">مكتمل</SelectItem>
                        <SelectItem value="rejected">مرفوض</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>تاريخ الانتهاء</Label>
                    <Input
                      type="date"
                      defaultValue={message.Etude?.DateFin ? format(new Date(message.Etude.DateFin), "yyyy-MM-dd") : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ملاحظات الدراسة</Label>
                  <Textarea
                    className="min-h-[120px]"
                    defaultValue={message.Etude?.Notes || ""}
                    placeholder="أدخل ملاحظات الدراسة..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">إلغاء</Button>
                  <Button>حفظ التغييرات</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attachments */}
        <TabsContent value="attachments" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>الملفات المرفقة</CardTitle>
                <CardDescription>جميع الملفات المرتبطة بهذه الرسالة</CardDescription>
              </div>
              <Button variant="outline" className="gap-2">
                <Paperclip className="h-4 w-4" />
                إضافة مرفق
              </Button>
            </CardHeader>
            <CardContent>
              {message.PiecesJointes?.length > 0 ? (
                <div className="space-y-2">
                  {message.PiecesJointes.map((file: any) => (
                    <div key={file.IdPiece} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{file.NomFichier}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.Taille} - {format(new Date(file.DateAjout), "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        تحميل
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                  <Paperclip className="h-8 w-8" />
                  <p>لا توجد مرفقات</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}