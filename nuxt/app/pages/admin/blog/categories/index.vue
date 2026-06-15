<template>
  <div class="bg-gray-100 min-h-screen p-4 md:p-10 font-sans text-gray-900">
    <div class="max-w-7xl mx-auto w-full">
      <div class="flex items-center justify-between mb-6 px-1">
        <h1 class="text-xl font-bold md:text-2xl">
          Категорії блогу
        </h1>
        <UButton
          color="primary"
          icon="i-lucide-plus"
          to="/admin/blog/categories/create"
        >
          Додати категорію
        </UButton>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 px-1">
        <div class="text-sm text-gray-500 order-2 sm:order-1">
          {{ total }} результатів
        </div>

        <div class="flex items-center gap-4 order-1 sm:order-2 ml-auto sm:ml-0 w-full sm:w-auto justify-end">
          <UInput
            v-model="search"
            placeholder="Пошук за назвою..."
            icon="i-lucide-search"
            class="w-full sm:w-72"
            @keyup.enter="onSearch"
          />

          <USelect
            v-model="perPage"
            :items="perPageOptions"
            class="w-24"
            @update:model-value="onPerPageChange"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-base">
        <UTable
          :data="categories"
          :columns="columns"
          :ui="{
            root: 'overflow-x-auto w-full',
            base: 'w-full divide-y divide-gray-200',
            thead: 'bg-gray-50 text-gray-600 text-sm',
            tbody: 'divide-y divide-gray-100 text-sm text-gray-800 bg-white',
            tr: 'hover:bg-gray-50/70 transition-colors',
            td: 'px-6 py-4 align-middle whitespace-nowrap',
            th: 'px-6 py-3.5 font-medium'
          }"
        >
          <template #parent_title-cell="{ row }">
            <span
              v-if="row.original.parent_title"
              class="font-medium text-gray-700"
            >
              {{ row.original.parent_title }}
            </span>
            <span
              v-else
              class="text-gray-400 italic"
            >
              —
            </span>
          </template>

          <template #description-cell="{ row }">
            <span
              v-if="row.original.description"
              class="max-w-md whitespace-normal break-words leading-relaxed block text-gray-600"
            >
              {{ row.original.description }}
            </span>
            <span
              v-else
              class="text-gray-400 italic"
            >
              —
            </span>
          </template>

          <template #actions-cell="{ row }">
            <UDropdownMenu :items="getActionItems(row.original)">
              <UButton
                icon="i-lucide-ellipsis-vertical"
                color="neutral"
                variant="ghost"
                class="hover:bg-gray-100 rounded-full"
              />
            </UDropdownMenu>
          </template>
        </UTable>

        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div class="flex items-center text-sm text-gray-500 gap-2">
            <span>Показано</span>
            <span class="border border-gray-200 rounded-md px-3 py-1 bg-white shadow-sm font-semibold text-gray-900">
              {{ categories.length }}
            </span>
            <span>з {{ total }} результатів</span>
          </div>

          <UPagination
            v-model:page="page"
            :total="total"
            :items-per-page="perPage"
            @update:page="getCategories"
          />
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
  description: string | null
  parent_id: number | null
  parent_title: string | null
}

interface ApiResponse {
  data: CategoryItem[]
  meta: {
    current_page: number
    total: number
    per_page: number
  }
}

const router = useRouter()
const toast = useToast()

const categories = ref<CategoryItem[]>([])
const page = ref(1)
const total = ref(0)
const perPage = ref(5)
const search = ref('')

const perPageOptions = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 }
]

const columns = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'title', header: 'Назва' },
  { accessorKey: 'slug', header: 'Псевдонім' },
  { accessorKey: 'description', header: 'Опис' },
  { accessorKey: 'parent_title', header: 'Батьківська категорія' },
  { id: 'actions', header: 'Дії' }
]

const getCategories = () => {
  $fetch<ApiResponse>('http://localhost/api/admin/blog/categories', {
    params: {
      page: page.value,
      per_page: perPage.value,
      search: search.value
    }
  }).then((response) => {
    categories.value = response.data
    total.value = response.meta.total
  })
}

const deleteCategory = async (id: number) => {
  try {
    await $fetch(`http://localhost/api/admin/blog/categories/${id}`, {
      method: 'DELETE'
    })
    toast.add({
      title: 'Успішно',
      description: 'Категорію видалено',
      color: 'success'
    })
    getCategories()
  } catch (error) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Помилка',
      description: err.data?.message || 'Не вдалося видалити категорію',
      color: 'error'
    })
  }
}

const getActionItems = (category: CategoryItem) => {
  return [
    [
      {
        label: 'Редагувати',
        icon: 'i-lucide-pencil',
        onSelect: () => router.push(`/admin/blog/categories/${category.id}/edit`)
      }
    ],
    [
      {
        label: 'Видалити',
        icon: 'i-lucide-trash-2',
        color: 'error' as const,
        onSelect: () => deleteCategory(category.id)
      }
    ]
  ]
}

const onSearch = () => {
  page.value = 1
  getCategories()
}

const onPerPageChange = () => {
  page.value = 1
  getCategories()
}

getCategories()
</script>
