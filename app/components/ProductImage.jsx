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

  // Track if selectedImage belongs to the current color gallery list
  const isSelectedImageInList =
    selectedImage && allImages.some((img) => img.id === selectedImage.id);

  // Track currently active main image in the gallery.
  // Initialize to the selected image if it belongs to the color gallery, otherwise default to the first image of the gallery.
  const [activeImage, setActiveImage] = useState(
    isSelectedImageInList ? selectedImage : allImages[0],
  );

  // If the variant selection changes, only sync active image state if the new image is part of the current color gallery list
  useEffect(() => {
    const isSelectedInList =
      selectedImage && allImages.some((img) => img.id === selectedImage.id);
    if (isSelectedInList) {
      setActiveImage(selectedImage);
    }
  }, [selectedImage, images]);

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
          aspectRatio="4/5"
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
                  aspectRatio="4/5"
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
