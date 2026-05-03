import client from '../api/client'

export async function login(payload) {
  const { data } = await client.post('/login', payload)
  return data
}

export async function register(payload) {
  const { data } = await client.post('/register', payload)
  return data
}
