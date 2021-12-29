module.exports = (req, res, next) => {
    if (req.isAuthenticated() && req.user.is_admin == true) {
        return next();
    } else {
        req.flash('msg', 'You are not admin');
        return res.redirect("/admin/login")
    }
}