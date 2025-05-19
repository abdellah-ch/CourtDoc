"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
// import { sources } from "next/dist/compiled/webpack/webpack";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  CodeReference: z.string().optional(),
  NumeroMessagerie: z.string().optional(),
  CodeBarre: z.string().optional(),
  dateMessage: z.date({ required_error: "حقل مطلوب" }),
  dateArrivee: z.date().optional(),
  sujet: z.string().min(1, "حقل مطلوب"),
  remarques: z.string().optional(),
  statut: z.string().min(1, "حقل مطلوب"),
  idType: z.string().min(1, "حقل مطلوب"),
  IdTypeSource: z.string().min(1, "حقل مطلوب"),
  idProsecutor: z.string().optional(),
  idCode: z.string().min(1, "حقل مطلوب"),
  idSource: z.string().min(1, "حقل مطلوب"),
  idSourceDestination: z.string().optional(),
  AutreLibelleSource: z.string().min(0, "حفل مطلوب"),
  AutreLibelleDestination: z.string().optional(),
  IdTypeDestination: z.string().optional(),
  underSupervision: z.boolean().default(false).optional(),
  participants_courrier: z.string().optional(), // or add any specific validation you need


  // document: z.instanceof(File).optional(),
});

export default function AddMessagerieForm() {

  const { id } = useParams(); // Gets [id] from the URL
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CodeReference: "",
      NumeroMessagerie: "",
      CodeBarre: "",
      dateMessage: undefined,
      dateArrivee: undefined,
      sujet: "",
      remarques: "",
      statut: "",
      idType: "",
      IdTypeSource: "",
      IdTypeDestination: "",
      idCode: "",
      idSource: "",
      AutreLibelleSource: "",
      participants_courrier: "",
      underSupervision: false,
    },
  });


  const selectedIdTypeSource = form.watch("IdTypeSource");
  const selectedIdTypeDestination = form.watch("IdTypeDestination");
  const selectedIdTypeMessagerie = form.watch("idType")
  const [selectedSources, setSelectedSources] = useState<string>("")
  const [messageTypes, setMessageTypes] = useState<any[]>([])
  const [filiereLibelle, setFiliereLibelle] = useState<string>("")
  const [allSources, setAllSources] = useState<any>()
  const [Availablesources, setAvailableSources] = useState<any[]>([]);

  const [AvailableDestinations, setAvailableDestinations] = useState<any[]>([]);
  const [anotherSource, setAnotherSource] = useState<boolean>(false)
  const [anotherDestination, setAnotherDestination] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  // const [responsable, setResponsables] = useState<any>()
  const [codeFilieres, setCodeFilieres] = useState<any[]>()
  useEffect(() => {
    fetchMessageTypes(setMessageTypes)
    const IdFiliere = id?.toString()
    if (IdFiliere) {
      fetchFiliereLibelle(parseInt(IdFiliere), setFiliereLibelle)
      fetchCodeFilieres(parseInt(IdFiliere), setCodeFilieres)
    }
    fetchSources(setAllSources)
    // fetchResponsables(setResponsables)
    if (selectedIdTypeSource) {
      // console.log("Selected IdTypeSource:", selectedIdTypeSource);
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

    if (selectedIdTypeDestination) {
      console.log(selectedIdTypeDestination)
      // console.log("Selected IdTypeSource:", selectedIdTypeSource);
      if (parseInt(selectedIdTypeDestination) === 5) {
        setAnotherDestination(true)
      } else {
        allSources.forEach((element: any) => {
          if (element.IdTypeSource == selectedIdTypeDestination) {
            setAvailableDestinations(element.Sources)
            setAnotherDestination(false)
          }
        });
      }

    }

  }, [selectedIdTypeSource, selectedSources, selectedIdTypeDestination])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsDisabled(true)
    // Prepare the data in the correct format
    const messagerieData = {
      ...values,
      dateMessage: format(values.dateMessage, "yyyy-MM-dd"),
      dateArrivee: values.dateArrivee ? format(values.dateArrivee, "yyyy-MM-dd") : null,
    };

    // console.log("Form submitted with values:", messagerieData);

    try {
      // Call your createMessagerie function
      const response = await createMessagerie(messagerieData);

      // Handle success
      toast.success("تم حفظ الإرسالية بنجاح");

      // Optional: reset form or redirect
      // form.reset();
      // router.push('/messageries');

      // console.log("Messagerie created:", response);
      // router.push(`/dashboard/${id}/record`)
      setIsDisabled(false)
    } catch (error) {
      // console.error("Error creating messagerie:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء حفظ الإرسالية"
      );
      setIsDisabled(false)
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
            {
              (Number(selectedIdTypeMessagerie) === 1 || Number(selectedIdTypeMessagerie) === 3) ? (
                <FormField
                  control={form.control}
                  name="NumeroMessagerie"
                  render={({ field }) => (
                    <FormItem className="text-right">
                      <FormLabel>رقم الإرسالية</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder=" أدخل رقم الإرسالية " />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null
            }

            <FormField
              control={form.control}
              name="CodeReference"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>المرجع  (اختياري) </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder=" أدخل رقم المرجع " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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


            <FormField
              control={form.control}
              name="CodeBarre"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel> رقم المضمون  (اختياري) </FormLabel>
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
            {Number(selectedIdTypeMessagerie) != 2 && (
              <FormField
                control={form.control}
                name="dateArrivee"
                render={({ field }) => (
                  <FormItem className="flex flex-col text-right">
                    <FormLabel>تاريخ الوصول </FormLabel>
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
            )}


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
              name="IdTypeSource"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>{Number(selectedIdTypeMessagerie) === 2 ? "نوع المرسل إليه" : "نوع المرسل"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger dir="rtl" className="w-full cursor-pointer">
                        <SelectValue placeholder={Number(selectedIdTypeMessagerie) === 2 ? "نوع المرسل إليه" : "نوع المرسل"} />
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



            {
              !anotherSource ? (
                <FormField
                  control={form.control}
                  name="idSource"
                  render={({ field }) => (
                    <FormItem className="text-right">
                      <FormLabel>{Number(selectedIdTypeMessagerie) === 2 ? " المرسل إليه" : " المرسل"}  </FormLabel>
                      <SearchableSelect
                        items={Availablesources}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder={Number(selectedIdTypeMessagerie) === 2 ? " المرسل إليه" : " المرسل"}
                        searchPlaceholder={Number(selectedIdTypeMessagerie) === 2 ? " المرسل إليه" : " المرسل"}
                        renderItem={(eleme: any) => `${eleme.NomSource}`}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (<FormField
                control={form.control}
                name="AutreLibelleSource"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel>  أخر</FormLabel>
                    <FormControl>
                      <Input {...field}
                        placeholder="  مصدر"
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e);
                          // Clear the other field when typing here
                          form.setValue('idSource', '');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />)
            }

            {
              Number(selectedIdTypeMessagerie) === 3 ? (
                <>
                  <FormField
                    control={form.control}
                    name="IdTypeDestination"
                    render={({ field }) => (
                      <FormItem className="text-right">
                        <FormLabel>نوع المرسل إليه</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger dir="rtl" className="w-full cursor-pointer">
                              <SelectValue placeholder=" نوع المرسل إليه" />
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



                  {
                    !anotherDestination ? (
                      <FormField
                        control={form.control}
                        name="idSourceDestination"
                        render={({ field }) => (
                          <FormItem className="text-right">
                            <FormLabel>اختر المرسل إليه </FormLabel>
                            <SearchableSelect
                              items={AvailableDestinations}
                              value={field.value || ""}
                              onValueChange={field.onChange}
                              placeholder="اختر المرسل إليه"
                              searchPlaceholder="ابحث عن المرسل إليه..."
                              renderItem={(eleme: any) => `${eleme.NomSource}`}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (<FormField
                      control={form.control}
                      name="AutreLibelleDestination"
                      render={({ field }) => (
                        <FormItem className="text-right">
                          <FormLabel> المرسل إليه</FormLabel>
                          <FormControl>
                            <Input {...field}
                              placeholder="  المرسل إليه"
                              value={field.value || ""}
                              onChange={(e) => {
                                field.onChange(e);
                                // Clear the other field when typing here
                                form.setValue('idSourceDestination', '');
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />)
                  }

                </>
              ) : null
            }


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
              name="underSupervision"
              render={({ field }) => (
                <FormItem className="text-right" dir="rtl">
                  <FormLabel className="cursor-pointer font-medium text-gray-700">
                    الإشراف
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className=" border-2 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <FormDescription className="text-right text-xs text-muted-foreground">
                        (مراسلة تحت الإشراف)
                      </FormDescription>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="participants_courrier"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>أطراف المراسلة</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="أدخل أطراف المراسلة"
                      value={field.value || ""}
                    />
                  </FormControl>
                  
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
            <Button type="submit" disabled={isDisabled} onClick={() => console.log(form.getValues())}>حفظ الإرسالية</Button>
          </div>
        </form>
      </Form>
    </div >
  );
}