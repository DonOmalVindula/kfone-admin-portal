import { SessionProvider } from "next-auth/react"

interface AppProps {
    Component: React.ComponentType
    pageProps: {
        session: any
    }
}

// export default function App({
//     children,
//     pageProps: { session, ...pageProps },
// }: AppProps) {
//     return (
//         <SessionProvider session={session}>
//             <Component {...pageProps} />
//         </SessionProvider>
//     )
// }

export default function AuthenticatedPage() {
    return (
        <h1>this is a page 2</h1>
    )
}
