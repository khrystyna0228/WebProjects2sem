<template>
  <div class="bg-gray-100 min-h-screen p-4 md:p-10 font-sans text-gray-900">
    <div class="max-w-2xl mx-auto">
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

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h1 class="text-xl font-bold mb-1">
          Додати статтю
        </h1>
        <p class="text-sm text-gray-500 mb-6">
          Заповніть форму нижче, щоб створити нову статтю
        </p>
        <PostForm />
      </div>
    </div>
  </div>
</template>
