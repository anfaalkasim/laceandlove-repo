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
          {consolidatedDiscounts.map((discount, index) => {
            return (
              <dl key={index} className="cart-discount-row">
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
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
      
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
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="checkout-actions-row">
      <a href={checkoutUrl} className="checkout-btn" target="_self">
        Continue to Checkout
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

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
