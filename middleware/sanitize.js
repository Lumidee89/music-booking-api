const sanitizeRequest = (req, res, next) => {
    if (req.body) {
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === "string") {
          req.body[key] = req.body[key].replace(/\$/g, "").replace(/\./g, "");
        }
      });
    }
  
    if (req.query) {
      Object.keys(req.query).forEach((key) => {
        if (typeof req.query[key] === "string") {
          req.query[key] = req.query[key].replace(/\$/g, "").replace(/\./g, "");
        }
      });
    }
  
    next();
  };
  
  module.exports = sanitizeRequest;