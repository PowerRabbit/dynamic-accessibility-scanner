type InMemoryStorageType = {
    setItem: (key: string, value: string) => void;
    getItem: (key: string) => string | undefined;
    removeItem: (key: string) => void;
}

class InMemoryStorageClass implements InMemoryStorageType {

    private storage: Map<string, string> = new Map();

    setItem(key: string, value: string): void {
        this.storage.set(key, value);
    }

    getItem(key: string): string | undefined {
        return this.storage.get(key);
    }

    removeItem(key: string): void {
        this.storage.delete(key);
    }
}

class StorageClass {

    private storage: Storage | InMemoryStorageType;
    private prefix = 'DAS_storage_'

    constructor() {
        try {
            const date = String(Date.now());
            const key = `${this.prefix}testdate`;
            window.localStorage.setItem(key, date);
            if (window.localStorage.getItem(key) === date) {
                window.localStorage.removeItem(key);

                this.storage = window.localStorage;
            } else {
                throw new Error('No local storage support');
            }
        } catch {
            this.storage = new InMemoryStorageClass();
        }
    }

    save(key: string, value: unknown): void {
        this.storage.setItem(this.prefix + key, JSON.stringify(value));
    }

    load<T = unknown>(key: string) : T | undefined {
        const data = this.storage.getItem(this.prefix + key);
        if (data) {
            return JSON.parse(data) as T;
        }
        return undefined;
    }

    delete(key: string): void {
        this.storage.removeItem(key);
    }
}

export const storageService = new StorageClass();
