type RequestMethodType = 'GET' | 'POST' | 'PATCH';

type RequestOptionsType = {
    url: string;
    method: RequestMethodType;
    payload?: Record<string, unknown>;
}

type RequestParamsType = {
    method: RequestMethodType;
    mode: RequestMode;
    credentials: RequestCredentials;
    headers: {
        "Content-Type": string;
    };
    body?: string;
    signal: AbortSignal,
}

const apiUrl = 'http://localhost:3000/api/';

export class DasRequest {
    cancelled = false;

    private readonly abortController: AbortController;
    private readonly method: RequestMethodType;
    private readonly url: string;
    private readonly payload?: Record<string, unknown>;

    constructor(options: RequestOptionsType) {
        this.abortController = new AbortController();
        const { method, url, payload } = options;

        this.method = method;
        this.url = url;
        this.payload = payload;
    }

    makeRequest(): Request {
        const { method, url, payload, abortController } = this;

        const requestParams: RequestParamsType = {
            method,
            mode: "cors",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            signal: abortController.signal
        };
        if (payload && (method === 'POST' || method === 'PATCH')) {
            requestParams.body = JSON.stringify(payload);
        }

        return new Request(apiUrl + url, requestParams);
    }

    cancel() {
        if (this.abortController) {
            this.abortController.abort();
        }
        this.cancelled = true;
    }
}
