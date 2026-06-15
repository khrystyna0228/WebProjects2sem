<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-6"
    @submit="onSubmit"
  >
    <div class="space-y-5">
      <UFormField
        label="Заголовок"
        name="title"
        required
        :ui="{ label: 'text-sm font-medium text-gray-900' }"
      >
        <UInput
          v-model="state.title"
          class="w-full"
          placeholder="Заголовок статті"
        />
      </UFormField>

      <UFormField
        label="Псевдонім (slug)"
        name="slug"
        description="Згенерується автоматично, якщо не вказати"
        :ui="{ label: 'text-sm font-medium text-gray-900', description: 'text-xs text-gray-400' }"
      >
        <UInput
          v-model="state.slug"
          class="w-full"
          placeholder="post-slug"
        />
      </UFormField>

      <UFormField
        label="Короткий опис"
        name="excerpt"
        description="Необов'язково"
        :ui="{ label: 'text-sm font-medium text-gray-900', description: 'text-xs text-gray-400' }"
      >
        <UTextarea
          v-model="state.excerpt"
          class="w-full"
          placeholder="Короткий опис статті..."
          :rows="2"
        />
      </UFormField>

      <UFormField
        label="Текст статті"
        name="content_raw"
        required
        :ui="{ label: 'text-sm font-medium text-gray-900' }"
      >
        <UTextarea
          v-model="state.content_raw"
          class="w-full"
          placeholder="Текст статті..."
          :rows="8"
        />
      </UFormField>
    </div>

    <USeparator />

    <div class="space-y-5">
      <UFormField
        label="Категорія"
        name="category_id"
        required
        :ui="{ label: 'text-sm font-medium text-gray-900' }"
      >
        <USelect
          v-model="state.category_id"
          :items="categoryOptions"
          class="w-full"
          placeholder="Оберіть категорію"
        />
      </UFormField>

      <UFormField
        label="Публікація"
        name="is_published"
        :ui="{ label: 'text-sm font-medium text-gray-900' }"
      >
        <USwitch
          v-model="state.is_published"
          label="Опублікувати статтю"
        />
      </UFormField>
    </div>

    <div class="flex flex-col sm:flex-row gap-2 pt-2">
      <UButton type="submit" color="primary" class="sm:flex-1 justify-center">
        Зберегти
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        to="/admin/blog/posts"
        class="sm:flex-1 justify-center bg-white text-gray-700 hover:bg-gray-50 border-gray-200 transition-colors"
      >
        Скасувати
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

interface PostItem {
  id: number
  title: string
  slug: string | null
  excerpt?: string | null
  content_raw?: string
  category_id: number | null
  is_published: boolean
}

interface ComboBoxItem {
  id: number
  id_title: string
}

const props = defineProps<{
  post?: PostItem | null
}>()

const isEdit = computed(() => !!props.post?.id)

const schema = z.object({
  title: z.string().min(5, 'Мінімум 5 символів').max(200, 'Максимум 200 символів'),
  slug: z.string().max(200, 'Максимум 200 символів').optional().or(z.literal('')),
  excerpt: z.string().max(500, 'Максимум 500 символів').optional().or(z.literal('')),
  content_raw: z.string().min(5, 'Мінімум 5 символів').max(10000, 'Максимум 10000 символів'),
  category_id: z.number({ message: 'Оберіть категорію' }),
  is_published: z.boolean()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: props.post?.title ?? '',
  slug: props.post?.slug ?? '',
  excerpt: props.post?.excerpt ?? '',
  content_raw: props.post?.content_raw ?? '',
  category_id: props.post?.category_id ?? undefined,
  is_published: props.post?.is_published ?? false
})

const categoryOptions = ref<{ label: string, value: number }[]>([])

const getCategoryOptions = () => {
  $fetch<ComboBoxItem[]>('http://localhost/api/admin/blog/categories-combobox')
    .then((response) => {
      categoryOptions.value = response.map(item => ({
        label: item.id_title,
        value: item.id
      }))
    })
}

onMounted(() => {
  getCategoryOptions()
})

const toast = useToast()
const router = useRouter()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const url = isEdit.value
    ? `http://localhost/api/admin/blog/posts/${props.post?.id}`
    : 'http://localhost/api/admin/blog/posts'

  const method = isEdit.value ? 'PUT' : 'POST'

  try {
    await $fetch(url, {
      method,
      body: event.data
    })

    toast.add({
      title: 'Успішно',
      description: isEdit.value ? 'Статтю оновлено' : 'Статтю створено',
      color: 'success'
    })

    router.push('/admin/blog/posts')
  } catch (error) {
    const err = error as { data?: { message?: string } }
    toast.add({
      title: 'Помилка',
      description: err.data?.message || 'Сталася помилка при збереженні',
      color: 'error'
    })
  }
}
</script>
