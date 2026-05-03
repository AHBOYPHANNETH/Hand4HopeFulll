import axios from 'axios'
import { API_URL } from '../config'

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
})

client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hand4hope_token')
      localStorage.removeItem('hand4hope_user')
      delete client.defaults.headers.common.Authorization
    }
    return Promise.reject(err)
  }
)

export function setAuthToken(token) {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete client.defaults.headers.common.Authorization
  }
}

export default client
