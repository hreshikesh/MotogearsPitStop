import React from 'react';
import { motion } from 'framer-motion';

const ProductImageGallery = ({ images, onImageClick, productName }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
      {images.map((img, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onImageClick(idx)}
          className="relative h-[72px] w-[72px] shrink-0 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm transition-shadow hover:border-[#e63946] hover:shadow-md sm:h-20 sm:w-20 md:h-24 md:w-24"
        >
          <img
            src={img}
            alt={`${productName} view ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductImageGallery;