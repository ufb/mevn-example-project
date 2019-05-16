function Slice(query) {
  let slice;
  const from = query.from;
  const to = query.to;

  if (from) slice = [{ $skip: from*1 }];
  if (to) {
    slice = slice || [];
    slice.push({ $limit: to*1 });
  }
  return slice;
}

module.exports = { Slice }
