import client from '../api/client'

export async function fetchProfile() {
  const { data } = await client.get('/profile')
  return data
}

export async function updateProfile(payload) {
  const { data } = await client.put('/profile', payload)
  return data
}

export async function uploadAvatar(file) {
  const fd = new FormData()
  fd.append('avatar', file)
  const { data } = await client.post('/profile/avatar', fd)
  return data
}

export async function removeAvatar() {
  const { data } = await client.delete('/profile/avatar')
  return data
}
