import client from '../api/client'

export async function fetchPublicContents() {
  const { data } = await client.get('/site-contents')
  return data
}

export async function adminFetchContents() {
  const { data } = await client.get('/admin/site-contents')
  return data
}

export async function adminUpsertContents(contents) {
  const { data } = await client.put('/admin/site-contents', { contents })
  return data
}
