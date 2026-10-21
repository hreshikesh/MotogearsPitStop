import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsUrl } from '@/utils/urlUtils';

export const shopCategories = [
  {
    name: 'Bike Accessories',
    items: ['Crash Guards', 'Crash Protection', 'Handguards', 'Tank Pads', 'Wind Deflectors', 'Tail Tidy', 'Mirrors', 'Seats'],
  },
  {
    name: 'Riding Gear',
    items: ['Helmets', 'Jackets', 'Gloves', 'Boots', 'Pants', 'Rain Gear', 'Knee Guards', 'Bluetooth & Intercom'],
  },
  {
    name: 'Touring',
    items: ['Panniers', 'Top Boxes', 'Saddle Bags', 'Tank Bags', 'Tail Bags', 'Backpacks', 'Seats', 'Racks'],
  },
  {
    name: 'Performance Parts',
    items: ['Exhaust', 'Engine Oil', 'Lubricants', 'Chain Sets', 'Air Filters', 'Brake Pads'],
  },
  {
    name: 'Lighting',
    items: ['Fog Lamps', 'Indicators', 'Electricals', 'Tail Lights'],
  },
  {
    name: 'Popular Brands',
    isBrand: true,
    items: ['Maddog', 'Barkbusters', 'KTM', 'Royal Enfield', 'Studds', 'Axor', 'Cardo'],
  },
];

const MegaMenu = ({ onClose }) => {
  const categories = shopCategories;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="w-full bg-white border-y border-gray-200 shadow-2xl"
    >
      <div className="mx-auto grid max-h-[calc(100vh-150px)] max-w-[1600px] grid-cols-2 gap-x-8 gap-y-10 overflow-y-auto px-8 py-8 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map((category, idx) => (
          <div key={idx} className="border-r border-gray-200 px-2 last:border-r-0 xl:px-4">
            <Link 
              to={category.isBrand ? '/products' : productsUrl({ category: category.name })}
              onClick={onClose}
              className="text-[#e63946] hover:text-gray-900 transition-colors font-bold mb-4 text-sm uppercase tracking-wide flex items-center gap-2 group"
            >
              {category.name}
              <span className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[10px]">
                →
              </span>
            </Link>
            <ul className="space-y-2.5">
              {category.items.map((item, itemIdx) => {
                const path = category.isBrand 
                  ? productsUrl({ brand: item }) 
                  : productsUrl({ category: category.name, subcategory: item });
                  
                return (
                  <li key={itemIdx}>
                    <Link
                      to={path}
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors block py-0.5 hover:translate-x-1 duration-200"
                      onClick={onClose}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MegaMenu;
