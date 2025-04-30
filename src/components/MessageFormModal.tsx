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
import { useForm } from "react-hook-form";

type FormData = {
    source: string;
    content: string;
    date: string;
};

interface MessageFormModalProps {
    idMessagerie: string;
}

export function MessageFormModal({ idMessagerie }: MessageFormModalProps) {
    const { register, handleSubmit, reset } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        // try {
        //   const payload = {
        //     ...data,
        //     idMessagerie,
        //   };

        //   const response = await fetch("/api/messages", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(payload),
        //   });

        //   if (response.ok) {
        //     console.log("تم حفظ الرسالة بالمعرف:", idMessagerie);
        //     reset();
        //   }
        // } catch (error) {
        //   console.error("خطأ:", error);
        // }
    };

    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button variant="outline">
                   إضافة <Plus className="mr-2 h-4 w-4 font-bold" />  
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader dir="rtl">
                    <DialogTitle>إضافة رد على الإرسالية {idMessagerie}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4" dir="rtl">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="source" className="text-right">
                            المصدر
                        </Label>
                        <Input
                            id="source"
                            {...register("source")}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="content" className="text-right">
                            المحتوى
                        </Label>
                        <Input
                            id="content"
                            {...register("content")}
                            className="col-span-3"
                        />
                    </div>
                    <Button type="submit">حفض</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}