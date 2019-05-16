import { admin } from '../support/utils'

describe('Login Page', function() {

  beforeEach(function() {
    cy.visit('/')
  })

  it('redirects to login page from "/"', () => {
    cy.url().should('include', '/login')
  })

  it('redirects to login page from "/restaurants"', () => {
    cy.visit('/restaurants')
    cy.url().should('include', '/login')
  })

  it('redirects to login page from "/users"', () => {
    cy.visit('/users')
    cy.url().should('include', '/login')
  })

  it('does not have a logout button', () => {
    cy.get('h1 button').should('not.exist')
  })

  it('has text "Login Form"', () => {
    cy.contains('.v-toolbar__title', 'Login Form')
  })

  it('links to "/register"', () => {
    cy.contains('Not have an account yet?')
    cy.contains('Register').should('have.attr', 'href', '/register')
  })

  it('requires email on submit', () => {
    cy.get('button').contains('Login').click()
    cy.get('.error--text').should('contain', 'E-mail is required.')
  })

  it('requires password on submit', () => {
    cy.get('button').click()
    cy.get('.error--text').should('contain', 'Password is required.')
  })

  it('validates email on blur', () => {
    cy.get('[type="email"]').type('wrong').trigger('blur')
    cy.get('.error--text').should('contain', 'Must be valid e-mail.')
  })

  it('validates password on blur', () => {
    cy.get('[type="password"]').type('2short').trigger('blur')
    cy.get('.error--text').should('contain', 'Password must contain 8 to 64 characters.')
  })

  it('alerts on wrong credentials', () => {
    cy.get('[type="email"]').type('doesnt@exi.st')
    cy.get('[type="password"]').type('mmmmmmmm')
    cy.get('button').click()
    cy.get('.v-snack__content').should('contain', 'Username or password is incorrect')
  })

  it('logs in on valid input', () => {
    cy.get('[type="email"]').type(admin.email)
    cy.get('[type="password"]').type(admin.password)
    cy.get('button').click()
    cy.url().should('include', '/restaurants')
  })
})
