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
// import { Badge } from "@/components/ui/badge";
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { ar } from 'date-fns/locale';

import { Cadre, User, UserFonctionne, columns } from "./columns"
import { DataTable } from "./data-table"
import { useSelectedUsers } from '@/context/SelectedUsersContext';


const UserManagementPage = () => {
    const { language } = useLanguage();
    const isArabic = language === 'ar';
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            username: "",
            password: "",
            lastName: "",
            firstName: "",
            phone: "",
            email: "",
            startDate: new Date(),
            hireDate: new Date(),
            role: "",
            cadre: "",
        },
    });
    const [users, setUsers] = useState<User[]>([]);
    const [date, setDate] = useState<Date>();
    const [cadres, setCadres] = useState<Cadre[]>([])
    const [fonctions, setFonctions] = useState<UserFonctionne[]>([])
    //selected users
    const { selectedUsers } = useSelectedUsers()


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
            startDate: { label: isArabic ? 'تاريخ الإلتحاق ' : "Date d'adhésion" },
            assignmentDate: { label: isArabic ? 'تاريخ التعيين' : "Date d'affectation" },
            role: { label: isArabic ? 'التصنيف' : 'Rôle' },
            cadre: { label: isArabic ? 'الإطار' : 'Cadre' },
            function: { label: isArabic ? 'الوظيفة' : 'Fonction' }
        },
        buttons: {
            save: isArabic ? 'إضافة' : 'Ajouter',
            reset: isArabic ? ' تعديل' : 'Modifier',
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

    type FormData = {
        username: string
        password: string
        lastName: string
        firstName: string
        phone?: string
        email?: string
        startDate: Date
        hireDate: Date
        role: string
        cadre: string
    }
    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
        // toast.success(isArabic ? 'تم إضافة المستخدم بنجاح' : 'Utilisateur ajouté avec succès');
    };
    useEffect(() => {
        // Fetch users from API (mocked here)
       

        const fetchCadresFonctions = async () => {
            const response = await fetch('/api/cadres-functions');
            const data = await response.json();
            setCadres(data.cadres)
            setFonctions(data.functions)
        }
        fetchCadresFonctions();
        fetchUsers();

        // console.log('Users:', users);

        console.log("selected Users", selectedUsers);

        if (selectedUsers.length === 1) {
            setValue("username", selectedUsers[0].UserName || '');
            setValue("password", selectedUsers[0].MotDePasse || ''); // optional, depending on use
            setValue("lastName", selectedUsers[0].Nom || '');
            setValue("firstName", selectedUsers[0].Prenom || '');
            setValue("phone", selectedUsers[0].Tel || '');
            setValue("email", selectedUsers[0].Email || '');
            setValue("startDate", new Date(selectedUsers[0].DateAffectation));
            setValue("hireDate", new Date(selectedUsers[0].DateEmbauche));
            setValue("role", selectedUsers[0].UserFonctionne.IdUserFonctionne?.toString() || '');
            setValue("cadre", selectedUsers[0].Cadre.IdCadre?.toString() || '');
        }else{
            reset();
        }
    }, [selectedUsers]);

    const onSubmit = (data: any) => {

        toast.success(isArabic ? 'تم إضافة المستخدم بنجاح' : 'Utilisateur ajouté avec succès');
    };

    const updateUser = async (formData:FormData)=>{
        console.log(formData);
        
        if (!selectedUsers[0]) return
        try {
            const res = await fetch(`/api/users/${selectedUsers[0].IdUtilisateur}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Update failed")

            const updated = await res.json()
            console.log("User updated:", updated)
            fetchUsers();

            toast.success(isArabic ? 'تم تعديل المستخدم بنجاح' : 'Utilisateur modifié avec succès');

        } catch (error) {
            console.error("Update error:", error)
        }
    }

    return (
        <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full p-4 min-h-screen h-fit bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="lg:max-w-6xl md:max-w-xl px-0  m-auto  space-y-6">


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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                {/* half Information */}
                                <div className="space-y-4">

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
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            render={({ field }) => (
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
                                                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>{isArabic ? 'اختر تاريخ' : 'Choisir une date'}</span>}

                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align={isArabic ? 'end' : 'start'}>
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            className="rounded-md border"
                                                            locale={ar}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{translations.fields.hireDate.label}</Label>
                                        <Controller
                                            name="hireDate"
                                            control={control}
                                            render={({ field }) => (
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
                                                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>{isArabic ? 'اختر تاريخ' : 'Choisir une date'}</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align={isArabic ? 'end' : 'start'}>
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            className="rounded-md border"
                                                            locale={ar}

                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2 ">
                                        <Label>{translations.fields.role.label}</Label>
                                        <Controller
                                            name="role"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className='w-full' dir={isArabic ? 'rtl' : 'ltr'}>
                                                        <SelectValue placeholder={isArabic ? 'اختر الدور' : 'Sélectionner un rôle'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {fonctions.map((fonction) => (
                                                            <SelectItem key={fonction.IdUserFonctionne} value={fonction.IdUserFonctionne.toString()} dir={isArabic ? 'rtl' : 'ltr'}>
                                                                {fonction.Libelle}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2 w-full" >
                                        <Label>{translations.fields.cadre.label}</Label>
                                        <Controller
                                            name="cadre"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value} >
                                                    <SelectTrigger className='w-full text-end' dir={isArabic ? 'rtl' : 'ltr'}>
                                                        <SelectValue placeholder={isArabic ? 'اختر الإطار' : 'Sélectionner un cadre'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {cadres.map((cadre) => (
                                                            <SelectItem key={cadre.IdCadre} value={cadre.IdCadre.toString()} className='w-full' dir={isArabic ? 'rtl' : 'ltr'} >
                                                                {cadre.Libelle}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="flex  gap-4 pt-6 px-0 w-full">
                                <Button
                                    type="submit"
                                    className="w-1/4 cursor-pointer"
                                >
                                    {translations.buttons.save}
                                </Button>
                                <Button
                                    className="w-1/4 cursor-pointer"
                                    disabled={selectedUsers.length === 1 ? false : true}
                                    type='button'
                                    onClick={handleSubmit(updateUser)}
                                >
                                    {translations.buttons.reset}
                                </Button>
                                <Button
                                    className="w-1/4 cursor-pointer bg-red-500 hover:bg-red-400 "
                                    disabled={selectedUsers.length > 0 ? false : true}
                                    type='button'
                                >
                                    {translations.buttons.delete}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="shadow-sm border-0">
                    <CardContent>
                        {

                            users.length === 0 ? "loading...." : (<DataTable columns={columns} data={users} />)
                        }

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserManagementPage;