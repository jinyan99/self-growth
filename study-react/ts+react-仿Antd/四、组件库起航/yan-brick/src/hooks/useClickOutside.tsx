import { RefObject, useEffect } from "react";
//引入内置类型ref相关的类型RefObject类型，不用引用的内置Function类型
function useClickOutside(ref: RefObject<HTMLElement>, handler: (e: Event) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
        // js dom的节点查询方法看他是不是他的子代返bool值
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return
      }
      handler(event)
    }
    document.addEventListener('click', listener)
    return () => {
      document.removeEventListener('click', listener)
    }
  }, [ref, handler])
}

export default useClickOutside