import {useLoaderData, Link} from 'react-router';
import {useState} from 'react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `Lace & Love | All Products`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);

  return {products};
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();
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
      {/* Breadcrumb Header Banner */}
      <div
        style={{
          background: '#FAF9F6',
          padding: '3rem 2rem',
          borderRadius: '8px',
          marginBottom: '3rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
          <Link to="/">HOME</Link> &nbsp;/&nbsp; SHOP ALL
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 400, margin: 0 }}>All Products</h1>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0.75rem auto 0', fontSize: '0.95rem' }}>
          Explore our complete collection of luxury lingerie, intimate wear, and daily essentials.
        </p>
      </div>

      {/* Main PLP 2-Column Layout */}
      <div className="glamor-plp-layout">
        {/* Left Sidebar Filters Column */}
        <div className="glamor-sidebar">
          {/* Categories Widget */}
          <div className="glamor-widget">
            <h3 className="glamor-widget-title">Categories</h3>
            <ul className="glamor-cat-list">
              {categories.map((cat, i) => (
                <li key={i}>
                  <Link to={`/collections/${cat.handle}`} className="glamor-cat-item">
                    <span>{cat.title}</span>
                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>({cat.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
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
              Showing {products.nodes.length} results
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

          <PaginatedResourceSection
            connection={products}
            resourcesClassName={`grid-cols-${gridCols}`}
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : 'lazy'}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </div>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
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
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        price {
          ...MoneyCollectionItem
        }
        compareAtPrice {
          ...MoneyCollectionItem
        }
      }
    }
  }
`;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;
