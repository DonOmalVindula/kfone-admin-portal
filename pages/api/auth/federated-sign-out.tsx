import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';

export default async function federatedIdPLogouthandler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const token = await getToken({ req });
        if (!token && process.env.NEXT_PUBLIC_ASGARDEO_POST_LOGOUT_REDIRECT_URI) {
            // If the user isn't logged in and the base URL exists, just redirect to the base URL.
            console.warn('The JWT token could not be found while calling the /federated-logout endpoint hence redirecting to the base URL.');
            return res.redirect(process.env.NEXT_PUBLIC_ASGARDEO_POST_LOGOUT_REDIRECT_URI);
        } else if (token && !token.idToken && process.env.NEXT_PUBLIC_ASGARDEO_POST_LOGOUT_REDIRECT_URI) {
            // If there is no id token, a logout cannot be performed to the federated identity provider.
            console.warn('The id token could not be found while calling the /federated-logout endpoint hence redirecting to the base URL.');
            return res.redirect(process.env.NEXT_PUBLIC_ASGARDEO_POST_LOGOUT_REDIRECT_URI)
        } else if (token && token.idToken && process.env.NEXT_PUBLIC_ASGARDEO_POST_LOGOUT_REDIRECT_URI && process.env.NEXTAUTH_ASGARDEO_SERVER_ORIGIN) {
            // Construct the query params, perform the federated identity provider logout, and redirect the browser to the provider auth server.
            const logoutURL = `${process.env.NEXT_PUBLIC_ASGARDEO_SERVER_ORIGIN}/oidc/logout`;
            const logoutParams = new URLSearchParams({
                id_token_hint: (token.idToken as string),
                post_logout_redirect_uri: (process.env.NEXT_PUBLIC_ASGARDEO_POST_LOGOUT_REDIRECT_URI),
                state: 'sign_out_success',
            });
            res.setHeader('Set-Cookie', [
                'next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
                '__Secure-next-auth.session-token=deleted; path=/; Secure; expires=Thu, 01 Jan 1970 00:00:00 GMT',
            ]);
            return res.redirect(`${logoutURL}?${logoutParams}`);
        } else if (!process.env.NEXTAUTH_URL || !process.env.NEXTAUTH_ASGARDEO_SERVER_ORIGIN) {
            throw new Error('Environemntal variables are not properly configured to perform the logout functionality.');
        } else {
            throw new Error('Something went wrong during the logout.');
        }
    } catch (error) {
        console.error(error);
    }
}