import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LocalMessage } from "@/types/messages";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OfferMessageProps {
  message: LocalMessage;
  isMe: boolean;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
}

export const OfferMessageComponent: React.FC<OfferMessageProps> = ({
  message,
  isMe,
  onAccept,
  onDecline,
}) => {
  const { offer, item } = message;
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "decline" | null>(
    null
  );

  const handleAction = async (action: "accept" | "decline") => {
    setIsLoading(true);
    setActionType(action);
    try {
      if (action === "accept") {
        await onAccept();
        toast.success("Offer accepted successfully!");
      } else {
        await onDecline();
        toast.success("Offer declined successfully!");
      }
    } catch (error) {
      console.error(`Error ${action}ing offer:`, error);
      toast.error(`Failed to ${action} offer. Please try again.`);
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  return (
    <Card
      className={cn(
        "w-full shadow-lg",
        isMe
          ? "bg-gray-700 text-gray-100 rounded-tr-none"
          : "bg-gray-800 text-gray-100 rounded-tl-none"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-20 w-20 flex-shrink-0 relative">
            {item?.media?.[0] ? (
              <img
                src={item.media[0]}
                alt={item.name}
                className="h-full w-full rounded object-cover border border-gray-600"
              />
            ) : (
              <div className="h-full w-full rounded bg-gray-700 flex items-center justify-center text-gray-400 text-xs text-center border border-gray-600">
                No Image
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{item?.name}</h3>
            <p className="text-sm text-gray-400">
              Listed Price: ${item?.price}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-300">
          Offer:{" "}
          <span className="font-medium text-[#FF3B30]">${offer?.price}</span>
        </p>
        {offer?.status === "new" && !isMe && (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("decline")}
              disabled={isLoading}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
            >
              {isLoading && actionType === "decline" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => handleAction("accept")}
              disabled={isLoading}
              className="bg-[#FF3B30] hover:bg-[#E6352B] text-white"
            >
              {isLoading && actionType === "accept" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Accept
            </Button>
          </div>
        )}
        {offer?.status === "accepted" && (
          <Badge
            variant="secondary"
            className="mt-2 bg-green-700 text-white border-green-600"
          >
            Offer Accepted
          </Badge>
        )}
        {offer?.status === "rejected" && (
          <Badge
            variant="secondary"
            className="mt-2 bg-red-700 text-white border-red-600"
          >
            Offer Declined
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
