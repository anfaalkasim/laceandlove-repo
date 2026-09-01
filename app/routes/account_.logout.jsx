// if we don't implement this, /account/logout will get caught by account.$.tsx to do login

export async function loader({context}) {
  return handleLogout(context);
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({context}) {
  return handleLogout(context);
}

async function handleLogout(context) {
  const customerId = context.session.get('loggedInCustomerId');
  let cleanId = null;
  if (customerId) {
    cleanId = btoa(customerId).replace(/=/g, '');
    context.session.unset(`customer_cart_${cleanId}`);
  }
  context.session.unset('loggedInCustomerId');
  context.session.unset('loggedInCustomerCartId');
  context.session.unset('guest_cart_id');
  context.session.unset('guestCartId');

  const response = await context.customerAccount.logout();

  // Expire all cart cookies so browser starts clean
  response.headers.append(
    'Set-Cookie',
    'cart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;',
  );
  response.headers.append(
    'Set-Cookie',
    'cart_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;',
  );
  if (cleanId) {
    response.headers.append(
      'Set-Cookie',
      `cart_${cleanId}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;`,
    );
  }

  return response;
}

/** @typedef {import('./+types/account_.logout').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
