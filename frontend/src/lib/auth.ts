import { Api } from "./Api";

interface BasicAuthSecurity {
    accessToken: string;
}

export const apiInner = new Api<BasicAuthSecurity>({
    baseUrl: ".",
    securityWorker: (securityData) => {
        if (!securityData) {
            return {};
        }

        return {
            headers: {
                Authorization: `Bearer ${securityData.accessToken}`,
            },
        };
    },
});

export const api = apiInner.api;
