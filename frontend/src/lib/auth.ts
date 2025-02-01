import { Api } from "./Api";

export let api: Api<BasicAuthSecurity>;

interface BasicAuthSecurity {
    accessToken: string;
}

export const createApiClient = (fetchFn: typeof fetch) => {
    api = new Api<BasicAuthSecurity>({
        baseUrl: "",
        customFetch: fetchFn,
        securityWorker: (securityData) => {
            if (!securityData) return {};
            return {
                headers: {
                    Authorization: `Bearer ${securityData.accessToken}`,
                },
            };
        },
    });

    return api;
};

export const getApi = () => {
    if (!api) throw new Error("API client not initialized. Call `createApiClient(fetch)` first.");
    return api.api;
};
