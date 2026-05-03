import client from '../api/client'

export async function fetchEvents(params = {}) {
  const { data } = await client.get('/events', { params })
  return data
}

export async function fetchEvent(id) {
  const { data } = await client.get(`/events/${id}`)
  return data
}

export async function volunteerForEvent(eventId, notes) {
  const { data } = await client.post(`/events/${eventId}/volunteer`, { notes })
  return data
}

export async function adminFetchEvents() {
  const { data } = await client.get('/admin/events')
  return data
}

export async function adminCreateEvent(formData) {
  const { data } = await client.post('/admin/events', formData)
  return data
}

export async function adminUpdateEvent(id, formData) {
  const { data } = await client.patch(`/admin/events/${id}`, formData)
  return data
}

export async function adminDeleteEvent(id) {
  const { data } = await client.delete(`/admin/events/${id}`)
  return data
}
