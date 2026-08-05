import {useState} from 'react';

/**
 * @param {{
 *   descriptionHtml: string;
 *   braType?: string | null;
 *   pantiesType?: string | null;
 * }}
 */
export function ProductAccordions({descriptionHtml, braType, pantiesType}) {
  const [openIndex, setOpenIndex] = useState(0); // Default open first one (Description)

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const hasSpecs = braType || pantiesType;

  return (
    <div className="product-accordions">
      {/* 1. Description Accordion */}
      <div className={`accordion-item ${openIndex === 0 ? 'open' : ''}`}>
        <button
          type="button"
          className="accordion-header"
          onClick={() => toggleIndex(0)}
        >
          <span>Description</span>
          <ChevronIcon />
        </button>
        <div className="accordion-content">
          <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        </div>
      </div>

      {/* 2. Details & Specs Accordion (if specs exist) */}
      {hasSpecs && (
        <div className={`accordion-item ${openIndex === 1 ? 'open' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleIndex(1)}
          >
            <span>Details & Specs</span>
            <ChevronIcon />
          </button>
          <div className="accordion-content">
            <table className="specs-table">
              <tbody>
                {braType && (
                  <tr className="specs-row">
                    <td className="specs-label">Bra Style</td>
                    <td className="specs-value">{braType}</td>
                  </tr>
                )}
                {pantiesType && (
                  <tr className="specs-row">
                    <td className="specs-label">Panties Style</td>
                    <td className="specs-value">{pantiesType}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Material & Care Accordion */}
      <div className={`accordion-item ${openIndex === 2 ? 'open' : ''}`}>
        <button
          type="button"
          className="accordion-header"
          onClick={() => toggleIndex(2)}
        >
          <span>Material & Care</span>
          <ChevronIcon />
        </button>
        <div className="accordion-content">
          <p>
            Lace & Love garments are made from selected premium fabrics, fine Italian lace, and delicate silk accents. To preserve their premium quality, we recommend:
          </p>
          <ul>
            <li>Hand wash cold with a mild, delicate detergent.</li>
            <li>Do not bleach, twist, or wring.</li>
            <li>Lay flat to dry in shade. Do not tumble dry.</li>
            <li>Iron on low heat if necessary, protecting delicate lace panels with a pressing cloth.</li>
          </ul>
        </div>
      </div>

      {/* 4. Shipping & Returns Accordion */}
      <div className={`accordion-item ${openIndex === 3 ? 'open' : ''}`}>
        <button
          type="button"
          className="accordion-header"
          onClick={() => toggleIndex(3)}
        >
          <span>Shipping & Returns</span>
          <ChevronIcon />
        </button>
        <div className="accordion-content">
          <p>
            <strong>Complimentary standard shipping</strong> on all orders over $150.
          </p>
          <p>
            Delivery times:
          </p>
          <ul>
            <li>Standard delivery: 3–6 business days.</li>
            <li>Express shipping: 1–3 business days.</li>
          </ul>
          <p>
            We offer complimentary returns and exchanges within 30 days of delivery. Items must be returned in unworn, unwashed condition with all original tags and protective liners attached.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="accordion-chevron"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
