import {Suspense} from 'react';
import {Await, Link, NavLink} from 'react-router';
import {useAside} from '~/components/Aside';

/**
 * @param {HeaderProps}
 */
export function Header({header, cart}) {
  const {open} = useAside();
  const shopName = header?.shop?.name || 'LACE & LOVE';

  const menuItems = header?.menu?.items || [];
  const hasShopifyMenu = menuItems.length > 0;

  return (
    <header className="glamor-header">
      <div className="glamor-header-inner">
        {/* Navigation Links: Dynamically mapped from Shopify Admin Navigation menu if configured */}
        <nav className="glamor-nav">
          <NavLink to="/" end className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
            HOME
          </NavLink>
          <NavLink to="/collections" className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
            SHOP
          </NavLink>

          {hasShopifyMenu ? (
            menuItems.map((item) => {
              if (!item.url) return null;
              // Parse relative path from Shopify menu URL if applicable
              const url = item.url.includes('myshopify.com') || item.url.startsWith('http')
                ? new URL(item.url).pathname
                : item.url;

              if (url === '/' || url === '/collections') return null;

              return (
                <NavLink
                  key={item.id}
                  to={url}
                  className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}
                >
                  {item.title.toUpperCase()}
                </NavLink>
              );
            })
          ) : (
            <>
              <NavLink to="/collections/bras" className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
                BRAS
              </NavLink>
              <NavLink to="/collections/panties" className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
                PANTIES
              </NavLink>
              <NavLink to="/collections/bikini" className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
                BIKINI
              </NavLink>
              <NavLink to="/collections/hipster" className={({isActive}) => isActive ? 'glamor-nav-link active' : 'glamor-nav-link'}>
                HIPSTER
              </NavLink>
            </>
          )}
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

          <Link to="/cart" className="glamor-icon-btn" aria-label="Cart">
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
          </Link>
        </div>
      </div>
    </header>
  );
}

/**
 * Mobile drawer header menu compatibility
 */
export function HeaderMenu({menu}) {
  const {close} = useAside();
  const menuItems = menu?.items || [];

  return (
    <nav className="mobile-nav" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
      <NavLink to="/" end className="glamor-nav-link" onClick={close}>HOME</NavLink>
      <NavLink to="/collections" className="glamor-nav-link" onClick={close}>SHOP ALL</NavLink>
      {menuItems.length > 0 ? (
        menuItems.map((item) => {
          const url = item.url.includes('myshopify.com') || item.url.startsWith('http')
            ? new URL(item.url).pathname
            : item.url;
          if (url === '/' || url === '/collections') return null;
          return (
            <NavLink key={item.id} to={url} className="glamor-nav-link" onClick={close}>
              {item.title.toUpperCase()}
            </NavLink>
          );
        })
      ) : (
        <>
          <NavLink to="/collections/bras" className="glamor-nav-link" onClick={close}>BRAS</NavLink>
          <NavLink to="/collections/panties" className="glamor-nav-link" onClick={close}>PANTIES</NavLink>
          <NavLink to="/collections/bikini" className="glamor-nav-link" onClick={close}>BIKINI</NavLink>
          <NavLink to="/collections/hipster" className="glamor-nav-link" onClick={close}>HIPSTER</NavLink>
        </>
      )}
    </nav>
  );
}

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {Promise<any>} cart
 */
