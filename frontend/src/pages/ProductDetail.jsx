import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Minus, Plus, Star, Truck, Shield } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/ui/use-toast';
import ProductCard from '@/components/ProductCard';
import ProductImageGallery from '@/components/ProductImageGallery';
import ImageLightbox from '@/components/ImageLightbox';
import { productsUrl } from '@/utils/urlUtils';
import { getWhatsAppUrl } from '@/config/contact';
import { getProductGalleryImages, getProductImage, handleProductImageError } from '@/utils/imageUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id || '');
  const product = products.find(p =>
    String(p.id) === decodedId ||
    String(p._id || '') === decodedId ||
    String(p.slug || '') === decodedId
  );
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const addToCart = useCartStore(state => state.addToCart);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-[#e63946] hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const productImage = getProductImage(product);
  const galleryImages = getProductGalleryImages(product);
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from wishlist" });
    } else {
      addToWishlist(product);
      toast({ title: "Added to wishlist!" });
    }
  };

  const handleLiveDemo = () => {
    window.open(getWhatsAppUrl(`Hi, I'd like to see a live demo of ${product.name}`), '_blank');
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} - MotoGearsPitstop`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-white pt-24 px-4 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-8 bg-gray-50 p-3 rounded-lg border border-gray-200 w-fit">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
            <span>/</span>
            <Link to={productsUrl({ category: product.category })} className="hover:text-gray-900 transition-colors">{product.category}</Link>
            {product.subcategory && (
              <>
                <span>/</span>
                <Link to={productsUrl({ category: product.category, subcategory: product.subcategory })} className="hover:text-gray-900 transition-colors">{product.subcategory}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px] md:max-w-[300px]">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Images */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-square border border-gray-200"
              >
                <img
                  src={productImage}
                  alt={product.name}
                  onError={(event) => handleProductImageError(event, product)}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Image Gallery */}
              {galleryImages.length > 0 && (
                <ProductImageGallery 
                  images={galleryImages} 
                  onImageClick={openLightbox} 
                  productName={product.name}
                />
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                {renderStars(product.rating)}
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                    </span>
                    <span className="rounded bg-[#16a34a] px-3 py-1 text-sm font-bold text-white">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Bike Compatibility */}
              <div className="mb-6">
                <h3 className="text-gray-900 font-bold mb-2">Compatible with:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.bikes.map((bike, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-300"
                    >
                      {bike}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-gray-900 font-medium">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-100 text-gray-900 p-2 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-gray-900 font-bold text-xl w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-100 text-gray-900 p-2 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`ml-auto p-1 transition-colors ${
                    inWishlist ? 'text-[#e63946]' : 'text-gray-500 hover:text-[#e63946]'
                  }`}
                >
                  <Heart size={26} fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={2} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mb-8 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-black"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleLiveDemo}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-black"
                >
                  <svg viewBox="0 0 32 32" className="h-[22px] w-[22px] shrink-0 fill-[#25D366]" aria-hidden>
                    <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.253.586 4.457 1.7 6.395L3.2 28.8l6.556-1.723a12.7 12.7 0 006.245 1.607c7.06 0 12.799-5.74 12.799-12.799 0-3.421-1.332-6.638-3.75-9.056A12.717 12.717 0 0016 3.2zm0 23.309a10.5 10.5 0 01-5.35-1.465l-.384-.228-3.973 1.043 1.06-3.874-.25-.4a10.51 10.51 0 01-1.61-5.585c0-5.83 4.743-10.574 10.574-10.574 2.825 0 5.48 1.1 7.478 3.099a10.51 10.51 0 013.097 7.478c0 5.83-4.744 10.573-10.574 10.573zm5.799-7.917c-.318-.16-1.882-.929-2.174-1.035-.292-.106-.504-.16-.716.16-.212.318-.822 1.035-1.008 1.248-.186.212-.371.239-.69.08-.318-.16-1.342-.494-2.556-1.577-.945-.842-1.583-1.883-1.769-2.201-.185-.318-.02-.49.14-.649.144-.143.318-.371.478-.557.16-.185.212-.318.318-.53.106-.212.053-.398-.026-.557-.08-.16-.716-1.725-.981-2.362-.258-.62-.52-.536-.716-.546-.185-.008-.398-.01-.61-.01-.212 0-.557.08-.849.398-.291.318-1.113 1.088-1.113 2.653 0 1.566 1.14 3.08 1.299 3.293.16.212 2.243 3.425 5.436 4.803.76.328 1.352.523 1.815.67.762.242 1.457.208 2.006.126.612-.091 1.882-.769 2.148-1.512.266-.743.266-1.38.186-1.512-.08-.132-.291-.211-.61-.371z" />
                  </svg>
                  Live Product Demo
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Truck className="text-[#e63946]" size={24} />
                  <div>
                    <div className="text-gray-900 font-medium text-sm">Free Shipping</div>
                    <div className="text-gray-600 text-xs">On orders above ₹5000</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="text-[#e63946]" size={24} />
                  <div>
                    <div className="text-gray-900 font-medium text-sm">Genuine Product</div>
                    <div className="text-gray-600 text-xs">100% Authentic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">{key}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct, index) => (
                  <ProductCard key={`${relProduct.id}-${relProduct.name}-${index}`} product={relProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={galleryImages}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextLightboxImage}
        onPrev={prevLightboxImage}
      />
    </>
  );
};

export default ProductDetail;
