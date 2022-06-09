const { admin, db } = require("./admin")
    //authoraization ve gönderdiğimiz token ver bize.Call authentication middleware;
module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
        console.error("Token Bulunamadı...!")
        return res.status(403).json({ Hata: "İzin verilmedi" })
    }


    //verifier et return which token is that
    admin.auth().verifyIdToken(idToken).then(tokenac => {
        req.user = tokenac;
        console.log(tokenac);
        return db.collection("userabd").where("userId", "==", req.user.uid)
            .limit(1) //alacağımız dokümanı 1 tane olarak limitle
            .get().then(data => {
                req.user.userHandle = data.docs[0].data().userHandle;
                req.user.profileUrl = data.docs[0].data().profileUrl;
                req.user.onurlLinkiId = data.docs[0].data().onurlLinkiId;
                return next()
            }).catch(err => {
                console.error("Tokeni kontrol ederken hata oluştu", err);
                res.status(403).json({ err })
            })

    })


}