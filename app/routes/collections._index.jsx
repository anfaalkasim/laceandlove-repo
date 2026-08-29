import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

// Local Codezeel Glamor Demo category cover images
const GLAMOR_CAT_IMAGES = [
  '/images/product-09.jpg',
  '/images/product-03.jpg',
  '/images/product-10.jpg',
  '/images/product-11.jpg',
  '/images/product-12.jpg',
  '/images/product-15.jpg',
];

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Lace & Love | All Lingerie & Innerwear Collections'}];
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
    pageBy: 12,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

function loadDeferredData() {
  return {};
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {collections} = useLoaderData();

  return (
    <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* Glamor Header Banner */}
      <div
        style={{
          position: 'relative',
          backgroundImage: 'url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '4.5rem 2rem',
          borderRadius: '8px',
          marginBottom: '3.5rem',
          textAlign: 'center',
          color: '#fff',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '0.8rem', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
            <Link to="/" style={{ color: '#fff' }}>HOME</Link> &nbsp;/&nbsp; COLLECTIONS
          </p>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 400, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Browse All Collections</h1>
          <p style={{ color: '#f0f0f0', maxWidth: '600px', margin: '0.75rem auto 0', fontSize: '0.95rem' }}>
            Discover our full spectrum of luxury bras, thongs, seamless panties, sleepwear, and shapewear.
          </p>
        </div>
      </div>

      {/* 3-Column Category Card Grid */}
      <PaginatedResourceSection
        connection={collections}
        resourcesClassName="glamor-cat-grid"
      >
        {({node: collection, index}) => {
          const fallbackImg = GLAMOR_CAT_IMAGES[index % GLAMOR_CAT_IMAGES.length];
          const imgUrl = collection?.image?.url || fallbackImg;

          return (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              className="glamor-cat-card"
            >
              <img src={imgUrl} alt={collection.title} className="glamor-cat-img" />
              <div className="glamor-cat-overlay">
                <h3 className="glamor-cat-title">{collection.title}</h3>
                <span className="glamor-cat-btn">EXPLORE COLLECTION</span>
              </div>
            </Link>
          );
        }}
      </PaginatedResourceSection>
    </div>
  );
}

const COLLECTION_FRAGMENT = `#graphql
  fragment Collection on Collection {
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

const COLLECTIONS_QUERY = `#graphql
  ${COLLECTION_FRAGMENT}
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
