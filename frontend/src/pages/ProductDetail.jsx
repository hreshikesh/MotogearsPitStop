import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SeoHead from '@/components/SeoHead';
import {
  productMetaTitle,
  productMetaDescription,
} from '@/utils/seoText';
import {
  productSchema,
  breadcrumbSchema,
} from '@/utils/jsonLd';
import { productImageAlt } from '@/utils/imageSeo';
import { trackViewItem, trackAddToCart } from '@/utils/analytics';
import { getProductIdentifier } from '@/utils/urlUtils';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, Star } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/ui/use-toast';
import ProductCard from '@/components/ProductCard';
import ProductImageGallery from '@/components/ProductImageGallery';
import ImageLightbox from '@/components/ImageLightbox';
import { productsUrl } from '@/utils/urlUtils';
import { getProductGalleryImages, getProductImage, handleProductImageError } from '@/utils/imageUtils';
import { getWhatsAppUrl } from '@/config/contact';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (product) trackViewItem(product);
  }, [product]);

  const canonicalPath = product
    ? `/product/${encodeURIComponent(String(getProductIdentifier(product)))}`
    : undefined;

  const jsonLd = useMemo(() => {
    if (!product) return null;
    const crumbs = breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      ...(product.category
        ? [{ name: product.category, path: productsUrl({ category: product.category }) }]
        : []),
      ...(product.subcategory
        ? [{
            name: product.subcategory,
            path: productsUrl({ subcategory: product.subcategory }),
          }]
        : []),
      { name: product.name, path: canonicalPath },
    ]);
    return [productSchema(product), crumbs];
  }, [product, canonicalPath]);

  if (!product) {
    return (
      <>
        <SeoHead
          title="Product Not Found | MotoGearsPitstop"
          description="This product could not be found. Browse our motorcycle gear catalog."
          robots="noindex, follow"
        />
      <div className="min-h-screen bg-white py-6 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-[#e63946] hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
      </>
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
    trackAddToCart(product, quantity);
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

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const sharePayload = {
      title: product.name,
      text: `Check out ${product.name} at Moto Gears Pit Stop`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied',
        description: 'Product link copied to your clipboard.',
      });
    } catch {
      toast({
        title: 'Could not share',
        description: url,
        variant: 'destructive',
      });
    }
  };

  const handleAskQuestion = () => {
    const url = window.location.href;
    const message = `Hi, I have a question about ${product.name}:\n${url}`;
    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
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
      <SeoHead
        title={product.seoTitle || productMetaTitle(product)}
        description={product.metaDescription || productMetaDescription(product)}
        canonicalPath={canonicalPath}
        ogType="product"
        ogImage={productImage}
        ogImageAlt={productImageAlt(product)}
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-white py-6 px-4 pb-8">
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
                  alt={product.imageAlt || productImageAlt(product)}
                  fetchPriority="high"
                  decoding="async"
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
                      className="bg-[#FDE047] text-[#0a0a0a] px-3 py-1 rounded-full text-sm font-bold border border-[#e5c940]"
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
                  className="btn-primary-off-white flex w-full items-center justify-center rounded-full px-6 py-4 text-lg font-bold shadow-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex w-full items-center justify-center btn-primary-yellow rounded-full px-6 py-4 text-lg font-bold shadow-md"
                >
                  Buy It Now
                </button>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="btn-primary-off-white flex flex-1 items-center justify-center rounded-full px-4 py-3 text-sm font-bold shadow-sm"
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={handleAskQuestion}
                    className="btn-primary-off-white flex flex-1 items-center justify-center rounded-full px-4 py-3 text-sm font-bold shadow-sm"
                  >
                    Ask a Question
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-[#0a0a0a]/15">
                  <div className="text-[#0a0a0a] font-bold text-sm">Free Shipping</div>
                  <div className="text-[#0a0a0a]/80 text-xs">On orders above ₹5000</div>
                </div>
                <div className="p-4 rounded-2xl border border-[#0a0a0a]/15">
                  <div className="text-[#0a0a0a] font-bold text-sm">Genuine Product</div>
                  <div className="text-[#0a0a0a]/80 text-xs">100% Authentic</div>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-[#FDE047] rounded-lg p-6 border border-[#e5c940] mb-12">
            <h2 className="text-2xl font-bold text-[#0a0a0a] mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 py-3 border-b border-[#0a0a0a]/15 text-sm font-bold text-[#0a0a0a]">
                  <span>{key}</span>
                  <span className="text-right">{value}</span>
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
