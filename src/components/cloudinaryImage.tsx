import Image from "next/image";
import React from "react";

interface CloudinaryImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  transformation?: "thumbnail" | "detail" | "original";
}

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  transformation = "original",
}) => {
  if (!src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: width, height: height }}
      >
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  // Fungsi untuk menambahkan transformasi pada URL Cloudinary
  const getTransformedUrl = (url: string) => {
    // Cek apakah ini URL Cloudinary
    if (!url.includes("cloudinary.com")) {
      return url;
    }

    // Pisahkan URL
    const parts = url.split("/upload/");
    if (parts.length !== 2) {
      return url;
    }

    // Transformasi berdasarkan tipe
    let transformParams = "";

    switch (transformation) {
      case "thumbnail":
        transformParams = "c_fill,g_auto,h_300,w_300,q_auto,f_auto/";
        break;
      case "detail":
        transformParams = "c_limit,h_800,w_800,q_auto,f_auto/";
        break;
      case "original":
      default:
        transformParams = "q_auto,f_auto/";
        break;
    }

    // Kembalikan URL yang sudah ditransformasi
    return `${parts[0]}/upload/${transformParams}${parts[1]}`;
  };

  return (
    <Image
      src={getTransformedUrl(src)}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
};

export default CloudinaryImage;
