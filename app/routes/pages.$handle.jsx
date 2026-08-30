import {useLoaderData, Link} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

// Fallback content & local imagery for pages if not present in Shopify Storefront API
const FALLBACK_PAGES = {
  about: {
    title: 'About Lace & Love',
    body: `
      <div class="glamor-page-section">
        <div style="margin-bottom: 2.5rem; overflow: hidden; border-radius: 8px;">
          <img src="/images/hero-bg.jpg" alt="Lace & Love Brand Banner" style="width: 100%; height: 350px; object-fit: cover;" />
        </div>
        <h2>Crafting Elegance & Intimacy</h2>
        <p>Welcome to <strong>Lace & Love</strong>, your destination for luxury lingerie, delicate lace, and comfortable everyday intimates. Inspired by timeless European elegance and modern design, we curate pieces that celebrate confidence, comfort, and sensual grace.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2.5rem 0;">
          <img src="/images/product-11.jpg" alt="Atelier Craftsmanship 1" style="width: 100%; height: 380px; object-fit: cover; border-radius: 6px;" />
          <img src="/images/product-12.jpg" alt="Atelier Craftsmanship 2" style="width: 100%; height: 380px; object-fit: cover; border-radius: 6px;" />
        </div>
        <p>Every piece in our collection is crafted with premium soft-touch lace, silk blends, and breathable fabrics designed to feel like a second skin.</p>
        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
          <a href="/collections" class="glamor-btn-primary">EXPLORE OUR COLLECTIONS</a>
          <a href="/pages/contact" class="glamor-btn-outline">CONTACT US</a>
        </div>
      </div>
    `,
  },
  contact: {
    title: 'Contact Us',
    body: `
      <div class="glamor-page-section">
        <div style="margin-bottom: 2rem; overflow: hidden; border-radius: 8px;">
          <img src="/images/product-09.jpg" alt="Contact Atelier Studio" style="width: 100%; height: 280px; object-fit: cover;" />
        </div>
        <p>We are here to assist you with sizing, custom orders, order updates, and inquiries.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
          <div style="background: #FAF9F6; padding: 2rem; border-radius: 8px;">
            <h3 style="margin-top: 0;">Customer Care</h3>
            <p><strong>Email:</strong> support@laceandlove.com</p>
            <p><strong>Phone / WhatsApp:</strong> +91 6238171416</p>
            <p><strong>Hours:</strong> Mon - Sat: 9:00 AM - 7:00 PM EST</p>
          </div>
          <div style="background: #FAF9F6; padding: 2rem; border-radius: 8px;">
            <h3 style="margin-top: 0;">Visit Our Studio</h3>
            <p>Lace & Love Boutique Atelier</p>
            <p>124 Fashion Boulevard, Suite 400</p>
            <p>New York, NY 10001</p>
          </div>
        </div>
      </div>
    `,
  },
  faq: {
    title: 'Frequently Asked Questions',
    body: `
      <div class="glamor-page-section">
        <div style="margin-bottom: 1.5rem;">
          <h4>Q: How do I choose the correct bra size?</h4>
          <p>We recommend checking our <a href="/pages/size-guide" style="text-decoration: underline;">Size Guide</a> for step-by-step measurement instructions.</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h4>Q: What is your return policy?</h4>
          <p>We accept returns on unworn items with tags attached within 30 days of purchase. Intimates must have hygiene liners intact.</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h4>Q: How long does shipping take?</h4>
          <p>Standard express shipping takes 2 to 4 business days. International shipping takes 5 to 7 business days.</p>
        </div>
      </div>
    `,
  },
  'size-guide': {
    title: 'Size Guide & Measurement Chart',
    body: `
      <div class="glamor-page-section">
        <p>Find your perfect fit with our comprehensive sizing chart.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 1.5rem;">
          <thead>
            <tr style="background: #121212; color: #fff; text-align: left;">
              <th style="padding: 10px;">Size</th>
              <th style="padding: 10px;">Bust (in)</th>
              <th style="padding: 10px;">Underbust (in)</th>
              <th style="padding: 10px;">Hips (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px;">S</td><td style="padding: 10px;">32 - 34"</td><td style="padding: 10px;">27 - 29"</td><td style="padding: 10px;">35 - 37"</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px;">M</td><td style="padding: 10px;">34 - 36"</td><td style="padding: 10px;">29 - 31"</td><td style="padding: 10px;">37 - 39"</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px;">L</td><td style="padding: 10px;">36 - 38"</td><td style="padding: 10px;">31 - 33"</td><td style="padding: 10px;">39 - 41"</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px;">XL</td><td style="padding: 10px;">38 - 40"</td><td style="padding: 10px;">33 - 35"</td><td style="padding: 10px;">41 - 43"</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
  features: {
    title: 'Brand Features & Quality',
    body: `
      <div class="glamor-page-section">
        <h2>Why Choose Lace & Love?</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
          <div style="background: #FAF9F6; padding: 1.5rem; border-radius: 6px;">
            <img src="/images/product-03.jpg" alt="Lace fabric" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 1rem;" />
            <h4>Soft-Touch Lace</h4>
            <p>Non-scratch ultra-soft lace engineered for sensitive skin comfort.</p>
          </div>
          <div style="background: #FAF9F6; padding: 1.5rem; border-radius: 6px;">
            <img src="/images/product-10.jpg" alt="Seamless construction" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 1rem;" />
            <h4>Seamless Precision</h4>
            <p>Laser-cut edges that stay invisible under any outfit.</p>
          </div>
          <div style="background: #FAF9F6; padding: 1.5rem; border-radius: 6px;">
            <img src="/images/product-15.jpg" alt="Inclusive fit" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 1rem;" />
            <h4>Inclusive Sizing</h4>
            <p>Designed to support and flatter every silhouette from XS to 2XL.</p>
          </div>
        </div>
      </div>
    `,
  },
};

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Lace & Love | ${data?.page?.title ?? 'Info Page'}`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}) {
  const handle = params.handle;
  if (!handle) {
    throw new Error('Missing page handle');
  }

  let page = null;
  try {
    const res = await context.storefront.query(PAGE_QUERY, {
      variables: { handle },
    });
    page = res?.page;
  } catch {
    page = null;
  }

  if (!page) {
    const fallback = FALLBACK_PAGES[handle] || FALLBACK_PAGES[handle === 'about-us' ? 'about' : ''] || {
      title: handle.replace(/-/g, ' ').toUpperCase(),
      body: `
        <div class="glamor-page-section">
          <div style="margin-bottom: 2rem; overflow: hidden; border-radius: 8px;">
            <img src="/images/product-12.jpg" alt="Collection Banner" style="width: 100%; height: 280px; object-fit: cover;" />
          </div>
          <p>Welcome to the <strong>${handle.replace(/-/g, ' ')}</strong> page.</p>
          <p>Explore our curated collections or contact customer support for further assistance.</p>
          <div style="margin-top: 2rem;">
            <a href="/collections" class="glamor-btn-primary">EXPLORE SHOP</a>
          </div>
        </div>
      `,
    };
    page = {
      handle,
      id: `fallback-${handle}`,
      title: fallback.title,
      body: fallback.body,
    };
  }

  redirectIfHandleIsLocalized(request, {handle, data: page});

  return {
    page,
  };
}

function loadDeferredData() {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();

  return (
    <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
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
          <Link to="/">HOME</Link> &nbsp;/&nbsp; PAGE &nbsp;/&nbsp; {page.title}
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 400, margin: 0 }}>{page.title}</h1>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.7, color: '#333' }}>
        <div dangerouslySetInnerHTML={{__html: page.body}} />
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
