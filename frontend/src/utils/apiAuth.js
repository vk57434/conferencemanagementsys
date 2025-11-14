import axios from 'axios'
const APIAuth = axios.create({ baseURL: 'http://localhost:5000/api' })
APIAuth.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export default APIAuth