const generateAuthenticator = () => {
  return (req, res, next) => {
    const whiteList = ['/login', '/register'];
    if (req.session.email || whiteList.includes(req.path)) {
      return next();
    }
    res.cookie('errMessage', 'You should register or login first.');
    res.redirect('/login');
  };
};

module.exports = generateAuthenticator;