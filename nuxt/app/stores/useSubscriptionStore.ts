import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscription', () => {
  const selectedPlan = ref<string | null>(null)

  function setPlan(planId: string) {
    selectedPlan.value = planId
  }

  return {
    selectedPlan,
    setPlan
  }
})
