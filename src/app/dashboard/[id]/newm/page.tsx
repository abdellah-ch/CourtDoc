"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, UploadCloud, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { createMessagerie, fetchCodeFilieres, fetchFiliereLibelle, fetchMessageTypes, fetchResponsables, fetchSources } from "@/lib/FetchMessagerieInfo";
import { useParams, useRouter } from 'next/navigation';
import { sources } from "next/dist/compiled/webpack/webpack";
import { SearchableSelect } from "@/components/SearchableSelect";

const formSchema = z.object({
  numeroMessage: z.string().min(1, "حقل مطلوب"),
  dateMessage: z.date({ required_error: "حقل مطلوب" }),
  dateArrivee: z.date({ required_error: "حقل مطلوب" }),
  sujet: z.string().min(1, "حقل مطلوب"),
  remarques: z.string().optional(),
  statut: z.string().min(1, "حقل مطلوب"),
  idType: z.string().min(1, "حقل مطلوب"),
  IdTypeSource: z.string().min(1, "حقل مطلوب"),
  idProsecutor: z.string().optional(),
  idCode: z.string().min(1, "حقل مطلوب"),
  idSource: z.string().min(1, "حقل مطلوب"),
  // document: z.instanceof(File).optional(),
});

export default function AddMessagerieForm() {

  const { id } = useParams(); // Gets [id] from the URL
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroMessage: "",
      sujet: "",
      statut: "",
    },
  });


  const selectedIdTypeSource = form.watch("IdTypeSource");

  const [selectedSources, setSelectedSources] = useState<string>("")
  const [messageTypes, setMessageTypes] = useState<any[]>([])
  const [filiereLibelle, setFiliereLibelle] = useState<string>("")
  const [allSources, setAllSources] = useState<any>()
  const [Availablesources, setAvailableSources] = useState<any[]>([]);
  const [anotherSource, setAnotherSource] = useState<boolean>(false)

  const [responsable, setResponsables] = useState<any>()
  const [codeFilieres, setCodeFilieres] = useState<any[]>()
  useEffect(() => {
    fetchMessageTypes(setMessageTypes)
    const IdFiliere = id?.toString()
    if (IdFiliere) {
      fetchFiliereLibelle(parseInt(IdFiliere), setFiliereLibelle)
      fetchCodeFilieres(parseInt(IdFiliere), setCodeFilieres)
    }
    fetchSources(setAllSources)
    fetchResponsables(setResponsables)
    if (selectedIdTypeSource) {
      console.log("Selected IdTypeSource:", selectedIdTypeSource);
      if (parseInt(selectedIdTypeSource) === 5) {

        setAnotherSource(true)
      } else {
        allSources.forEach((element: any) => {
          if (element.IdTypeSource == selectedIdTypeSource) {
            setAvailableSources(element.Sources)
            setAnotherSource(false)
          }
        });
      }

    }

  }, [selectedIdTypeSource, selectedSources])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Prepare the data in the correct format
    const messagerieData = {
      ...values,
      dateMessage: format(values.dateMessage, "yyyy-MM-dd"),
      dateArrivee: values.dateArrivee ? format(values.dateArrivee, "yyyy-MM-dd") : null,
    };

    console.log("Form submitted with values:", messagerieData);

    try {
      // Call your createMessagerie function
      const response = await createMessagerie(messagerieData);

      // Handle success
      toast.success("تم حفظ الإرسالية بنجاح");

      // Optional: reset form or redirect
      // form.reset();
      // router.push('/messageries');

      console.log("Messagerie created:", response);
      router.push(`/dashboard/${id}/record`)
    } catch (error) {
      console.error("Error creating messagerie:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء حفظ الإرسالية"
      );
    }
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-md lg:max-w-6xl md:max-w-xl m-auto">
      <h2 className="text-2xl font-bold text-right mb-6">إضافة إرسالية ({filiereLibelle})</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" method="post">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="idCode"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel> رمز الشعبة </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger dir="rtl" className="w-full cursor-pointer">
                        <SelectValue placeholder="اختر رمز الشعبة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent dir="rtl">
                      {codeFilieres?.map((code) => (
                        <SelectItem key={code.IdCode} value={code.IdCode.toString()}>
                          {code.Valeur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="codeMessagerie"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel> رمز الشعبة</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="أدخل رمز الشعبة" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="numeroMessage"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>رقم المضمون</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder=" أدخل رقم المضمون " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateMessage"
              render={({ field }) => (
                <FormItem className="flex flex-col text-right">
                  <FormLabel>تاريخ الإرسالية</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-right font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd", { locale: ar })
                          ) : (
                            <span>اختر التاريخ</span>
                          )}
                          <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={ar}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateArrivee"
              render={({ field }) => (
                <FormItem className="flex flex-col text-right">
                  <FormLabel>تاريخ الوصول (اختياري)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-right font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd", { locale: ar })
                          ) : (
                            <span>اختر التاريخ</span>
                          )}
                          <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={ar}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message Content */}
            <FormField
              control={form.control}
              name="sujet"
              render={({ field }) => (
                <FormItem className="text-right md:col-span-2">
                  <FormLabel>موضوع الإرسالية</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="أدخل موضوع الإرسالية" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarques"
              render={({ field }) => (
                <FormItem className="text-right md:col-span-2">
                  <FormLabel>ملاحظات (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="أدخل أي ملاحظات إضافية"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dropdown Selections */}
            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>الإنجاز</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger dir="rtl" className="w-full cursor-pointer">
                        <SelectValue placeholder="الإنجاز" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent dir="rtl" >
                      <SelectItem value="منجز">منجز</SelectItem>
                      <SelectItem value="غير منجز">غير منجز</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idType"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>طبيعة المراسلة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger dir="rtl" className="w-full cursor-pointer">
                        <SelectValue placeholder="اختر طبيعة الإرسالية" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent dir="rtl">
                      {messageTypes.map((type) => (
                        <SelectItem key={type.IdType} value={type.IdType.toString()}>
                          {type.Libelle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="IdTypeSource"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>نوع المصدر</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger dir="rtl" className="w-full cursor-pointer">
                        <SelectValue placeholder="اختر نوع المصدر" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent dir="rtl">
                      {allSources?.map((source: any) => (
                        <SelectItem key={source.IdTypeSource} value={source.IdTypeSource?.toString()}>
                          {source.Libelle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idSource"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>المصدر</FormLabel>
                  {!anotherSource ? (
                    <SearchableSelect
                      items={Availablesources}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="اختر المصدر"
                      searchPlaceholder="ابحث عن المصدر..."
                      renderItem={(eleme: any) => `${eleme.NomSource}`}
                    />
                  ) : (<Input className="w-full" placeholder="مصدر أخر" />)}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idProsecutor"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel> النائب المكلف (إختياري)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger dir="rtl" className="w-full cursor-pointer">
                        <SelectValue placeholder="اختر النائب المكلف" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent dir="rtl">
                      {responsable?.map((prosecutor: any) => (
                        <SelectItem key={prosecutor.IdResponsable} value={prosecutor.IdResponsable.toString()}>
                          {prosecutor.prenom} {prosecutor.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
              }}
            >
             جديد 
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                router.push(`/dashboard/${id}/record`)
              }}
            >
              إلغاء
            </Button>
            <Button type="submit" onClick={() => console.log(form.getValues())}>حفظ الإرسالية</Button>
          </div>
        </form>
      </Form>
    </div >
  );
}