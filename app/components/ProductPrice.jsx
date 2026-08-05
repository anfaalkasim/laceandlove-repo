import {Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 * }}
 */
export function ProductPrice({price, compareAtPrice}) {
  let discountPercentage = 0;
  if (compareAtPrice && price) {
    const compareAmount = parseFloat(compareAtPrice.amount);
    const priceAmount = parseFloat(price.amount);
    if (compareAmount > priceAmount) {
      discountPercentage = Math.round(((compareAmount - priceAmount) / compareAmount) * 100);
    }
  }

  return (
    <div className="product-price-section">
      <div className="product-price">
        {compareAtPrice ? (
          <div className="product-price-on-sale">
            {price ? <span><Money data={price} /></span> : null}
            <s>
              <Money data={compareAtPrice} />
            </s>
            {discountPercentage > 0 && (
              <span className="discount-badge">{discountPercentage}% OFF</span>
            )}
          </div>
        ) : price ? (
          <Money data={price} />
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
