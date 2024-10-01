export interface ILocalStorage {
    setItem: (key: string, value: string) => void;
    getItem: (key: string) => string | null;
    removeItem: (key: string) => void;
    clear: () => void;
}

export const useLocalStorage = (): ILocalStorage => {
    const setItem = (key: string, value: string): void => {
        localStorage.setItem(key, value);
    };

    const getItem = (key: string): string | null => {
        return localStorage.getItem(key);
    };

    const removeItem = (key: string): void => {
        localStorage.removeItem(key);
    };

    const clear = (): void => {
        localStorage.clear();
    }

    return { setItem, getItem, removeItem, clear };
};
