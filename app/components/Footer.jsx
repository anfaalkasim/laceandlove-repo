import {Link} from 'react-router';

// Instagram / Lookbook preview strip local pictures
const FOOTER_LOOKBOOK_IMAGES = [
  '/images/product-09.jpg',
  '/images/product-03.jpg',
  '/images/product-10.jpg',
  '/images/product-11.jpg',
  '/images/product-12.jpg',
  '/images/product-15.jpg',
];

export function Footer() {
  return (
    <footer className="glamor-footer">
      {/* Glamor Lookbook / Instagram Gallery Strip */}
      <div style={{ maxWidth: '1440px', margin: '0 auto 4rem', padding: '0 2rem' }}>
        <h4 style={{ color: '#fff', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center', marginBottom: '1.5rem' }}>
          Follow Us @LaceAndLove #GlamorLookbook
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
          {FOOTER_LOOKBOOK_IMAGES.map((imgUrl, i) => (
            <div key={i} style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '4px', position: 'relative' }}>
              <img
                src={imgUrl}
                alt={`Instagram look ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="glamor-footer-grid">
        <div>
          <h4 className="glamor-footer-title">LACE & LOVE</h4>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#999' }}>
            Empowering confidence with premium lingerie, innerwear, and sleepwear crafted for everyday luxury and timeless comfort.
          </p>
        </div>

        <div>
          <h4 className="glamor-footer-title">SHOP CATEGORIES</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.2', fontSize: '0.9rem' }}>
            <li><Link to="/collections/bras" style={{ color: '#bbb' }}>Luxury Bras</Link></li>
            <li><Link to="/collections/panties" style={{ color: '#bbb' }}>Seamless Panties</Link></li>
            <li><Link to="/collections/lingerie-sets" style={{ color: '#bbb' }}>Lingerie Sets</Link></li>
            <li><Link to="/collections/sleepwear" style={{ color: '#bbb' }}>Sleepwear & Nightgowns</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="glamor-footer-title">HELP & INFO</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2.2', fontSize: '0.9rem' }}>
            <li><Link to="/policies/privacy-policy" style={{ color: '#bbb' }}>Privacy Policy</Link></li>
            <li><Link to="/policies/terms-of-service" style={{ color: '#bbb' }}>Terms of Service</Link></li>
            <li><Link to="/policies/shipping-policy" style={{ color: '#bbb' }}>Shipping & Returns</Link></li>
            <li><Link to="/pages/about" style={{ color: '#bbb' }}>About Our Brand</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="glamor-footer-title">NEWSLETTER</h4>
          <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1rem' }}>
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                background: '#222',
                border: '1px solid #333',
                padding: '0.6rem 1rem',
                color: '#fff',
                borderRadius: '4px',
                flex: 1,
                fontSize: '0.85rem',
              }}
            />
            <button className="glamor-btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem' }}>
              JOIN
            </button>
          </div>
        </div>
      </div>

      <div className="glamor-footer-bottom">
        &copy; {new Date().getFullYear()} Lace & Love. All rights reserved. Codezeel Glamor Theme design.
      </div>
    </footer>
  );
}
