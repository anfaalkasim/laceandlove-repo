import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from 'react-router';
import {useState} from 'react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  /** @type {LoaderReturnData} */
  const {customer} = useLoaderData();

  const email = customer?.emailAddress?.emailAddress || customer?.email || '';
  const heading = customer
    ? customer.firstName
      ? `Welcome back, ${customer.firstName}`
      : `Welcome back to your account`
    : 'Account Overview';

  return (
    <div className="account-container">
      <header className="account-header">
        <div className="account-header-content">
          <span className="account-badge">My Account</span>
          <h1 className="account-title">{heading}</h1>
          {email && <p className="account-email">{email}</p>}
        </div>
      </header>

      <div className="account-dashboard-layout">
        <aside className="account-sidebar">
          <AccountMenu />
        </aside>
        <main className="account-content-outlet">
          <Outlet context={{customer}} />
        </main>
      </div>
    </div>
  );
}

function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getActiveTabLabel = () => {
    if (location.pathname.includes('/account/orders')) return 'Orders History';
    if (location.pathname.includes('/account/profile')) return 'Personal Profile';
    if (location.pathname.includes('/account/addresses')) return 'Saved Addresses';
    return 'Navigation Menu';
  };

  return (
    <div className="account-menu-wrapper">
      {/* Mobile Trigger Button */}
      <button
        type="button"
        className="account-menu-mobile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="hamburger-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </span>
        <span className="trigger-label">{getActiveTabLabel()}</span>
        <span className="chevron-icon">{isOpen ? '▲' : '▼'}</span>
      </button>

      <nav className={`account-tabs-nav ${isOpen ? 'open' : ''}`} role="navigation">
        <div className="account-nav-group">
          <div className="account-nav-label">Main Menu</div>
          <NavLink
            to="/account/profile"
            onClick={() => setIsOpen(false)}
            className={({isActive}) => `account-tab-link${isActive ? ' active' : ''}`}
          >
            <svg className="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/account/orders"
            onClick={() => setIsOpen(false)}
            className={({isActive}) => `account-tab-link${isActive ? ' active' : ''}`}
          >
            <svg className="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Orders</span>
          </NavLink>
          <NavLink
            to="/account/addresses"
            onClick={() => setIsOpen(false)}
            className={({isActive}) => `account-tab-link${isActive ? ' active' : ''}`}
          >
            <svg className="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Addresses</span>
          </NavLink>
        </div>
        <div className="account-nav-group account-nav-footer">
          <Logout onClick={() => setIsOpen(false)} />
        </div>
      </nav>
    </div>
  );
}

function Logout({onClick}) {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      <button
        type="submit"
        onClick={onClick}
        className="account-tab-link logout-btn"
      >
        <svg className="tab-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Sign Out</span>
      </button>
    </Form>
  );
}

/** @typedef {import('./+types/account').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
