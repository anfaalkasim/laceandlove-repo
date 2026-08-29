import {useLoaderData, Link, Await} from 'react-router';
import {useState, Suspense} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {ProductAccordions} from '~/components/ProductAccordions';
import {ProductItem} from '~/components/ProductItem';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

// Fallback local image paths if a Shopify product has no uploaded images
const PDP_FALLBACK_IMAGES = [
  '/images/product-12.jpg',
  '/images/product-12-hover.jpg',
  '/images/product-09.jpg',
  '/images/product-10.jpg',
];

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `Lace & Love | ${data?.product?.title ?? 'Product'}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product?.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

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
  ]);

  if (!product?.id) {
    throw new Response(`Product ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, recommendedProducts} = useLoaderData();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const rawImages = product.images?.nodes || [];
  const galleryImages = rawImages.length > 0 ? rawImages.map(img => img.url) : PDP_FALLBACK_IMAGES;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentImageUrl = galleryImages[selectedImageIndex] || galleryImages[0];

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* PDP Breadcrumb Banner */}
      <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2rem', textTransform: 'uppercase' }}>
        <Link to="/">HOME</Link> &nbsp;/&nbsp; <Link to="/collections">SHOP</Link> &nbsp;/&nbsp; {product.title}
      </div>

      {/* Main PDP Grid (Layout 04) */}
      <div className="glamor-pdp-container">
        {/* Left Side Gallery (Vertical Thumbnails + Main Image) */}
        <div className="glamor-pdp-gallery">
          <div className="glamor-pdp-thumbs">
            {galleryImages.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`${product.title} view ${index + 1}`}
                className={`glamor-thumb ${selectedImageIndex === index ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <img
              src={currentImageUrl}
              alt={product.title}
              className="glamor-pdp-main-img"
            />
          </div>
        </div>

        {/* Right Side Product Info Panel */}
        <div className="glamor-pdp-details">
          <p className="glamor-pdp-brand">{product.vendor || 'LACE & LOVE LUXURY'}</p>
          <h1 className="glamor-pdp-title">{product.title}</h1>

          {/* Price Display */}
          <div className="glamor-pdp-price">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          {/* Stock Indicator Bar */}
          <div
            style={{
              background: '#FAF9F6',
              padding: '0.75rem 1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                {selectedVariant?.availableForSale ? '🔥 HURRY! ONLY A FEW LEFT IN STOCK' : 'OUT OF STOCK'}
              </span>
              <span style={{ color: '#666' }}>{selectedVariant?.availableForSale ? '85% Sold' : '0% Available'}</span>
            </div>
            <div style={{ height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: selectedVariant?.availableForSale ? '85%' : '0%', height: '100%', background: 'var(--color-accent)' }} />
            </div>
          </div>

          {/* Integrated Product Form with Swatches, Quantity & Buttons */}
          <ProductForm
            productOptions={product.options}
            selectedVariant={selectedVariant}
            product={product}
          />

          <div style={{ marginTop: '2rem' }}>
            <ProductAccordions product={product} />
          </div>
        </div>
      </div>

      {/* Recommended / You May Also Like Section (Queried Live from Storefront) */}
      <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid #eee' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
            RECOMMENDED FOR YOU
          </p>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 400, margin: 0 }}>You May Also Like</h2>
        </div>

        <Suspense fallback={<div>Loading recommendations...</div>}>
          <Await resolve={recommendedProducts}>
            {(response) => (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                {(response?.products?.nodes || []).slice(0, 4).map((recommendedProd) => (
                  <ProductItem key={recommendedProd.id} product={recommendedProd} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </section>

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
    id
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
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
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
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

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProductsPDP {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          id
          url
          altText
          width
          height
        }
        images(first: 2) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;
