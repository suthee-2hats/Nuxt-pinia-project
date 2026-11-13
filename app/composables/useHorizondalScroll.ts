import { ref, onMounted, onUnmounted } from "vue";

export function useHorizontalWheelScroll() {
  const scrollElement = ref<HTMLElement | null>(null);

  const handleWheel = (event: WheelEvent) => {
    if (!scrollElement.value || event.deltaY === 0 || event.ctrlKey) return;

    event.preventDefault();
    scrollElement.value.scrollLeft += event.deltaY;
  };

  onMounted(() => {
    scrollElement.value?.addEventListener("wheel", handleWheel, {
      passive: false,
    });
  });

  onUnmounted(() => {
    scrollElement.value?.removeEventListener("wheel", handleWheel);
  });

  return {
    scrollElement,
  };
}
