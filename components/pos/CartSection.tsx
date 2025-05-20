import React from 'react';

import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { CartSectionProps } from './types';

const CartSection: React.FC<CartSectionProps> = ({
  items,
  isloading,
  updateQuantity,
  removeItem,
  total,
  clearCart,
  validateAndUpdateQuantity,
  setShowDiscountModal,
  discount,
  calculateFinalTotal
}) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg justify-between">
      <div className="border-b border-[#3e4a5c] flex items-center gap-2 flex-row justify-between px-4 py-3 !m-0">
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5 text-paperclip-red" /> Cart Items
        </CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowDiscountModal(true)}
            className="inline-flex items-center justify-center gap-2"
          >
            Discount
          </Button>
          <Button onClick={clearCart}>Clear Cart</Button>
        </div>
      </div>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {isloading ? (
            // Show 3 skeleton items (adjust the count as needed)
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-2 border-b animate-pulse">
                <div className="w-16 h-16 flex-shrink-0 relative rounded-md bg-gray-200 dark:bg-gray-700" />
                <div className="flex-grow">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))
          ) : (
            // Normal item listings
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 py-2 border-b"
              >
                <div className="w-16 h-16 flex-shrink-0 relative rounded-md overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="text-sm text-gray-500 space-x-1">
                    <span>{item.category}</span>
                    {item.size && <span>• {item.size}</span>}
                  </div>
                  <div className="text-sm font-semibold">
                    £{item.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      validateAndUpdateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      validateAndUpdateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
          {/* {!isloading && items.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 py-2 border-b"
            >
              <div className="w-16 h-16 flex-shrink-0 relative rounded-md overflow-hidden">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{item.title}</h3>
                <div className="text-sm text-gray-500 space-x-1">
                  <span>{item.category}</span>
                  {item.size && <span>• {item.size}</span>}
                </div>
                <div className="text-sm font-semibold">
                  £{item.price.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    validateAndUpdateQuantity(item.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    validateAndUpdateQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))} */}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="w-full flex justify-between items-center mb-2">
          <span className="text-xl font-semibold">Subtotal:</span>
          <span className="text-xl">£{total.toFixed(2)}</span>
        </div>
        {discount.value > 0 && (
          <div className="w-full flex justify-between items-center mb-2 text-green-500">
            <span>
              Discount (
              {discount.type === "percentage"
                ? `${discount.value}%`
                : `£${discount.value}`}
              ):
            </span>
            <span>-£{(total - calculateFinalTotal()).toFixed(2)}</span>
          </div>
        )}
        <div className="w-full flex justify-between items-center">
          <span className="text-xl font-semibold">Final Total:</span>
          <span
            className={`text-2xl font-bold ${
              discount.value > 0
                ? discount.type === "percentage"
                  ? "text-yellow-500"
                  : "text-green-500"
                : "text-paperclip-red"
            }`}
          >
            £{calculateFinalTotal().toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CartSection; 