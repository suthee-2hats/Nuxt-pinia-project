<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'

const props = defineProps<{
  images: string[]
  title: string
  thumbnail?: string
}>()

const panelId = useId()

const galleryImages = computed(() => {
  const sources = props.images.length > 0 ? props.images : [props.thumbnail]

  return [...new Set(sources)].filter(
    (source): source is string => Boolean(source),
  )
})

const activeIndex = ref(0)

const thumbRefs = ref<HTMLButtonElement[]>([])

const setThumbRef = (
  element: Element | null,
  index: number,
) => {
  if (element instanceof HTMLButtonElement) {
    thumbRefs.value[index] = element
  }
}

watch(galleryImages, () => {
  activeIndex.value = 0
})

const activeImage = computed(
  () => galleryImages.value[activeIndex.value] ?? '',
)

const mainImageAlt = computed(() => {
  if (galleryImages.value.length <= 1) return props.title

  return `${props.title} — image ${activeIndex.value + 1} of ${galleryImages.value.length}`
})

const onThumbKeydown = (event: KeyboardEvent, index: number) => {
  const lastIndex = galleryImages.value.length - 1

  let nextIndex = index

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      nextIndex = index === lastIndex ? 0 : index + 1
      break

    case 'ArrowUp':
    case 'ArrowLeft':
      nextIndex = index === 0 ? lastIndex : index - 1
      break

    case 'Home':
      nextIndex = 0
      break

    case 'End':
      nextIndex = lastIndex
      break

    default:
      return
  }

  event.preventDefault()

  activeIndex.value = nextIndex
  thumbRefs.value[nextIndex]?.focus()
}
</script>

<template>
  <div
    class="product-gallery"
    :class="{ 'product-gallery--single': galleryImages.length <= 1 }"
    role="group"
    aria-label="Product image gallery"
  >
    <div
      :id="panelId"
      class="product-gallery__main"
      role="group"
      aria-label="Selected product image"
    >
      <img
        v-if="activeImage"
        :src="activeImage"
        :alt="mainImageAlt"
        decoding="async"
      />
    </div>

    <div
      v-if="galleryImages.length > 1"
      class="product-gallery__thumbnails"
      role="group"
      aria-label="Choose a product image"
    >
      <button
        v-for="(image, index) in galleryImages"
        :key="image"
        :ref="(element) => setThumbRef(element as Element | null, index)"
        type="button"
        class="product-gallery__thumb"
        :class="{ 'is-active': activeIndex === index }"
        :aria-pressed="activeIndex === index"
        :aria-controls="panelId"
        :aria-label="`Show image ${index + 1} of ${galleryImages.length}`"
        @click="activeIndex = index"
        @keydown="onThumbKeydown($event, index)"
      >
        <img
          :src="image"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </button>
    </div>
  </div>
</template>
