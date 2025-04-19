"use client";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="p-4">
            <button
                onClick={() => setLanguage("ar")}
                className={`p-2 ${language === "ar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                العربية
            </button>
            <button
                onClick={() => setLanguage("fr")}
                className={`p-2 ml-2 ${language === "fr" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                Français
            </button>
        </div>
    );
}