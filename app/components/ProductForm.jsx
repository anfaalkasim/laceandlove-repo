import {Link, useNavigate} from 'react-router';
import {useState} from 'react';
import {AddToCartButton} from './AddToCartButton';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 *   onOpenSizeGuide?: () => void;
 *   product?: any;
 * }}
 */
export function ProductForm({productOptions, selectedVariant, onOpenSizeGuide, product}) {
  const navigate = useNavigate();
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
  
  const whatsappNumber = '916238171416';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="product-form" style={{ width: '100%' }}>
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
                {option.name}
              </h5>
              {option.name.toLowerCase() === 'size' && onOpenSizeGuide && (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', textDecoration: 'underline', fontSize: '0.8rem', cursor: 'pointer' }}
                  onClick={onOpenSizeGuide}
                >
                  Size Guide
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  exists,
                  isDifferentProduct,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={`glamor-size-chip ${selected ? 'selected' : ''}`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      {name}
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`glamor-size-chip ${selected ? 'selected' : ''}`}
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
                      {name}
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity Stepper & Add to Cart Button Block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid #ddd',
              borderRadius: '30px',
              padding: '2px 8px',
              background: '#fff',
            }}
          >
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.6rem 0.8rem',
                fontSize: '1.1rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              &minus;
            </button>
            <span style={{ padding: '0 0.8rem', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.6rem 0.8rem',
                fontSize: '1.1rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              &#43;
            </button>
          </div>

          <div style={{ flex: 1 }}>
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
              {selectedVariant?.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
            </AddToCartButton>
          </div>
        </div>

        {selectedVariant?.availableForSale && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-order-btn"
          >
            <WhatsAppIcon />
            <span>ORDER ON WHATSAPP</span>
          </a>
        )}
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.11 1.94 12.007 1.94c-5.437 0-9.863 4.373-9.867 9.8.001 2.128.561 4.204 1.63 6.024L2.66 21.365l3.987-1.457zm11.234-7.234c-.302-.152-1.791-.883-2.073-.984-.282-.102-.489-.153-.69.152-.202.305-.783.984-.961 1.187-.178.203-.356.229-.658.077-1.282-.64-2.122-1.08-2.964-2.524-.222-.38-.222-.656-.071-.806.136-.135.302-.354.453-.531.152-.177.202-.303.303-.505.101-.202.05-.38-.025-.531-.076-.152-.69-1.662-.947-2.278-.25-.601-.524-.52-.719-.53-.186-.01-.399-.011-.612-.011-.213 0-.558.08-.85.399-.292.318-1.116 1.092-1.116 2.662 0 1.57 1.144 3.088 1.303 3.3.158.213 2.253 3.441 5.459 4.824.762.329 1.357.525 1.821.673.765.243 1.462.209 2.011.127.613-.092 1.791-.733 2.043-1.442.252-.709.252-1.316.177-1.442-.075-.127-.282-.203-.585-.355z" />
    </svg>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
