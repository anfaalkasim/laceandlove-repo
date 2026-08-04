import {Image} from '@shopify/hydrogen';
import {useState, useEffect} from 'react';

/**
 * @param {{
 *   selectedImage: ProductVariantFragment['image'];
 *   images: Array<any>;
 * }}
 */
export function ProductImage({selectedImage, images = []}) {
  const allImages = images && images.length > 0 ? images : selectedImage ? [selectedImage] : [];

  // Track currently active main image in the gallery
  const [activeImage, setActiveImage] = useState(selectedImage || allImages[0]);

  // If the variant selection changes and changes the variant image, sync active image state
  useEffect(() => {
    if (selectedImage) {
      setActiveImage(selectedImage);
    }
  }, [selectedImage]);

  if (allImages.length === 0) {
    return <div className="product-image" />;
  }

  const currentImage = activeImage || allImages[0];

  return (
    <div className="product-gallery">
      {/* Main Large Product Image */}
      <div className="product-image-main">
        <Image
          alt={currentImage.altText || 'Product Image'}
          aspectRatio="1/1"
          data={currentImage}
          key={currentImage.id}
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </div>

      {/* Thumbnails row if there are multiple images */}
      {allImages.length > 1 && (
        <div className="product-image-thumbnails">
          {allImages.map((img) => {
            const isActive = img.id === currentImage.id;
            return (
              <button
                key={img.id}
                type="button"
                className={`thumbnail-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <Image
                  data={img}
                  aspectRatio="1/1"
                  sizes="80px"
                  alt={img.altText || 'Product Thumbnail'}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
