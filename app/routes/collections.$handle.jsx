import {redirect, useLoaderData, Link} from 'react-router';
import {useState, useMemo} from 'react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';

// High-resolution local demo product dataset
const CSV_DEMO_PRODUCTS = [
  {
    id: 'gid://shopify/Product/1001',
    title: 'Delicate Lace Underwire Bra',
    handle: 'delicate-lace-underwire-bra',
    vendor: 'Lace & Love',
    featuredImage: {
      id: 'img-lace-bra',
      url: '/images/product-09.jpg',
      altText: 'Delicate Lace Underwire Bra',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        { id: 'img-bra-1', url: '/images/product-09.jpg', altText: 'Lace Bra' },
        { id: 'img-bra-2', url: '/images/product-09-hover.jpg', altText: 'Lace Bra Hover' },
      ],
    },
    priceRange: {
      minVariantPrice: { amount: '48.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '48.00', currencyCode: 'USD' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '65.00', currencyCode: 'USD' },
    },
    variants: {
      nodes: [
        { id: 'v-bra-s', title: 'Small / Black Silk', availableForSale: true, price: { amount: '48.00', currencyCode: 'USD' }, compareAtPrice: { amount: '65.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'S' }, { name: 'Color', value: 'Black Silk' }] },
        { id: 'v-bra-m', title: 'Medium / Black Silk', availableForSale: true, price: { amount: '48.00', currencyCode: 'USD' }, compareAtPrice: { amount: '65.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'M' }, { name: 'Color', value: 'Black Silk' }] },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/1002',
    title: 'Sports Comfort Seamless Bra',
    handle: 'sports-comfort-seamless-bra',
    vendor: 'Lace & Love',
    featuredImage: {
      id: 'img-sports-bra',
      url: '/images/product-10.jpg',
      altText: 'Sports Comfort Seamless Bra',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        { id: 'img-sports-1', url: '/images/product-10.jpg', altText: 'Sports Bra' },
        { id: 'img-sports-2', url: '/images/product-10-hover.jpg', altText: 'Sports Bra Hover' },
      ],
    },
    priceRange: {
      minVariantPrice: { amount: '38.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '38.00', currencyCode: 'USD' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '50.00', currencyCode: 'USD' },
    },
    variants: {
      nodes: [
        { id: 'v-sports-s', title: 'Small / Rose Pink', availableForSale: true, price: { amount: '38.00', currencyCode: 'USD' }, compareAtPrice: { amount: '50.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
        { id: 'v-sports-m', title: 'Medium / Rose Pink', availableForSale: true, price: { amount: '38.00', currencyCode: 'USD' }, compareAtPrice: { amount: '50.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'M' }] },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/1003',
    title: 'Silk Camisole Bralette',
    handle: 'silk-camisole-bralette',
    vendor: 'Lace & Love',
    featuredImage: {
      id: 'img-cami-bra',
      url: '/images/product-11.jpg',
      altText: 'Silk Camisole Bralette',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        { id: 'img-cami-1', url: '/images/product-11.jpg', altText: 'Camisole Bralette' },
        { id: 'img-cami-2', url: '/images/product-11-hover.jpg', altText: 'Camisole Hover' },
      ],
    },
    priceRange: {
      minVariantPrice: { amount: '42.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '42.00', currencyCode: 'USD' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '55.00', currencyCode: 'USD' },
    },
    variants: {
      nodes: [
        { id: 'v-cami-s', title: 'Small / Cream Nude', availableForSale: true, price: { amount: '42.00', currencyCode: 'USD' }, compareAtPrice: { amount: '55.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/1004',
    title: 'Bikini Cotton Stretch Panties',
    handle: 'bikini-cotton-stretch-panties',
    vendor: 'Lace & Love',
    featuredImage: {
      id: 'img-bikini-pnt',
      url: '/images/product-03.jpg',
      altText: 'Bikini Cotton Stretch Panties',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        { id: 'img-pnt-1', url: '/images/product-03.jpg', altText: 'Bikini Panties' },
        { id: 'img-pnt-2', url: '/images/product-09-hover.jpg', altText: 'Bikini Panties Hover' },
      ],
    },
    priceRange: {
      minVariantPrice: { amount: '18.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '18.00', currencyCode: 'USD' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '24.00', currencyCode: 'USD' },
    },
    variants: {
      nodes: [
        { id: 'v-bikini-s', title: 'Small / Black', availableForSale: true, price: { amount: '18.00', currencyCode: 'USD' }, compareAtPrice: { amount: '24.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/1005',
    title: 'Hipster Lace Accent Brief',
    handle: 'hipster-lace-accent-brief',
    vendor: 'Lace & Love',
    featuredImage: {
      id: 'img-hipster-pnt',
      url: '/images/product-15.jpg',
      altText: 'Hipster Lace Accent Brief',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        { id: 'img-hip-1', url: '/images/product-15.jpg', altText: 'Hipster Brief' },
        { id: 'img-hip-2', url: '/images/product-15-hover.jpg', altText: 'Hipster Hover' },
      ],
    },
    priceRange: {
      minVariantPrice: { amount: '22.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '22.00', currencyCode: 'USD' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '28.00', currencyCode: 'USD' },
    },
    variants: {
      nodes: [
        { id: 'v-hip-s', title: 'Small / Rose Pink', availableForSale: true, price: { amount: '22.00', currencyCode: 'USD' }, compareAtPrice: { amount: '28.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/1006',
    title: 'Contour High Waist Brief',
    handle: 'contour-high-waist-brief',
    vendor: 'Lace & Love',
    featuredImage: {
      id: 'img-shapewear',
      url: '/images/product-12.jpg',
      altText: 'Contour High Waist Brief',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        { id: 'img-shp-1', url: '/images/product-12.jpg', altText: 'High Waist Brief' },
        { id: 'img-shp-2', url: '/images/product-12-hover.jpg', altText: 'High Waist Brief Hover' },
      ],
    },
    priceRange: {
      minVariantPrice: { amount: '42.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '42.00', currencyCode: 'USD' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '55.00', currencyCode: 'USD' },
    },
    variants: {
      nodes: [
        { id: 'v-shp-m', title: 'Medium / Black', availableForSale: true, price: { amount: '42.00', currencyCode: 'USD' }, compareAtPrice: { amount: '55.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'M' }] },
      ],
    },
  },
];

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Lace & Love | ${data?.collection?.title ?? 'Shop'} Collection`}];
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
    pageBy: 24,
  });

  if (!handle) {
    throw redirect('/collections/all');
  }

  let collection = null;
  let collectionsData = null;

  try {
    const res = await Promise.all([
      storefront.query(COLLECTION_QUERY, {
        variables: {handle, ...paginationVariables},
      }),
      storefront.query(ALL_COLLECTIONS_QUERY),
    ]);
    collection = res[0]?.collection;
    collectionsData = res[1];
  } catch {
    collection = null;
  }

  // Resilient fallback collection structure if Shopify collection returns null or empty
  if (!collection) {
    collection = {
      id: `col-${handle}`,
      handle,
      title: handle.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: 'Explore our curated luxury collection with interactive sorting and filtering.',
      products: {
        nodes: CSV_DEMO_PRODUCTS,
      },
    };
  } else if (!collection.products?.nodes?.length) {
    collection.products = {
      nodes: CSV_DEMO_PRODUCTS,
    };
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    allCollections: collectionsData?.collections?.nodes || [],
  };
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection, allCollections} = useLoaderData();
  const [gridCols, setGridCols] = useState(3);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  const rawProducts = collection?.products?.nodes || [];

  const defaultCategoryList = [
    { title: 'Bras & Bralettes', handle: 'bras' },
    { title: 'Panties & Thongs', handle: 'panties' },
    { title: 'Bikini Collection', handle: 'bikini' },
    { title: 'Hipster Briefs', handle: 'hipster' },
    { title: 'Lingerie Sets', handle: 'lingerie-sets' },
    { title: 'Sleepwear & Slips', handle: 'sleepwear' },
    { title: 'Shapewear', handle: 'shapewear' },
    { title: 'Shop All', handle: 'all' },
  ];

  // Dynamic category list with synchronized real-time item counts
  const categories = useMemo(() => {
    return defaultCategoryList.map((defaultCat) => {
      const liveCol = allCollections.find((c) => c.handle === defaultCat.handle);
      const liveCount = liveCol?.products?.nodes?.length || 0;
      
      // Calculate active display count: if live shopify count is > 0 use it, else use active product grid count
      const activeCount = liveCount > 0 ? liveCount : (collection.handle === defaultCat.handle ? rawProducts.length : 6);

      return {
        title: liveCol?.title || defaultCat.title,
        handle: defaultCat.handle,
        count: activeCount,
      };
    });
  }, [allCollections, collection, rawProducts]);

  // Active Multi-Facet Filtering
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((product) => {
      if (inStockOnly) {
        const hasStock = product.variants?.nodes?.some(v => v.availableForSale !== false);
        if (!hasStock) return false;
      }
      if (onSaleOnly) {
        const isSale = product.compareAtPriceRange?.minVariantPrice?.amount ||
          product.variants?.nodes?.some(v => v.compareAtPrice && parseFloat(v.compareAtPrice.amount) > parseFloat(v.price?.amount || '0'));
        if (!isSale) return false;
      }
      if (selectedSize) {
        const matchesSize = product.variants?.nodes?.some(v =>
          v.selectedOptions?.some(opt => opt.name.toLowerCase() === 'size' && opt.value.toUpperCase() === selectedSize) ||
          v.title?.toUpperCase().includes(selectedSize)
        );
        if (!matchesSize) return false;
      }
      return true;
    });
  }, [rawProducts, inStockOnly, onSaleOnly, selectedSize]);

  // Active Sorting (Price, Alphabetical, Featured)
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => {
        const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
        const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
        return priceA - priceB;
      });
    } else if (sortBy === 'price-high') {
      return list.sort((a, b) => {
        const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
        const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
        return priceB - priceA;
      });
    } else if (sortBy === 'title-asc') {
      return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'title-desc') {
      return list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }
    return list; // 'featured'
  }, [filteredProducts, sortBy]);

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
          {/* Dynamic Categories Widget */}
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

          {/* Interactive Availability Filter */}
          <div className="glamor-widget">
            <h3 className="glamor-widget-title">Availability</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#444' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In Stock Only
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                />
                On Sale Items
              </label>
            </div>
          </div>

          {/* Interactive Size Filter */}
          <div className="glamor-widget">
            <h3 className="glamor-widget-title">Filter By Size</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size || 'all'}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    border: '1px solid #ddd',
                    background: selectedSize === size ? '#121212' : '#fff',
                    color: selectedSize === size ? '#fff' : '#121212',
                    borderRadius: '3px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {size || 'ALL'}
                </button>
              ))}
            </div>
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
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              Showing <strong>{sortedProducts.length}</strong> {sortedProducts.length === 1 ? 'product' : 'products'}
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
                  cursor: 'pointer',
                }}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title-asc">Alphabetical: A - Z</option>
                <option value="title-desc">Alphabetical: Z - A</option>
              </select>
            </div>
          </div>

          {/* Active Product Grid */}
          <div className={`grid-cols-${gridCols}`}>
            {sortedProducts.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 6 ? 'eager' : 'lazy'}
              />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#666' }}>
              <h3>No products match your selected filters.</h3>
              <button
                className="glamor-btn-outline"
                style={{ marginTop: '1rem' }}
                onClick={() => { setInStockOnly(false); setOnSaleOnly(false); setSelectedSize(''); setSortBy('featured'); }}
              >
                RESET ALL FILTERS
              </button>
            </div>
          )}
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
    options {
      name
      values
    }
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
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
          width
          height
        }
        gallery_images: metafield(namespace: "custom", key: "gallery_images") {
          references(first: 5) {
            nodes {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
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

const ALL_COLLECTIONS_QUERY = `#graphql
  query AllCollectionsWithCounts {
    collections(first: 20) {
      nodes {
        id
        title
        handle
        products(first: 250) {
          nodes {
            id
          }
        }
      }
    }
  }
`;
