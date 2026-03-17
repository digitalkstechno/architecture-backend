import User from "../models/user.model.js";

export const checkPermission = (module, action) => {
  return async (req, res, next) => {
    try {

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: no user on request" });
      }

      // reload user
      const user = await User.findById(req.user._id)
        .populate({
          path: "role",
          populate: { path: "permissions" },
        })
        .populate({
          path: "tenantId",
          populate: {
            path: "subscription.planId",
          },
        });

      if (!user) {
        return res.status(401).json({ message: "Invalid session" });
      }

      // ⭐ SUPER ADMIN BYPASS
      if (user.isSuperAdmin) {
        return next();
      }

      const norm = (v) => (v || "").toString().trim().toUpperCase();

      const check = (perms) => {
        if (!Array.isArray(perms)) return false;

        const entry = perms.find((p) => norm(p.module) === norm(module));

        return (
          entry &&
          Array.isArray(entry.actions) &&
          entry.actions.map(norm).includes(norm(action))
        );
      };

      // 1️⃣ Plan permissions
      const tenant = user.tenantId;
      const planPerms = tenant?.subscription?.planId?.modulePermissions;

      if (check(planPerms)) {
        return next();
      }

      // 2️⃣ Role permissions
      const rolePerms = user.role?.permissions || [];

      if (check(rolePerms)) {
        return next();
      }

      // 3️⃣ User permissions
      const userPerms = user.permissions || [];

      if (check(userPerms)) {
        return next();
      }

      return res.status(403).json({ message: "Permission Denied!" });

    } catch (err) {
      console.error("checkPermission error:", err);
      return res.status(500).json({ message: "Permission check failed" });
    }
  };
};