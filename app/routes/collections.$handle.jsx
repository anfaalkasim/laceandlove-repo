import {redirect, useLoaderData, Link} from 'react-router';
import {useState} from 'react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Lace & Love | ${data?.collection.title ?? 'Shop'} Collection`}];
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!handle) {
    throw redirect('/collections/all');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();
  const [gridCols, setGridCols] = useState(3);
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    { title: 'Bras & Bralettes', count: 42, handle: 'bras' },
    { title: 'Panties & Thongs', count: 38, handle: 'panties' },
    { title: 'Lingerie Sets', count: 24, handle: 'lingerie-sets' },
    { title: 'Sleepwear & Slips', count: 18, handle: 'sleepwear' },
    { title: 'Shapewear', count: 12, handle: 'shapewear' },
  ];

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* Full Photo Breadcrumb Banner */}
      <div
        style={{
          position: 'relative',
          backgroundImage: 'url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '4.5rem 2rem',
          borderRadius: '8px',
          marginBottom: '3rem',
          textAlign: 'center',
          color: '#fff',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '0.8rem', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
            <Link to="/" style={{ color: '#fff' }}>HOME</Link> &nbsp;/&nbsp; <Link to="/collections" style={{ color: '#fff' }}>SHOP</Link> &nbsp;/&nbsp; {collection.title}
          </p>
          <h1 style={{ fontSize: '3rem', fontWeight: 400, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{collection.title}</h1>
          {collection.description && (
            <p style={{ color: '#f0f0f0', maxWidth: '600px', margin: '0.75rem auto 0', fontSize: '0.95rem' }}>
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* Main PLP 2-Column Layout (Sidebar + Product Grid) */}
      <div className="glamor-plp-layout">
        {/* Left Sidebar Filters Column */}
        <div className="glamor-sidebar">
          {/* Categories Widget */}
          <div className="glamor-widget">
            <h3 className="glamor-widget-title">Categories</h3>
            <ul className="glamor-cat-list">
              {categories.map((cat, i) => (
                <li key={i}>
                  <Link
                    to={`/collections/${cat.handle}`}
                    className={`glamor-cat-item ${collection.handle === cat.handle ? 'active' : ''}`}
                  >
                    <span>{cat.title}</span>
                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>({cat.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar Promo Photo Card */}
          <div className="glamor-widget" style={{ borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
            <img
              src="/images/product-10.jpg"
              alt="Special Offer"
              style={{ width: '100%', height: '260px', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>SPECIAL EDITION</span>
              <h4 style={{ margin: '4px 0', fontSize: '1.1rem', fontWeight: 400 }}>Lace & Silk Collection</h4>
              <Link to="/collections/bras" className="glamor-btn-white" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', marginTop: '6px', alignSelf: 'flex-start' }}>
                SHOP NOW
              </Link>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="glamor-widget">
            <h3 className="glamor-widget-title">Availability</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#444' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> In Stock
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" /> On Sale
              </label>
            </div>
          </div>

          {/* Filter by Size */}
          <div className="glamor-widget">
            <h3 className="glamor-widget-title">Filter By Size</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                <button
                  key={size}
                  style={{
                    padding: '0.4rem 0.8rem',
                    border: '1px solid #ddd',
                    background: '#fff',
                    borderRadius: '3px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Products Grid & Top Bar */}
        <div>
          {/* Top Bar (Sort & Column Switcher) */}
          <div
            style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              paddingBottom: '1.25rem',
              marginBottom: '2rem',
              borderBottom: '1px solid #eee',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              Showing {collection.products.nodes.length} results
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {/* Grid Column Switcher */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setGridCols(2)}
                  style={{
                    padding: '4px 8px',
                    background: gridCols === 2 ? '#121212' : '#eee',
                    color: gridCols === 2 ? '#fff' : '#000',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                >
                  2 Cols
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  style={{
                    padding: '4px 8px',
                    background: gridCols === 3 ? '#121212' : '#eee',
                    color: gridCols === 3 ? '#fff' : '#000',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                >
                  3 Cols
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  background: '#fff',
                }}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="latest">Latest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Paginated Resource Section & Grid */}
          <PaginatedResourceSection
            connection={collection.products}
            resourcesClassName={`grid-cols-${gridCols}`}
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 6 ? 'eager' : 'lazy'}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
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
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        price {
          ...MoneyProductItem
        }
        compareAtPrice {
          ...MoneyProductItem
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;
