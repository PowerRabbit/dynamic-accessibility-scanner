type ErrorAdditionalata = {
    url: string;
}

type ErrorInfoType = {
    name: string;
    message: string;
}

export class ScanError extends Error {
    constructor(data: ErrorInfoType) {
        super();

        this.name = data.name;
        this.message = data.message;
    }

}

export const scanErrorFactory = (error: unknown, errorData: ErrorAdditionalata): ScanError => {

    const data: ErrorInfoType = {
        name: 'Unknown Page Scan Error',
        message: 'Unknown error occured while scanning!'
    };

    if (error instanceof Error) {
        if (error.message.startsWith('net::ERR_NAME_NOT_RESOLVED at')) {
            data.name = 'Site not found!';
            data.message = `Cannot reach the URL: ${errorData.url}`;
        } else {
            data.name = error.name;
            data.message = error.message;
        }

    }

    return new ScanError(data);
};
