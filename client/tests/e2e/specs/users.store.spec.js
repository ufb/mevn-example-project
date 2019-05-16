import { admin } from '../support/utils'

describe('Vuex users store', () => {

  beforeEach(() => cy.visit('/'))
  const getStore = () => cy.window().its('__app__.$store')

  describe('Not logged in', () => {

    it('has keys `user` and `users`', () => {
      getStore().its('state.users').should('have.keys', ['users', 'user'])
    })

    it('is empty', () => {
      getStore().its('state.users')
        .then(state => Cypress._.omit(state, 'loading'))
        .should('deep.equal', { user: null, users: [] })
    })

    it('loggs in a user', done => {
      getStore().then(store => {
        store.dispatch('users/login', { username: admin.email, password: admin.password })
          .then(() => {
            expect(store.state.users.user).to.have.keys(['_email', '_id', '_role'])
            done()
          })
      })
    })
  })

  describe('Logged in', () => {

    beforeEach(() => cy.login(admin.email, admin.password))

    it('start empty', () => {
      getStore().its('state.users')
        .then(state => Cypress._.omit(state, 'loading'))
        .should('deep.equal', { user: null, users: [] })
    })

    it('has set `user` correctly', done => {
      cy.visit('/')
      getStore().its('state.users.user').then(user => {
        expect(user._role).to.equal('admin')
        expect(user._email).to.equal(admin.email)
        done()
      })
    })

    it('fetches users (role:admin, page:/users)', () => {
      cy.visit('/users')
      getStore().its('state.users.users').should('not.be.empty')
    })

    it.only('changes state on action `removeUser`', () => {
      cy.visit('/users')

      getStore().then(store => {
        setTimeout(() => {
          const users = store.getters['users/getUsers']
          const length = users.length
          const secondUser = users[1]

          store.dispatch('users/removeUser', secondUser._id).then(() => {
            const updatedUsers = store.state.users.users;
            const removedUser = updatedUsers.find(u => u._id === secondUser._id)

            expect(updatedUsers.length).to.equal(length - 1)
            expect(removedUser).to.equal(undefined)
          })
        }, 0)
      })
    })
  })
})
