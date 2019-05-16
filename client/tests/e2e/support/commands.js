import { API_URL } from '../support/config'

Cypress.Commands.add('resetUsers', token => cy.request({
  method: 'DELETE',
  url: `${API_URL}users`,
  headers: { Authorization: `Bearer ${token}` }
}))

Cypress.Commands.add('removeUser', token => cy.request({
  method: 'DELETE',
  url: `${API_URL}users/testuser`,
  headers: { Authorization: `Bearer ${token}` }
}))

Cypress.Commands.add('resetRestaurants', token => cy.request({
  method: 'DELETE',
  url: `${API_URL}restaurants`,
  headers: { Authorization: `Bearer ${token}` }
}))

Cypress.Commands.add('resetReviews', (token, sid) => cy.request({
  method: 'DELETE',
  url: `${API_URL}restaurants/${sid}/reviews`,
  Authorization: `Bearer ${token}`
}))

Cypress.Commands.add('resetDB', (coll, token, sid) => {
  if (!coll || coll === 'restaurants') cy.resetRestaurants(token)
  if (!coll || coll === 'users') cy.resetUsers(token)
  if (coll === 'reviews') cy.resetReviews(token, sid)
})

Cypress.Commands.add('fx_resetUsers', () => cy.route('DELETE', `${API_URL}users`, []))
Cypress.Commands.add('fx_resetRestaurants', () => cy.route('DELETE', `${API_URL}restaurants`, []))
Cypress.Commands.add('fx_resetReviews', (sid) => cy.route('DELETE', `${API_URL}restaurants/${sid}/reviews`, []))
Cypress.Commands.add('fx_resetDB', (token) => {
  cy.fx_resetUsers()
  cy.fx_resetRestaurants()
})

Cypress.Commands.add('register', (role, email, password) => {
  cy.request({
		method: 'POST',
		url: `${API_URL}users`,
    body: { email, password, role }
	})
})

Cypress.Commands.add('login', (email, password) => {
  cy.request({
		method: 'GET',
		url: `${API_URL}users/self`,
		headers: { Authorization: 'Basic ' + btoa(`${email}:${password}`) }
	})
    .then(resp => {
      return cy.window().its('localStorage').then(storage => {
        storage.setItem('token', resp.body.token)
        return resp
      })
    })
})
