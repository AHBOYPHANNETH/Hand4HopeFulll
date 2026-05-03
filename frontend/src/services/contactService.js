import client from '../api/client'

export async function submitContact(payload) {
  const { data } = await client.post('/contacts', payload)
  return data
}
