
import NextAuth, { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt";
import axios, { AxiosError } from "axios";

declare module "next-auth/jwt" {
    interface JWT {
        provider: string;
        idToken: string;
    }
}

// this performs the final handshake for the keycloak
// provider, the way it's written could also potentially
// perform the action for other providers as well
async function doFinalSignoutHandshake(jwt: JWT) {
    const { provider, idToken } = jwt;

    if (idToken) {
        try {
            // Add the id_token_hint to the query string
            const params = new URLSearchParams();
            params.append('id_token_hint', idToken);
            params.append('post_logout_redirect_uri', process.env.NEXT_PUBLIC_ASGARDEO_POST_LOGOUT_REDIRECT_URI ?? "");
            params.append('state', "sign_out_success");

            const { status, statusText } = await axios.get(`https://api.asgardeo.io/t/${process.env.NEXT_PUBLIC_ASGARDEO_ORGANIZATION_NAME}/oidc/logout?${params.toString()}`);

            // The response body should contain a confirmation that the user has been logged out
            console.log("Completed post-logout handshake", status, statusText);
        }
        catch (e: any) {
            console.error("Unable to perform post-logout handshake", (e as AxiosError)?.code || e)
        }
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        {
            id: "asgardeo",
            name: "Asgardeo",
            clientId: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_SECRET,
            issuer: process.env.NEXT_PUBLIC_ASGARDEO_ISSUER,
            userinfo: "https://api.asgardeo.io/t/" + process.env.NEXT_PUBLIC_ASGARDEO_ORGANIZATION_NAME + "/oauth2/userinfo",
            type: "oauth",
            wellKnown: "https://api.asgardeo.io/t/" + process.env.NEXT_PUBLIC_ASGARDEO_ORGANIZATION_NAME + "/oauth2/token/.well-known/openid-configuration",
            // authorization: { params: { scope: process.env.ASGARDEO_SCOPES } },
            idToken: true,
            checks: ["pkce", "state"],
            profile(profile) {                
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                }
            },
        },
    ],
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log("signIn", user);
            console.log("account", account);
            console.log("profile", profile);
            console.log("email", email);
            console.log("credentials", credentials);
            

            return true
        },
        async session({ session, token, user }: any) {        
            session.user = user;
            session.idToken = token.idToken;
            session.access_token = token.accessToken;
            
            // console.log("session", sessi);
            console.log("token", token);            
        
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {       
            if (account) {
                token.accessToken = account.access_token
                token.idToken = account.id_token ?? ""
            }

            return token
        }
    },
    events: {
        signOut: ({ session, token }) => doFinalSignoutHandshake(token)
    },
    theme: {
        colorScheme: "light",
    },
    debug: true,
}

export default NextAuth(authOptions);