import client from '../api/client'

export async function fetchEvents(params = {}) {
  const { data } = await client.get('/events', { params })
  return data
}

export async function fetchEvent(id) {
  const { data } = await client.get(`/events/${id}`)
  return data
}

export async function volunteerForEvent(eventId, payload) {
  const { data } = await client.post(`/events/${eventId}/volunteer`, payload)
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
  // PHP doesn't parse multipart bodies on PATCH/PUT — POST with _method spoofing
  // is the standard Laravel workaround so the file and fields come through.
  formData.append('_method', 'PATCH')
  const { data } = await client.post(`/admin/events/${id}`, formData)
  return data
}

export async function adminDeleteEvent(id) {
  const { data } = await client.delete(`/admin/events/${id}`)
  return data
}

export async function fetchMyVolunteerRequests() {
  const { data } = await client.get('/my-volunteer-requests')
  return data
}

export async function adminFetchVolunteerRequests() {
  const { data } = await client.get('/admin/volunteer-requests')
  return data
}

export async function adminUpdateVolunteerRequestStatus(payload) {
  const { data } = await client.post('/admin/volunteer-requests/update-status', payload)
  return data
}

export async function adminFetchEventRosters() {
  const { data } = await client.get('/admin/event-rosters')
  return data
}

export async function adminFetchEventRoster(eventId) {
  const { data } = await client.get(`/admin/event-rosters/${eventId}`)
  return data
}

/**
 * Fetch the CSV as a blob (Sanctum token rides on the Authorization header,
 * so a plain <a download> won't work) and trigger a client-side download.
 */
export async function adminDownloadEventRosterCsv(eventId, filenameHint = 'event') {
  const response = await client.get(`/admin/event-rosters/${eventId}/export`, {
    responseType: 'blob',
  })
  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const safe = filenameHint
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'event'
  link.download = `${safe}-volunteers.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
