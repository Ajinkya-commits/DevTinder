const adminauth = (req, res, next) => {
  console.log("admin auth middleware called");
  const token = "xysz123";
  const isAdmin = token === "xysz123";
  if (!isAdmin) {
    console.log("User is not an admin");
    res.status(403).json({ message: "Access denied. Admins only." });
  } else {
    console.log("User is an admin");
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("user auth middleware called");
  const token = "xysz123a";
  const isUser = token === "xysz123";
  if (!isUser) {
    console.log("User is not authenticated");
    res.status(401).json({ message: "Unauthorized access." });
  } else {
    console.log("User is authenticated");
    next();
  }
};

module.exports = {
  adminauth,
  userAuth,
};
