'use client';

import { useState } from 'react'
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
            JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 6) // Limit to 6 items
    }, [items, searchTerm])

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <div className="relative px-2 pt-1">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={searchPlaceholder}
                        className="pl-10 pr-4 py-1 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <SelectItem
                                key={item.IdUtilisateur || item.IdFiliere || item.IdGroupeFiliere}
                                value={item.IdUtilisateur?.toString() || item.IdFiliere?.toString() || item.IdGroupeFiliere?.toString()}
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
                            الفروع
                        </Button>
                        <Button
                            variant={activeTab === 'groups' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('groups')}
                        >
                            المجموعات
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

function FilieresSection() {
    const [newFiliere, setNewFiliere] = useState({
        Libelle: '',
        IdGroupeFiliere: ''
    })

    // Mock data - replace with actual API calls
    const filieres = [
        { IdFiliere: 1, Libelle: "القانون المدني", IdGroupeFiliere: 1, GroupeFilieres: { Libelle: "المجموعة القانونية" } },
        { IdFiliere: 2, Libelle: "المحاسبة", IdGroupeFiliere: 2, GroupeFilieres: { Libelle: "المجموعة المالية" } }
    ]

    const groupes = [
        { IdGroupeFiliere: 1, Libelle: "المجموعة القانونية" },
        { IdGroupeFiliere: 2, Libelle: "المجموعة المالية" }
    ]

    const handleAddFiliere = () => {
        // API call to add filiere
        console.log('Adding filiere:', newFiliere)
        setNewFiliere({ Libelle: '', IdGroupeFiliere: '' })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="اسم الفرع الجديد"
                    value={newFiliere.Libelle}
                    onChange={(e) => setNewFiliere({ ...newFiliere, Libelle: e.target.value })}
                />

                <Select
                    value={newFiliere.IdGroupeFiliere}
                    onValueChange={(value) => setNewFiliere({ ...newFiliere, IdGroupeFiliere: value })}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="اختر مجموعة" />
                    </SelectTrigger>
                    <SelectContent>
                        {groupes.map(groupe => (
                            <SelectItem key={groupe.IdGroupeFiliere} value={groupe.IdGroupeFiliere.toString()}>
                                {groupe.Libelle}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button onClick={handleAddFiliere} className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    إضافة فرع
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الفرع</TableHead>
                            <TableHead>المجموعة</TableHead>
                            <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filieres.map(filiere => (
                            <TableRow key={filiere.IdFiliere}>
                                <TableCell>{filiere.Libelle}</TableCell>
                                <TableCell>{filiere.GroupeFilieres?.Libelle}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon">
                                        <TrashIcon className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function GroupsSection() {
    const [newGroup, setNewGroup] = useState('')

    // Mock data
    const groups = [
        { IdGroupeFiliere: 1, Libelle: "المجموعة القانونية" },
        { IdGroupeFiliere: 2, Libelle: "المجموعة المالية" }
    ]

    const handleAddGroup = () => {
        // API call to add group
        console.log('Adding group:', newGroup)
        setNewGroup('')
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
                    إضافة مجموعة
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
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
                </Table>
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
                    placeholder="اختر فرع"
                    searchPlaceholder="ابحث عن فرع..."
                    renderItem={(filiere) => filiere.Libelle}
                />

                <SearchableSelect
                    items={groups}
                    value={selectedGroup}
                    onValueChange={setSelectedGroup}
                    placeholder="اختر مجموعة"
                    searchPlaceholder="ابحث عن مجموعة..."
                    renderItem={(group) => group.Libelle}
                />
            </div>

            <div className="flex gap-4">
                <Button onClick={handleAssignAccess} className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    تعيين الصلاحية
                </Button>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <CopyIcon className="h-4 w-4" />
                            نسخ الصلاحيات
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>نسخ الصلاحيات بين المستخدمين</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Select>
                                <SelectTrigger>
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
                                <SelectTrigger>
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