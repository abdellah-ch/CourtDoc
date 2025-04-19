"use client";

import { createContext, useContext, useState } from "react";

type Language = "ar" | "fr";

const LanguageContext = createContext<{
    language: Language;
    setLanguage: (lang: Language) => void;
}>({
    language: "ar",
    setLanguage: () => { },
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [language, setLanguage] = useState<Language>("ar");
    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
