import { FetchError } from "./fetch-error.class";
import { DasRequest } from "./request.class";

type ExpectedErrorContent = {
    message: string;
}

type OnErrorFallbackType =  <T = unknown>(e: unknown) => T;

class CommunicationServiceClass {

    private async processResponse <T = unknown>(response: Response): Promise<T | undefined> {
        let content: T | undefined;
        if (response) {
            content = await response.json();
        } else {
            throw(new Error('No response received!'));
        }

        if (!response.ok) {
            let message = 'An error occured.';

            if (content) {
                message = (content as unknown as ExpectedErrorContent).message || '';
            }

            throw new FetchError({
                status: response.status,
                message,
            });

        }
        return content;
    }

    private async send<T = unknown>(options: {request: Request, onErrorFallback?: OnErrorFallbackType}): Promise<T> {
        const { request, onErrorFallback } = options;
        let response: Response | undefined;
        try {
            response = await fetch(request);
        } catch (e) {
            if (document.visibilityState === 'visible') { // Not in reload
                window.alert('Cannot fetch data from server!');
            }
            throw e;
        }
        let content: T | undefined;
        try {
            content = await this.processResponse<T>(response) as T;
        } catch(e) {

            if (onErrorFallback) {
                return onErrorFallback<T>(e);
            }

            if (e instanceof FetchError) {
                window.alert(e.message);
            } else {
                window.alert('An unknown error occured');
            }
            throw e;
        }

        return content;
    };

    async post<T = unknown>(options: {url: string, payload?: Record<string, unknown>, onErrorFallback?: OnErrorFallbackType}): Promise<T> {
        const { url, payload, onErrorFallback } = options;

        const request = new DasRequest({
            method: 'POST',
            url,
            payload,
        }).makeRequest();

        return this.send<T>({request, onErrorFallback});
    }

    async get<T = unknown>(options: {url: string, onErrorFallback?: OnErrorFallbackType}): Promise<T> {
        const { url, onErrorFallback } = options;
        const request = new DasRequest({
            method: 'GET',
            url,
        }).makeRequest();

        return this.send<T>({request, onErrorFallback});
    }

    async delete<T = unknown>(options: {url: string, onErrorFallback?: OnErrorFallbackType}): Promise<T> {
        const { url, onErrorFallback } = options;
        const request = new DasRequest({
            method: 'DELETE',
            url,
        }).makeRequest();

        return this.send<T>({request, onErrorFallback});
    }

}

export const communicationService = new CommunicationServiceClass();
