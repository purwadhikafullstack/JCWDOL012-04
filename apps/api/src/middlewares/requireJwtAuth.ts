import passport from "passport";

const requireJwtAuth = passport.authenticate("jwt", { session: false, failureRedirect: "/auth/google/failed" });

export { requireJwtAuth };