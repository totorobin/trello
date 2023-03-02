import axios from 'axios'

const baseDomain = 'http://192.168.1.80:8080'
const baseURL = `${baseDomain}/api`

export default axios.create({
  baseURL
})
