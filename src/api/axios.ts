// import axios from 'axios'

// import { getEnvironmentConfig } from '../config/environment'

// const axiosInstance = axios.create({
//   baseURL: getEnvironmentConfig().apiUrl,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// export default axiosInstance
