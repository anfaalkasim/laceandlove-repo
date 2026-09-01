import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';

// Define the additional context object
const additionalContext = {
  // Additional context for custom properties, CMS clients, 3P SDKs, etc.
  // These will be available as both context.propertyName and context.get(propertyContext)
  // Example of complex objects that could be added:
  // cms: await createCMSClient(env),
  // reviews: await createReviewsClient(env),
};

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 * @param {Request} request
 * @param {Env} env
 * @param {ExecutionContext} executionContext
 */
export async function createHydrogenRouterContext(
  request,
  env,
  executionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  let customerAccountRef = {current: null};

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      // Or detect from URL path based on locale subpath, cookies, or any other strategy
      i18n: {language: 'EN', country: 'US'},
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
        getId() {
          const customerId = session.get('loggedInCustomerId');
          const cookieHeader = request.headers.get('Cookie');
          let cartId = null;

          if (customerId) {
            const cleanId = btoa(customerId).replace(/=/g, '');
            // Only retrieve the cart belonging to THIS specific customer
            cartId =
              session.get(`customer_cart_${cleanId}`) ||
              getCookie(cookieHeader, `cart_${cleanId}`);
            // If this customer has no cart yet, return null so a fresh cart is created for them
          } else {
            // Guest cart retrieval
            cartId =
              session.get('guest_cart_id') ||
              getCookie(cookieHeader, 'cart_guest') ||
              getCookie(cookieHeader, 'cart');
          }

          if (cartId) {
            cartId = decodeURIComponent(cartId);
            const prefix = 'gid://shopify/Cart/';
            if (!cartId.startsWith(prefix)) {
              cartId = `${prefix}${cartId}`;
            }
          }
          return cartId;
        },
        setId(cartId) {
          const customerId = session.get('loggedInCustomerId');
          const headers = new Headers();

          if (customerId) {
            const cleanId = btoa(customerId).replace(/=/g, '');
            headers.append(
              'Set-Cookie',
              `cart_${cleanId}=${cartId}; path=/; Max-Age=31536000; SameSite=Lax`,
            );

            const sessionKey = `customer_cart_${cleanId}`;
            const cachedCartId = session.get(sessionKey);
            if (cachedCartId !== cartId) {
              session.set(sessionKey, cartId);
              saveCartIdToShopify(
                customerAccountRef.current,
                customerId,
                cartId,
                waitUntil,
              );
            }
          } else {
            session.set('guest_cart_id', cartId);
            headers.append(
              'Set-Cookie',
              `cart=${cartId}; path=/; Max-Age=31536000; SameSite=Lax`,
            );
            headers.append(
              'Set-Cookie',
              `cart_guest=${cartId}; path=/; Max-Age=31536000; SameSite=Lax`,
            );
          }
          return headers;
        },
      },
    },
    additionalContext,
  );

  customerAccountRef.current = hydrogenContext.customerAccount;

  // Initialize and cache customer ID synchronously in the session if logged in
  const customerAccount = hydrogenContext.customerAccount;
  const isLoggedIn = await customerAccount.isLoggedIn();
  if (isLoggedIn) {
    try {
      // 1. Fetch customer ID (guaranteed to succeed if authenticated)
      const {data} = await customerAccount.query(`
        query getCustomerId {
          customer {
            id
          }
        }
      `);
      if (data?.customer?.id) {
        const customerId = data.customer.id;
        const cleanId = btoa(customerId).replace(/=/g, '');
        const sessionKey = `customer_cart_${cleanId}`;
        session.set('loggedInCustomerId', customerId);

        // 2. Fetch customer cart metafield (defensively, to handle missing schema/fields)
        try {
          const metafieldData = await customerAccount.query(`
            query getCustomerCartMetafield {
              customer {
                cartId: metafield(namespace: "custom", key: "cart_id") {
                  value
                }
              }
            }
          `);
          const shopifyCartId = metafieldData?.data?.customer?.cartId?.value;
          if (shopifyCartId) {
            session.set(sessionKey, decodeURIComponent(shopifyCartId));
          } else {
            const cookieHeader = request.headers.get('Cookie');
            const localCustomerCartId = getCookie(cookieHeader, `cart_${cleanId}`);

            if (localCustomerCartId) {
              session.set(sessionKey, localCustomerCartId);
            }
          }
        } catch {
          // Fall back to customer's own local cookie if Shopify metafield fails
          const cookieHeader = request.headers.get('Cookie');
          const localCustomerCartId = getCookie(cookieHeader, `cart_${cleanId}`);
          if (localCustomerCartId) {
            session.set(sessionKey, localCustomerCartId);
          }
        }
      }
    } catch {
      // Ignore login-query errors
    }
  } else {
    session.unset('loggedInCustomerId');
    session.unset('loggedInCustomerCartId');
  }

  return hydrogenContext;
}



/**
 * Reads a specific cookie value from the request cookie header
 * @param {string | null} cookieHeader
 * @param {string} name
 * @returns {string | null}
 */
function getCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Saves the cart ID to the customer's metafield on Shopify
 * @param {any} customerAccount
 * @param {string} customerId
 * @param {string} cartId
 * @param {any} waitUntil
 */
function saveCartIdToShopify(customerAccount, customerId, cartId, waitUntil) {
  if (!customerAccount || !customerId || !cartId) return;

  const promise = customerAccount
    .mutate(
      `
    mutation updateCustomerCart($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
      {
        variables: {
          metafields: [
            {
              ownerId: customerId,
              namespace: 'custom',
              key: 'cart_id',
              value: cartId,
              type: 'single_line_text_field',
            },
          ],
        },
      },
    )
    .then((res) => {
      if (res?.data?.metafieldsSet?.userErrors?.length) {
        console.warn(
          'Shopify metafield save userErrors:',
          res.data.metafieldsSet.userErrors,
        );
      }
    })
    .catch((error) => {
      console.error('Error saving cart ID to customer profile:', error);
    });

  waitUntil(promise);
}

/** @typedef {Class<additionalContext>} AdditionalContextType */
