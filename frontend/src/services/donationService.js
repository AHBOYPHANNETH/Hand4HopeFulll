import client from '../api/client'

export async function submitDonation(payload) {
  const { data } = await client.post('/donations', payload)
  return data
}
