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

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="account-container">
      <header className="account-header">
        <h1>{heading}</h1>
        {customer?.email && <p className="account-email">{customer.email}</p>}
      </header>

      <div className="account-dashboard-layout">
        <AccountMenu />
        <div className="account-content-outlet">
          <Outlet context={{customer}} />
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getActiveTabLabel = () => {
    if (location.pathname.includes('/account/orders')) return 'Orders';
    if (location.pathname.includes('/account/profile')) return 'Profile';
    if (location.pathname.includes('/account/addresses')) return 'Addresses';
    return 'Menu';
  };

  return (
    <div className="account-menu-wrapper">
      {/* Mobile Hamburger Trigger */}
      <button
        type="button"
        className="account-menu-mobile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="hamburger-icon">☰</span>
        <span className="trigger-label">{getActiveTabLabel()}</span>
        <span className="chevron-icon">{isOpen ? '▲' : '▼'}</span>
      </button>

      <nav className={`account-tabs-nav ${isOpen ? 'open' : ''}`} role="navigation">
        <NavLink
          to="/account/profile"
          onClick={() => setIsOpen(false)}
          className={({isActive}) => `account-tab-link${isActive ? ' active' : ''}`}
        >
          Profile
        </NavLink>
        <NavLink
          to="/account/orders"
          onClick={() => setIsOpen(false)}
          className={({isActive}) => `account-tab-link${isActive ? ' active' : ''}`}
        >
          Orders
        </NavLink>
        <NavLink
          to="/account/addresses"
          onClick={() => setIsOpen(false)}
          className={({isActive}) => `account-tab-link${isActive ? ' active' : ''}`}
        >
          Addresses
        </NavLink>
        <Logout onClick={() => setIsOpen(false)} />
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
        Sign out
      </button>
    </Form>
  );
}

/** @typedef {import('./+types/account').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
