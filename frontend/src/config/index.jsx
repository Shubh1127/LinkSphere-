import axios from 'axios'

export const BASE_URL= 'https://linksphere-blxe.onrender.com'

export const clientServer=axios.create({
    baseURL:BASE_URL,
    withCredentials:true,
})