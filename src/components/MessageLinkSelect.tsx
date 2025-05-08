"use client"
import { SearchIcon } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { format } from "date-fns"

type MessageLinkItem = {
  IdMessagerie: number
  NumeroOrdre: number
  NumeroMessagerie: string
  Sujet: string
  DateMessage: Date | string
}

export function MessageLinkSelect({
  messages,
  value,
  onValueChange,
  placeholder = "ابحث عن مراسلة...",
  disabledIds = []
}: {
  messages: MessageLinkItem[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabledIds?: number[]
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredMessages = useMemo(() => {
    if (!searchTerm) return (messages || []).filter(msg => !disabledIds?.includes(msg.IdMessagerie)).slice(0, 6);
    
    return (messages || [])
      .filter(msg => {
        if (!msg) return false;
        // Exact match comparison
        return String(msg.NumeroOrdre) === searchTerm && 
               !disabledIds?.includes(msg.IdMessagerie);
      })
      .slice(0, 6)
  }, [messages, searchTerm, disabledIds])

  const selectedMessage = useMemo(() => {
    return messages.find(msg => msg.IdMessagerie.toString() === value)
  }, [value, messages])

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger dir="rtl" className="cursor-pointer w-full mt-4 text-right">
        <SelectValue placeholder={placeholder}>
          {selectedMessage ? `#${selectedMessage.NumeroOrdre}` : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="p-0">
        <div className="relative px-3 py-2 border-b">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="ابحث بالرقم الترتيبي (مطابقة كاملة)"
            dir="rtl"
            className="pl-8 pr-3 py-1 h-9 text-sm"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d*$/.test(value)) {
                setSearchTerm(value);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        <div dir="rtl" className="max-h-[300px] overflow-y-auto">
          {filteredMessages.length > 0 ? (
            filteredMessages.map(message => (
              <SelectItem
                key={message.IdMessagerie}
                value={message.IdMessagerie.toString()}
                className="cursor-pointer py-2 px-3 text-right"
              >
                <div className="flex flex-col">
                  <span className="font-medium">#{message.NumeroOrdre}</span>
                  <span className="text-sm text-muted-foreground">
                    {message.NumeroMessagerie}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {message.Sujet}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.DateMessage), "dd/MM/yyyy")}
                  </span>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="py-3 text-center text-sm text-muted-foreground">
              {searchTerm ? "لا توجد نتائج مطابقة" : "أدخل الرقم الترتيبي للبحث"}
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  )
}