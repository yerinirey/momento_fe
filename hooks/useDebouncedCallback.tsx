import { useEffect, useRef } from "react";
// 입력중에는 request하지 않도록
export function useDebouncedCallback<T>(
  callback: VoidFunction,
  dependencies: T[],
  timeout: number
) {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    clearTimeout(timer.current!);
    timer.current = setTimeout(callback, timeout);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [callback, timeout, dependencies]);
}
