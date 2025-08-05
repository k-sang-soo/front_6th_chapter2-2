// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): (T | ((value: T) => void))[] {
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
