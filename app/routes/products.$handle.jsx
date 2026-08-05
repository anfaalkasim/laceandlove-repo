import {useLoaderData} from 'react-router';
import {useState, useRef} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {ProductAccordions} from '~/components/ProductAccordions';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const sizeGuideRef = useRef(null);

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  // Helper to extract a human-readable name from a metafield (handles plain text & metaobject references)
  const getMetafieldDisplayValue = (metafield) => {
    if (!metafield) return null;
    if (metafield.reference?.fields) {
      const nameField = metafield.reference.fields.find(
        (f) => f.key === 'name' || f.key === 'title' || f.key === 'label',
      );
      if (nameField) return nameField.value;
      const firstValuedField = metafield.reference.fields.find((f) => f.value);
      if (firstValuedField) return firstValuedField.value;
      return metafield.reference.handle;
    }
    return metafield.value;
  };

  const braTypeValue = getMetafieldDisplayValue(product.bra_type);
  const pantiesTypeValue = getMetafieldDisplayValue(product.panties_type);

  return (
    <div className="product">
      <ProductImage selectedImage={selectedVariant?.image} images={product.images?.nodes} />
      <div className="product-main">
        {product.vendor && <div className="product-vendor">{product.vendor}</div>}
        <h1>{title}</h1>
        
        <div className="product-status-row">
          <span className={`status-pulse-dot ${!selectedVariant?.availableForSale ? 'low-stock' : ''}`} />
          <span>
            {selectedVariant?.availableForSale 
              ? 'In stock - ready to dispatch' 
              : 'Currently out of stock'}
          </span>
        </div>

        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />
        
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />
        
        <ProductAccordions
          descriptionHtml={descriptionHtml}
          braType={braTypeValue}
          pantiesType={pantiesTypeValue}
        />
      </div>

      {/* Sizing Guide Backdrop Modal */}
      <div 
        className={`modal-backdrop ${isSizeGuideOpen ? 'open' : ''}`} 
        onClick={(e) => {
          if (sizeGuideRef.current && !sizeGuideRef.current.contains(e.target)) {
            setIsSizeGuideOpen(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsSizeGuideOpen(false);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close size guide"
      >
        <div 
          ref={sizeGuideRef}
          className="modal-window" 
        >
          <div className="modal-header">
            <h3>Size Guide</h3>
            <button type="button" className="modal-close-btn" onClick={() => setIsSizeGuideOpen(false)}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>Use the chart below to find your perfect fit. If you are between sizes, we recommend choosing the larger size.</p>
            
            <h4>Bust & Underband (Bras)</h4>
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Underband (in)</th>
                  <th>Bust (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>XS (30A-30B)</td>
                  <td>26 - 28</td>
                  <td>30 - 32</td>
                </tr>
                <tr>
                  <td>S (32A-32C)</td>
                  <td>28 - 30</td>
                  <td>32 - 34</td>
                </tr>
                <tr>
                  <td>M (34A-34C)</td>
                  <td>30 - 32</td>
                  <td>34 - 36</td>
                </tr>
                <tr>
                  <td>L (36A-36D)</td>
                  <td>32 - 34</td>
                  <td>36 - 39</td>
                </tr>
                <tr>
                  <td>XL (38B-38DD)</td>
                  <td>34 - 36</td>
                  <td>39 - 42</td>
                </tr>
              </tbody>
            </table>

            <h4>Waist & Hips (Panties & Sets)</h4>
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Waist (in)</th>
                  <th>Hips (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>XS</td>
                  <td>24 - 25</td>
                  <td>34 - 35</td>
                </tr>
                <tr>
                  <td>S</td>
                  <td>26 - 27</td>
                  <td>36 - 37</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>28 - 29</td>
                  <td>38 - 39</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>30 - 32</td>
                  <td>40 - 42</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>33 - 35</td>
                  <td>43 - 45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    bra_type: metafield(namespace: "custom", key: "bra_type") {
      value
      reference {
        ... on Metaobject {
          id
          handle
          fields {
            key
            value
          }
        }
      }
    }
    panties_type: metafield(namespace: "custom", key: "panties_type") {
      value
      reference {
        ... on Metaobject {
          id
          handle
          fields {
            key
            value
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
