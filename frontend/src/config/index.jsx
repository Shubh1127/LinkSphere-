import axios from 'axios'

export const clientServer=axios.create({
    baseURL:'http://localhost:9090',
    withCredentials:true,
})