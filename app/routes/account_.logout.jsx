import {redirect} from 'react-router';

// if we don't implement this, /account/logout will get caught by account.$.tsx to do login

export async function loader() {
  return redirect('/');
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({context}) {
  context.session.unset('loggedInCustomerId');

  const response = await context.customerAccount.logout();

  const guestCartId = context.session.get('guestCartId');
  if (guestCartId) {
    response.headers.append(
      'Set-Cookie',
      `cart=${guestCartId}; path=/; Max-Age=31536000; SameSite=Lax`,
    );
  } else {
    response.headers.append(
      'Set-Cookie',
      'cart=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;',
    );
  }

  return response;
}

/** @typedef {import('./+types/account_.logout').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
