"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/SearchableSelect";
import { fetchSources } from "@/lib/FetchMessagerieInfo";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

type FormData = {
    sourceType: string;
    source: string;
    otherSource: string;
    content: string;
    date: string;
};

interface MessageFormModalProps {

    setRefresh : (item:boolean)=>void
    idMessagerie: string;
}

export function MessageFormModal({ setRefresh, idMessagerie }: MessageFormModalProps) {
    const [allSources, setAllSources] = useState<any[]>([]);
    const [availableSources, setAvailableSources] = useState<any[]>([]);
    const [anotherSource, setAnotherSource] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const form = useForm<FormData>({
        defaultValues: {
            sourceType: "",
            source: "",
            otherSource: "",
            content: "",
            date: ""
        }
    });

    const selectedSourceType = form.watch("sourceType");

    useEffect(() => {
        fetchSources(setAllSources);
    }, []);

    useEffect(() => {
        if (selectedSourceType) {
            if (parseInt(selectedSourceType) === 5) {
                setAnotherSource(true);
                form.setValue('source', '');
            } else {
                const selectedSourceGroup = allSources.find(
                    (source) => source.IdTypeSource?.toString() === selectedSourceType
                );
                if (selectedSourceGroup) {
                    setAvailableSources(selectedSourceGroup.Sources || []);
                    setAnotherSource(false);
                    form.setValue('otherSource', '');
                }
            }
        }
    }, [selectedSourceType, allSources]);

    const onSubmit = async (data: FormData) => {
        setIsButtonDisabled(true)
        // console.log({
        //     ...data,
        //     idMessagerie,
        //     source: anotherSource ? data.otherSource : data.source
        // });
        console.log(data);


        fetch(`/api/response/${idMessagerie}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => {
            toast.success("تمت الاضافة بنجاح")
            setRefresh(true)
            setIsModalOpen(false)
        }).catch((err) => {
            toast.error(err)
        })





        // try {
        //   const payload = {
        //     ...data,
        //     idMessagerie,
        //     source: anotherSource ? data.otherSource : data.source
        //   };

        //   const response = await fetch("/api/messages", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(payload),
        //   });

        //   if (response.ok) {
        //     console.log("تم حفظ الرسالة بالمعرف:", idMessagerie);
        //     form.reset();
        //   }
        // } catch (error) {
        //   console.error("خطأ:", error);
        // }
    };

    return (
        <Dialog open={isModalOpen}>
            <DialogTrigger asChild onClick={() => setIsModalOpen(true)}>
                <Button variant="outline">
                    إضافة <Plus className="mr-2 h-4 w-4 font-bold" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader dir="rtl" className="text-center">
                    <DialogTitle className="text-center">إضافة رد على الإرسالية </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4" dir="rtl">
                        <FormField
                            control={form.control}
                            name="sourceType"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel >نوع المصدر</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}  >
                                        <FormControl className="w-full">
                                            <SelectTrigger dir="rtl">
                                                <SelectValue placeholder="اختر نوع المصدر" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent dir="rtl">
                                            {allSources?.map((source) => (
                                                <SelectItem
                                                    key={source.IdTypeSource}
                                                    value={source.IdTypeSource?.toString()}
                                                >
                                                    {source.Libelle}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {!anotherSource ? (
                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>اختر المصدر</FormLabel>
                                        <SearchableSelect
                                            items={availableSources}
                                            value={field.value || ""}
                                            onValueChange={field.onChange}
                                            placeholder="اختر المصدر"
                                            searchPlaceholder="ابحث عن المصدر..."
                                            renderItem={(item: any) => `${item.NomSource}`}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="otherSource"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>مصدر آخر</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="أدخل مصدر آخر"
                                                value={field.value || ""}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    form.setValue('source', '');
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>المحتوى</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="أدخل محتوى الرد"
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>التاريخ</FormLabel>
                                    <FormControl>
                                        <Input
                                            dir="rtl"
                                            type="date"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2 mt-8">
                        <Button disabled={isButtonDisabled} type="submit"  className="w-[49%] cursor-pointer">حفظ</Button>

                        <Button type="button" variant="outline" onClick={()=>setIsModalOpen(false)} className="w-[49%] cursor-pointer" >الغاء</Button>
                    
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}