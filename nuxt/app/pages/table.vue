<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn } from '#ui/types'

interface Product {
  id: number
  title: string
  description: string
  price: number
  rating: number
  brand: string
  category: string
  thumbnail: string
}

const search = ref('')
const page = ref(1)
const pageCount = 10
const sortKey = ref<keyof Product | null>(null)
const sortDesc = ref(false)

const { data: products } = await useFetch<Product[]>('/api/table', {
  default: () => [],
  key: 'products-table'
})

const sortableColumns: Array<{ key: keyof Product, label: string }> = [
  { key: 'title', label: 'Назва' },
  { key: 'description', label: 'Опис' },
  { key: 'price', label: 'Ціна' },
  { key: 'rating', label: 'Оцінка' },
  { key: 'brand', label: 'Бренд' },
  { key: 'category', label: 'Категорія' }
]

function applySort(key: keyof Product) {
  if (sortKey.value === key) {
    sortDesc.value = !sortDesc.value
  } else {
    sortKey.value = key
    sortDesc.value = false
  }
  page.value = 1
}

const columns: TableColumn<Product>[] = [
  ...sortableColumns.map(col => ({
    accessorKey: col.key,
    header: () => h('button', {
      class: 'flex items-center gap-1 hover:text-gray-900 transition',
      onClick: () => applySort(col.key)
    }, [
      col.label,
      sortKey.value === col.key
        ? sortDesc.value
          ? h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', innerHTML: '<path fill="currentColor" d="M11 4h2v12l5.5-5.5l1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5L11 16z"/>' })
          : h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', innerHTML: '<path fill="currentColor" d="M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8z"/>' })
        : null
    ])
  })),
  {
    accessorKey: 'thumbnail',
    header: 'Фото'
  }
]

const filtered = computed(() => {
  if (!products.value) return []
  return products.value.filter(product =>
    [product.title, product.description, product.brand, product.category].some(value =>
      String(value).toLowerCase().includes(search.value.toLowerCase())
    )
  )
})

const sorted = computed(() => {
  if (!sortKey.value) return filtered.value
  return [...filtered.value].sort((a, b) => {
    const aVal = a[sortKey.value!]
    const bVal = b[sortKey.value!]

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDesc.value ? bVal - aVal : aVal - bVal
    }

    return sortDesc.value
      ? String(bVal).localeCompare(String(aVal))
      : String(aVal).localeCompare(String(bVal))
  })
})

const filteredTotal = computed(() => filtered.value.length)

watch(search, () => {
  page.value = 1
})

const paginated = computed(() => {
  const start = (page.value - 1) * pageCount
  return sorted.value.slice(start, start + pageCount)
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-4 md:p-10 font-sans text-gray-900">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-4 px-1">
        <div class="text-sm text-gray-500">
          {{ filteredTotal }} результатів
        </div>

        <UInput
          v-model="search"
          placeholder="Пошук..."
          class="w-64"
        />
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <UTable
          :data="paginated"
          :columns="columns"
          :ui="{
            thead: 'bg-gray-50 text-gray-600 text-sm',
            tbody: 'divide-y divide-gray-50 text-sm text-gray-800',
            tr: 'hover:bg-gray-50 transition-colors',
            td: 'px-6 py-4 align-top',
            th: 'px-6 py-3.5 font-medium'
          }"
        >
          <template #description-cell="{ row }">
            <div class="max-w-xs whitespace-normal break-words leading-snug">
              {{ row.original.description }}
            </div>
          </template>

          <template #thumbnail-cell="{ row }">
            <div class="w-[100px] h-[100px] flex-shrink-0">
              <img
                :src="row.original.thumbnail"
                alt="product"
                style="width: 100px; height: 100px; object-fit: contain;"
              >
            </div>
          </template>

          <template #rating-cell="{ row }">
            <span :class="row.original.rating < 4.5 ? 'text-red-500' : 'text-green-500'">
              {{ row.original.rating }}
            </span>
          </template>
        </UTable>

        <div class="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
          <div class="flex items-center text-sm text-gray-500 gap-2">
            <span>Показано</span>
            <span class="border border-gray-200 rounded-md px-3 py-1 bg-white shadow-sm font-semibold text-gray-900">
              {{ paginated.length }}
            </span>
            <span>з {{ filteredTotal }} результатів</span>
          </div>

          <UPagination
            v-model:page="page"
            :page-count="pageCount"
            :total="filteredTotal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
