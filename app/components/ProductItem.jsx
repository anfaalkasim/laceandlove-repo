import {useState} from 'react';
import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

// High-resolution local Codezeel Glamor Demo image pairs (Primary & Hover)
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
    primary: '/images/product-03.jpg',
    secondary: '/images/product-09-hover.jpg',
  },
  {
    primary: '/images/product-19.jpg',
    secondary: '/images/product-10-hover.jpg',
  },
];

const COLOR_HEX_MAP = {
  black: '#121212',
  'black silk': '#121212',
  green: '#2D5A27',
  gray: '#808080',
  grey: '#808080',
  red: '#D32F2F',
  pink: '#E62A65',
  'rose pink': '#FFB3C6',
  'dusty rose': '#D8A7B1',
  nude: '#E8D4C8',
  'cream nude': '#F5E8D3',
  cream: '#FFFDD0',
  white: '#FFFFFF',
  navy: '#0B192C',
  blue: '#1976D2',
  gold: '#D4AF37',
  purple: '#6B46C1',
  beige: '#F5F5DC',
};

/**
 * Dynamically extract unique color options from product options & variants
 */
function extractDynamicSwatches(product) {
  const options = product?.options || [];
  const colorOpt = options.find(o => o.name?.toLowerCase().includes('color') || o.name?.toLowerCase().includes('colour'));
  
  let colorNames = [];
  if (colorOpt && colorOpt.values) {
    colorNames = colorOpt.values;
  } else if (product?.variants?.nodes) {
    const variantColors = product.variants.nodes.flatMap(v => 
      (v.selectedOptions || []).filter(o => o.name?.toLowerCase().includes('color') || o.name?.toLowerCase().includes('colour')).map(o => o.value)
    );
    colorNames = Array.from(new Set(variantColors));
  }

  // If no color options present on product, fallback to standard intimates color swatches
  if (colorNames.length === 0) {
    colorNames = ['Black Silk', 'Rose Pink', 'Cream Nude'];
  }

  return colorNames.slice(0, 5).map(c => ({
    name: c,
    hex: COLOR_HEX_MAP[c.toLowerCase()] || '#121212',
  }));
}

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
  const fallbackPair = DEMO_IMAGE_PAIRS[Math.abs(hash) % DEMO_IMAGE_PAIRS.length];

  let rawPrimary = product?.featuredImage?.url;
  let rawSecondary = product?.images?.nodes?.[1]?.url || product?.images?.nodes?.[0]?.url;

  // Use local HD images if remote burst URL is slow/broken or null
  const primaryUrl = (rawPrimary && !rawPrimary.includes('burst.shopifycdn.com')) ? rawPrimary : fallbackPair.primary;
  const secondaryUrl = (rawSecondary && !rawSecondary.includes('burst.shopifycdn.com')) ? rawSecondary : fallbackPair.secondary;

  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice || product.variants?.nodes?.[0]?.compareAtPrice || null;
  const price = product.priceRange?.minVariantPrice;

  const isSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price?.amount || '0');

  // Dynamic Color Swatches
  const swatches = extractDynamicSwatches(product);
  const [activeSwatch, setActiveSwatch] = useState(swatches[0]?.name || '');

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

      {/* Dynamic Swatches Section under Product Card */}
      <div className="glamor-swatches" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0.6rem 0' }}>
        {swatches.map((swatch) => (
          <button
            key={swatch.name}
            type="button"
            title={swatch.name}
            onClick={() => setActiveSwatch(swatch.name)}
            className={`glamor-swatch-dot ${activeSwatch === swatch.name ? 'active' : ''}`}
            style={{
              backgroundColor: swatch.hex,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              display: 'inline-block',
              cursor: 'pointer',
              border: activeSwatch === swatch.name ? '2px solid #121212' : '1px solid rgba(0,0,0,0.15)',
              transform: activeSwatch === swatch.name ? 'scale(1.25)' : 'scale(1.0)',
              transition: 'all 0.2s ease',
              padding: 0,
              outline: 'none',
            }}
          />
        ))}
        {swatches.length > 0 && (
          <span style={{ fontSize: '0.7rem', color: '#777', marginLeft: '4px', textTransform: 'capitalize' }}>
            {activeSwatch}
          </span>
        )}
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
