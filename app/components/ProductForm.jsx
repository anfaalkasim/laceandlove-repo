import {Link, useNavigate} from 'react-router';
import {useState} from 'react';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 *   onOpenSizeGuide?: () => void;
 * }}
 */
export function ProductForm({productOptions, selectedVariant, onOpenSizeGuide, product}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

  const productTitle = product?.title || selectedVariant?.product?.title || '';
  const productHandle = product?.handle || selectedVariant?.product?.handle || '';
  const variantTitle = selectedVariant?.title && selectedVariant.title !== 'Default Title' ? ` (${selectedVariant.title})` : '';
  const variantPrice = selectedVariant?.price 
    ? `${selectedVariant.price.amount} ${selectedVariant.price.currencyCode === 'INR' ? '₹' : selectedVariant.price.currencyCode}` 
    : '';
  
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = `${origin}/products/${productHandle}`;
  const whatsappMessage = `Hello! I would like to order:
*Product:* ${productTitle}${variantTitle}
*Quantity:* ${quantity}
*Price:* ${variantPrice}
*Link:* ${productUrl}`;
  
  // Replace with the desired WhatsApp phone number (with country code, no +, spaces, or dashes)
  const whatsappNumber = '916238171416'; // Placeholder
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5>
              {option.name}
              {option.name.toLowerCase() === 'size' && onOpenSizeGuide && (
                <button
                  type="button"
                  className="size-guide-link"
                  onClick={onOpenSizeGuide}
                >
                  Size Guide
                </button>
              )}
            </h5>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const isSwatch = !!(swatch?.color || swatch?.image?.previewImage?.url || option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour');
                const baseClass = isSwatch ? 'product-options-item' : 'product-options-item-text';
                const className = `${baseClass}${selected ? ' selected' : ''}${!available ? ' disabled' : ''}`;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className={className}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      {isSwatch ? (
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      ) : (
                        name
                      )}
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={className}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      {isSwatch ? (
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      ) : (
                        name
                      )}
                    </button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        );
      })}

      <div className="product-quantity">
        <span className="product-quantity-label">Quantity</span>
        <div className="quantity-selector">
          <button
            type="button"
            className="quantity-btn"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            &minus;
          </button>
          <span className="quantity-value">{quantity}</span>
          <button
            type="button"
            className="quantity-btn"
            onClick={() => setQuantity((q) => q + 1)}
          >
            &#43;
          </button>
        </div>
      </div>

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>

      {selectedVariant?.availableForSale && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-order-btn"
        >
          <WhatsAppIcon />
          <span>Order on WhatsApp</span>
        </a>
      )}
    </div>
  );
}

const COLOR_MAP = {
  black: '#1a1a1a',
  white: '#ffffff',
  beige: '#e8d3b9',
  blue: '#2c75d3',
  red: '#a93226',
  green: '#1e8449',
  yellow: '#f4d03f',
  pink: '#f5b7b1',
  purple: '#6c3483',
  grey: '#7f8c8d',
  gray: '#7f8c8d',
  brown: '#873600',
  orange: '#e67e22',
  navy: '#1b263b',
  cream: '#fdfd96',
  ivory: '#fffff0',
  lavender: '#d7bde2',
  peach: '#f5cba7',
  nude: '#e5c290',
  champagne: '#f7e7ce',
  teal: '#117a65',
  coral: '#ec7063',
  plum: '#7d3c98',
  lilac: '#ebdef0',
  mint: '#d4efdf',
  charcoal: '#2c3e50',
  burgundy: '#641e16',
  maroon: '#78281f',
  gold: '#d4af37',
  silver: '#bdc3c7',
  bronze: '#cd7f32',
  copper: '#b87333',
  olive: '#7d6608',
  khaki: '#f0e68c',
  mustard: '#d4ac0d',
  camel: '#c19a6b',
  rust: '#ba4a00',
  sand: '#f5f5dc',
  tan: '#d2b48c',
  taupe: '#7b7d7d',
  terracotta: '#d35400',
  turquoise: '#138d75',
  violet: '#a569bd',
  wine: '#5b2c6f',
};

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  let color = swatch?.color;

  if (!image && !color) {
    const normalized = name.toLowerCase().trim();
    if (COLOR_MAP[normalized]) {
      color = COLOR_MAP[normalized];
    } else {
      const words = normalized.split(/\s+/);
      for (const word of words) {
        if (COLOR_MAP[word]) {
          color = COLOR_MAP[word];
          break;
        }
      }
    }
    if (!color) {
      color = '#e0e0e0';
    }
  }

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.11 1.94 12.007 1.94c-5.437 0-9.863 4.373-9.867 9.8.001 2.128.561 4.204 1.63 6.024L2.66 21.365l3.987-1.457zm11.234-7.234c-.302-.152-1.791-.883-2.073-.984-.282-.102-.489-.153-.69.152-.202.305-.783.984-.961 1.187-.178.203-.356.229-.658.077-1.282-.64-2.122-1.08-2.964-2.524-.222-.38-.222-.656-.071-.806.136-.135.302-.354.453-.531.152-.177.202-.303.303-.505.101-.202.05-.38-.025-.531-.076-.152-.69-1.662-.947-2.278-.25-.601-.524-.52-.719-.53-.186-.01-.399-.011-.612-.011-.213 0-.558.08-.85.399-.292.318-1.116 1.092-1.116 2.662 0 1.57 1.144 3.088 1.303 3.3.158.213 2.253 3.441 5.459 4.824.762.329 1.357.525 1.821.673.765.243 1.462.209 2.011.127.613-.092 1.791-.733 2.043-1.442.252-.709.252-1.316.177-1.442-.075-.127-.282-.203-.585-.355z" />
    </svg>
  );
}
