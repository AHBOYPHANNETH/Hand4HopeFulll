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

export async function fetchUsers(params = {}) {
  const { data } = await client.get('/admin/users', { params })
  return data
}

export async function updateUser(id, payload) {
  const { data } = await client.patch(`/admin/users/${id}`, payload)
  return data
}

export async function deleteUser(id) {
  const { data } = await client.delete(`/admin/users/${id}`)
  return data
}
