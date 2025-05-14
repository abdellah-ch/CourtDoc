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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MessageFormModal } from "@/components/MessageFormModal";
import { DeleteAlert } from "@/components/DeleteAlert";
import { toast } from "sonner";
import { Messageries } from "@/generated/prisma";
import { EtudeWorkflow } from "@/components/EtudeWorkflow";
import { MessageLinksManager } from "@/components/MessageLinksManager";
import { fetchMessageriesByFiliere, fetchResponsables } from "@/lib/FetchMessagerieInfo";

export default function MessageDetailPage() {
  const { idMessagerie } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("message");
  const [isEditing, setIsEditing] = useState(false);
  const [isResultEditing, setIsResultEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [IdDeleteReponse, setIdDeleteReponse] = useState<number>(0)
  const [refresh, setRefresh] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<Partial<Messageries>>({});
  const [resultat, setResultat] = useState("");

  const [responsable, setResponsable] = useState([]);
  const [messageries, setMessageries] = useState<any[]>([]);
  const params = useParams();
  // console.log(params.id);

  const getCombinedActions = () => {
    // Get decisions with DateDecision (Etude)
    const decisions = message.Etude
      ?.filter((etude: any) => etude.DateDecision)
      .map((etude: any) => ({
        id: `decision-${etude.IdEtude}`,
        type: 'قرار',
        date: etude.DateDecision,
        subject: etude.decision,
        source: etude.Sources?.NomSource,
        prosecutor: etude.ProsecutorResponsables
          ? `${etude.ProsecutorResponsables.prenom} ${etude.ProsecutorResponsables.nom}`
          : null
      })) || [];

    // Get responses (Reponses)
    const responses = message.Reponses
      ?.filter((response: any) => !response.IsDeleted)
      .map((response: any) => ({
        id: `response-${response.IdReponse}`,
        type: `#${response.NumeroReponse}جواب`,
        date: response.DateReponse,
        subject: response.Contenu,
        source: response.Sources?.NomSource || response.AutreLibelleSource,
        prosecutor: null
      })) || [];

    // Combine and sort by date (decisions first when dates are equal)
    return [...decisions, ...responses].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (dateA === dateB) {
        // Decisions come before responses when dates are equal
        return a.type === 'قرار' ? -1 : 1;
      }
      return dateB - dateA; // Newest first
    });
  };

  const handleChange = (field: keyof Messageries, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    // console.log("Changes to save:", editedData);
    fetch(`/api/updateMessagerie/${idMessagerie}`, {
      method: "PUT",
      body: JSON.stringify({
        editedData
      })
    }).then((res) => {
      // console.log(res);
      setRefresh((prev) => !prev)
      toast.success("تم التحديث بنجاح")
    })
    // Implement your save logic here
  };


  const handleDelete = (IdDeleteResponse: number) => {
    // Your delete logic here
    // console.log("Item deleted", IdDeleteReponse);
    setIsDeleteOpen(false);
    fetch(`/api/delete/reponse/${IdDeleteReponse}`).then((res) => {
      res.json()
    })
      .then((data) => {
        toast.success("تم")
      })
      .catch((err) => {
        toast.error("error", err)
      })
  };

  useEffect(() => {
    fetchResponsables(setResponsable)
    if (params.id) {
      fetchMessageriesByFiliere(parseInt(params.id.toString()), setMessageries);
    }
    if (message) {
      setResultat(message.resultat)
    }
    fetch(`/api/messageries/${idMessagerie}`)
      .then(res => res.json())
      .then(data => {
        setMessage(data);
        console.log(data);

      });
  }, [idMessagerie, isDeleteOpen, refresh, isResultEditing]);

  if (!message) return (
    <div className="p-6 flex justify-center items-center h-[50vh]">
      <div className="text-center space-y-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-lg font-medium">جاري التحميل...</p>
      </div>
    </div>
  )

  const handleUpdateResultat = () => {
    // Implement update logic
    setIsResultEditing(false);
    console.log(resultat);
    fetch(`/api/updateResultat/${idMessagerie}`, {
      method: "PUT",
      body: JSON.stringify({
        resultat: resultat
      })
    }).then((res) => {
      setRefresh((prev) => !prev)
      toast.success("تم")
    })
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
        </div>
      </div>

      {/* Message Header */}
      <Card className="rounded-lg shadow-md border-0">
        <CardHeader className="border-b px-6 py-4 bg-white rounded-t-lg">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">رقم الإرسالية</Label>
                    <Input
                      defaultValue={message.NumeroMessagerie}
                      onChange={(e) => handleChange('NumeroMessagerie', e.target.value)}
                      className="bg-white text-gray-800 border-gray-300"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">رقم الإرسالية:</span>
                    <span className="text-gray-800">{message.NumeroMessagerie}</span>
                  </div>
                )}
              </CardTitle>

              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">تاريخ الإرسال:</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      // defaultValue={message.DateMessage.toISOString().split('T')[0]}
                      onChange={(e) => handleChange('DateMessage', new Date(e.target.value))}
                      className="bg-white text-gray-800 border-gray-300 w-full max-w-[180px]"
                    />
                  ) : (
                    <span className="text-gray-700">
                      {format(new Date(message.DateMessage), "dd/MM/yyyy")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">تاريخ الوصول:</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      // defaultValue={message.DateArrivee?.toISOString().split('T')[0]}
                      onChange={(e) => handleChange('DateArrivee', e.target.value ? new Date(e.target.value) : null)}
                      className="bg-white text-gray-800 border-gray-300 w-full max-w-[180px]"
                    />
                  ) : (
                    <span className="text-gray-700">
                      {message.DateArrivee ? format(new Date(message.DateArrivee), "dd/MM/yyyy") : "---"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">

              <Label className="text-sm font-medium text-gray-600 block mb-1 mr-2">الحالة</Label>
              {isEditing ? (
                <div className="min-w-[150px]">
                  <Select
                    dir="rtl"
                    defaultValue={message.Statut}
                    onValueChange={(value) => handleChange('Statut', value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="منجز" className="hover:bg-white">منجز</SelectItem>
                      <SelectItem value="غير منجز" className="hover:bg-white">غير منجز</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Badge
                  variant={message.Statut === "منجز" ? "default" : "destructive"}
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {message.Statut}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">

            {/* Message Type */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">طبيعة المراسلة</Label>
              {
                isEditing ? (<div className="w-full">
                  <Select
                    dir="rtl"
                    defaultValue={message.TypeMessageries?.Libelle}
                    onValueChange={(value) => handleChange('IdType', parseInt(value))}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800 w-full">
                      {message.TypeMessageries?.Libelle}
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="1" className="hover:bg-white">وارد</SelectItem>
                      <SelectItem value="2" className="hover:bg-white">صادر</SelectItem>
                      <SelectItem value="3" className="hover:bg-white">وارد_صادر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>) : (
                  <p className="text-gray-800 font-medium">{message.TypeMessageries?.Libelle || "---"}</p>
                )
              }
            </div>

            {/* Barcode */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">رقم المضمون</Label>
              {isEditing ? (
                <Input
                  defaultValue={message.CodeBarre}
                  onChange={(e) => handleChange('CodeBarre', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                />
              ) : (
                <p className="text-gray-800 font-medium">{message.CodeBarre}</p>
              )}
            </div>

            {/* Reference */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">المرجع</Label>
              {isEditing ? (
                <Input
                  defaultValue={message.CodeReference || ""}
                  onChange={(e) => handleChange('CodeReference', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                />
              ) : (
                <p className="text-gray-800 font-medium">{message.CodeReference || "---"}</p>
              )}
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">




            {/* Subject */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">الموضوع</Label>
              {isEditing ? (
                <Textarea
                  defaultValue={message.Sujet}
                  onChange={(e) => handleChange('Sujet', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800 min-h-[100px]"
                />
              ) : (
                <p className="text-gray-800 font-medium whitespace-pre-line">
                  {message.Sujet || "---"}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">ملاحظات</Label>
              {isEditing ? (
                <Textarea
                  defaultValue={message.Remarques || ""}
                  onChange={(e) => handleChange('Remarques', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800 min-h-[100px]"
                />
              ) : (
                <p className="text-gray-800 font-medium whitespace-pre-line">
                  {message.Remarques || "---"}
                </p>
              )}
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">


            {/* Source */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">المصدر</Label>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-gray-800 font-medium">{message.Sources?.NomSource || message.AutreLibelleSource}</p>
              </div>
            </div>

            {/* distination */}
            {
              (message.IdType === 3) ? (

                <div className="bg-white p-3 rounded-lg">
                  <Label className="block text-sm font-medium text-gray-600 mb-1">المرسل إليه</Label>

                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-800 font-medium">{message.Sources_Messageries_IdSourceDestinationToSources?.NomSource || message.AutreLibelleDestination}</p>
                  </div>

                </div>
              ) : null
            }


          </div>
        </CardContent>

        <CardFooter className="bg-white px-6 py-4 rounded-b-lg border-t flex justify-end gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSaveChanges}
                className=" text-white"

                variant="default"
              >
                حفظ التغييرات
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="default"
              className=""
            >
              تعديل
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Tab System */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
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
            القرارات ({message.Etude?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="actions" className="gap-2 cursor-pointer">
            <FileText className="h-4 w-4" />
            الإجراءات
          </TabsTrigger>
          <TabsTrigger value="attachments" className="gap-2 cursor-pointer">
            <Paperclip className="h-4 w-4" />
            المراسلات المضمومة
          </TabsTrigger>
        </TabsList>

        {/* Result Content */}
        <TabsContent value="message" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>النتيجة</CardTitle>
            </CardHeader>
            <CardContent>
              {isResultEditing ? (
                <Textarea
                  className="min-h-[150px]"
                  value={resultat || ""}
                  onChange={(e) => setResultat(e.target.value)}
                  placeholder=" النتيجة..."
                />
              ) : (
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{message.Resultat || "لا يوجد محتوى"}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-white px-6 py-4 rounded-b-lg border-t flex justify-end gap-3">
              {isResultEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsResultEditing(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleUpdateResultat}
                    className=" text-white"

                    variant="default"
                  >
                    حفظ التغييرات
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsResultEditing(true)}
                  variant="default"
                  className=""
                >
                  تعديل
                </Button>
              )}
            </CardFooter>

          </Card>
        </TabsContent>

        {/* Responses */}
        <TabsContent value="responses" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>إضافة الأجوبة</CardTitle>
              </div>
              <MessageFormModal setRefresh={setRefresh} idMessagerie={idMessagerie?.toString() || ""} />
            </CardHeader>
            <CardContent className="custom-scrollbar">

              {/* {message.Reponses?.length > 0 ? (
                <Table >
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الجواب</TableHead>
                      <TableHead className="text-right">المصدر</TableHead>
                      <TableHead className="text-right">الموضوع</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {message.Reponses.map((response: any) => {
                      if (response.IsDeleted == false) {
                        return (<TableRow key={response.IdReponse} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="text-right">
                            {response.NumeroReponse}
                          </TableCell>
                          <TableCell className="text-right">
                            {response.Sources?.NomSource || response.AutreLibelleSource}
                          </TableCell>
                          <TableCell className=" font-medium text-right max-w-[400px] truncate">{response.Contenu}</TableCell>
                          <TableCell className="text-right">
                            {response.DateReponse && format(new Date(response.DateReponse), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell className="flex gap-2 justify-start">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Delete functionality would go here
                                setIdDeleteReponse(response.IdReponse)
                                setRefresh((prev) => !prev)
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
              )} */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Etude */}
        <TabsContent value="etude" className="pt-6">
          <EtudeWorkflow message={message} refreshData={setRefresh} prosecutors={responsable} />

        </TabsContent>
        {/* actions */}
        {/* Actions Timeline */}
        <TabsContent value="actions" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل الإجراءات</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الموضوع</TableHead>
                    <TableHead className="text-right">المصدر</TableHead>
                    <TableHead className="text-right">النائب</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCombinedActions().map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        <Badge variant={action.type === 'قرار' ? 'default' : 'secondary'}>
                          {action.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {action.date && format(new Date(action.date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {action.subject}
                      </TableCell>
                      <TableCell className="text-right">
                        {action.source}
                      </TableCell>
                      <TableCell className="text-right">
                        {action.prosecutor || '---'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Attachments */}
        <TabsContent value="attachments" className="pt-6">
          <MessageLinksManager
            message={message}
            refreshData={setRefresh}
            allMessages={messageries}
            refresh={refresh}
          />
        </TabsContent>
      </Tabs>
    </div >
  );
}