import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  Link,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Profile'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  context.customerAccount.handleAuthStatus();

  return {};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer = {};
    const validInputKeys = ['firstName', 'lastName'];
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext();
  const {state} = useNavigation();
  /** @type {ActionReturnData} */
  const action = useActionData();
  const customer = action?.customer ?? account?.customer;

  const firstName = customer?.firstName || '';
  const lastName = customer?.lastName || '';
  const email = customer?.emailAddress?.emailAddress || customer?.email || '';
  const phone = customer?.phoneNumber?.phoneNumber || '';
  const addressesCount = customer?.addresses?.nodes?.length || 0;

  // Calculate initials for avatar
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'LL';

  return (
    <div className="account-profile-wrapper">
      {/* Profile Header Avatar Banner */}
      <div className="profile-hero-banner">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar-circle">
            <span>{initials}</span>
          </div>
          <span className="profile-status-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Member
          </span>
        </div>
        <div className="profile-hero-info">
          <h2 className="profile-user-name">
            {firstName || lastName ? `${firstName} ${lastName}` : 'Valued Customer'}
          </h2>
          {email && <p className="profile-user-email">{email}</p>}
          <div className="profile-hero-stats">
            <span className="stat-pill">
              <strong>{addressesCount}</strong> Saved {addressesCount === 1 ? 'Address' : 'Addresses'}
            </span>
            <span className="stat-pill verified-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verified Account
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Side Cards */}
      <div className="profile-sections-grid">
        {/* Personal Details Form Card */}
        <div className="account-profile-card">
          <div className="profile-card-header">
            <div className="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h3>Personal Information</h3>
              <p className="profile-card-subhead">Update your name and personal details below</p>
            </div>
          </div>

          <Form method="PUT" className="profile-form">
            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-with-icon">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Enter first name"
                    aria-label="First name"
                    defaultValue={firstName}
                    minLength={2}
                    required
                  />
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>

              <div className="profile-form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-with-icon">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter last name"
                    aria-label="Last name"
                    defaultValue={lastName}
                    minLength={2}
                    required
                  />
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
            </div>

            {action?.error && (
              <div className="profile-form-error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{action.error}</span>
              </div>
            )}

            {action?.customer && !action?.error && (
              <div className="profile-form-success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Your profile has been updated successfully!</span>
              </div>
            )}

            <div className="profile-form-actions">
              <button
                type="submit"
                className="profile-form-submit-btn"
                disabled={state !== 'idle'}
              >
                {state !== 'idle' ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </Form>
        </div>

        {/* Security & Email Details Card */}
        <div className="account-profile-card security-card">
          <div className="profile-card-header">
            <div className="header-icon lock-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div>
              <h3>Account Credentials</h3>
              <p className="profile-card-subhead">Managed securely via Shopify Customer Accounts</p>
            </div>
          </div>

          <div className="credentials-list">
            <div className="credential-item">
              <div className="credential-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Primary Email</span>
              </div>
              <div className="credential-value-wrapper">
                <span className="credential-value">{email || 'Not provided'}</span>
                <span className="badge-verified">Verified</span>
              </div>
            </div>

            {phone && (
              <div className="credential-item">
                <div className="credential-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>Phone Number</span>
                </div>
                <div className="credential-value-wrapper">
                  <span className="credential-value">{phone}</span>
                </div>
              </div>
            )}
          </div>

          <div className="security-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p>Your password and login security are protected by Shopify passwordless authentication & Shop Pay.</p>
          </div>
        </div>
      </div>

      {/* Account Quick Dashboard Shortcuts */}
      <div className="profile-shortcuts-container">
        <h4 className="shortcuts-title">Quick Account Shortcuts</h4>
        <div className="profile-shortcuts-grid">
          <Link to="/account/orders" className="shortcut-card">
            <div className="shortcut-icon order-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div className="shortcut-text">
              <h5>Order History</h5>
              <p>View & track your past purchases</p>
            </div>
            <svg className="shortcut-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>

          <Link to="/account/addresses" className="shortcut-card">
            <div className="shortcut-icon address-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="shortcut-text">
              <h5>Delivery Addresses</h5>
              <p>Manage shipping & billing addresses</p>
            </div>
            <svg className="shortcut-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>

          <Link to="/collections/all" className="shortcut-card">
            <div className="shortcut-icon shop-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <div className="shortcut-text">
              <h5>Shop New Arrivals</h5>
              <p>Explore latest collections & trends</p>
            </div>
            <svg className="shortcut-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * @typedef {{
 *   error: string | null;
 *   customer: CustomerFragment | null;
 * }} ActionResponse
 */

/** @typedef {import('customer-accountapi.generated').CustomerFragment} CustomerFragment */
/** @typedef {import('@shopify/hydrogen/customer-account-api-types').CustomerUpdateInput} CustomerUpdateInput */
/** @typedef {import('./+types/account.profile').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
