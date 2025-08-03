// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

export function useLocalStorage<T>(
  _key: string,
  _initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // TODO: 구현
  return [_initialValue, () => {}]; // 임시 반환값
}