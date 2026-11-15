const jwt = require("jsonwebtoken");

// Checks that the user is logged in
function authUser(req, res, next) {
  const token = req.cookies.token;

  // 1. No token means not logged in
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Please login" });
  }

  try {
    // 2. Verify the token with our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Save the user id so controllers can use it
    req.user = decoded;

    // 4. Go to the next step (the controller)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { authUser };