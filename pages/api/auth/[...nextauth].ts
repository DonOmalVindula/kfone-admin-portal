
import NextAuth, { NextAuthOptions } from "next-auth"
import { JWT, JWTDecodeParams, JWTEncodeParams, getToken } from "next-auth/jwt";
import axios, { AxiosError } from "axios";
import { redirect } from "next/navigation";
import jwtDecode from "jwt-decode";

declare module "next-auth/jwt" {
    interface JWT {
        provider: string;
        idToken: string;
        accessToken: string;
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
            authorization: {
                params:
                    { scope: "openid " + "profile " + 
                        "urn:kfonenextjsdemo:kfoneadminapis:create-promo " +
                        "urn:kfonenextjsdemo:kfoneadminapis:view-promos " +
                        "urn:kfonenextjsdemo:kfoneadminapis:update-device-promo " +
                        "urn:kfonenextjsdemo:kfoneadminapis:delete-promo " +
                        "urn:kfonenextjsdemo:kfoneadminapis:create-user " +
                        "urn:kfonenextjsdemo:kfoneadminapis:view-users " +
                        "urn:kfonenextjsdemo:kfoneadminapis:create-device " +
                        "urn:kfonenextjsdemo:kfoneadminapis:view-devices"
                    }
            },
            idToken: true,
            checks: ["pkce", "state"],
            profile(profile) {
                console.log("profile: " + JSON.stringify(profile));

                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                }
            },
        },
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }: any) {
            return true
        },
        async session({ session, token, user }: any) {
            if (token) {
                const decodedAccessToken: any = jwtDecode(token.accessToken);
    
                session.user.accessToken = token.accessToken;
                session.user.idToken = token.idToken;
                session.user.scope =  decodedAccessToken.scope;
            }
            console.log("session: " + JSON.stringify(session));

            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (account) {
                token.accessToken = account.access_token!
                token.idToken = account.id_token!
            }            

            return token;
        }
    },
    theme: {
        colorScheme: "light",
    },
    debug: true,
}

export default NextAuth(authOptions);