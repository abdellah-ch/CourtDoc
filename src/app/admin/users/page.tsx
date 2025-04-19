'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { ar } from 'date-fns/locale';

const UserManagementPage = () => {
    const { language } = useLanguage();
    const isArabic = language === 'ar';
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [users, setUsers] = useState<{ id: number; Nom: string; lastName: string; email: string; phone?: string; role?: string; cadre?: string; function?: string }[]>([]);
    const [date, setDate] = useState<Date>();

    // Translations
    const translations = {
        title: isArabic ? 'إدارة المستخدمين' : 'Gestion des utilisateurs',
        personalInfo: isArabic ? 'المعلومات الشخصية' : 'Informations personnelles',
        contactInfo: isArabic ? 'معلومات الاتصال' : 'Informations de contact',
        rolePosition: isArabic ? 'الوظيفة والصلاحيات' : 'Rôle et position',
        userList: isArabic ? 'قائمة المستخدمين' : 'Liste des utilisateurs',
        fields: {
            username: { label: isArabic ? 'اسم المستخدم' : "Nom d'utilisateur", placeholder: isArabic ? 'ادخل اسم المستخدم' : "Entrez le nom d'utilisateur" },
            password: { label: isArabic ? 'كلمة المرور' : 'Mot de passe', placeholder: isArabic ? 'ادخل كلمة المرور' : 'Entrez le mot de passe' },
            lastName: { label: isArabic ? 'الاسم العائلي' : 'Nom de famille', placeholder: isArabic ? 'ادخل الاسم العائلي' : 'Entrez le nom de famille' },
            firstName: { label: isArabic ? 'الاسم الشخصي' : 'Prénom', placeholder: isArabic ? 'ادخل الاسم الشخصي' : 'Entrez le prénom' },
            phone: { label: isArabic ? 'الهاتف' : 'Téléphone', placeholder: isArabic ? 'ادخل رقم الهاتف' : 'Entrez le numéro de téléphone' },
            email: { label: isArabic ? 'البريد الإلكتروني' : 'Email', placeholder: isArabic ? 'ادخل البريد الإلكتروني' : 'Entrez votre email' },
            hireDate: { label: isArabic ? 'تاريخ التوظيف' : "Date d'embauche" },
            startDate: {label: isArabic ? 'تاريخ الإلتحاق ' : "Date d'adhésion" },
            assignmentDate: { label: isArabic ? 'تاريخ التعيين' : "Date d'affectation" },
            role: { label: isArabic ? 'التصنيف' : 'Rôle' },
            cadre: { label: isArabic ? 'الإطار' : 'Cadre' },
            function: { label: isArabic ? 'الوظيفة' : 'Fonction' }
        },
        buttons: {
            save: isArabic ? 'حفظ' : 'Enregistrer',
            reset: isArabic ? ' تعديل' : 'Modifier',
            addUser: isArabic ? 'إضافة مستخدم' : 'Ajouter un utilisateur',
            delete: isArabic ? 'مسح' : 'Supprimer'
        },
        tableHeaders: {
            name: isArabic ? 'الاسم' : 'Nom',
            email: isArabic ? 'البريد الإلكتروني' : 'Email',
            phone: isArabic ? 'الهاتف' : 'Téléphone',
            role: isArabic ? 'الدور' : 'Rôle',
            cadre: isArabic ? 'الإطار' : 'Cadre',
            function: isArabic ? 'الوظيفة' : 'Fonction'
        }
    };

    // Mock data for dropdowns
    const roles = [
        { id: 1, label: isArabic ? 'مدير' : 'Administrateur' },
        { id: 2, label: isArabic ? 'مشرف' : 'Superviseur' },
        { id: 3, label: isArabic ? 'موظف' : 'Employé' }
    ];

    const cadres = [
        { id: 1, label: isArabic ? 'إداري' : 'Administratif' },
        { id: 2, label: isArabic ? 'فني' : 'Technique' },
        { id: 3, label: isArabic ? 'قضائي' : 'Judiciaire' }
    ];

    const fonctions = [
        { id: 1, label: isArabic ? 'محامي' : 'Avocat' },
        { id: 2, label: isArabic ? 'كاتب' : 'Secrétaire' },
        { id: 3, label: isArabic ? 'محضر' : 'Greffier' }
    ];

    useEffect(() => {
        // Fetch users from API (mocked here)
        const fetchUsers = async () => {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
            console.log(data);
            // toast.success(isArabic ? 'تم إضافة المستخدم بنجاح' : 'Utilisateur ajouté avec succès');


        };

        fetchUsers();
        // toast.success(isArabic ? 'تم إضافة المستخدم بنجاح' : 'Utilisateur ajouté avec succès');

        console.log('Users:', users);
        
    }, []);

    const onSubmit = (data: any) => {
        
        toast.success(isArabic ? 'تم إضافة المستخدم بنجاح' : 'Utilisateur ajouté avec succès');
    };

    return (
        <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full p-4 h-fit bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="lg:max-w-4xl md:max-w-xl px-0  m-auto  space-y-6">
                

                {/* User Form */}
                <Card className="shadow-sm border-0 w-full">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {translations.title}
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* half Information */}
                                <div className="space-y-4">
                                    {/* <h3 className="text-lg font-semibold">{translations.personalInfo}</h3> */}

                                    <div className="space-y-2">
                                        <Label>{translations.fields.username.label}</Label>
                                        <Input
                                            placeholder={translations.fields.username.placeholder}
                                            {...register('username', { required: true })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{translations.fields.password.label}</Label>
                                        <Input
                                            type="password"
                                            placeholder={translations.fields.password.placeholder}
                                            {...register('password', { required: true })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{translations.fields.lastName.label}</Label>
                                        <Input
                                            placeholder={translations.fields.lastName.placeholder}
                                            {...register('lastName', { required: true })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{translations.fields.firstName.label}</Label>
                                        <Input
                                            placeholder={translations.fields.firstName.placeholder}
                                            {...register('firstName', { required: true })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{translations.fields.phone.label}</Label>
                                        <Input
                                            placeholder={translations.fields.phone.placeholder}
                                            {...register('phone')}
                                        />
                                    </div>
                                    
                                </div>

                                {/* Half Information */}
                                <div className="space-y-4">
                                    {/* <h3 className="text-lg font-semibold">{translations.contactInfo}</h3> */}

                                    

                                    <div className="space-y-2">
                                        <Label>{translations.fields.email.label}</Label>
                                        <Input
                                            type="email"
                                            placeholder={translations.fields.email.placeholder}
                                            {...register('email')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{translations.fields.startDate.label}</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>{isArabic ? 'اختر تاريخ' : 'Choisir une date'}</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align={isArabic ? 'end' : 'start'}>
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    className="rounded-md border"
                                                    locale={ar}

                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{translations.fields.hireDate.label}</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>{isArabic ? 'اختر تاريخ' : 'Choisir une date'}</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align={isArabic ? 'end' : 'start'}>
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    className="rounded-md border"
                                                    locale={ar}

                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2 ">
                                        <Label>{translations.fields.role.label}</Label>
                                        <Select onValueChange={(value) => setValue("role", value)}>
                                            <SelectTrigger className='w-full' dir={isArabic ? 'rtl' : 'ltr'}>
                                                <SelectValue placeholder={isArabic ? 'اختر الدور' : 'Sélectionner un rôle'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id.toString()} dir={isArabic ? 'rtl' : 'ltr'}>
                                                        {role.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 w-full" >
                                        <Label>{translations.fields.cadre.label}</Label>
                                        <Select  onValueChange={(value) => setValue("cadre", value)} >
                                            <SelectTrigger className='w-full text-end' dir={isArabic ? 'rtl' : 'ltr'}>
                                                <SelectValue placeholder={isArabic ? 'اختر الإطار' : 'Sélectionner un cadre'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cadres.map((cadre) => (
                                                    <SelectItem key={cadre.id} value={cadre.id.toString()} className='w-full' dir={isArabic ? 'rtl' : 'ltr'} >
                                                        {cadre.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>
                                
                                
                                
                            </div>
                            

                            <div className="flex  gap-4 pt-6 px-0 w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => reset()}
                                    className="w-1/4 cursor-pointer"
                                >
                                    {translations.buttons.reset}
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-1/4 cursor-pointer"
                                >
                                    {translations.buttons.save}
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-1/4 cursor-pointer bg-red-500 hover:bg-red-400"
                                >
                                    {translations.buttons.delete}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="shadow-sm border-0">
                    {/* <CardHeader>
                        <CardTitle className="text-lg">
                            {translations.userList}
                        </CardTitle>
                    </CardHeader> */}
                    <CardContent>
                        {/* table user */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserManagementPage;