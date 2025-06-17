const { admin, db } = require("../firebaseAdmin");
// const db = admin.firestore();

const { getDoc } = require("../utils");

const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const { data } = await getDoc(db, req.user.uid, 'users');
      if (data.role !== role) {
        return res.status(403).json({ message: `Only ${role}s can access this resource` });
      }
      req.userDoc = data; // optional, in case you want to reuse it
      next();
    } catch (err) {
      console.error("Error in requireRole:", err);
      return res.status(403).json({ message: "Access denied" });
    }
  };
};

module.exports = requireRole;