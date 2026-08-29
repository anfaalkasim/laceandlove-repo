import {useState} from 'react';

/**
 * @param {{
 *   descriptionHtml?: string;
 *   product?: any;
 *   braType?: string | null;
 *   pantiesType?: string | null;
 * }}
 */
export function ProductAccordions({descriptionHtml, product, braType, pantiesType}) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const htmlContent = descriptionHtml || product?.descriptionHtml || (product?.description ? `<p>${product.description}</p>` : null) || `
    <p>Handcrafted with ultra-soft stretch lace, delicate underwire support, and plush lining for everyday luxury and timeless elegance.</p>
    <ul>
      <li>Breathable non-scratch European lace</li>
      <li>Adjustable silk-touch shoulder straps</li>
      <li>Reinforced hook and eye closure</li>
      <li>Contoured cups for natural shape and support</li>
    </ul>
  `;

  return (
    <div className="product-accordions" style={{ borderTop: '1px solid #eee', marginTop: '1.5rem' }}>
      {/* 1. Description Accordion */}
      <div style={{ borderBottom: '1px solid #eee' }}>
        <button
          type="button"
          onClick={() => toggleIndex(0)}
          style={{
            width: '100%',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '1rem 0',
            background: 'none',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
          }}
        >
          <span>Description</span>
          <span>{openIndex === 0 ? '−' : '+'}</span>
        </button>
        {openIndex === 0 && (
          <div style={{ paddingBottom: '1rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.7' }}>
            <div dangerouslySetInnerHTML={{__html: htmlContent}} />
          </div>
        )}
      </div>

      {/* 2. Fabric & Material Care */}
      <div style={{ borderBottom: '1px solid #eee' }}>
        <button
          type="button"
          onClick={() => toggleIndex(1)}
          style={{
            width: '100%',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '1rem 0',
            background: 'none',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
          }}
        >
          <span>Fabric & Care</span>
          <span>{openIndex === 1 ? '−' : '+'}</span>
        </button>
        {openIndex === 1 && (
          <div style={{ paddingBottom: '1rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.7' }}>
            <p><strong>Composition:</strong> 85% Polyamide, 15% Elastane. Lining: 100% Breathable Cotton.</p>
            <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
              <li>Hand wash cold with delicate detergent.</li>
              <li>Do not bleach or tumble dry.</li>
              <li>Lay flat to dry in shade.</li>
            </ul>
          </div>
        )}
      </div>

      {/* 3. Shipping & Returns */}
      <div style={{ borderBottom: '1px solid #eee' }}>
        <button
          type="button"
          onClick={() => toggleIndex(2)}
          style={{
            width: '100%',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '1rem 0',
            background: 'none',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
          }}
        >
          <span>Shipping & Returns</span>
          <span>{openIndex === 2 ? '−' : '+'}</span>
        </button>
        {openIndex === 2 && (
          <div style={{ paddingBottom: '1rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.7' }}>
            <p><strong>Free Express Shipping</strong> on orders over $75.</p>
            <p>All orders are delivered in unbranded, discreet luxury packaging.</p>
            <p>Accepting returns on unworn items with tags within 30 days.</p>
          </div>
        )}
      </div>
    </div>
  );
}
