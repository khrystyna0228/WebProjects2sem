export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'POST') {
    const body = await readBody(event)

    if (!body.fullName || !body.cardNumber) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Please fill in your name and card details'
      })
    }

    console.log('Дані успішно відправлено на :', body)

    return {
      success: true,
      message: 'Success! Your free trial has started.'
    }
  }
})
