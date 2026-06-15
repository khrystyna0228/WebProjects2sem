<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-6"
    @submit="onSubmit"
  >
    <div class="space-y-5">
      <UFormField
        label="Назва категорії"
        name="title"
        required
        :ui="{ label: 'text-sm font-medium text-gray-900' }"
      >
        <UInput
          v-model="state.title"
          class="w-full"
          placeholder="Наприклад: Новини технологій"
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
          placeholder="news-technology"
        />
      </UFormField>

      <UFormField
        label="Опис"
        name="description"
        description="Необов'язково"
        :ui="{ label: 'text-sm font-medium text-gray-900', description: 'text-xs text-gray-400' }"
      >
        <UTextarea
          v-model="state.description"
          class="w-full"
          placeholder="Короткий опис категорії..."
          :rows="3"
        />
      </UFormField>
    </div>

    <USeparator />

    <UFormField
      label="Батьківська категорія"
      name="parent_id"
      required
      :ui="{ label: 'text-sm font-medium text-gray-900' }"
    >
      <USelect
        v-model="state.parent_id"
        :items="parentOptions"
        class="w-full"
        placeholder="Оберіть категорію"
      />
    </UFormField>

    <div class="flex flex-col sm:flex-row gap-2 pt-2">
      <UButton type="submit" color="primary" class="sm:flex-1 justify-center">
        Зберегти
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        to="/admin/blog/categories"
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

interface CategoryItem {
  id: number
  title: string
  slug: string | null
  description?: string | null
  parent_id: number | null
}

interface ComboBoxItem {
  id: number
  id_title: string
}

const props = defineProps<{
  category?: CategoryItem | null
}>()

const isEdit = computed(() => !!props.category?.id)

const schema = z.object({
  title: z.string().min(5, 'Мінімум 5 символів').max(200, 'Максимум 200 символів'),
  slug: z.string().max(200, 'Максимум 200 символів').optional().or(z.literal('')),
  description: z.string().max(500, 'Максимум 500 символів').optional().or(z.literal('')),
  parent_id: z.number({ message: 'Оберіть батьківську категорію' })
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: props.category?.title ?? '',
  slug: props.category?.slug ?? '',
  description: props.category?.description ?? '',
  parent_id: props.category?.parent_id ?? undefined
})

const parentOptions = ref<{ label: string, value: number }[]>([])

const getParentOptions = () => {
  $fetch<ComboBoxItem[]>('http://localhost/api/admin/blog/categories-combobox')
    .then((response) => {
      parentOptions.value = response.map(item => ({
        label: item.id_title,
        value: item.id
      }))
    })
}

onMounted(() => {
  getParentOptions()
})

const toast = useToast()
const router = useRouter()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const url = isEdit.value
    ? `http://localhost/api/admin/blog/categories/${props.category?.id}`
    : 'http://localhost/api/admin/blog/categories'

  const method = isEdit.value ? 'PUT' : 'POST'

  try {
    await $fetch(url, {
      method,
      body: event.data
    })

    toast.add({
      title: 'Успішно',
      description: isEdit.value ? 'Категорію оновлено' : 'Категорію створено',
      color: 'success'
    })

    router.push('/admin/blog/categories')
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
