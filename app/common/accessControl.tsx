import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";

interface AccessControlProps {
    allowedScopes?: string[];
}

export const AccessControl = (props: PropsWithChildren<AccessControlProps>) => {
    const { children, allowedScopes } = props;
    const { data } = useSession();
    const receivedScopes = data?.user?.scope?.split(" ") || [];

    console.log("Received scopes: ", receivedScopes);

    if (!allowedScopes) return <>{children}</>;

    if (allowedScopes.some(v => receivedScopes.includes(v))) {
        return <>{children}</>;
    }

    return null;
};

