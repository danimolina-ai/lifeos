// Custom hook for localStorage with sync to Supabase
import { useState } from 'react';
import { syncData } from '../lib/storage';

export const useLocalStorage = (key, init) => {
    const [val, setVal] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : init;
        } catch {
            return init;
        }
    });

    const setValue = (v) => {
        const toStore = typeof v === 'function' ? v(val) : v;
        setVal(toStore);
        const jsonValue = JSON.stringify(toStore);
        localStorage.setItem(key, jsonValue);

        // Directly trigger sync for lifeOS data (bypass interception issues)
        if (key === 'lifeOS_v58' && syncData) {
            syncData(key, jsonValue);
        }
    };

    return [val, setValue];
};

export default useLocalStorage;
