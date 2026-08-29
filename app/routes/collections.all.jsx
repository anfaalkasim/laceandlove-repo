import {useLoaderData, Link} from 'react-router';
import {useState, useMemo} from 'react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
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
        { id: 'v-bra-s', title: 'Small / Black Silk', availableForSale: true, price: { amount: '48.00', currencyCode: 'USD' }, compareAtPrice: { amount: '65.00', currencyCode: 'USD' }, selectedOptions: [{ name: 'Size', value: 'S' }] },
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
export const meta = () => {
  return [{title: 'Lace & Love | All Products'}];
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  let products = null;
  try {
    const res = await context.storefront.query(ALL_PRODUCTS_QUERY, {
      variables: paginationVariables,
    });
    products = res?.products;
  } catch (e) {
    products = null;
  }

  if (!products?.nodes?.length) {
    products = {
      nodes: CSV_DEMO_PRODUCTS,
    };
  }

  return {products};
}

function loadDeferredData() {
  return {};
}

export default function AllProducts() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();
  const [gridCols, setGridCols] = useState(3);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  const rawProducts = products?.nodes || [];

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

  // Active Sorting
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
    return list;
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
            <Link to="/" style={{ color: '#fff' }}>HOME</Link> &nbsp;/&nbsp; SHOP ALL
          </p>
          <h1 style={{ fontSize: '3rem', fontWeight: 400, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>All Products</h1>
        </div>
      </div>

      {/* Main PLP 2-Column Layout */}
      <div className="glamor-plp-layout">
        {/* Sidebar Filters */}
        <div className="glamor-sidebar">
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
        </div>

        {/* Product Grid & Top Bar */}
        <div>
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
            id: 'all-products',
            handle: 'all',
          },
        }}
      />
    </div>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
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
        compareAtPriceRange {
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
        variants(first: 10) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;
