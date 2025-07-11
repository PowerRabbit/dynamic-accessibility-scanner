type InMemoryStorageType = {
    setItem: (key: string, value: unknown) => void;
    getItem: <T = unknown>(key: string) => T | undefined;
    removeItem: (key: string) => void;
}

class InMemoryStorageClass implements InMemoryStorageType {

    private storage: Map<string, unknown> = new Map();

    setItem(key: string, value: unknown): void {
        this.storage.set(key, value);
    }

    getItem<T = unknown>(key: string) : T | undefined {
        return this.storage.get(key) as T;
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
        return this.storage.getItem(key) as T;
    }

    delete(key: string): void {
        this.storage.removeItem(key);
    }
}

export const storageService = new StorageClass();
