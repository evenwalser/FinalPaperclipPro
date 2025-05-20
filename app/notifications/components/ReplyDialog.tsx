import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { Textarea } from "@/components/ui/textarea"
import { Notification } from "../types"
 
  
  interface ReplyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    notification: Notification | null
    replyContent: string
    setReplyContent: (content: string) => void
    onReply: () => void
  }
  
  export function ReplyDialog({ open, onOpenChange, notification, replyContent, setReplyContent, onReply }: ReplyDialogProps) {
    if (!notification) return null
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reply to {notification.sender}</DialogTitle>
            <DialogDescription>{notification.subject}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={onReply}>
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }