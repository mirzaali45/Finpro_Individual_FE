// src/components/products/ProductImage.tsx
import React from "react";
import { ImageIcon } from "lucide-react";
import CloudinaryImage from "@/components/cloudinaryImage";

interface ProductImageProps {
  image: string | null;
  productName: string;
  onImageClick: () => void;
}

export default function ProductImage({
  image,
  productName,
  onImageClick,
}: ProductImageProps) {
  if (!image) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Product Image
        </h3>
      </div>
      <div className="p-4">
        <div
          className="w-full h-48 overflow-hidden relative rounded-md cursor-pointer"
          onClick={onImageClick}
        >
          <CloudinaryImage
            src={image}
            alt={productName}
            width={300}
            height={200}
            className="object-cover w-full h-full hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity">
            <span className="opacity-0 hover:opacity-100 text-white font-medium">
              Click to view
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
