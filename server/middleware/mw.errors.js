module.exports = function(err, req, res, next) {

  if (typeof (err) === 'string') {
    // errors thrown by developer manually
    return res.status(400).json({ message: err });
  }
  else if (err.name === 'ValidationError') {
    // Mongoose validation failed
    return res.status(400).json({ message: err.message });
  }
  else if (err.name === 'UnauthorizedError') {
    // JWT authentication failed
    return res.status(401).json({ message: 'Invalid Token' });
  }
  return res.status(500).json({ message: err.message });
}
