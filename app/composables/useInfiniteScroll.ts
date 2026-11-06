import {
    onMounted,
    onUnmounted,
    type Ref,
  } from 'vue'
  
  export const useInfiniteScroll = (
    target: Ref<HTMLElement | null>,
    callback: () => void,
  ) => {
    let observer: IntersectionObserver | null = null
  
    onMounted(() => {
      if (!target.value) return
  
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
  
          if (entry?.isIntersecting) {
            callback()
          }
        },
        {
          root: null,
          rootMargin: '300px',
          threshold: 0,
        },
      )
  
      observer.observe(target.value)
    })
  
    onUnmounted(() => {
      observer?.disconnect()
    })
  }