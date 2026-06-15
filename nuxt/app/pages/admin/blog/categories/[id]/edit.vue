<template>
  <div class="bg-gray-100 min-h-screen p-4 md:p-10 font-sans text-gray-900">
    <div class="max-w-xl mx-auto">
      <div class="mb-6">
        <UButton
          to="/admin/blog/categories"
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
          class="-ml-2.5 text-gray-500 hover:text-gray-900 transition"
        >
          Назад до списку категорій
        </UButton>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h1 class="text-xl font-bold mb-6">
          Редагувати категорію
        </h1>

        <CategoryForm
          v-if="category"
          :category="category"
        />

        <div
          v-else
          class="text-gray-500"
        >
          Завантаження...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CategoryItem {
  id: number
  title: string
  slug: string | null
  description?: string | null
  parent_id: number | null
}

const route = useRoute()
const category = ref<CategoryItem | null>(null)

const getCategory = () => {
  $fetch<CategoryItem>(`http://localhost/api/admin/blog/categories/${route.params.id}`)
    .then((response) => {
      category.value = response
    })
}

getCategory()
</script>
