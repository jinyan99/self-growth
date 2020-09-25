import { useState, useEffect } from 'react'
// 自定义hook一定要use开头
/**
 * 
 * @param {any} value
 * @param {number} delay 多少秒后执行
 */
function useDebounce(value: any, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce;