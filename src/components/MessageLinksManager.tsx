"use client";
import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';
import { MessageLinkSelect } from "@/components/MessageLinkSelect";

export function MessageLinksManager({
  message,
  refreshData,
  allMessages,
  refresh
}: {
  message: any;
  refreshData: Dispatch<SetStateAction<boolean>>;
  allMessages: any[];
  refresh:boolean
}) {
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkedMessages, setLinkedMessages] = useState<any[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  // Fetch linked messages when component mounts or message changes
  useEffect(() => {
    const fetchLinkedMessages = async () => {
      try {
        const res = await fetch(`/api/links/${message.IdMessagerie}`);
        if (!res.ok) throw new Error('Failed to fetch links');
        const data = await res.json();
        setLinkedMessages(data);
      } catch (error) {
        console.error("Error loading linked messages:", error);
        toast.error("حدث خطأ أثناء تحميل المراسلات المضمومة");
      } finally {
        setLoadingLinks(false);
      }
    };

    fetchLinkedMessages();
  }, [message.IdMessagerie, refresh]);

  // Get disabled IDs (current message + already linked messages)
  const disabledIds = [
    message.IdMessagerie,
    ...linkedMessages.map(link => 
      link.IdMessagerieSource === message.IdMessagerie 
        ? link.IdMessagerieCible 
        : link.IdMessagerieSource
    )
  ];

  const handleLinkAction = async () => {
    if (!selectedMessageId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/messagerie-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          IdMessagerieSource: message.IdMessagerie,
          IdMessagerieCible: parseInt(selectedMessageId)
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      refreshData((prev)=>!prev);
      setSelectedMessageId("");
      toast.success("تم ضم المراسلة بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء العملية");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlink = async (linkId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/messagerie-links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          IdMessagerieSource: message.IdMessagerie,
          IdMessagerieCible: linkId
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      refreshData((prev)=>!prev);
      toast.success("تم فك ضم المراسلة بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء العملية");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-xl">إدارة المراسلات المضمومة</CardTitle>
        <CardDescription>ربط أو فك ربط هذه المراسلة مع مراسلات أخرى</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Current Links */}
        <div>
          <h3 className="font-medium mb-3">المراسلات المضمومة الحالية</h3>
          <div className="space-y-2">
            {loadingLinks ? (
              <p className="text-center py-4">جاري تحميل المراسلات المضمومة...</p>
            ) : linkedMessages.length > 0 ? (
              linkedMessages.map(link => {
                const linkedMessage = link.IdMessagerieSource === message.IdMessagerie
                  ? link.Messageries_MessagerieLinks_IdMessagerieCibleToMessageries
                  : link.Messageries_MessagerieLinks_IdMessagerieSourceToMessageries;

                if (!linkedMessage) return null;

                return (
                  <div key={link.IdLink} className="border p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {linkedMessage.NumeroMessagerie} - {linkedMessage.Sujet}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(link.DateLiaison), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUnlink(linkedMessage.IdMessagerie)}
                      disabled={isLoading}
                    >
                      فك الضم
                    </Button>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">
                لا توجد مراسلات مضمومة
              </p>
            )}
          </div>
        </div>

        {/* Link Form */}
        <div className="border p-4 rounded-lg">
          <div className="space-y-4">
            <div>
              <Label>اختر مراسلة للضم</Label>
              <MessageLinkSelect
                messages={allMessages}
                value={selectedMessageId}
                onValueChange={setSelectedMessageId}
                disabledIds={disabledIds}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedMessageId("")}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleLinkAction}
                disabled={!selectedMessageId || isLoading}
              >
                {isLoading ? "جاري المعالجة..." : "ضم المراسلة"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}