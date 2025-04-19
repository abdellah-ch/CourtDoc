'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";

const ParametersPage = () => {
    const { language, setLanguage } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div
            dir={isArabic ? 'rtl' : 'ltr'}
            className=" h-fit bg-gradient-to-br from-gray-50 to-gray-100"
        >
            <div className="max-w-4xl max-h-[94vh] mx-auto space-y-6 overflow-y-auto">
                {/* Header with Language Switcher */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isArabic ? 'الإعدادات' : 'Paramètres'}
                    </h1>

                    <ToggleGroup
                        type="single"
                        value={language}
                        onValueChange={(value) => value && setLanguage(value as 'ar' | 'fr')}
                        className="bg-gray-100 rounded-lg p-1"
                    >
                        <ToggleGroupItem value="ar" aria-label="Arabic" className="px-3 py-1 data-[state=on]:bg-white">
                            <span className={language === 'ar' ? 'font-semibold' : ''}>العربية</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="fr" aria-label="French" className="px-3 py-1 data-[state=on]:bg-white">
                            <span className={language === 'fr' ? 'font-semibold' : ''}>Français</span>
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                {/* Court Settings Card */}
                <Card className="shadow-sm border-0">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {isArabic ? 'إعدادات المحكمة' : 'Paramètres du tribunal'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="court">
                                        {isArabic ? 'المحكمة' : 'Tribunal'}
                                    </Label>
                                    <Input
                                        id="court"
                                        placeholder={isArabic ? 'اسم المحكمة' : 'Nom du tribunal'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="courtType">
                                        {isArabic ? 'نوع المحكمة' : 'Type de tribunal'}
                                    </Label>
                                    <Input
                                        id="courtType"
                                        placeholder={isArabic ? 'نوع المحكمة' : 'Type de tribunal'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">
                                        {isArabic ? 'العنوان' : 'Adresse'}
                                    </Label>
                                    <Input
                                        id="address"
                                        placeholder={isArabic ? 'العنوان' : 'Adresse'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">
                                        {isArabic ? 'المدينة' : 'Ville'}
                                    </Label>
                                    <Input
                                        id="city"
                                        placeholder={isArabic ? 'المدينة' : 'Ville'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">
                                        {isArabic ? 'الهاتف' : 'Téléphone'}
                                    </Label>
                                    <Input
                                        id="phone"
                                        placeholder={isArabic ? 'الهاتف' : 'Téléphone'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fax">
                                        {isArabic ? 'الفاكس' : 'Fax'}
                                    </Label>
                                    <Input
                                        id="fax"
                                        placeholder={isArabic ? 'الفاكس' : 'Fax'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        {isArabic ? 'الإيميل' : 'Email'}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={isArabic ? 'الإيميل' : 'Email'}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* User Credentials Card */}
                <Card className="shadow-sm border-0">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {isArabic ? 'بيانات المستخدم' : 'Identifiants utilisateur'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="domain">
                                        {isArabic ? 'دومين (PC)' : 'Domaine (PC)'}
                                    </Label>
                                    <Input
                                        id="domain"
                                        placeholder={isArabic ? 'دومين' : 'Domaine'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">
                                        {isArabic ? 'اسم المستخدم' : "Nom d'utilisateur"}
                                    </Label>
                                    <Input
                                        id="username"
                                        placeholder={isArabic ? 'اسم المستخدم' : "Nom d'utilisateur"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        {isArabic ? 'الرقم السري' : 'Mot de passe'}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder={isArabic ? 'الرقم السري' : 'Mot de passe'}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" className="w-full md:w-auto cursor-pointer">
                                    {isArabic ? 'حفظ التغييرات' : 'Enregistrer les modifications'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ParametersPage;