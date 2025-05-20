import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Pencil, Trash2, Copy } from "lucide-react";
import { ItemCardProps } from "./types";
import { isVideo } from "../../utils/inventory";
import Image from "next/image";
import 'swiper/css';

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  brandLogoMap,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  isDeleting,
  canManageItems,
}) => {
  console.log('here is my item ', item)
  return (
    <Card
      className={`overflow-hidden transition-shadow duration-300 ${
        isSelected ? "ring-2 ring-[#FF3B30]" : ""
      }`}
    >
      <CardContent className="p-4 relative">
        <div className="relative mb-4 aspect-[4/2]">
          <div className="relative mb-4">
            {item.item_images?.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
                className="w-full rounded-lg swiper-inventory"
              >
                {item.item_images.map((media, index) => (
                  <SwiperSlide key={index}>
                    {isVideo(media.image_url) ? (
                      <video
                        controls
                        className="w-full h-48 object-cover rounded-lg"
                      >
                        <source src={media.image_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (

                      <img
                        src={media.image_url}
                        alt={`${item.title} - ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              (item.image_url ? <> <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
                className="w-full rounded-lg swiper-inventory"
              >
               
                  <SwiperSlide >
                    

                      <img
                        src={item.image_url}
                        alt={`${item.title}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                   
                  </SwiperSlide>
              
              </Swiper></> : <><div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg">
                <span className="text-gray-500 text-sm">
                  No Media Available
                </span>
              </div></>)
              // <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg">
              //   <span className="text-gray-500 text-sm">
              //     No Media Available
              //   </span>
              // </div>
            )}
          </div>
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <span className="text-white text-lg sm:text-xl font-bold">
                Selected
              </span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 space-y-2 sm:space-y-0 gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 overflow-hidden text-ellipsis overflow-clip display-webkit-box line-clamp-2 min-h-[56px]">
              {item.title}
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-700">
              £{item.price.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center min-w-[68px]">
            {item.status === "available" && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock
              </span>
            )}
            {item.status === "low_stock" && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Low Stock
              </span>
            )}
            {item.status === "out_of_stock" && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Item Metadata */}
        <p className="text-sm text-gray-600 mb-4">
          Category:{" "}
          {item?.categories?.find((category) => category.level === 1)?.name ||
            "N/A"}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Quantity: {item.quantity || 0}
        </p>
        <p className="text-sm text-gray-600 mb-4 flex items-center space-x-2">
          <span>Brand:</span>
          {item.brand && brandLogoMap[item.brand] && (
            <img
              src={brandLogoMap[item.brand] || ''}
              alt={item.brand}
              className="h-4 w-4 object-contain"
            />
          )}
          <span>{item.brand || "N/A"}</span>
        </p>
        <p className="text-sm text-gray-600 mb-4">
          color: {item.color || ""}
        </p>
        {/* <p className="text-sm text-gray-600 mb-4">
          Age: {item.age || 0}
        </p> */}
        <div className="text-sm text-gray-600 mb-4">
          {item.condition && (
            <p className="mb-1">Condition: {item.condition}</p>
          )}
          {item.size && <p>Size: {item.size}</p>}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
          {canManageItems && (
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full leading-[normal] hover:bg-[#f42037]"
                onClick={() => onEdit(item.id)}
              >
                <Pencil className="mr-1 h-3 w-3" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 leading-[normal]"
                disabled={isDeleting}
                onClick={() => onDelete(item.id)}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-1" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full leading-[normal]"
                onClick={() => onDuplicate(item.id)}
              >
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={item?.status === "out_of_stock"}
            className={`w-full leading-[normal] ${
              isSelected
                ? "bg-[#FF3B30] text-white hover:bg-[#E6352B]"
                : "hover:bg-[#f42037]"
            }`}
            onClick={() => onSelect(item.id)}
          >
            {isSelected ? "Deselect" : "Select"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
