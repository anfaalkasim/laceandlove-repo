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
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}, menuData] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
    storefront.query(COLLECTION_MENU_QUERY, {
      variables: {handle: 'main-menu'},
    }).catch((err) => {
      console.error('Failed to fetch menu in collection loader', err);
      return null;
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  // Dynamically find sibling/sub collections based on the main-menu structure
  let subcategories = [];
  if (menuData?.menu?.items) {
    const currentPath = `/collections/${handle}`;
    
    // Look for parent item matching the current collection handle
    let parentItem = menuData.menu.items.find((item) => {
      if (!item.url) return false;
      const path = new URL(item.url, 'https://placeholder.com').pathname;
      return path === currentPath;
    });

    // If not found directly, look for sibling subcategory menu item structure
    if (!parentItem) {
      parentItem = menuData.menu.items.find((item) => {
        return item.items?.some((child) => {
          if (!child.url) return false;
          const path = new URL(child.url, 'https://placeholder.com').pathname;
          return path === currentPath;
        });
      });
    }

    if (parentItem && parentItem.items?.length > 0) {
      const parentPath = parentItem.url ? new URL(parentItem.url, 'https://placeholder.com').pathname : '';
      subcategories = [
        {
          title: `All ${parentItem.title}`,
          url: parentPath,
          handle: parentPath.split('/').pop(),
        },
        ...parentItem.items.map((sub) => {
          const path = sub.url ? new URL(sub.url, 'https://placeholder.com').pathname : '';
          return {
            title: sub.title,
            url: path,
            handle: path.split('/').pop(),
          };
        }),
      ];
    }
  }

  return {
    collection,
    subcategories,
  };
}

/**
 * Load data for rendering content below the fold.
 */
function loadDeferredData({context}) {
  return {};
}

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

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection, subcategories} = useLoaderData();

  // State hooks for filter modal (supporting multiple selections)
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('subcategory');

  // Extract unique subcategory options (metafields) from products dynamically
  const availableSubcategories = new Set();
  collection.products.nodes.forEach((product) => {
    const braVal = getMetafieldDisplayValue(product.bra_type);
    const pantiesVal = getMetafieldDisplayValue(product.panties_type);
    if (braVal) availableSubcategories.add(braVal);
    if (pantiesVal) availableSubcategories.add(pantiesVal);
  });
  const subcategoryList = Array.from(availableSubcategories).sort();

  // Extract unique size options from variant details dynamically
  const availableSizes = new Set();
  collection.products.nodes.forEach((product) => {
    product.variants?.nodes?.forEach((variant) => {
      variant.selectedOptions?.forEach((opt) => {
        if (opt.name.toLowerCase() === 'size') {
          availableSizes.add(opt.value);
        }
      });
    });
  });
  const sizesList = Array.from(availableSizes).sort();

  // Helper toggle function for multi-select states
  const toggleFilter = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // Filter products client-side based on multi-select parameters (OR logic inside category lists)
  const filteredProducts = collection.products.nodes.filter((product) => {
    // 1. Subcategory filter (matches any of the selected subcategories)
    if (selectedSubcategories.length > 0) {
      const braVal = getMetafieldDisplayValue(product.bra_type);
      const pantiesVal = getMetafieldDisplayValue(product.panties_type);
      const matchesSubcategory =
        selectedSubcategories.includes(braVal) ||
        selectedSubcategories.includes(pantiesVal);
      if (!matchesSubcategory) return false;
    }

    // 2. Sizes filter (matches any of the selected sizes in stock)
    if (selectedSizes.length > 0) {
      const hasSize = product.variants?.nodes?.some(
        (variant) =>
          variant.availableForSale &&
          variant.selectedOptions?.some(
            (opt) =>
              opt.name.toLowerCase() === 'size' &&
              selectedSizes.includes(opt.value),
          ),
      );
      if (!hasSize) return false;
    }

    // 3. Price ranges filter (matches any of the selected ranges)
    if (selectedPriceRanges.length > 0) {
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      const matchesPrice = selectedPriceRanges.some((range) => {
        if (range === 'under-500' && price < 500) return true;
        if (range === '500-1000' && price >= 500 && price <= 1000) return true;
        if (range === 'above-1000' && price > 1000) return true;
        return false;
      });
      if (!matchesPrice) return false;
    }

    return true;
  });

  const hasActiveFilters =
    selectedSubcategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedPriceRanges.length > 0;

  return (
    <div className="collection">
      <h1>{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>

      {/* Filter Control Bar */}
      <div className="filter-bar">
        <button className="filter-trigger-btn" onClick={() => setIsFilterOpen(true)}>
          {/* Settings / Filter Slider Icon SVG */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          FILTER
        </button>

        {/* Multi-select Filter Badges Display */}
        {hasActiveFilters && (
          <div className="active-filters-badges">
            {selectedSubcategories.map((sub) => (
              <span key={sub} className="filter-badge">
                Style: {sub}
                <button type="button" onClick={() => toggleFilter(sub, selectedSubcategories, setSelectedSubcategories)}>&times;</button>
              </span>
            ))}
            {selectedSizes.map((size) => (
              <span key={size} className="filter-badge">
                Size: {size}
                <button type="button" onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}>&times;</button>
              </span>
            ))}
            {selectedPriceRanges.map((range) => (
              <span key={range} className="filter-badge">
                Price: {range === 'under-500' ? 'Under ₹500' : range === '500-1000' ? '₹500 - ₹1000' : 'Over ₹1000'}
                <button type="button" onClick={() => toggleFilter(range, selectedPriceRanges, setSelectedPriceRanges)}>&times;</button>
              </span>
            ))}
            <button
              type="button"
              className="clear-all-filters-btn"
              onClick={() => {
                setSelectedSubcategories([]);
                setSelectedSizes([]);
                setSelectedPriceRanges([]);
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Tabbed Drawer Filter Overlay Modal */}
      {isFilterOpen && (
        <div className="filter-overlay-backdrop" onClick={() => setIsFilterOpen(false)}>
          <div className="filter-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h3>Filters</h3>
              <button
                type="button"
                className="close-filter-btn"
                onClick={() => setIsFilterOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="filter-modal-body">
              {/* Tab sidebar categories */}
              <div className="filter-modal-sidebar">
                {subcategoryList.length > 0 && (
                  <button
                    type="button"
                    className={`filter-sidebar-tab ${activeFilterTab === 'subcategory' ? 'active' : ''}`}
                    onClick={() => setActiveFilterTab('subcategory')}
                  >
                    Subcategories
                  </button>
                )}
                <button
                  type="button"
                  className={`filter-sidebar-tab ${activeFilterTab === 'size' ? 'active' : ''}`}
                  onClick={() => setActiveFilterTab('size')}
                >
                  Size
                </button>
                <button
                  type="button"
                  className={`filter-sidebar-tab ${activeFilterTab === 'price' ? 'active' : ''}`}
                  onClick={() => setActiveFilterTab('price')}
                >
                  Price
                </button>
              </div>

              {/* Specific selection values */}
              <div className="filter-modal-content">
                {activeFilterTab === 'subcategory' && subcategoryList.length > 0 && (
                  <div className="filter-pills-list">
                    {subcategoryList.map((sub) => {
                      const isActive = selectedSubcategories.includes(sub);
                      return (
                        <button
                          type="button"
                          key={sub}
                          className={`filter-pill-btn ${isActive ? 'active' : ''}`}
                          onClick={() => toggleFilter(sub, selectedSubcategories, setSelectedSubcategories)}
                        >
                          {sub}
                          {isActive && <span className="pill-check-indicator">&#10003;</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeFilterTab === 'size' && (
                  <div className="filter-pills-list">
                    {sizesList.length > 0 ? (
                      sizesList.map((size) => {
                        const isActive = selectedSizes.includes(size);
                        return (
                          <button
                            type="button"
                            key={size}
                            className={`filter-pill-btn ${isActive ? 'active' : ''}`}
                            onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                          >
                            {size}
                            {isActive && <span className="pill-check-indicator">&#10003;</span>}
                          </button>
                        );
                      })
                    ) : (
                      <p className="no-filters-msg">No size options found in this collection.</p>
                    )}
                  </div>
                )}

                {activeFilterTab === 'price' && (
                  <div className="filter-pills-list">
                    {[
                      {key: 'under-500', label: 'Under ₹500'},
                      {key: '500-1000', label: '₹500 - ₹1000'},
                      {key: 'above-1000', label: 'Over ₹1000'},
                    ].map((range) => {
                      const isActive = selectedPriceRanges.includes(range.key);
                      return (
                        <button
                          type="button"
                          key={range.key}
                          className={`filter-pill-btn ${isActive ? 'active' : ''}`}
                          onClick={() => toggleFilter(range.key, selectedPriceRanges, setSelectedPriceRanges)}
                        >
                          {range.label}
                          {isActive && <span className="pill-check-indicator">&#10003;</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="filter-modal-footer">
              <button
                type="button"
                className="apply-filters-btn"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters ({filteredProducts.length} Products)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Products Grid rendering based on filtering state */}
      {hasActiveFilters ? (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <p className="no-filters-msg" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem 0' }}>
              No products match the selected filters.
            </p>
          )}
        </div>
      ) : (
        <PaginatedResourceSection
          connection={collection.products}
          resourcesClassName="products-grid"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>
      )}

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
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price {
          ...MoneyProductItem
        }
        selectedOptions {
          name
          value
        }
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

const COLLECTION_MENU_QUERY = `#graphql
  query CollectionMenu($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    menu(handle: $handle) {
      id
      items {
        id
        title
        url
        items {
          id
          title
          url
        }
      }
    }
  }
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
