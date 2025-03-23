import axios from "axios"

class Api {
  constructor(baseUrl, token = '') {
    this.baseUrl = baseUrl
    this.token = token
  }
  get(endpoint) {
    return axios.get(this.baseUrl + endpoint)
  }

  post(endpoint, data) {
    return axios.post(this.baseUrl + endpoint, data)
  }

  login(username, password, callback) {
    this.post("/auth", { username: username, password: password })
      .then((data) => {
        callback(null, data.data.token)
      })
      .catch((error) => {
        callback(error)
      })
  }
}

export default {
  install(app, options) {
    const api = new Api(options.baseUrl, options.token)
    app.provide('api', api)
  }
}
