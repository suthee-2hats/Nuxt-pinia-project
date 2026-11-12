import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

type PageSeoType = 'website' | 'article' | 'product'

export interface PageSeoOptions {
  /** Page title without the brand suffix (unless `absoluteTitle` is set). */
  title: string
  description: string
  /** Absolute image URL used for Open Graph and Twitter cards. */
  image?: string
  type?: PageSeoType
  /** Hide the page from search engines (account, cart, checkout, auth). */
  noIndex?: boolean
  /** Use `title` exactly as provided instead of appending "| FASCO". */
  absoluteTitle?: boolean
}

/**
 * Applies the site's SEO defaults to a page: title, meta description,
 * Open Graph, Twitter card and robots directives.
 */
export const usePageSeo = (options: MaybeRefOrGetter<PageSeoOptions>) => {
  const seo = computed(() => {
    const value = toValue(options)
    const fullTitle = value.absoluteTitle
      ? value.title
      : `${value.title} | FASCO`

    return {
      fullTitle,
      description: value.description,
      image: value.image,
      type: value.type ?? 'website',
      robots: value.noIndex ? 'noindex, nofollow' : 'index, follow',
      twitterCard: value.image
        ? ('summary_large_image' as const)
        : ('summary' as const),
    }
  })

  useSeoMeta({
    title: () => seo.value.fullTitle,
    description: () => seo.value.description,
    robots: () => seo.value.robots,

    ogTitle: () => seo.value.fullTitle,
    ogDescription: () => seo.value.description,
    ogSiteName: 'FASCO',
    ogImage: () => seo.value.image,

    twitterCard: () => seo.value.twitterCard,
    twitterTitle: () => seo.value.fullTitle,
    twitterDescription: () => seo.value.description,
  })

  // `ogType` in useSeoMeta does not accept "product", so set it directly.
  useHead(() => ({
    meta: [
      {
        property: 'og:type',
        content: seo.value.type,
      },
    ],
  }))
}
