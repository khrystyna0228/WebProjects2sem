export default defineEventHandler((event) => {
  const method = getMethod(event)

  if (method === 'GET') {
    const products = [
      {
        id: 'starter',
        name: 'Starter - Annual',
        trialText: '3-days free then:',
        price: '83.25',
        originalPrice: '$1,188',
        discountPrice: '999',
        savings: '$189 in savings',
        features: [
          { main: 'Primary user only', sub: '(extra team members for $35/month)' },
          { main: 'Save unlimited properties', sub: null },
          { main: '<b>10,000</b> exports', sub: null },
          { main: '<b>500</b> free skip traces', sub: null },
          { main: 'Imports $0.01', sub: null },
          { main: '<b>FREE</b> daily product trainings', sub: null },
          { main: 'Full suite of next-gen tools', sub: null },
          { main: 'AI powered comp tool', sub: null },
          { main: 'Includes dedicated support agent', sub: null }
        ]
      },
      {
        id: 'team',
        name: 'Team - Annual',
        trialText: '3-days free then:',
        price: '207.50',
        originalPrice: '$2,988',
        discountPrice: '2,490',
        savings: '$498 in savings',
        features: [
          { main: 'Primary user + 2 free team members', sub: '(extra team members for $25/month)' },
          { main: 'Save unlimited properties', sub: null },
          { main: '<b>50,000</b> exports', sub: null },
          { main: '<b>1,000</b> free skip traces', sub: null },
          { main: 'Imports $0.01', sub: null },
          { main: '<b>FREE</b> daily product trainings', sub: null },
          { main: 'Full suite of next-gen tools', sub: null },
          { main: 'AI powered comp tool', sub: null },
          { main: 'Includes dedicated support agent', sub: null }
        ]
      },
      {
        id: 'business',
        name: 'Business - Annual',
        trialText: '3-days free then:',
        price: '457.50',
        originalPrice: '$6,588',
        discountPrice: '5,490',
        savings: '$1,098 in savings',
        features: [
          { main: 'Primary user + 6 free team members', sub: '(extra team members for $20/month)' },
          { main: 'Save unlimited properties', sub: null },
          { main: '<b>100,000</b> exports', sub: null },
          { main: '<b>2,000</b> free skip traces', sub: null },
          { main: 'Imports $0.01', sub: null },
          { main: '<b>FREE</b> daily product trainings', sub: null },
          { main: 'Full suite of next-gen tools', sub: null },
          { main: 'AI powered comp tool', sub: null },
          { main: 'Includes dedicated support agent', sub: null }
        ]
      }
    ]

    const query = getQuery(event)
    const planId = query.plan

    if (planId) {
      const found = products.find(p => p.id === planId)
      if (!found) {
        throw createError({ statusCode: 404, statusMessage: 'Plan not found' })
      }
      return found
    }
    return products
  }
})
