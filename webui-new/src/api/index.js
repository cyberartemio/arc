import axios from "axios"

class Api {
  constructor(baseUrl, token = '') {
    this.baseUrl = baseUrl
    this.token = token
  }
  axiosConfig(authenticated) {
    const headers = {}
    if (authenticated)
      headers["Authorization"] = "Bearer: " + this.token
    return {
      headers
    }
  }
  get(endpoint, authenticated = false) {
    return axios.get(this.baseUrl + endpoint, this.axiosConfig(authenticated))
  }

  post(endpoint, data, authenticated = false) {
    return axios.post(this.baseUrl + endpoint, data)
  }

  login(username, password, callback) {
    this.post("/auth", { username: username, password: password }, this.axiosConfig())
      .then((data) => {
        callback(null, data.data.token)
      })
      .catch((err) => {
        callback(err)
      })
  }
      })
  }
}

export default {
  install(app, options) {
    const api = new Api(options.baseUrl, options.token)
    app.provide('api', api)
  }
}
