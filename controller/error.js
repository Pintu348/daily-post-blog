exports.Page404 = (req,res,next)=>{
    return res.status(404).render("404",{pageTitle:"error!"})
}