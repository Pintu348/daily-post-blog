
exports.notLoggedIn = (req,res,next)=>{
    if(req.method != 'POST')
    {
        req.session.reqURL=req.url;
    }
    if(!req.session.isLoggedIn)
    {
        return res.redirect("/login")
    }
    next()
}

exports.isLoggedIn = (req,res,next)=>{
    if(req.session.isLoggedIn)
    {
        return res.redirect("/posts");
    }
    next()
}

// failed attempt while login
exports.loginFailedAttempt = (req,res,next)=>{
    if(req.session.loginFailedAttempt>4)
    {
        req.flash("loginError","You loose your maximum attempt to login please try after some time!");
        req.session.cookie.expires=5*60*1000;
        return res.redirect("/login");
    }
    next();
}


// failed attempt while resetting

exports.resetPasswordFailedAttempt = (req,res,next)=>{
    if(req.session.resetPasswordFailedAttempt>2)
    {
        req.flash("resetPasswordError","You loose your maximum attempt of resetting password please try after some time!");
        req.session.cookie.expires=5*60*1000;
        return res.redirect("/resetpassword");
    }
    next();
}

// resetting password times in a day