const errorHandler = (err, req, res, next) => {
  if (typeof (err) === 'string') {
    //custom application error
    return res.status(400).json({ message: err });
  }
  if (err.name === 'ValidationError') {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(402).json({ message: 'Invalid Token' });
  }
  //defalut
  return res.status(500).json({ message: err.message });
}
module.exports = errorHandler;