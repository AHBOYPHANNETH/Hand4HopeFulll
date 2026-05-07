import client from '../api/client'

export async function fetchProfile() {
  const { data } = await client.get('/profile')
  return data
}

export async function updateProfile(payload) {
  const { data } = await client.put('/profile', payload)
  return data
}
