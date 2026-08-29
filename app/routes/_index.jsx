import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Lace & Love | Codezeel Glamor Lingerie Store'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

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

  // Circle Category Bubbles with local HD Imagery
  const categoryBubbles = [
    { title: 'Bras', handle: 'bras', img: '/images/product-09.jpg' },
    { title: 'Panties', handle: 'panties', img: '/images/product-03.jpg' },
    { title: 'Sets', handle: 'lingerie-sets', img: '/images/product-10.jpg' },
    { title: 'Sleepwear', handle: 'sleepwear', img: '/images/product-15.jpg' },
    { title: 'Swimwear', handle: 'swimwear', img: '/images/product-11.jpg' },
    { title: 'Shapewear', handle: 'shapewear', img: '/images/product-12.jpg' },
  ];

  // Full 6 Local High-Resolution Category Cards
  const categories = [
    {
      title: 'Bras & Bralettes',
      handle: 'bras',
      img: '/images/product-09.jpg',
      itemCount: '42 Items',
    },
    {
      title: 'Bikini & Panties',
      handle: 'panties',
      img: '/images/product-03.jpg',
      itemCount: '38 Items',
    },
    {
      title: 'Lingerie Sets',
      handle: 'lingerie-sets',
      img: '/images/product-10.jpg',
      itemCount: '24 Items',
    },
    {
      title: 'Sleepwear & Slips',
      handle: 'sleepwear',
      img: '/images/product-15.jpg',
      itemCount: '18 Items',
    },
    {
      title: 'Luxury Swimwear',
      handle: 'swimwear',
      img: '/images/product-11.jpg',
      itemCount: '29 Items',
    },
    {
      title: 'Contours & Shapewear',
      handle: 'shapewear',
      img: '/images/product-12.jpg',
      itemCount: '15 Items',
    },
  ];

  const promoCards = [
    {
      title: 'Luxury Satin Sleepwear',
      subtitle: 'NIGHTTIME ELEGANCE',
      img: '/images/product-15.jpg',
      link: '/collections/sleepwear',
    },
    {
      title: 'Seamless Everyday Basics',
      subtitle: 'INVISIBLE COMFORT',
      img: '/images/product-19.jpg',
      link: '/collections/panties',
    },
  ];

  const instagramImages = [
    '/images/product-09.jpg',
    '/images/product-03.jpg',
    '/images/product-10.jpg',
    '/images/product-11.jpg',
    '/images/product-12.jpg',
    '/images/product-15.jpg',
  ];

  return (
    <div className="glamor-home">
      {/* Main Hero Banner (Layout 01) */}
      <section
        className="glamor-hero"
        style={{
          backgroundImage: `url('/images/hero-bg.jpg')`,
        }}
      >
        <div className="glamor-hero-overlay" />
        <div className="glamor-hero-content">
          <p className="glamor-hero-subtitle">NEW ARRIVALS 2025</p>
          <h1 className="glamor-hero-title">
            Beach Days Ahead, Your Perfect Bikini Awaits You
          </h1>
          <Link to="/collections" className="glamor-btn-white">
            SHOP ALL PRODUCTS
          </Link>
        </div>
      </section>

      {/* Circle Category Bubbles Strip */}
      <div style={{ background: '#FAF9F6', padding: '2rem 0', borderBottom: '1px solid #eee' }}>
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          {categoryBubbles.map((bubble, i) => (
            <Link
              key={i}
              to={`/collections/${bubble.handle}`}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #121212',
                  padding: '2px',
                  background: '#fff',
                }}
              >
                <img
                  src={bubble.img}
                  alt={bubble.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {bubble.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="page-container">
        {/* Shop by Category (6-Card Responsive Grid) */}
        <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
            EXPLORE COLLECTIONS
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 400, margin: 0 }}>Shop By Category</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            marginBottom: '5rem',
          }}
        >
          {categories.map((cat, i) => (
            <Link key={i} to={`/collections/${cat.handle}`} className="glamor-cat-card">
              <img src={cat.img} alt={cat.title} className="glamor-cat-img" />
              <div className="glamor-cat-overlay">
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.9 }}>
                  {cat.itemCount}
                </span>
                <h3 className="glamor-cat-title" style={{ margin: '4px 0 1rem' }}>{cat.title}</h3>
                <span className="glamor-cat-btn">EXPLORE CATEGORY</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Dual Image Brand Mission (Layout 01) */}
        <section className="glamor-brand-story">
          <div className="glamor-dual-images">
            <img
              src="/images/product-11.jpg"
              alt="Brand story back"
              className="glamor-img-back"
            />
            <img
              src="/images/product-12.jpg"
              alt="Brand story front"
              className="glamor-img-front"
            />
          </div>
          <div className="glamor-story-content">
            <p className="glamor-story-subtitle">LUXURY, COMFORT & STYLE</p>
            <h2 className="glamor-story-title">
              Empowering confidence, one lingerie piece at a time.
            </h2>
            <p className="glamor-story-desc">
              Crafted from ultra-soft laces and premium sustainable fabrics. Our innerwear offers seamless contours, uncompromised support, and elegant designs tailored for every silhouette.
            </p>
            <Link to="/collections" className="glamor-btn-primary">
              EXPLORE LINGERIE
            </Link>
          </div>
        </section>

        {/* Fresh Styles Just Landed Section */}
        <section style={{ margin: '5rem 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
              MOST POPULAR
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 400 }}>Fresh Styles Just Landed</h2>
          </div>

          <Suspense fallback={<div>Loading styles...</div>}>
            <Await resolve={data.recommendedProducts}>
              {(response) => (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                  {(response?.products?.nodes || []).slice(0, 4).map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              )}
            </Await>
          </Suspense>
        </section>

        {/* High Impact Full-Width Photo Promo Banner */}
        <section
          style={{
            position: 'relative',
            backgroundImage: `url('/images/hero-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            overflow: 'hidden',
            padding: '5rem 3rem',
            color: '#fff',
            margin: '5rem 0',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '550px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
              LIMITED EDITION SALE
            </span>
            <h2 style={{ fontSize: '3rem', margin: '0.5rem 0 1rem', fontWeight: 400 }}>
              Up to 40% Off Designer Intimates
            </h2>
            <p style={{ color: '#e0e0e0', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6' }}>
              Elevate your lingerie wardrobe with handcrafted delicate lace, satin robes, and push-up bralettes.
            </p>
            <Link to="/collections/bras" className="glamor-btn-white">
              DISCOVER DISCOUNT
            </Link>
          </div>
        </section>

        {/* 2-Card Side-by-Side Promo Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '5rem' }}>
          {promoCards.map((card, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                aspectRatio: '16/9',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <img
                src={card.img}
                alt={card.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.7) 100%)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'flex-end',
                  color: '#fff',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffb3c6' }}>
                  {card.subtitle}
                </span>
                <h3 style={{ fontSize: '1.75rem', margin: '0.3rem 0 1rem', fontWeight: 400 }}>
                  {card.title}
                </h3>
                <Link to={card.link} className="glamor-btn-white" style={{ alignSelf: 'flex-start', padding: '0.6rem 1.4rem', fontSize: '0.75rem' }}>
                  SHOP NOW
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Instagram / Lookbook Photo Grid Section */}
        <section style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
            INSPIRE YOUR LOOK
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 400, marginBottom: '2rem' }}>Follow Us On Instagram</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
            {instagramImages.map((imgUrl, i) => (
              <div key={i} style={{ aspectRatio: '3/4', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={imgUrl}
                  alt={`Lookbook photo ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const HOMEPAGE_COLLECTIONS_QUERY = `#graphql
  query HomepageCollections {
    shop {
      brand {
        coverImage {
          image {
            url
          }
        }
      }
    }
    collections(first: 6) {
      nodes {
        id
        title
        handle
        image {
          url
        }
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
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
