import { admin } from '../support/utils'

describe('Login Page', function() {

  beforeEach(function() {
    cy.visit('/register')
  })

  it('does not have a logout button', () => {
    cy.get('h1 button').should('not.exist')
  })

  it('has text "Register"', () => {
    cy.contains('.v-toolbar__title', 'Register')
  })

  it('links to "/login"', () => {
    cy.contains('Already have an account?')
    cy.contains('Login').should('have.attr', 'href', '/login')
  })

  it('requires email on submit', () => {
    cy.get('button').contains('Register').click()
    cy.get('.error--text').should('contain', 'E-mail is required.')
  })

  it('requires password on submit', () => {
    cy.get('button').click()
    cy.get('.error--text').should('contain', 'Password is required.')
  })

  it('validates 2. password on blur', () => {
    cy.get('[name="password"]').type('correctamente')
    cy.get('[name="password2"]').type('wrong').trigger('blur')
    cy.get('.error--text').should('contain', 'Passwords don\'t match!')
  })

  it('alerts that email aready exists', () => {
    cy.get('[type="email"]').type(admin.email)
    cy.get('[name="password"]').type('oooooooo')
    cy.get('[name="password2"]').type('oooooooo')
    cy.get('button').click()
    cy.get('.v-snack__content').should('contain', 'This e-mail is already registered')
  })

  it('registers on valid input', () => {
    cy.get('[type="email"]').type('testuser@ed.cba')
    cy.get('[name="password"]').type('oooooooo')
    cy.get('[name="password2"]').type('oooooooo')

    cy.get('button').click()
    cy.url().should('include', '/restaurants')

    cy.login(admin.email, admin.password)
      .then(resp => cy.removeUser(resp.body.token))
  })
})
