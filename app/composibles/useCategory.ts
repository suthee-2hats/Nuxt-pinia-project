export const useCategories = () => {
    const categories = ref<any[]>([])
    const pending = ref(false)
  
    const fetchCategories = async () => {
      pending.value = true
      try {
        // 1. Fetch category list
        const cats: any = await $fetch('https://dummyjson.com/products/categories')
        
        // Limit to 12 categories for the grid + carousel to avoid massive loading times
        const selectedCats = cats.slice(0, 12)
  
        // 2. Fetch the first product for each category to get the image
        const categoryPromises = selectedCats.map(async (cat: any) => {
          const productData: any = await $fetch(`https://dummyjson.com/products/category/${cat.slug}?limit=1`)
          return {
            name: cat.name,
            slug: cat.slug,
            image: productData.products[0]?.thumbnail || '' // Get first product's image
          }
        })
  
        categories.value = await Promise.all(categoryPromises)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        pending.value = false
      }
    }
  
    return { categories, pending, fetchCategories }
  }