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
export function ProductForm({productOptions, selectedVariant, onOpenSizeGuide}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

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
