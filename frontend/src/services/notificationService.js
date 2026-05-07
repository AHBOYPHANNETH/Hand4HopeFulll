import client from '../api/client'

export async function fetchNotifications() {
  const { data } = await client.get('/notifications')
  return data
}

export async function markNotificationsRead(id) {
  const { data } = await client.post('/notifications/mark-read', id ? { id } : {})
  return data
}
