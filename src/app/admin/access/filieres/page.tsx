'use client';

import { useEffect, useRef, useState } from 'react'
// import { useQuery, useMutation } from '@tanstack/react-query'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, TrashIcon, CopyIcon, UsersIcon, SearchIcon } from 'lucide-react'
import { useMemo } from 'react';
import { setgroups } from 'process';
import { toast } from 'sonner';

function SearchableSelect({
    items,
    value,
    onValueChange,
    placeholder,
    searchPlaceholder,
    renderItem
}: {
    items: any[],
    value: string,
    onValueChange: (value: string) => void,
    placeholder: string,
    searchPlaceholder: string,
    renderItem: (item: any) => React.ReactNode
}) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            JSON.stringify(item).includes(searchTerm.toLowerCase())
        ).slice(0, 6) // Limit to 6 items
    }, [items, searchTerm])
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (filteredItems.length > 0 && inputRef.current) {
            inputRef.current.focus();
        }
    }, [filteredItems]);

    return (
        <Select value={value} onValueChange={onValueChange} >
            <SelectTrigger  dir='rtl' className='cursor-pointer w-[150px]'>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <div className="relative px-2 py-2">
                    <SearchIcon className="absolute left-4 top-1/2  transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={searchPlaceholder}
                        dir='rtl'
                        className="pl-10 pr-4 py-2 w-full mb-1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        ref={inputRef}

                    />
                </div>
                <div dir='rtl' className="max-h-[300px] overflow-y-auto">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <SelectItem
                                key={item.IdUtilisateur || item.IdFiliere || item.IdGroupeFiliere}
                                value={item.IdUtilisateur?.toString() || item.IdFiliere?.toString() || item.IdGroupeFiliere?.toString()}
                                className='cursor-pointer'
                            >
                                {renderItem(item)}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="py-2 text-center text-sm text-gray-500">
                            لا توجد نتائج
                        </div>
                    )}
                </div>
            </SelectContent>
        </Select>
    )
}


export default function FiliereManagementPage() {
    const [activeTab, setActiveTab] = useState<'filieres' | 'groups' | 'users'>('filieres')

    return (
        <div dir='rtl' className="w-full p-4 min-h-screen h-fit bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="lg:max-w-6xl md:max-w-xl px-0 m-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">إدارة النظام</h1>

                    <div className="flex gap-2">
                        <Button
                            variant={activeTab === 'filieres' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('filieres')}
                        >
                            الشعب
                        </Button>
                        <Button
                            variant={activeTab === 'groups' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('groups')}
                        >
                            الفئات
                        </Button>
                        <Button
                            variant={activeTab === 'users' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('users')}
                        >
                            صلاحيات المستخدمين
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'filieres' && <FilieresSection />}
                {activeTab === 'groups' && <GroupsSection />}
                {activeTab === 'users' && <UserAccessSection />}
            </div>
        </div>
    )
}


//implement the filieres section
function FilieresSection() {
    const [newFiliere, setNewFiliere] = useState({
        Libelle: '',
        IdGroupeFiliere: ''
    })

    const [newCodeFiliere, setNewCodeFiliere] = useState({
        Valeur: '',
        IdFiliere: ''
    })

    const [selectedGroupFiliere, setSelectedGroupFiliere] = useState('')
    const [selectedFiliere, setSelectedFiliere] = useState('')

    const [groupes,setGroupes] = useState([]);
    const [filieres,setFilieres] = useState([]);
    
    const fetchGroupes = async ()=>{
        const response = await fetch("/api/GroupeFilieres")
        const data = await response.json()
        setGroupes(data)
    }

    const fetchFilieres = async () =>{
        const response = await fetch('/api/Filieres')
        const data = await response.json()
        setFilieres(data)
    }
    useEffect(()=>{
        fetchGroupes()
        fetchFilieres()
    },[])

    
    

    

    const handleAddFiliere = async () => {
         await addNewFiliere()
    }
    const handleAddCodeFiliere = async () => {
         await addNewCodeFiliere()
    }

    const addNewFiliere = async () => {
        try {
            const res = await fetch("/api/GroupeFilieres", {
                method: "post",
                body: JSON.stringify({ nom: newFiliere.Libelle, idGroupe: selectedGroupFiliere }),
            })

            if(!res.ok){

            }else{
                toast.success('تمت إضافة الشعبة بنجاح');
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء إضافة الشعبة');
        }
        
    }

    const addNewCodeFiliere = async () => {
        try {
            const res = await fetch("/api/Filieres", {
                method: "post",
                body: JSON.stringify({ Valeur: newCodeFiliere.Valeur, IdFiliere: parseInt(selectedFiliere) }),
            })

            if (!res.ok) {

            } else {
                toast.success('تمت إضافة الرمز بنجاح');
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء إضافة الرمز');
        }

    }
    return (
        <div className="space-y-4" dir='rtl'>
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="اسم الشعبة الجديدة"
                    value={newFiliere.Libelle}
                    onChange={(e) => setNewFiliere({ ...newFiliere, Libelle: e.target.value })}
                />

                {/* <Select
                    value={newFiliere.IdGroupeFiliere}
                    onValueChange={(value) => setNewFiliere({ ...newFiliere, IdGroupeFiliere: value })}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                        {groupes.map(groupe => (
                            <SelectItem key={groupe.IdGroupeFiliere} value={groupe.IdGroupeFiliere.toString()}>
                                {groupe.Libelle}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select> */}
                <SearchableSelect 
                    items={groupes}
                    value={selectedGroupFiliere}
                    onValueChange={setSelectedGroupFiliere}
                    placeholder="اختر الفئة"
                    searchPlaceholder="ابحث عن الفئة..."
                    renderItem={(Groupe) => `${Groupe.Libelle}`}
                    
                />
                <Button type='button' onClick={handleAddFiliere} className="gap-2 w-[140px]">
                    <PlusIcon className="h-4 w-4" />
                    إضافة الشعبة
                </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="رمز الشعبة الجديد"
                    value={newCodeFiliere.Valeur}
                    onChange={(e) => setNewCodeFiliere({ ...newCodeFiliere, Valeur: e.target.value })}
                />

               
                <SearchableSelect
                    items={filieres}
                    value={selectedFiliere}
                    onValueChange={setSelectedFiliere}
                    placeholder="اختر الشعبة"
                    searchPlaceholder="ابحث عن الشعبة..."
                    renderItem={(Groupe) => `${Groupe.Libelle}`}
                />
                <Button onClick={handleAddCodeFiliere} className="gap-2 w-[140px]">
                    <PlusIcon className="h-4 w-4" />
                    إضافة الرمز
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden w-[80%] mx-auto mt-8">
                {/* <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">الشعبة</TableHead>
                            <TableHead className="text-center">الفئة</TableHead>
                            <TableHead className="text-center">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filieres.map(filiere => (
                            <TableRow key={filiere.IdFiliere}>
                                <TableCell className='text-center'>{filiere.Libelle}</TableCell>
                                <TableCell className='text-center'>{filiere.GroupeFilieres?.Libelle}</TableCell>
                                <TableCell className="text-center gap-2">
                                    <Button variant="ghost" size="icon" className='cursor-pointer'>
                                        <TrashIcon className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> */}
            </div>
        </div>
    )
}

function GroupsSection() {
    const [newGroup, setNewGroup] = useState('')

    // Mock data
    // const groups = [
    //     { IdGroupeFiliere: 1, Libelle: "المجموعة القانونية" },
    //     { IdGroupeFiliere: 2, Libelle: "المجموعة المالية" }
    // ]

    const handleAddGroup = async () => {
        // API call to add group
        // console.log('Adding group:', newGroup)
        // setNewGroup('')
        const res = await fetch("/api/groupe",{
            method:"POST",
            body:JSON.stringify({
                Libelle : newGroup
            })
        })
        if(!res.ok){
            toast.error('error');
        }else{
            toast.success('تمت إضافة الفئة بنجاح');

        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Input
                    placeholder="اسم المجموعة الجديدة"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                />
                <Button onClick={handleAddGroup} className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    إضافة فئة
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                {/* <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>المجموعة</TableHead>
                            <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groups.map(group => (
                            <TableRow key={group.IdGroupeFiliere}>
                                <TableCell>{group.Libelle}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon">
                                        <TrashIcon className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> */}
            </div>
        </div>
    )
}

function UserAccessSection() {
    const [selectedUser, setSelectedUser] = useState('')
    const [selectedFiliere, setSelectedFiliere] = useState('')
    const [selectedGroup, setSelectedGroup] = useState('')

    // Mock data
    const users = [
        { IdUtilisateur: 1, Nom: "محمد", Prenom: "أحمد" },
        { IdUtilisateur: 2, Nom: "فاطمة", Prenom: "الزهراء" }
    ]

    const filieres = [
        { IdFiliere: 1, Libelle: "القانون المدني" },
        { IdFiliere: 2, Libelle: "المحاسبة" }
    ]

    const groups = [
        { IdGroupeFiliere: 1, Libelle: "المجموعة القانونية" },
        { IdGroupeFiliere: 2, Libelle: "المجموعة المالية" }
    ]

    const userAccess = [
        { IdUtilisateur: 1, Nom: "محمد أحمد", Filieres: ["القانون المدني"], Groups: ["المجموعة القانونية"] }
    ]

    const handleAssignAccess = () => {
        // API call to assign access
        console.log('Assigning access:', {
            userId: selectedUser,
            filiereId: selectedFiliere,
            groupId: selectedGroup
        })
    }

    const handleDuplicateAccess = (sourceUserId: number, targetUserId: number) => {
        // API call to duplicate access
        console.log(`Duplicating access from user ${sourceUserId} to ${targetUserId}`)
    }

    return (
        <div className="space-y-6">
            {/* Assignment Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SearchableSelect
                    items={users}
                    value={selectedUser}
                    onValueChange={setSelectedUser}
                    placeholder="اختر مستخدم"
                    searchPlaceholder="ابحث عن مستخدم..."
                    renderItem={(user) => `${user.Prenom} ${user.Nom}`}
                />


                <SearchableSelect
                    items={filieres}
                    value={selectedFiliere}
                    onValueChange={setSelectedFiliere}
                    placeholder="اختر الشعبة"
                    searchPlaceholder="ابحث عن الشعبة..."
                    renderItem={(filiere) => filiere.Libelle}
                />

                <SearchableSelect
                    items={groups}
                    value={selectedGroup}
                    onValueChange={setSelectedGroup}
                    placeholder="اختر الفئة"
                    searchPlaceholder="ابحث عن الفئة..."
                    renderItem={(group) => group.Libelle}
                />
            </div>

            <div className="flex gap-4">
                <Button onClick={handleAssignAccess} className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    تعيين الصلاحية
                </Button>

                <Dialog >
                    <DialogTrigger  asChild>
                        <Button variant="outline" className="gap-2">
                            <CopyIcon className="h-4 w-4" />
                            نسخ الصلاحيات
                        </Button>
                    </DialogTrigger>
                    <DialogContent dir='rtl'>
                        <DialogHeader>
                            <DialogTitle>نسخ الصلاحيات بين المستخدمين</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Select>
                                <SelectTrigger className='w-[200px]'>
                                    <SelectValue placeholder="اختر مصدر الصلاحيات" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem
                                            key={user.IdUtilisateur}
                                            value={user.IdUtilisateur.toString()}
                                        >
                                            {user.Prenom} {user.Nom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select>
                                <SelectTrigger className='w-[200px]'>
                                    <SelectValue placeholder="اختر مستهدف الصلاحيات" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem
                                            key={user.IdUtilisateur}
                                            value={user.IdUtilisateur.toString()}
                                        >
                                            {user.Prenom} {user.Nom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button onClick={() => handleDuplicateAccess(1, 2)}>
                                نسخ الصلاحيات
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Access List */}
            <div className="border rounded-lg overflow-hidden">
               {/* Selected User table Access */}
            </div>
        </div>
    )
}