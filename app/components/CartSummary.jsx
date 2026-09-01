import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {useFetcher} from 'react-router';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  // Group and aggregate discount allocations from both the cart level and line level
  const discountAllocationsMap = {};

  // 1. Process cart-level discount allocations (if any)
  const cartAllocations = cart?.discountAllocations || [];
  for (const allocation of cartAllocations) {
    const key = allocation.code || allocation.title || 'Discount';
    const amount = parseFloat(allocation.discountedAmount?.amount || '0');
    if (amount > 0) {
      if (!discountAllocationsMap[key]) {
        discountAllocationsMap[key] = {
          label: allocation.code
            ? `Coupon Applied (${allocation.code})`
            : `Offer Applied (${allocation.title})`,
          amount: 0,
          currencyCode: allocation.discountedAmount?.currencyCode,
        };
      }
      discountAllocationsMap[key].amount += amount;
    }
  }

  // 2. Process line-level discount allocations from cart lines
  const lines = cart?.lines?.nodes || [];
  for (const line of lines) {
    const lineAllocations = line.discountAllocations || [];
    for (const allocation of lineAllocations) {
      const key = allocation.code || allocation.title || 'Discount';
      const amount = parseFloat(allocation.discountedAmount?.amount || '0');
      if (amount > 0) {
        if (!discountAllocationsMap[key]) {
          discountAllocationsMap[key] = {
            label: allocation.code
              ? `Coupon Applied (${allocation.code})`
              : `Offer Applied (${allocation.title})`,
            amount: 0,
            currencyCode: allocation.discountedAmount?.currencyCode,
          };
        }
        discountAllocationsMap[key].amount += amount;
      }
    }
  }

  // Convert the map to an array of consolidated discounts
  const consolidatedDiscounts = Object.values(discountAllocationsMap).map((d) => ({
    label: d.label,
    discountedAmount: {
      amount: d.amount.toFixed(2),
      currencyCode: d.currencyCode || 'USD',
    },
  }));

  // Calculate total discount across the entire cart
  const totalDiscount = consolidatedDiscounts.reduce((sum, d) => {
    return sum + parseFloat(d.discountedAmount.amount);
  }, 0);

  const hasDiscounts = totalDiscount > 0;
  const subtotalAmount = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const originalSubtotalAmount = subtotalAmount + totalDiscount;
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || 'USD';

  const originalSubtotal = {
    amount: originalSubtotalAmount.toFixed(2),
    currencyCode
  };

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <h4>Order Summary</h4>
      
      {hasDiscounts ? (
        <>
          <dl className="cart-original-subtotal">
            <dt>Original Subtotal</dt>
            <dd>
              <Money data={originalSubtotal} />
            </dd>
          </dl>
          {consolidatedDiscounts.map((discount) => {
            return (
              <dl key={discount.label} className="cart-discount-row">
                <dt>{discount.label}</dt>
                <dd>
                  <span>-</span>
                  <Money data={discount.discountedAmount} />
                </dd>
              </dl>
            );
          })}
          <dl className="cart-subtotal">
            <dt>Subtotal</dt>
            <dd>
              {cart?.cost?.subtotalAmount?.amount ? (
                <Money data={cart?.cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </dl>
        </>
      ) : (
        <dl className="cart-subtotal">
          <dt>Subtotal</dt>
          <dd>
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>
      )}

      <CartPromotionalCodes
        discountCodes={cart?.discountCodes}
        giftCardCodes={cart?.appliedGiftCards}
      />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} cart={cart} />
      
      {/* Trust Badges */}
      <div className="cart-trust-badges">
        <div className="trust-badge-item">
          <LockIcon />
          <span>Secure SSL Checkout & Payment</span>
        </div>
        <div className="trust-badge-item">
          <ShippingIcon />
          <span>Complimentary delivery on orders over $150</span>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string; cart?: any}}
 */
function CartCheckoutActions({checkoutUrl, cart}) {
  if (!checkoutUrl) return null;

  const lines = cart?.lines?.nodes || [];
  const linesSummary = lines
    .map((l) => {
      const title = l.merchandise?.product?.title || 'Product';
      const variant =
        l.merchandise?.title && l.merchandise.title !== 'Default Title'
          ? ` (${l.merchandise.title})`
          : '';
      return `• ${l.quantity}x ${title}${variant}`;
    })
    .join('\n');

  const totalAmount = cart?.cost?.totalAmount?.amount
    ? `${cart.cost.totalAmount.amount} ${
        cart.cost.totalAmount.currencyCode === 'INR'
          ? '₹'
          : cart.cost.totalAmount.currencyCode
      }`
    : '';

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const checkoutFullUrl = checkoutUrl.startsWith('http')
    ? checkoutUrl
    : `${origin}${checkoutUrl}`;

  const message = `Hello Lace & Love! I would like to order:
${linesSummary}
Total: ${totalAmount}
Checkout Link: ${checkoutFullUrl}`;

  const whatsappNumber = '916238171416';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <div className="checkout-actions-row">
      <a href={checkoutUrl} className="checkout-btn" target="_self">
        Continue to Checkout
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-order-btn"
        style={{marginTop: '0.85rem'}}
      >
        <WhatsAppIcon />
        <span>ORDER ON WHATSAPP</span>
      </a>
    </div>
  );
}

/**
 * Combined promo code & gift card form using a collapsible accordion
 */
function CartPromotionalCodes({discountCodes, giftCardCodes}) {
  const [isOpen, setIsOpen] = useState(false);
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  const activeDiscounts =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  const hasAppliedCodes =
    activeDiscounts.length > 0 || (giftCardCodes && giftCardCodes.length > 0);

  return (
    <div className="cart-promo-container">
      <button
        type="button"
        className="cart-promo-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>🏷️ Apply Promo Code or Gift Card</span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      <div
        className={`cart-promo-content ${
          isOpen || hasAppliedCodes ? 'open' : ''
        }`}
      >
        {/* Applied Codes Lists */}
        {hasAppliedCodes && (
          <div className="applied-codes-container">
            {/* Applied Discounts */}
            {activeDiscounts.map((code) => (
              <UpdateDiscountForm
                key={code}
                discountCodes={activeDiscounts.filter((c) => c !== code)}
              >
                <div className="applied-code-pill">
                  <span className="pill-label">
                    Promo: <strong>{code}</strong>
                  </span>
                  <button
                    type="submit"
                    className="pill-remove-btn"
                    aria-label={`Remove discount ${code}`}
                  >
                    &times;
                  </button>
                </div>
              </UpdateDiscountForm>
            ))}

            {/* Applied Gift Cards */}
            {giftCardCodes &&
              giftCardCodes.map((giftCard) => (
                <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
                  <div className="applied-code-pill">
                    <span className="pill-label">
                      Gift Card:{' '}
                      <strong>***{giftCard.lastCharacters}</strong> (
                      <Money data={giftCard.amountUsed} />)
                    </span>
                    <button
                      type="submit"
                      className="pill-remove-btn"
                      aria-label="Remove gift card"
                    >
                      &times;
                    </button>
                  </div>
                </RemoveGiftCardForm>
              ))}
          </div>
        )}

        {/* Inputs */}
        <div className="promo-inputs-grid">
          {/* Discount code form */}
          <UpdateDiscountForm discountCodes={activeDiscounts}>
            <div className="promo-input-row">
              <input
                id="discount-code-input"
                type="text"
                name="discountCode"
                placeholder="Promo Code"
                className="promo-text-input"
              />
              <button
                type="submit"
                className="promo-apply-btn"
                aria-label="Apply discount code"
              >
                Apply
              </button>
            </div>
          </UpdateDiscountForm>

          {/* Gift Card form */}
          <AddGiftCardForm fetcherKey="gift-card-add">
            <div className="promo-input-row">
              <input
                type="text"
                name="giftCardCode"
                placeholder="Gift Card Code"
                ref={giftCardCodeInput}
                className="promo-text-input"
              />
              <button
                type="submit"
                className="promo-apply-btn"
                disabled={giftCardAddFetcher.state !== 'idle'}
              >
                Apply
              </button>
            </div>
          </AddGiftCardForm>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({isOpen}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`chevron-icon ${isOpen ? 'rotated' : ''}`}
      style={{
        width: '14px',
        height: '14px',
        transition: 'transform 200ms ease',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   fetcherKey?: string;
 *   children: React.ReactNode;
 * }}
 */
function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardId: string;
 *   children: React.ReactNode;
 * }}
 */
function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="trust-badge-icon"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 1.5h13.5c.621 0 1.125.504 1.125 1.125v7.496c0 .621-.504 1.125-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125v-7.496c0-.621.504-1.125 1.125-1.125Z"
      />
    </svg>
  );
}

function ShippingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="trust-badge-icon"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.304-4.819a2.25 2.25 0 0 0-2.073-2.107l-8.547-.323m-4.5-3L4.5 9h11.25M18 14.25h2.25m-2.25 0V12m0 2.25c0-.621-.504-1.125-1.125-1.125H18m0 0v-2.25m-7.5 12h-1.5v-3h1.5v3Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.966 14.11 1.94 12.007 1.94c-5.437 0-9.863 4.373-9.867 9.8.001 2.128.561 4.204 1.63 6.024L2.66 21.365l3.987-1.457zm11.234-7.234c-.302-.152-1.791-.883-2.073-.984-.282-.102-.489-.153-.69.152-.202.305-.783.984-.961 1.187-.178.203-.356.229-.658.077-1.282-.64-2.122-1.08-2.964-2.524-.222-.38-.222-.656-.071-.806.136-.135.302-.354.453-.531.152-.177.202-.303.303-.505.101-.202.05-.38-.025-.531-.076-.152-.69-1.662-.947-2.278-.25-.601-.524-.52-.719-.53-.186-.01-.399-.011-.612-.011-.213 0-.558.08-.85.399-.292.318-1.116 1.092-1.116 2.662 0 1.57 1.144 3.088 1.303 3.3.158.213 2.253 3.441 5.459 4.824.762.329 1.357.525 1.821.673.765.243 1.462.209 2.011.127.613-.092 1.791-.733 2.043-1.442.252-.709.252-1.316.177-1.442-.075-.127-.282-.203-.585-.355z" />
    </svg>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
