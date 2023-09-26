export const isAdmin = (req, res, next) => {
    const user = req.session.user
    let isAdminUser = false;

    if (user.rol == "admin") {
        isAdminUser = true;
        next();
    } else {
        res.render('errors/base', {error: 'Access denied. Level to acceed: Admin'})
    }
}

export const isPremiumUser= (req, res, next)=>{
    const user= req.session.user
    let isPremiumUser= false

    if(user.rol == 'premium') {
        isPremiumUser=true
        next()
    }else{
        res.render('errors/base', {error:'Access denied. Level to acceed: Premium'})
    }
    
}