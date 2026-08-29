import {Suspense} from 'react';
import {Await, Link, NavLink} from 'react-router';
import {useAside} from '~/components/Aside';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {open} = useAside();
  const shopName = header?.shop?.name || 'LACE & LOVE';

  return (
    <header className="glamor-header">
      <div className="glamor-header-inner">
        {/* Navigation Links */}
        <nav className="glamor-nav">
          <NavLink to="/" end className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
            HOME
          </NavLink>
          <NavLink to="/collections" className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
            SHOP
          </NavLink>
          <NavLink to="/collections/bras" className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
            BRAS
          </NavLink>
          <NavLink to="/collections/panties" className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
            PANTIES
          </NavLink>
        </nav>

        {/* Centered Brand Logo */}
        <Link to="/" className="glamor-logo">
          {shopName}
        </Link>

        {/* Header Action Icons */}
        <div className="glamor-header-actions">
          <button className="glamor-icon-btn" onClick={() => open('search')} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <Link to="/account" className="glamor-icon-btn" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          <button className="glamor-icon-btn" onClick={() => open('cart')} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <Suspense fallback={<span className="glamor-cart-count">0</span>}>
              <Await resolve={cart}>
                {(cartData) => (
                  <span className="glamor-cart-count">{cartData?.totalQuantity || 0}</span>
                )}
              </Await>
            </Suspense>
          </button>
        </div>
      </div>
    </header>
  );
}

/**
 * Mobile drawer header menu compatibility
 */
export function HeaderMenu({menu, viewport}) {
  const {close} = useAside();
  return (
    <nav className="mobile-nav" onClick={close}>
      <NavLink to="/" end className="glamor-nav-link">HOME</NavLink>
      <NavLink to="/collections" className="glamor-nav-link">SHOP</NavLink>
      <NavLink to="/collections/bras" className="glamor-nav-link">BRAS</NavLink>
      <NavLink to="/collections/panties" className="glamor-nav-link">PANTIES</NavLink>
    </nav>
  );
}

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {Promise<any>} cart
 */
