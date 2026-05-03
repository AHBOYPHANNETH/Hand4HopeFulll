import client from '../api/client'

export async function fetchAnalytics() {
  const { data } = await client.get('/admin/analytics')
  return data
}

export async function fetchDonations() {
  const { data } = await client.get('/admin/donations')
  return data
}

export async function fetchContacts() {
  const { data } = await client.get('/admin/contacts')
  return data
}
