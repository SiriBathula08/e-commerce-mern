const verifyAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access denied" });
    }
    next();
};

export default verifyAdmin;
