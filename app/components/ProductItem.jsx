import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

// Local high-resolution Codezeel Glamor Demo image pairs (Primary & Hover)
const DEMO_IMAGE_PAIRS = [
  {
    primary: '/images/product-09.jpg',
    secondary: '/images/product-09-hover.jpg',
  },
  {
    primary: '/images/product-10.jpg',
    secondary: '/images/product-10-hover.jpg',
  },
  {
    primary: '/images/product-11.jpg',
    secondary: '/images/product-11-hover.jpg',
  },
  {
    primary: '/images/product-12.jpg',
    secondary: '/images/product-12-hover.jpg',
  },
  {
    primary: '/images/product-15.jpg',
    secondary: '/images/product-15-hover.jpg',
  },
  {
    primary: '/images/product-19.jpg',
    secondary: '/images/product-09-hover.jpg',
  },
];

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  
  const hash = (product?.id || product?.handle || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackPair = DEMO_IMAGE_PAIRS[hash % DEMO_IMAGE_PAIRS.length];

  const primaryUrl = product?.featuredImage?.url || fallbackPair.primary;
  const secondaryUrl = product?.images?.nodes?.[1]?.url || fallbackPair.secondary;

  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice || product.variants?.nodes?.[0]?.compareAtPrice || null;
  const price = product.priceRange?.minVariantPrice;

  const isSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price?.amount || '0');

  return (
    <div className="glamor-product-card">
      <div className="glamor-product-img-wrapper">
        {isSale ? (
          <span className="glamor-badge glamor-badge-sale">SALE</span>
        ) : (
          <span className="glamor-badge glamor-badge-new">NEW</span>
        )}

        <Link to={variantUrl} prefetch="intent">
          <img
            src={primaryUrl}
            alt={product.title}
            loading={loading}
            className="glamor-product-img"
          />
          <img
            src={secondaryUrl}
            alt={`${product.title} hover`}
            loading="lazy"
            className="glamor-product-img-hover"
          />
        </Link>

        {/* Hover Quick Actions Bar */}
        <div className="glamor-card-actions">
          <button className="glamor-card-action-btn" aria-label="Add to Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <Link to={variantUrl} className="glamor-card-action-btn" aria-label="Quick View">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </Link>
        </div>
      </div>

      <div className="glamor-swatches">
        <span className="glamor-swatch-dot" style={{ backgroundColor: '#121212' }} />
        <span className="glamor-swatch-dot" style={{ backgroundColor: '#E62A65' }} />
        <span className="glamor-swatch-dot" style={{ backgroundColor: '#F5E8D3' }} />
      </div>

      <div className="glamor-product-info">
        <Link to={variantUrl} prefetch="intent">
          <h4 className="glamor-product-title">{product.title}</h4>
        </Link>
        <div className="glamor-price-wrapper">
          {price && <Money data={price} />}
          {isSale && compareAtPrice && (
            <span className="glamor-price-compare">
              <Money data={compareAtPrice} />
            </span>
          )}
        </div>
      </div>

      {/* Select Options CTA Button */}
      <div style={{ marginTop: '0.5rem' }}>
        <Link to={variantUrl} className="glamor-btn-outline full-width">
          SELECT OPTIONS
        </Link>
      </div>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
