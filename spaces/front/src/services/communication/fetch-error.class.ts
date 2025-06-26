type FetchErrorOptionsType = {
    status: number;
    message?: string;
};

export class FetchError extends Error {

    status: number;

    constructor(options: FetchErrorOptionsType) {
        const { status } = options;
        const message = options.message ||  'An error occured in the request.';

        super(message);

        this.status = status;
        this.message = message;
    }
}
