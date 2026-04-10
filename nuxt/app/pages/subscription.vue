<script setup lang="ts">
useHead({
  title: 'Checkout'
})
interface ProductFeature {
  main: string
  sub?: string | null
}

interface Product {
  id: string
  name: string
  trialText: string
  price: string
  originalPrice: string
  discountPrice: string
  savings: string
  features: ProductFeature[]
}

interface SubmitResponse {
  success: boolean
  message: string
}

const route = useRoute()
const planId = (route.query.plan as string) || 'starter'

const { data: product } = await useFetch<Product>('/api/subscription', {
  query: { plan: planId }
})

const form = reactive({
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  fullName: 'dev4 dev4',
  address: '',
  consent: false
})

const trialEndDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 3)
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
})
const submitForm = async () => {
  try {
    const response = await $fetch<SubmitResponse>('/api/subscription/create', {
      method: 'POST',
      body: form
    })

    if (response) {
      console.log('Відповідь від сервера:', response)
      alert(response.message)
    }
  } catch (error) {
    const err = error as { data?: { statusMessage?: string } }
    console.error('Помилка відправки:', err)
    alert(err.data?.statusMessage || 'Щось пішло не так при відправці')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#fcfcfc] font-sans pb-20 text-[#333]">
    <header class="bg-[#333] text-white text-center py-3 mb-10">
      <h1 class="text-sm font-bold uppercase tracking-widest">
        Checkout
      </h1>
    </header>

    <div class="max-w-[1000px] mx-auto px-6">
      <NuxtLink
        to="/products"
        class="text-gray-400 text-[13px] mb-8 inline-block hover:underline"
      >
        &lt;&lt; back
      </NuxtLink>

      <h2 class="text-[26px] font-bold text-[#2c3e50] mb-2">
        You’re Almost In - Start Your 3-Day Free Trial Now!
      </h2>
      <p class="text-gray-600 text-sm mb-10">
        Set up your account to gain instant access! You won’t be charged if you decide to cancel within 3 days
      </p>

      <div
        v-if="product"
        class="grid grid-cols-1 md:grid-cols-12 gap-12 items-start"
      >
        <div class="md:col-span-5 bg-white rounded-lg border border-gray-100 shadow-xl overflow-hidden">
          <div class="h-[5px] w-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee]" />
          <div class="p-8">
            <h3 class="text-xl font-bold text-gray-800 mb-4">
              {{ product.name }}
            </h3>

            <div class="mb-4">
              <span class="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                3-days free then:
              </span>
              <div class="mt-3 flex items-baseline">
                <span class="text-[42px] font-black text-gray-800 leading-none">${{ product.price }}</span>
                <span class="text-gray-400 text-lg ml-1">/month</span>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                billed yearly at <del class="text-gray-400">{{ product.originalPrice }}</del>
                <span class="font-bold text-gray-700 ml-1">${{ product.discountPrice }}</span>
              </p>
              <div class="mt-3 inline-block bg-[#e6f6f0] text-[#059669] text-xs font-bold px-3 py-1.5 rounded">
                {{ product.savings }}
              </div>
            </div>

            <hr class="my-8 border-gray-100">

            <ul class="space-y-4">
              <li
                v-for="(f, i) in product.features"
                :key="i"
                class="flex gap-4 items-start"
              >
                <svg
                  class="w-4 h-4 text-[#7DE282] shrink-0 mt-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0l3.09 8.91L24 12l-8.91 3.09L12 24l-3.09-8.91L0 12l8.91-3.09L12 0z" />
                </svg>
                <div class="text-[13px] leading-relaxed">
                  <span
                    class="text-gray-700 font-semibold"
                    v-html="f.main"
                  />
                  <p
                    v-if="f.sub"
                    class="text-gray-500 mt-1 italic"
                  >
                    {{ f.sub }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="md:col-span-7 bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
          <h3 class="text-lg font-bold text-gray-800 mb-6">
            Order Summary
          </h3>

          <div class="space-y-4 text-[14px] mb-8">
            <div class="flex justify-between text-gray-600 pb-2 border-b border-gray-100">
              <span>Annual Plan</span>
              <span class="font-medium">${{ product.discountPrice }}.00</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span class="max-w-[200px] md:max-w-none">Total Due <span class="text-[11px] text-gray-400">(*not including sales tax where applicable)</span></span>
              <span class="font-medium">${{ product.discountPrice }}.00</span>
            </div>
            <div class="flex justify-between font-bold text-gray-800 pt-2">
              <span>Due Today</span>
              <span>$0.00</span>
            </div>
          </div>

          <div class="bg-[#f3f4f6] text-center py-4 rounded-md text-[13px] font-bold text-gray-500 mb-8">
            Includes 3-Day Free Trial
          </div>

          <h3 class="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
            Billing Information
            <span class="text-gray-400 text-[10px] border border-gray-300 rounded-full w-4 h-4 flex items-center justify-center italic">i</span>
          </h3>

          <form
            class="space-y-6"
            @submit.prevent="submitForm"
          >
            <div>
              <label class="block text-[14px] font-semibold text-gray-500 mb-2">Card Details</label>
              <div class="flex items-center border border-gray-300 rounded-md px-3 py-2.5 bg-[#fafafa]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-gray-400 mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                ><path
                  fill="currentColor"
                  d="M5 5h13a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v1h17V8a2 2 0 0 0-2-2zM3 17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-5H3zm2-1h4v1H5zm6 0h3v1h-3zm-8-6v1h17v-1z"
                /></svg>
                <input
                  v-model="form.cardNumber"
                  type="text"
                  placeholder="Number"
                  class="w-full text-[14px] outline-none bg-transparent placeholder-gray-400 font-medium"
                >
                <input
                  v-model="form.cardExpiry"
                  type="text"
                  placeholder="MM / YY"
                  class="w-20 text-[14px] outline-none bg-transparent placeholder-gray-400 text-right px-2 font-medium"
                >
                <input
                  v-model="form.cardCvc"
                  type="text"
                  placeholder="CVC"
                  class="w-14 text-[14px] outline-none bg-transparent placeholder-gray-400 text-right font-medium"
                >
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-semibold text-gray-500 mb-2">Address</label>
              <div class="border border-gray-300 rounded-md p-4 bg-[#fafafa] space-y-4">
                <label class="block text-[13px] text-gray-600 mb-1">Full name</label>
                <div class="relative border border-gray-300 rounded p-2 bg-white">
                  <input
                    v-model="form.fullName"
                    type="text"
                    class="w-full text-sm outline-none bg-transparent font-medium"
                  >
                </div>
                <label class="block text-[13px] text-gray-600 mb-1">Address</label>
                <div class="relative border border-gray-300 rounded p-2 bg-white">
                  <textarea
                    v-model="form.address"
                    rows="1"
                    class="w-full text-sm outline-none bg-transparent resize-none"
                  />
                </div>
              </div>
            </div>
            <div class="flex items-start gap-3 pt-2">
              <input
                id="consent"
                v-model="form.consent"
                type="checkbox"
                class="mt-1.5 w-5 h-5 accent-gray-700 shrink-0 border-gray-300 rounded"
              >
              <label
                for="consent"
                class="text-[11px] text-gray-500 leading-[1.6]"
              >
                I consent to <a
                  href="#"
                  class="font-bold underline text-gray-700 hover:text-black"
                >Terms of Use</a> and understand my 3-day free trial will automatically convert to
                <span class="font-semibold">${{ product.discountPrice }}.00</span> per year starting on <span class="font-semibold">{{ trialEndDate }}</span>.
                The yearly fee will be automatically charged each year going forward unless I cancel my account at least one (1) business day before the end of the current billing period, which can be done by calling (888) 463-3163.
              </label>
            </div>

            <button
              type="submit"
              class="w-full md:w-auto px-14 py-4 bg-[#e0e0e0] hover:bg-[#d0d0d0] text-gray-600 text-sm font-bold rounded-md transition duration-200"
            >
              Try It Free
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
