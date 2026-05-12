import client from '../api/client'

export async function submitDonation(payload) {
  const { data } = await client.post('/donations', payload)
  return data
}

export async function initiateKhqrDonation(payload) {
  const { data } = await client.post('/donations/khqr/initiate', payload)
  return data
}

export async function fetchKhqrStatus(donationId) {
  const { data } = await client.get(`/donations/khqr/${donationId}/status`)
  return data
}
