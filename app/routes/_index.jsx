import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Lace & Love | Premium Lingerie & Innerwear'}];
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
 * Load data necessary for rendering content above the fold.
 */
async function loadCriticalData({context}) {
  const [collectionsData] = await Promise.all([
    context.storefront.query(HOMEPAGE_COLLECTIONS_QUERY),
  ]);

  return {
    heroImage: collectionsData.shop?.brand?.coverImage?.image || null,
    brasCollection: collectionsData.bras,
    pantiesCollection: collectionsData.panties,
    collections: collectionsData.collections?.nodes || [],
  };
}

/**
 * Load data for rendering content below the fold.
 */
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

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const heroImage = data.heroImage;

  // Combine specific collections and filter duplicates from the general list
  const mainCollections = [];
  if (data.brasCollection) mainCollections.push(data.brasCollection);
  if (data.pantiesCollection) mainCollections.push(data.pantiesCollection);

  // Add other collections from the general list that aren't bras or panties
  data.collections.forEach((col) => {
    if (col.handle !== 'bras' && col.handle !== 'panties') {
      mainCollections.push(col);
    }
  });

  return (
    <div className="home-container">
      {/* Hero Banner Section (Customizable via Shopify settings > Brand cover image) */}
      {heroImage ? (
        <div className="hero-banner-wrapper">
          <Link to="/collections" className="hero-banner-link-card">
            <div
              className="hero-banner-image-only"
              style={{
                backgroundImage: `url(${heroImage.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                aspectRatio: '16 / 7',
                width: '100%',
              }}
            />
          </Link>
          <div className="hero-banner-cta-under">
            <Link className="hero-btn" to="/collections">
              Explore All Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="hero-banner">
          <div className="hero-content">
            <h1>Lace & Love</h1>
            <p>Discover our range of premium bras, panties, slips, and kids innerwear designed for everyday comfort and elegance.</p>
            <Link className="hero-btn" to="/collections">
              Explore All Collections
            </Link>
          </div>
        </div>
      )}

      {/* Categories Grid Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: '1200px', margin: '3rem auto 1.5rem', padding: '0 1rem' }}>
        <h2 style={{ margin: 0, fontWeight: 300, fontSize: '1.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Shop by Category</h2>
        <Link to="/collections" style={{ textDecoration: 'underline', color: 'var(--color-dark)', fontSize: '0.9rem', fontWeight: 600 }}>
          View All Categories &rarr;
        </Link>
      </div>
      <div className="category-grid">
        {mainCollections.map((collection) => {
          const image = collection.image;
          return (
            <Link
              key={collection.id}
              className="category-card"
              to={`/collections/${collection.handle}`}
            >
              {image ? (
                <Image
                  data={image}
                  aspectRatio="4/5"
                  sizes="(min-width: 45em) 33vw, 100vw"
                  className="category-card-image"
                />
              ) : (
                <div className="category-card-image" style={{ background: 'linear-gradient(135deg, #2A1B54 0%, #120A2B 100%)', height: '100%' }} />
              )}
              <div className="category-card-overlay">
                <h3 className="category-card-title">{collection.title}</h3>
                <span className="category-card-link">Explore Collection &rarr;</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recommended Products Section */}
      <div className="recommended-products">
        <h2 className="homepage-section-title">Recommended Products</h2>
        <Suspense fallback={<div>Loading recommended products...</div>}>
          <Await resolve={data.recommendedProducts}>
            {(response) => {
              const recommendedProductsList =
                response?.collection?.products?.nodes ||
                response?.fallbackProducts?.nodes ||
                [];
              return (
                <div className="recommended-products-grid">
                  {recommendedProductsList.length > 0 ? (
                    recommendedProductsList.map((product) => (
                      <ProductItem key={product.id} product={product} />
                    ))
                  ) : (
                    <p>No products found.</p>
                  )}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

const COLLECTION_FRAGMENT = `#graphql
  fragment HomepageCollection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
`;

const HOMEPAGE_COLLECTIONS_QUERY = `#graphql
  ${COLLECTION_FRAGMENT}
  query HomepageCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      brand {
        coverImage {
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    bras: collection(handle: "bras") {
      ...HomepageCollection
    }
    panties: collection(handle: "panties") {
      ...HomepageCollection
    }
    collections(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...HomepageCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
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
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "recommended-products") {
      products(first: 8) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
    fallbackProducts: products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').HomepageCollectionFragment} HomepageCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
