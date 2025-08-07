import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storageValue, setStorageValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  const setValue = (value: T) => {
    try {
      setStorageValue(value);
      if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        return localStorage.removeItem(key);
      }

      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving value to localStorage key ${key}: ${error}`);
    }
  };

  return [storageValue, setValue];
}
