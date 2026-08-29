import {Link, useLoaderData} from 'react-router';

const FALLBACK_POLICIES = {
  privacyPolicy: {
    title: 'Privacy Policy',
    body: `
      <p>At <strong>Lace & Love</strong>, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our store.</p>
      <h3>Information We Collect</h3>
      <p>When you visit the site, we collect device details, browser information, IP address, and cookie identifiers. When you place an order, we collect order details, shipping address, billing info, and email address.</p>
      <h3>How We Use Your Data</h3>
      <p>We use your information solely to fulfill orders, process payments, communicate tracking updates, and provide customer support.</p>
    `,
  },
  termsOfService: {
    title: 'Terms of Service',
    body: `
      <p>Welcome to <strong>Lace & Love</strong>. By accessing our website, purchasing items, or utilizing our services, you agree to be bound by these Terms of Service.</p>
      <h3>Products & Ordering</h3>
      <p>All items are subject to availability. We reserve the right to limit quantities or discontinue items at any time.</p>
      <h3>Intellectual Property</h3>
      <p>All photos, logos, branding, and text are the exclusive property of Lace & Love.</p>
    `,
  },
  refundPolicy: {
    title: 'Refund & Exchange Policy',
    body: `
      <p>We want you to love your purchase. If you are not completely satisfied, you may request a return or exchange within 30 days of receipt.</p>
      <h3>Return Conditions</h3>
      <ul>
        <li>Items must be unworn, unwashed, with all original tags attached.</li>
        <li>For hygiene reasons, intimates must have protective liners intact.</li>
        <li>Sale items marked as Final Sale are non-refundable.</li>
      </ul>
    `,
  },
  shippingPolicy: {
    title: 'Shipping & Delivery Policy',
    body: `
      <p>We offer fast, reliable, and discreet shipping worldwide.</p>
      <ul>
        <li><strong>Standard Express (2 - 4 Days):</strong> Free on orders over $75</li>
        <li><strong>Overnight Express:</strong> $15 flat rate</li>
        <li><strong>Discreet Packaging:</strong> Every order arrives in unbranded luxury packaging.</li>
      </ul>
    `,
  },
};

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Lace & Love | ${data?.policy?.title ?? 'Policy'}`}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({params, context}) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(/-([a-z])/g, (_, m1) =>
    m1.toUpperCase(),
  );

  let policy = null;
  try {
    const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
      variables: {
        privacyPolicy: false,
        shippingPolicy: false,
        termsOfService: false,
        refundPolicy: false,
        [policyName]: true,
        language: context.storefront.i18n?.language,
      },
    });
    policy = data?.shop?.[policyName];
  } catch (err) {
    policy = null;
  }

  if (!policy) {
    const fallback = FALLBACK_POLICIES[policyName] || {
      title: params.handle.replace(/-/g, ' ').toUpperCase(),
      body: `<p>Please contact customer support for details regarding our ${params.handle.replace(/-/g, ' ')} policy.</p>`,
    };
    policy = {
      handle: params.handle,
      id: `fallback-policy-${params.handle}`,
      title: fallback.title,
      body: fallback.body,
    };
  }

  return {policy};
}

export default function Policy() {
  /** @type {LoaderReturnData} */
  const {policy} = useLoaderData();

  return (
    <div className="page-container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
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
          <Link to="/">HOME</Link> &nbsp;/&nbsp; POLICIES &nbsp;/&nbsp; {policy.title}
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 400, margin: 0 }}>{policy.title}</h1>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.7, color: '#333' }}>
        <div dangerouslySetInnerHTML={{__html: policy.body}} />
      </div>
    </div>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
`;
