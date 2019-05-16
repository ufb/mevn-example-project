/** @TODO: case-insensitive sorting for restaurant names **/

const RULES = {
  users: {
    az: { field: 'email', dir: 1 },
    za: { field: 'email', dir: -1 },
    date: { field: 'created', dir: 1 },
    role: { field: 'role', dir: 1 }
  },
  restaurants: {
    az: { field: 'name', dir: 1 },
    za: { field: 'name', dir: -1 },
    rating: { field: 'avgRating', dir: -1 }
  }
}

function Sort(coll, query) {
  if (query.sort) {
    const rule = RULES[coll][query.sort];
    return rule ? {
      $sort: { [rule.field]: rule.dir }
    } : null;
  } else {
    return null;
  }
}

module.exports = { Sort }
