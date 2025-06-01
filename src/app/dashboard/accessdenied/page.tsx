// src/app/access-denied/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const AccessDeniedPage = () => {
    const router = useRouter();

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-950"
            >
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                        <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                            صلاحية الدخول مرفوضة
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            ليس لديك الإذن اللازم للوصول إلى هذه الصفحة. يرجى التواصل مع
                            المسؤول إذا كنت تعتقد أن هذا خطأ.
                        </p>
                    </div>

                    <div className="flex w-full flex-col space-y-2">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="w-full"
                        >
                            العودة للصفحة السابقة
                        </Button>
                        <Button
                            onClick={() => router.push("/dashboard")}
                        >
                            الذهاب إلى لوحة التحكم
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AccessDeniedPage;