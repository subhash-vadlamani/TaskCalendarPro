import axios from 'axios'
import { ACCESS_TOKEN } from './constants'

const VITE_API_URL = "http://127.0.0.1:8000"
const apiUrl = "/choreo-apis/djangoreactnoteapp/backend/rest-api-be2/v1"

const task = axios.create({
    baseURL: VITE_API_URL ? VITE_API_URL : apiUrl

})

task.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }
        console.log('Request Configuration:', config);  // Log the request configuration
        return config
    },
    (error) => {
        console.log('Request Error:', error)
        return Promise.reject(error)
    }
)

console.log(task.defaults.baseURL)

export default task