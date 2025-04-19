'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useEffect } from 'react';

export default function LanguageWrapper({ lang, children }: { lang: 'ar' | 'fr'; children: React.ReactNode }) {
    const { language } = useLanguage();
    useEffect(() => {
        document.body.setAttribute('lang', lang);
    }, [lang]);
    return (
        <div
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            className={language === 'ar' ? 'text-right' : 'text-left'}
        >
            {children}
        </div>
    );
}
