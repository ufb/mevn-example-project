const { Filter } = require('./filter')
const { Sort } = require('./sort')
const { Slice } = require('./slice')

function aggregate(coll, query, user) {
  let aggregation = [];

  const sort = Sort(coll, query);
  const slice = Slice(query);

  aggregation.push(Filter(coll, query, user));
  if (sort) aggregation.push(sort);
  if (slice) aggregation = aggregation.concat(slice);

  return aggregation;
}

module.exports = { aggregate }
