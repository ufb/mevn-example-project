module.exports = {
  users: {
    read: ['admin'],
    create: [],
    update: ['admin'],
    delete: ['admin'],
    seed: ['admin']
  },
  restaurants: {
    read: [],
    create: ['owner'],
    update: ['admin'],
    delete: ['admin'],
    seed: ['owner'],

    reviews: {
      read: [],
      create: ['user'],
      update: ['admin'],
      delete: ['admin'],
      seed: ['admin'],

      reply: {
        read: [],
        create: ['owner'],
        update: ['admin'],
        delete: ['admin']
      }
    }
  }
}
