import client from 'axios'

export const axios = client.create({
  baseURL: import.meta.env.API_URL
})
