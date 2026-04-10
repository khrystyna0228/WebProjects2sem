<template>
  <div class="max-w-[1200px] mx-auto p-6 font-sans">
    <div class="flex flex-col md:flex-row justify-between items-center mb-10">
      <h2 class="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
        Start Your 3 Day Free Trial
      </h2>
      <div class="flex items-center gap-3 mt-4 md:mt-0">
        <div class="flex items-center text-[#00b67a] text-[14px] font-semibold">
          Save up to 20%
          <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
        </div>
        <div class="flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button class="px-4 py-1.5 bg-white text-gray-800 font-semibold text-sm border-r border-gray-200">
            Annual
          </button>
          <button class="px-4 py-1.5 bg-gray-50 text-gray-500 font-medium text-sm hover:bg-gray-100 transition">
            Monthly
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-gray-400 hover:shadow-2xl flex flex-col"
      >
        <div class="h-1.5 w-full bg-gradient-to-r from-[#4ade80] to-[#06b6d4]" />

        <div class="p-8 flex-1 flex flex-col">
          <h2 class="text-2xl font-bold text-gray-800">
            {{ product.name }}
          </h2>

          <div class="mt-4">
            <span class="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded">
              {{ product.trialText }}
            </span>
          </div>

          <div class="mt-3 flex items-baseline leading-none">
            <span class="text-4xl font-extrabold text-gray-800">
              <span class="text-2xl mr-1">
                $
              </span>
              {{ product.price }}
            </span>
            <span class="text-gray-400 ml-1 text-sm">
              /month
            </span>
          </div>

          <p class="text-[13px] text-gray-500 mt-3">
            billed yearly at
            <del class="text-gray-400">
              {{ product.originalPrice }}
            </del>
            <span class="font-semibold text-gray-700 ml-1">
              {{ product.discountPrice }}
            </span>
          </p>

          <div class="mt-3">
            <span class="bg-[#E2E8F0] text-[#1e8e3e] text-[13px] font-bold px-3 py-1 rounded">
              {{ product.savings }}
            </span>
          </div>

          <NuxtLink
            :to="`/subscription?plan=${product.id}`"
            class="w-full block text-center mt-8 py-2.5 px-4 font-bold text-gray-900 rounded border border-transparent transition-all duration-200 bg-gradient-to-r from-[#fcd34d] to-[#f97316] hover:border-gray-800 hover:opacity-90"
          >
            Try It Free
          </NuxtLink>

          <hr class="border-gray-100 my-6">

          <ul class="space-y-4 flex-1">
            <li
              v-for="(feature, index) in product.features"
              :key="index"
              class="flex items-start gap-3"
            >
              <svg class="w-[16px] h-[16px] text-[#7DE282] flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M7.53 1.282a.5.5 0 0 1 .94 0l.478 1.306a7.5 7.5 0 0 0 4.464 4.464l1.305.478a.5.5 0 0 1 0 .94l-1.305.478a7.5 7.5 0 0 0-4.464 4.464l-.478 1.305a.5.5 0 0 1-.94 0l-.478-1.305a7.5 7.5 0 0 0-4.464-4.464L1.282 8.47a.5.5 0 0 1 0-.94l1.306-.478a7.5 7.5 0 0 0 4.464-4.464Z" /></svg>
              <div class="text-[13px] leading-snug">
                <span
                  class="text-gray-800"
                  v-html="feature.main"
                />
                <div
                  v-if="feature.sub"
                  class="text-[13px] text-gray-500 font-normal mt-0.5"
                >
                  {{ feature.sub }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Список продуктів'
})

const { data: products } = await useFetch('/api/products')
</script>
