import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
import { Notification } from "../types"

  
  interface OfferActionDialogProps {
    open?: boolean
    onOpenChange: (open: boolean) => void
    notification: Notification | null
    activeModal: string | null
    counterOffer: string
    setCounterOffer: (offer: string) => void
    onOfferAction: (action: 'accept' | 'counter' | 'decline') => void
  }
  
  export function OfferActionDialog({ open, onOpenChange, notification, activeModal, counterOffer, setCounterOffer, onOfferAction }: OfferActionDialogProps) {
    if (!notification || !activeModal) return null
  
    const isAcceptMode = activeModal === 'accept-offer'
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isAcceptMode ? 'Accept' : 'Decline'} Offer
            </DialogTitle>
            <DialogDescription>
              {notification.sender} offered ${notification.metadata.offerAmount}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {notification.metadata.itemImage && (
              <img
                src={notification.metadata.itemImage}
                alt={notification.metadata.itemTitle}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
            {isAcceptMode && (
              <Input
                type="number"
                placeholder="Enter counter offer amount"
                value={counterOffer}
                onChange={(e) => setCounterOffer(e.target.value)}
              />
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {isAcceptMode ? (
              <>
                <Button onClick={() => onOfferAction('counter')}>
                  Counter Offer
                </Button>
                <Button onClick={() => onOfferAction('accept')}>
                  Accept Offer
                </Button>
              </>
            ) : (
              <Button 
                variant="destructive" 
                onClick={() => onOfferAction('decline')}
              >
                Decline Offer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }