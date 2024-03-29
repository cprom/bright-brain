import auth0 from 'auth0-js'
import EventEmitter from 'eventemitter3'
import router from './../router'

export default class AuthService {
  authenticated = this.isAuthenticated()
  authNotifier = new EventEmitter()

  constructor () {
    this.login = this.login.bind(this)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
  }

  // create an instance of auth0.WebAuth with your
  // API and Client credentials
  auth0 = new auth0.WebAuth({
    domain: 'dev-kax21m4nb6wfmym8.us.auth0.com',
    clientID: 'TtFtNBrRCOu1lFnHH04hP6mjodk8Oouc',
    redirectUri: 'http://localhost:8080',
    audience: 'https://django-vuejs-api',
    responseType: 'token id_token',
    scope: 'openid profile'
  })

  // this method calls the authorize() method
  // which triggers the Auth0 login page
  login () {
    this.auth0.authorize()
  }

  // this method calls the parseHash() method of Auth0
  // to get authentication information from the callback URL
  handleAuthentication () {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        console.log(err)
        alert(`Error: ${err.error}. Check the console for further details.`)
      }
      router.replace('/')
    })
  }

  // stores the user's access_token, id_token, and a time at
  // which the access_token will expire in the local storage
  setSession (authResult) {
    this.accessToken = authResult.accessToken
    this.idToken = authResult.idToken
    this.profile = authResult.idTokenPayload
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
    this.authNotifier.emit('authChange', {authenticated: true})
  }

  // remove the access and ID tokens from the
  // local storage and emits the authChange event
  logout () {
    delete this.accessToken
    delete this.idToken
    delete this.expiresAt
    this.authNotifier.emit('authChange', false)
    // navigate to the home route
    router.replace('/')
  }

  // checks if the user is authenticated
  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this.expiresAt
  }

  // a static method to get the access token
  getAuthToken () {
    return this.accessToken
  }

  // a method to get the User profile
  getUserProfile (cb) {
    return this.profile
  }
}
