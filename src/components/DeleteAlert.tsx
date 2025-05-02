import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteAlert({ open, onOpenChange, onConfirm ,IdDeleteMessagerie  }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (Id:number) => void;
  IdDeleteMessagerie:number;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} >
      <AlertDialogContent >
        <AlertDialogHeader   >
          <AlertDialogTitle className="text-right">هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هذا الإجراء لا يمكن التراجع عنه. هذا سيحذف العنصر بشكل دائم من قاعدة البيانات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="text-right">
          <AlertDialogCancel asChild>
            <Button  variant="outline">إلغاء</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={()=>onConfirm(IdDeleteMessagerie)}>
              حذف
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}