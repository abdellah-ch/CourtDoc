
// context/SelectedUsersContext.tsx
"use client"

import { User } from "@/app/admin/users/columns"
import { createContext, useContext, useState, ReactNode } from "react"

type SelectedUsersContextType = {
    selectedUsers: User[]
    setSelectedUsers: (users: User[]) => void
}

const SelectedUsersContext = createContext<SelectedUsersContextType | undefined>(undefined)

export const SelectedUsersProvider = ({ children }: { children: ReactNode }) => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])

    return (
        <SelectedUsersContext.Provider value={{ selectedUsers, setSelectedUsers }}>
            {children}
        </SelectedUsersContext.Provider>
    )
}

export const useSelectedUsers = () => {
    const context = useContext(SelectedUsersContext)
    if (!context) {
        throw new Error("useSelectedUsers must be used within a SelectedUsersProvider")
    }
    return context
}
