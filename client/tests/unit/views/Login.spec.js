import { expect } from 'chai'
import sinon from 'sinon'
import { mount } from '@vue/test-utils'

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

import Login from '@/views/Login.vue'

Vue.config.silent = true

// createLocalVue() doesnt work for vuetify!
// ~> vuetify seems to have trouble being registered on multiple constructors
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Vuetify)


describe('Login.vue', () => {

  const router = new VueRouter()
  let store

  const _mount = mockUser => {
    return !mockUser ? mount(Login, { store, router }) :
      mount(Login, {
        computed: { user: {} },
        store,
        router
      })
  }

  it('mounts correctly', () => {
    const wrapper = _mount(true)

    wrapper.setProps({ user: {} })

    expect(wrapper.isVueInstance()).to.equal(true)
  })

  it('renders correct inputs & submit button', () => {
    const wrapper = _mount(true)

    expect(wrapper.contains('input[type="email"]')).to.equal(true)
    expect(wrapper.contains('input[type="password"]')).to.equal(true)
    expect(wrapper.contains('button')).to.equal(true)
  })

  it('doesnt render error msgs initially', () => {
    const wrapper = _mount(true)

    expect(wrapper.contains('.error--text')).to.equal(false)
  })

  describe('Input Behavior', () => {

    const inout = inps => inps.forEach(inp => { inp.trigger('focus'); inp.trigger('blur') })

    // no need to split into multiple `it` blocks here ~> console will tell ;)
    it('triggers correct error rendering @blur if invalid', () => {
      let text;
      const wrapper = _mount(true)
      const emailInput = wrapper.find('input[type="email"]')
      const pwInput = wrapper.find('input[type="password"]')

      inout([emailInput, pwInput])
      text = wrapper.text()

      expect(text.includes('E-mail is required')).to.equal(true)
      expect(text.includes('Password is required')).to.equal(true)

      emailInput.setValue('erróneo')
      pwInput.setValue(7)
      inout([emailInput, pwInput])
      text = wrapper.text()

      expect(text.includes('E-mail is required')).to.equal(false)
      expect(text.includes('Password is required')).to.equal(false)
      expect(text.includes('Must be valid e-mail')).to.equal(true)
      expect(text.includes('Password must contain 8 to 64 characters')).to.equal(true)
    })

    it('doesnt trigger error rendering @blur if valid', () => {
      const wrapper = _mount(true)
      const emailInput = wrapper.find('input[type="email"]')
      const pwInput = wrapper.find('input[type="password"]')

      emailInput.setValue('correct@mail.duh')
      pwInput.setValue('correctamente')
      inout([emailInput, pwInput])

      expect(wrapper.contains('.error--text')).to.equal(false)
    })
  })

  describe('Link `Register`', () => {

    it('routes to `/register`', () => {
      const wrapper = _mount(true)
      const link = wrapper.find('a')

      link.trigger('click')

      expect(wrapper.vm.$route.path).to.equal('/register')
    })
  })

  describe('Form Submit', () => {

    let actions

    beforeEach(() => {
      actions = { login: sinon.stub() }
      store = new Vuex.Store({
        modules: {
          users: { namespaced: true, actions }
        }
      })
    })

    describe('Error Rendering', () => {

      it('renders error msgs if invalid', () => {
        const wrapper = _mount(true)
        const inputBtn = wrapper.find('button')

        inputBtn.trigger('click')

        expect(wrapper.contains('.error--text')).to.equal(true)
      })

      it('doesnt render error msgs if valid', () => {
        const wrapper = _mount(true)
        const inputBtn = wrapper.find('button')

        wrapper.setData({ email: 'valid@gmx.de', password: '12345678' })
        inputBtn.trigger('click')

        expect(wrapper.contains('.error--text')).to.equal(false)
      })
    })

    describe('Dispatch Action', () => {

      it('dispatches store action `login` if valid', () => {
        const wrapper = _mount(true)

        wrapper.setData({ email: 'this@is.valid', password: 'thisisvalid.too' })
        wrapper.find('button').trigger('click')

        expect(actions.login.calledOnce).to.equal(true)
      })

      it('doesnt dispatch store action if invalid', () => {
        const wrapper = _mount(true)

        wrapper.setData({ email: 'naaaah', password: 'nein' })
        wrapper.find('button').trigger('click')

        expect(actions.login.calledOnce).to.equal(false)
      })
    })

    describe('Response and Routing', () => {

      let mutations, user

      beforeEach(() => {
        user = { role: 'user' }
        actions = {
          login({ commit }, { username, password }) {
            commit('setUser', { email: username, password, role: user.role })
          }
        }
        mutations = {
          setUser(state, user) {
            state.user = user
          }
        }
        store = new Vuex.Store({
          modules: {
            users: {
              namespaced: true,
              state: { user: {} },
              mutations,
              actions,
              getters: {
                getUser(state) { return state.user || null }
              }
            }
          }
        })
      })

      it('has correct prop value for `user` after response', done => {
        const wrapper = _mount()

        wrapper.setData({ email: 'this@is.valid', password: 'thisisvalid.too' })

        wrapper.vm.submit().then(() => {
          const user = wrapper.vm.user
          expect(user.email).to.equal('this@is.valid')
          expect(user.password).to.equal('thisisvalid.too')
          done()
        })
      })

      it('serves route `/restaurants?own=true` if role is "owner"', done => {
        user.role = 'owner'
        const wrapper = _mount()

        wrapper.setData({ email: 'correct@dah.de', password: 'correctamente' })

        wrapper.vm.submit().then(() => {
          expect(wrapper.vm.$route.fullPath).to.equal('/restaurants?own=true')
          done()
        })
      })

      it('serves route `/restaurants` if role is not "owner"', done => {
        const wrapper = _mount()

        wrapper.setData({ email: 'correct@dah.de', password: 'correctamente' })

        wrapper.vm.submit().then(() => {
          expect(wrapper.vm.$route.fullPath).to.equal('/restaurants')
          done()
        })
      })

      it('doesnt route on response error', () => {
        const wrapper = _mount()

        wrapper.setData({ email: 'correct@dah.de', password: 'erróneo' })

        expect(wrapper.vm.submit()).to.be.undefined
      })
    })
  })
})
