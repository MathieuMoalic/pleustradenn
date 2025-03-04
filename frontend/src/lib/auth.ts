import { addAlert } from "./alert";
import { Api } from "./api";
import { read as exerciseRead } from "./exercise";
import { goto } from "./page";
import { read as sessionRead } from "./session";

let apiInner: Api<BasicAuthSecurity>;

interface BasicAuthSecurity {
    accessToken: string;
}

export function initializeApiAndFetch() {
    apiInner = new Api<BasicAuthSecurity>({
        baseUrl: "",
        securityWorker: (securityData) => {
            if (!securityData) return {};
            return {
                headers: {
                    Authorization: `Bearer ${securityData.accessToken}`,
                },
            };
        },
    });
    const token = localStorage.getItem("token");
    if (!token) {
        goto("login");
    } else {
        apiInner.setSecurityData({ accessToken: token });
        exerciseRead();
        sessionRead();
    }
};

export const getApi = () => {
    if (!apiInner) throw new Error("API client not initialized. Call `initializeApiClient(fetch)` first.");
    return apiInner.api;
};

export async function login(username: string, password: string) {
    apiInner.token
        .loginTokenPost({
            grant_type: "password",
            username,
            password,
        })
        .then((res) => {
            localStorage.setItem("token", res.data.access_token);
            apiInner.setSecurityData({ accessToken: res.data.access_token });
            exerciseRead();
            sessionRead();
            goto("session");
        })
        .catch((res) => {
            addAlert(`${res.error.detail}`, "error");
        });
}
