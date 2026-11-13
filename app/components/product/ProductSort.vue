<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating-desc" },
];

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const optionRefs = ref<HTMLButtonElement[]>([]);

const menuId = useId();

const selectedOption = computed(() => {
  return (
    sortOptions.find((option) => option.value === props.modelValue) ?? {
      label: "Sort By",
      value: "default",
    }
  );
});

const selectedIndex = computed(() => {
  return sortOptions.findIndex((option) => option.value === props.modelValue);
});

const setOptionRef = (element: HTMLButtonElement | null, index: number) => {
  if (element) {
    optionRefs.value[index] = element;
  }
};

const openDropdown = async () => {
  isOpen.value = true;

  await nextTick();

  const index = selectedIndex.value >= 0 ? selectedIndex.value : 0;
  optionRefs.value[index]?.focus();
};

const closeDropdown = (restoreFocus = false) => {
  isOpen.value = false;

  if (restoreFocus) {
    nextTick(() => triggerRef.value?.focus());
  }
};

const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

const selectOption = (option: SortOption) => {
  emit("update:modelValue", option.value);
  closeDropdown(true);
};

const handleMenuKeydown = (event: KeyboardEvent) => {
  const currentIndex = optionRefs.value.indexOf(
    event.target as HTMLButtonElement,
  );

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      optionRefs.value[(currentIndex + 1) % sortOptions.length]?.focus();
      break;

    case "ArrowUp":
      event.preventDefault();
      optionRefs.value[
        (currentIndex - 1 + sortOptions.length) % sortOptions.length
      ]?.focus();
      break;

    case "Home":
      event.preventDefault();
      optionRefs.value[0]?.focus();
      break;

    case "End":
      event.preventDefault();
      optionRefs.value[sortOptions.length - 1]?.focus();
      break;

    case "Escape":
      event.preventDefault();
      closeDropdown(true);
      break;
  }
};

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    openDropdown();
  }
};

const handleOutsideClick = (event: PointerEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("pointerdown", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("pointerdown", handleOutsideClick);
});
</script>

<template>
  <div ref="dropdownRef" class="product-sort">
    <button
      ref="triggerRef"
      type="button"
      class="product-sort__trigger"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      @click="toggleDropdown"
      @keydown="handleTriggerKeydown"
    >
      <span>{{
        selectedOption.label === "Default" ? "Sort By" : selectedOption.label
      }}</span>

      <svg
        class="product-sort__icon"
        :class="{ 'is-open': isOpen }"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="m7 10 5 5 5-5" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      :id="menuId"
      class="product-sort__menu"
      role="menu"
      aria-label="Sort products"
      @keydown="handleMenuKeydown"
    >
      <button
        v-for="(option, index) in sortOptions"
        :key="option.value"
        :ref="
          (element) => setOptionRef(element as HTMLButtonElement | null, index)
        "
        type="button"
        class="product-sort__option"
        role="menuitemradio"
        :aria-checked="modelValue === option.value"
        tabindex="-1"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
