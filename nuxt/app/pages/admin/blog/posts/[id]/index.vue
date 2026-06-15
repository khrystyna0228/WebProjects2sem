<template>
  <div class="bg-gray-50 min-h-screen py-8 md:py-14 font-sans text-gray-900">
    <div class="max-w-3xl mx-auto px-4">
      <div class="mb-6">
        <UButton
          to="/admin/blog/posts"
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
          class="-ml-2.5 text-gray-500 hover:text-gray-900 transition"
        >
          Назад до списку статей
        </UButton>
      </div>

      <div
        v-if="post"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10"
      >
        <div
          v-if="post.category?.title"
          class="mb-4"
        >
          <UBadge
            color="primary"
            variant="subtle"
            size="md"
            class="rounded-md font-medium"
          >
            {{ post.category.title }}
          </UBadge>
        </div>

        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3 leading-tight">
          {{ post.title }}
        </h1>

        <p
          v-if="post.excerpt"
          class="text-lg text-gray-500 mb-6 leading-relaxed"
        >
          {{ post.excerpt }}
        </p>

        <div class="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 border-b border-gray-100 pb-6 mb-8">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-user"
              class="w-4 h-4 text-gray-400"
            />
            <span class="font-medium text-gray-700">{{ post.user?.name || 'Анонім' }}</span>
          </div>

          <div
            v-if="post.published_at"
            class="flex items-center gap-2"
          >
            <UIcon
              name="i-lucide-calendar"
              class="w-4 h-4 text-gray-400"
            />
            <span>{{ formatDate(post.published_at) }}</span>
          </div>

          <UBadge
            v-if="!post.is_published"
            color="warning"
            variant="subtle"
            class="rounded-md"
          >
            Не опубліковано
          </UBadge>
        </div>

        <div
          class="prose prose-slate prose-lg max-w-none text-gray-800 leading-relaxed
                 prose-headings:font-bold prose-headings:text-gray-950
                 prose-p:mb-5 prose-a:text-primary hover:prose-a:underline"
          v-html="post.content_html"
        />
      </div>

      <div
        v-else
        class="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="w-8 h-8 animate-spin text-primary"
        />
        <p class="font-medium">
          Завантаження вмісту статті...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Post {
  id: number
  title: string
  excerpt: string | null
  content_html: string
  published_at: string | null
  is_published: boolean
  category?: { id: number, title: string }
  user?: { id: number, name: string }
}

const route = useRoute()
const post = ref<Post | null>(null)

const getPost = () => {
  $fetch<Post>(`http://localhost/api/admin/blog/posts/${route.params.id}`)
    .then((response) => {
      post.value = response
    })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('uk-UA')
}

getPost()
</script>
