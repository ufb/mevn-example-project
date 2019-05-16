const toObjectId = require('mongoose').Types.ObjectId;

const FILTERS = {
  users: {
    role(val) {
      if (['user', 'owner', 'admin'].includes(val)) return { field: 'role', val };
      return null;
    }
  },
  restaurants: {
    own(val, user) {
      if (val == 'true') return { field: 'owner', val: toObjectId(user.sub) };
      return null;
    },
    rating(val) {
      val = JSON.parse(val);
      if (Array.isArray(val) &&
        val.length === 2 &&
        typeof val[0] === 'number' &&
        typeof val[1] === 'number'
      ) return { field: 'avgRating', val: { $gte: val[0], $lte: val[1] }};
      return null;
    }
  }
}

function Filter(coll, query, user) {
  let filters = { $match: {}};
  const rules = FILTERS[coll];

  for (let filter in rules) {
    if (rules.hasOwnProperty(filter) && query[filter]) {
      filter = rules[filter](query[filter], user);
      if (filter) filters.$match[filter.field] = filter.val;
    }
  }

  return filters;
}

module.exports = { Filter }
