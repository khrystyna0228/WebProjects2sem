<template>
  <div class="container">
    <div class="flex justify-center">
      <div class="w-full">
        <nav class="navbar bg-gray-100">
          <a href="/admin/blog/posts/create">Додати</a>
        </nav>
        <div class="card">
          <div class="card-body">
            <table class="table table-auto">
              <thead>
                <th>#</th>
                <th>ID автора</th>
                <th>ID категорії</th>
                <th>Заголовок</th>
                <th>Дата публікації</th>
              </thead>
              <tbody>
                <tr
                  v-for="post in posts"
                  :key="post.id"
                >
                  <td>{{ post.id }}</td>
                  <td>{{ post.user_id }}</td>
                  <td>{{ post.category_id }}</td>
                  <td>
                    <a :href="'/admin/blog/posts/' + post.id + '/edit'">
                      {{ post.title }}
                    </a>
                  </td>
                  <td>{{ post.date_published }}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
  date_published: string | null
}

interface ApiResponse {
  data: Post[]
}

const posts = ref<Post[]>([])

const getPosts = () => {
  $fetch<ApiResponse>('http://localhost/api/admin/blog/posts')
    .then((response) => {
      console.log(response)
      posts.value = response.data
    })
}

getPosts()
</script>
