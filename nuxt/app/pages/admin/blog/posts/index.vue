<template>
  <div class="bg-gray-100 min-h-screen p-4 md:p-10 font-sans text-gray-900">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6 px-1">
        <h1 class="text-xl font-bold md:text-2xl">
          Статті блогу
        </h1>
        <UButton
          color="primary"
          icon="i-lucide-plus"
          to="/admin/blog/posts/create"
        >
          Додати статтю
        </UButton>
      </div>

      <div class="flex items-center justify-between mb-4 px-1 flex-wrap gap-3">
        <div class="text-sm text-gray-500">
          {{ total }} результатів
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <UInput
            v-model="search"
            placeholder="Пошук за заголовком..."
            class="w-64"
            @keyup.enter="onSearch"
          />
          <USelect
            v-model="selectedCategory"
            :items="categoryOptions"
            placeholder="Категорія"
            class="w-48"
            @update:model-value="onCategoryChange"
          />

          <USelect
            v-model="perPage"
            :items="perPageOptions"
            class="w-32"
            @update:model-value="onPerPageChange"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <UTable
          :data="posts"
          :columns="columns"
          :ui="{
            thead: 'bg-gray-50 text-gray-600 text-sm',
            tbody: 'divide-y divide-gray-50 text-sm text-gray-800',
            tr: 'hover:bg-gray-50 transition-colors',
            td: 'px-6 py-4 align-top',
            th: 'px-6 py-3.5 font-medium'
          }"
        >
          <template #title-cell="{ row }">
            <NuxtLink
              :to="'/admin/blog/posts/' + row.original.id"
              class="text-gray-800 hover:underline"
            >
              {{ row.original.title }}
            </NuxtLink>
          </template>

          <template #date_published-cell="{ row }">
            <span v-if="row.original.date_published">
              {{ row.original.date_published }}
            </span>
            <span
              v-else
              class="text-gray-400"
            >
              Дата не вказана
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

        <div class="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
          <div class="flex items-center text-sm text-gray-500 gap-2">
            <span>Показано</span>
            <span class="border border-gray-200 rounded-md px-3 py-1 bg-white shadow-sm font-semibold text-gray-900">
              {{ posts.length }}
            </span>
            <span>з {{ total }} результатів</span>
          </div>

          <UPagination
            v-model:page="page"
            :items-per-page="perPage"
            :total="total"
            @update:page="getPosts"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: number
  title: string
  user_id: number
  category_id: number
  user_name: string | null
  category_title: string | null
  date_published: string | null
}

interface Category {
  id: number
  id_title: string
}

interface ApiResponse {
  data: Post[]
  meta: {
    current_page: number
    total: number
    per_page: number
  }
}

const router = useRouter()
const toast = useToast()

const posts = ref<Post[]>([])
const page = ref(1)
const total = ref(0)
const perPage = ref(25)
const search = ref('')

const perPageOptions = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
]

const columns = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'user_name', header: 'Автор' },
  { accessorKey: 'category_title', header: 'Категорія' },
  { accessorKey: 'title', header: 'Заголовок' },
  { accessorKey: 'date_published', header: 'Дата публікації' },
  { id: 'actions', header: 'Дії' }
]

const selectedCategory = ref<number | null>(null)
const categoryOptions = ref<{ label: string, value: number | null }[]>([
  { label: 'Всі категорії', value: null }
])

const getCategories = () => {
  $fetch<Category[]>('http://localhost/api/admin/blog/categories-combobox')
    .then((response) => {
      categoryOptions.value = [
        { label: 'Всі категорії', value: null },
        ...response.map(c => ({ label: c.id_title, value: c.id }))
      ]
    })
}

const getPosts = () => {
  $fetch<ApiResponse>('http://localhost/api/admin/blog/posts', {
    params: {
      page: page.value,
      per_page: perPage.value,
      search: search.value,
      category_id: selectedCategory.value
    }
  }).then((response) => {
    posts.value = response.data
    total.value = response.meta.total
  })
}

const deletePost = async (id: number) => {
  try {
    await $fetch(`http://localhost/api/admin/blog/posts/${id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Успішно',
      description: 'Статтю видалено',
      color: 'success'
    })

    getPosts()
  } catch (error) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Помилка',
      description: err.data?.message || 'Не вдалося видалити статтю',
      color: 'error'
    })
  }
}

const getActionItems = (post: Post) => {
  return [
    [
      {
        label: 'Перегляд',
        icon: 'i-lucide-eye',
        onSelect: () => router.push(`/admin/blog/posts/${post.id}`)
      },
      {
        label: 'Редагувати',
        icon: 'i-lucide-pencil',
        onSelect: () => router.push(`/admin/blog/posts/${post.id}/edit`)
      }
    ],
    [
      {
        label: 'Видалити',
        icon: 'i-lucide-trash-2',
        color: 'error' as const,
        onSelect: () => deletePost(post.id)
      }
    ]
  ]
}

const onSearch = () => {
  page.value = 1
  getPosts()
}

const onCategoryChange = () => {
  page.value = 1
  getPosts()
}

const onPerPageChange = () => {
  page.value = 1
  getPosts()
}

getCategories()
getPosts()
</script>
