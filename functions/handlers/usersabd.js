const { db, admin } = require("../importantsDoc/admin")

//const { app, initializeApp } = require("firebase-admin");

const firebaseConfig = require("../importantsDoc/config");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const { validateSignUpData, validateLoginData, reducekulbilgi, reducekulKullaniciURLGetir, reducekulKullaniciContactURLGetir, reducekulprofilGizle, reducekulKullanicbankaGetirGuncelle, reducekulFatura, reducekulgeceModu, validateResetData } = require("../importantsDoc/validatorData")

exports.kaydolClass = (req, res) => {
    const newkisi = {
        email: req.body.email,
        nameSurname: req.body.nameSurname,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userHandle: req.body.userHandle
    }


    const { valid, hatalar } = validateSignUpData(newkisi);

    if (!valid) {
        return res.status(400).json({ hatalar });

    }
    const noImg = "no-image.png";
    const backImg = "baha2.jpg";

    //veri control ediliyor burada, validation of data.
    let taken, userId;
    db.doc(`/userabd/${newkisi.userHandle}`).get().then(doc => {
            if (doc.exists) {
                return res.status(400).json({ userHandle: "bu kullanıcı zaten mevcut" });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newkisi.email, newkisi.password);
            }
        }).then((data) => {

            userId = data.user.uid;
            return data.user.getIdToken();


        })
        .then((tokenimiz) => {
            taken = tokenimiz

            const userCredentials = {
                userHandle: newkisi.userHandle,
                email: newkisi.email,
                nameSurname: newkisi.nameSurname,
                createdAt: new Date().toISOString(),
                profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
                backgorundImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${backImg}?alt=media`,
                userId
            }
            return db.doc(`/userabd/${newkisi.userHandle}`).set(userCredentials);

        }).then(() => {
            res.status(201).json({ taken });

        }).catch((err) => {
            console.error(err);
            if (err.code == "auth/email-already-in-use") {

                return res.status(400).json({ hata: "Bu email zaten kayıltlı...!" })
            } else if (err.code == "auth/weak-password") {
                return res.status(400).json({ hata: "Şifre en az 6 karakter olmalıdır!" })
            } else {
                return res.status(500).json({ GenelHata: "Backend de yanlış bir şeyler gitti, Lütfen tekrar deneyiniz!!" })
            }

        })





    //TODO Validate Data
    // firebase.auth().createUserWithEmailAndPassword(newkisi.email, newkisi.password).then((data) => {
    //     return res.status(201).json({ message: `Bu  ${data.user.uid} ait kullanıcı başarıyla giriş yapıldı.!` })
    // }).catch((err) => {
    //     console.error(err);
    //     return res.status(500).json({ error: err.code })
    // })
}


exports.deleteKullanici = (req, res) => {

    const crierDocument = db.doc(`/userabd/${req.user.userHandle}`);
    const crierHomeLink = db.doc(`/homepageLink/${req.user.onurlLinkiId}`);

    //firebase.auth().currentUser.delete()

    admin.auth().deleteUser(req.user.uid).then(() => {

            console.log('Successfully deleted user');

        })
        .catch((error) => {
            console.log('Error deleting user:', error);
        });

    crierDocument.get().then((doc) => {
        crierDocument.delete();

    }).then(() => {
        return res.json({ Mesaj: "Başarıyla silindi Crier !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })

    if (req.user.onurlLinkiId) {
        crierHomeLink.get().then((doc) => {
            crierHomeLink.delete();
        }).then(() => {

            return res.json({ Mesaj: "Başarıyla silindi Crier !!!" })
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ Err: err.code })
        })
    }

}

// Urlsi sil 

exports.urlsiSilKartta = (req, res) => {

    const crierHomeLink = db.doc(`/homepageLink/${req.user.onurlLinkiId}`);


    crierHomeLink.get().then((doc) => {
        crierHomeLink.delete();
    }).then(() => {

        return res.json({ Mesaj: "Başarıyla silindi Crier !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })



}


// üye ol ve Üretiğimiz URL TANIMLA
exports.kaydolClassOnUrlTanimla = (req, res) => {
    const newkisi = {
        email: req.body.email,
        nameSurname: req.body.nameSurname,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userHandle: req.body.userHandle,
        onurlLinkiId: req.body.onurlLinkiId
    }


    const { valid, hatalar } = validateSignUpData(newkisi);

    if (!valid) {
        return res.status(400).json({ hatalar });

    }
    const noImg = "no-image.png";
    const backImg = "baha2.jpg";



    //veri control ediliyor burada, validation of data.
    let taken, userId;
    db.doc(`/userabd/${newkisi.userHandle}`).get().then(doc => {
            if (doc.exists) {
                return res.status(400).json({ userHandle: "bu kullanıcı zaten mevcut" });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newkisi.email, newkisi.password);
            }
        }).then((data) => {

            userId = data.user.uid;
            return data.user.getIdToken();


        })
        .then((tokenimiz) => {
            taken = tokenimiz

            const userCredentials = {
                userHandle: newkisi.userHandle,
                email: newkisi.email,
                nameSurname: newkisi.nameSurname,
                createdAt: new Date().toISOString(),
                profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
                backgorundImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${backImg}?alt=media`,
                userId,
                onurlLinkiId: newkisi.onurlLinkiId
            }
            return (
                db.doc(`/userabd/${newkisi.userHandle}`).set(userCredentials),
                db.doc(`/homepageLink/${newkisi.onurlLinkiId}`).set(userCredentials)
            )

        }).then(() => {
            res.status(201).json({ taken });

        }).catch((err) => {
            console.error(err);
            if (err.code == "auth/email-already-in-use") {

                return res.status(400).json({ hata: "Bu email zaten kayıltlı...!" })
            } else {
                return res.status(500).json({ GenelHata: "Backend de yanlış bir şeyler gitti, Lütfen tekrar deneyiniz!!" })
            }

        })


    // db.doc(`/kullanicip/${newkisi.onurlLinkiId}`).get().then(doc => {


    //     if (!doc.exists) {
    //         return res.status(404).json({ Hata: "Bu linki  bulunamadı" })

    //     }
    //     console.log("document: ", doc)
    //     return doc.ref.update({ userId: userCredentials.userId });

    // })




    //TODO Validate Data
    // firebase.auth().createUserWithEmailAndPassword(newkisi.email, newkisi.password).then((data) => {
    //     return res.status(201).json({ message: `Bu  ${data.user.uid} ait kullanıcı başarıyla giriş yapıldı.!` })
    // }).catch((err) => {
    //     console.error(err);
    //     return res.status(500).json({ error: err.code })
    // })
}




exports.giriyapClass = (req, res) => {

    const kisigiris = {
        email: req.body.email,
        password: req.body.password

    }

    const { valid, hatakisigiris } = validateLoginData(kisigiris);

    if (!valid) {
        return res.status(400).json({ hatakisigiris });
    }
    firebase.auth().signInWithEmailAndPassword(kisigiris.email, kisigiris.password).then((data) => {
        return data.user.getIdToken()
    }).then((tokenimiz) => {
        return res.status(201).json({ TokenGiris: tokenimiz })
    }).catch(err => {
        console.error(err)
            //auth/wrong-password
            //auth/user-not-user
        if (err.code == "auth/wrong-password") {
            return res.status(400).json({ hata: "email yada parola  yanlış" });
        } else if (err.code == "auth/user-not-found") {
            return res.status(400).json({ hata: "Lütfen yanlış bilgileri girildi tekrar deneyiniz!!" })
        } else if (err.code == "auth/too-many-requests") {
            return res.status(400).json({ hata: "Lütfen bir süre sonra tekrar deneyiniz!!" })
        } else {
            return res.status(500).json({ err: err.code })
        }
    })

}

//firebase reset password

exports.parolaChange = (req, res) => {

    const kisigiris = {
        email: req.body.email
    }

    const { valid, hatakisigiris } = validateResetData(kisigiris);


    if (!valid) {
        return res.status(400).json({ hatakisigiris });
    }
    firebase.auth().sendPasswordResetEmail(kisigiris.email).then((data) => {
        return res.status(201).json({ emailgitti: data })
    }).catch(err => {
        console.error(err)
            //auth/wrong-password
            //auth/user-not-user
        return res.status(500).json({ err: err.code })

    })

}





// //aynısı yap
// const newkisi = {
//     email: req.body.email,
//     nameSurname: req.body.nameSurname,
//     password: req.body.password,
//     confirmPassword: req.body.confirmPassword,
//     userHandle: req.body.userHandle,
//     onurlLinkiId: req.body.onurlLinkiId
// }


// const { valid, hatalar } = validateSignUpData(newkisi);

// if (!valid) {
//     return res.status(400).json({ hatalar });
// }
// const noImg = "no-image.png";



// //veri control ediliyor burada, validation of data.
// let taken, userId;
// db.doc(`/userabd/${newkisi.userHandle}`).get().then(doc => {
//         if (doc.exists) {
//             return res.status(400).json({ userHandle: "bu kullanıcı zaten mevcut" });
//         } else {
//             return firebase.auth().createUserWithEmailAndPassword(newkisi.email, newkisi.password);
//         }
//     }).then((data) => {

//         userId = data.user.uid;
//         return data.user.getIdToken();


//     })
//     .then((tokenimiz) => {
//         taken = tokenimiz

//         const userCredentials = {
//             userHandle: newkisi.userHandle,
//             email: newkisi.email,
//             nameSurname: newkisi.nameSurname,
//             createdAt: new Date().toISOString(),
//             profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
//             userId,
//             onurlLinkiId: newkisi.onurlLinkiId
//         }
//         return (
//             db.doc(`/userabd/${newkisi.userHandle}`).set(userCredentials),
//             db.doc(`/homepageLink/${newkisi.onurlLinkiId}`).set(userCredentials)
//         )

//     }).then(() => {
//         res.status(201).json({ taken });


//     }).catch((err) => {
//         console.error(err);
//         if (err.code == "auth/email-already-in-use") {

//             return res.status(400).json({ hata: "Bu email zaten kayıltlı...!" })
//         } else {
//             return res.status(500).json({ GenelHata: "Backend de yanlış bir şeyler gitti, Lütfen tekrar deneyiniz!!" })
//         }

//     })

//ön tanımlı Linki yoksa giriş yap
exports.giriyapClassUrlTanimla = (req, res) => {

    const kisigiris = {
        email: req.body.email,
        password: req.body.password,
        onurlLinkiId: req.body.onurlLinkiId,
        userkullanici: req.body.userHandle
    }
    const noImg = "no-image.png";




    const { valid, hatakisigiris } = validateLoginData(kisigiris);

    if (!valid) {
        return res.status(400).json({ hatakisigiris });
    }
    let taken, userId = "jskjsdjkf";
    firebase.auth().signInWithEmailAndPassword(kisigiris.email, kisigiris.password).then((data) => {
        return data.user.getIdToken()
    }).then((tokenimiz) => {
        res.status(201).json({ TokenGiris: tokenimiz })
    }).then(() => {

        const userCredentials = {
            userId,
            email: kisigiris.email,
            profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
            onurlLinkiId: kisigiris.onurlLinkiId,
            userHandle: kisigiris.userkullanici
        }
        const userCredentials2 = {
            onurlLinkiId: kisigiris.onurlLinkiId
        }

        db.doc(`/userabd/${kisigiris.userkullanici}`).update(userCredentials2),
            db.doc(`/homepageLink/${kisigiris.onurlLinkiId}`).set(userCredentials)


    }).then(() => {

        let crierData = {}
        db.doc(`/userabd/${kisigiris.userkullanici}`).get().then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ Mesaj: "bu kişi  not found!!" })
            }
            crierData = doc.data()
            crierData.screamid = doc.id
            return db.doc(`/homepageLink/${kisigiris.onurlLinkiId}`).update(crierData)
        })
    }).catch(err => {
        console.error(err)
            //auth/wrong-password
            //auth/user-not-user
        if (err.code == "auth/wrong-password") {
            return res.status(400).json({ hata: "email yada parola  yanlış" });
        } else if (err.code == "auth/user-not-found") {
            return res.status(400).json({ hata: "Lütfen yanlış bilgileri girildi tekrar deneyiniz!!" })
        } else {
            return res.status(500).json({ err: err.code })
        }
    })

    // .then(() => {

    //     const userCredentials = {
    //         userId,
    //         email: kisigiris.email,
    //         profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
    //         onurlLinkiId: kisigiris.onurlLinkiId,
    //         userHandle: kisigiris.userkullanici
    //     }
    //     const userCredentials2 = {
    //         onurlLinkiId: kisigiris.onurlLinkiId
    //     }
    //     return (
    //         db.doc(`/userabd/${kisigiris.userkullanici}`).update(userCredentials2),
    //         db.doc(`/homepageLink/${kisigiris.onurlLinkiId}`).set(userCredentials)
    //     )
    // }).





    // db.doc(`/userabd/${kisigiris.userkullanici}`).get().then((doc) => {
    //     if (doc.exists) {

    //         return firebase.auth().signInWithEmailAndPassword(kisigiris.email, kisigiris.password)
    //     } else {

    //         return res.status(400).json({ userHandle: "kullanici adını yanlış" });
    //     }
    // }).then((data) => {
    //     userId = data.user.uid;

    //     return data.user.getIdToken()
    // }).then((tokenimiz) => {
    //    return res.status(201).json({ tokenimiz })
    // }).then(() => {


    //     const userCredentials = {
    //         userId,
    //         email: kisigiris.email,
    //         profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
    //         onurlLinkiId: kisigiris.onurlLinkiId,
    //         userHandle: kisigiris.userkullanici
    //     }
    //     const userCredentials2 = {
    //         onurlLinkiId: kisigiris.onurlLinkiId
    //     }

    //     return (
    //         db.doc(`/userabd/${kisigiris.userkullanici}`).update(userCredentials2),
    //         db.doc(`/homepageLink/${kisigiris.onurlLinkiId}`).set(userCredentials)
    //     )
    // }).then(() => {
    //     let crierData = {}
    //     db.doc(`/userabd/${kisigiris.userkullanici}`).get().then(doc => {
    //         if (!doc.exists) {
    //             return res.status(404).json({ Mesaj: "bu kişi  not found!!" })
    //         }
    //         crierData = doc.data()
    //         crierData.screamid = doc.id
    //         return db.doc(`/homepageLink/${kisigiris.onurlLinkiId}`).update(crierData)
    //     }).catch(err => {
    //         console.error(err)
    //         return res.status(500).json({ Mesaj: err.code })


    //     })
    // }).catch(err => {
    //     console.error(err)
    //     if (err.code == "auth/wrong-password") {
    //         return res.status(400).json({ hata: "email yada parola  yanlış" });
    //     } else if (err.code == "auth/user-not-found") {
    //         return res.status(400).json({ hata: "Lütfen yanlış bilgileri girildi tekrar deneyiniz!!" })
    //     } else {
    //         return res.status(500).json({ err: err.code })
    //     }
    // })


    // let taken, userId;

    // firebase.auth().signInWithEmailAndPassword(kisigiris.email, kisigiris.password).then((data) => {

    //     return data.user.getIdToken();

    // }).then((tokenimiz) => {
    //     return res.status(201).json({ TokenGiris: tokenimiz })
    // }).then(() => {


    //     const userCredentials = {
    //         userId,
    //         email: kisigiris.email,
    //         profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
    //         onurlLinkiId: kisigiris.onurlLinkiId,
    //         userHandle: kisigiris.userkullanici
    //     }
    //     const userCredentials2 = {
    //         onurlLinkiId: kisigiris.onurlLinkiId
    //     }

    //     return (
    //         db.doc(`/userabd/${kisigiris.userkullanici}`).update(userCredentials2),
    //         db.doc(`/homepageLink/${kisigiris.onurlLinkiId}`).set(userCredentials)
    //     )
    // }).then(() => {
    //     let crierData = {}
    //     db.doc(`/userabd/${kisigiris.userkullanici}`).get().then(doc => {
    //         if (!doc.exists) {
    //             return res.status(404).json({ Mesaj: "bu kişi  not found!!" })
    //         }
    //         crierData = doc.data()
    //         crierData.screamid = doc.id
    //         return db.doc(`/homepageLink/${kisigiris.onurlLinkiId}`).update(crierData)
    //     }).then(data => {
    //         return res.json(crierData)
    //     }).catch(err => {
    //         console.error(err)
    //         return res.status(500).json({ Mesaj: err.code })

    //         // db.collection("homepageLink")
    //         // .where("onurlLinkiId", "==", kisigiris.onurlLinkiId).update(crierData)

    //     })
    // }).catch(err => {
    //     console.error(err)
    //         //auth/wrong-password
    //         //auth/user-not-user
    //     if (err.code == "auth/wrong-password") {
    //         return res.status(400).json({ hata: "email yada parola  yanlış" });
    //     } else if (err.code == "auth/user-not-found") {
    //         return res.status(400).json({ hata: "Lütfen yanlış bilgileri girildi tekrar deneyiniz!!" })
    //     } else {
    //         return res.status(500).json({ err: err.code })
    //     }


}


exports.postIkon = (req, res) => {

    const noImg = "no-image.png";
    if (req.body.ikonUrl.trim() == "") {
        return res.status(400).json({ Body: "Linki vermeniz lazım !!" })
    }

    const createIkon = {
        ikonImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
        ikonUrl: `https://instagram/${req.body.ikonUrl}`,
        userHandle: req.user.userHandle
    }
    db.collection("socialkonlar").add(createIkon).then((data) => {
        const resScream = createIkon
        resScream.screamid = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });

        console.error(err)
    })

}


//ön link üret bana
exports.postTanimUret = (req, res) => {

    if (req.body.randomUrlTanim.trim() == "") {
        return res.status(400).json({ Body: "Linki vermeniz lazım !!" })
    }

    const createIkon = {
        randomUrlTanim: req.body.randomUrlTanim,
        userHandle: req.user.userHandle,
        userId: ""
    }

    db.collection("homepageLink").add(createIkon).then((data) => {

        if (req.user.userHandle === "omur") {
            const resScream = createIkon
            resScream.screamid = data.id
            res.json({ resScream });
        }

    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });

        console.error(err)
    })

}


//banka ikon ekle
exports.bankaIconEkle = (req, res) => {

    const noImg = "no-image.png";

    if (req.body.ikonUrl.trim() == "") {
        return res.status(400).json({ Body: "Linki vermeniz lazım !!" })
    }

    const createIkon = {
        ikonImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
        ikonUrl: `https://instagram/${req.body.ikonUrl}`,
        userHandle: req.user.userHandle

    }

    db.collection("bankaKonlar").add(createIkon).then((data) => {
        const resScream = createIkon
        resScream.screamid = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });

        console.error(err)
    })

}

//iletişm ikonalar Ekle


exports.iletisIconEkle = (req, res) => {

    const noImg = "no-image.png";

    if (req.body.ikonUrl.trim() == "") {
        return res.status(400).json({ Body: "Linki vermeniz lazım !!" })
    }

    const createIkon = {
        ikonImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
        ikonUrl: `https://instagram/${req.body.ikonUrl}`,
        userHandle: req.user.userHandle,

    }

    db.collection("contactIkons").add(createIkon).then((data) => {
        const resScream = createIkon
        resScream.screamid = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });
        console.error(err)
    })

}


//Social URL Ekle
exports.socialUrlEkle = (req, res) => {

        if (req.body.UrlLinki.trim() === "") {
            return res.status(400).json({ Hata: "Url alanı boş geçilemez!!" });
        }

        const newComments = {
            UrlLinki: req.body.UrlLinki,
            userHandle: req.user.userHandle,
            urlId: req.params.urlId,
            durumu: true
        }

        db.doc(`/socialkonlar/${req.params.urlId}`).get().then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ Hata: "Bu ikon bulunamadı" })
            }
        }).then(() => {
            return db.collection("linkUrlAll").add(newComments);
        }).then(() => {
            res.json(newComments)

        }).catch(err => {
            console.log(err)
            return res.status(500).json({ Hata: err.code })
        })
    }
    //whatsapp url ekle
exports.whatsapUrlEkle = (req, res) => {


    if (req.body.UrlLinki.trim() === "") {
        return res.status(400).json({ Hata: "Url alanı boş geçilemez!!" });
    }

    const newComments = {
        UrlLinki: `wa.me/${req.body.UrlLinki}`,
        userHandle: req.user.userHandle,
        urlId: req.params.urlId,
        durumu: true
    }

    db.doc(`/socialkonlar/${req.params.urlId}`).get().then(doc => {

        if (!doc.exists) {
            return res.status(404).json({ Hata: "Bu ikon bulunamadı" })
        }

        //  return doc.ref.update({ urlVar: true });

    }).then(() => {
        return db.collection("linkUrlAll").add(newComments);
    })

    .then(() => {
            res.json(newComments)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ Hata: err.code })
        })

}


//telegram Url Ekle
exports.telegramUrlEkle = (req, res) => {


    if (req.body.UrlLinki.trim() === "") {
        return res.status(400).json({ Hata: "Url alanı boş geçilemez!!" });
    }

    const newComments = {
        UrlLinki: `t.me/${req.body.UrlLinki}`,
        userHandle: req.user.userHandle,
        urlId: req.params.urlId,
        durumu: true
    }

    db.doc(`/socialkonlar/${req.params.urlId}`).get().then(doc => {

        if (!doc.exists) {
            return res.status(404).json({ Hata: "Bu ikon bulunamadı" })
        }

        //  return doc.ref.update({ urlVar: true });

    }).then(() => {
        return db.collection("linkUrlAll").add(newComments);
    })

    .then(() => {
            res.json(newComments)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ Hata: err.code })
        })

}

//instagram
exports.instagramUrlEkle = (req, res) => {


        if (req.body.UrlLinki.trim() === "") {
            return res.status(400).json({ Hata: "Url alanı boş geçilemez!!" });
        }

        const newComments = {
            UrlLinki: `instagram.com/${req.body.UrlLinki}`,
            userHandle: req.user.userHandle,
            urlId: req.params.urlId,
            durumu: true
        }

        db.doc(`/socialkonlar/${req.params.urlId}`).get().then(doc => {

            if (!doc.exists) {
                return res.status(404).json({ Hata: "Bu ikon bulunamadı" })
            }

            //  return doc.ref.update({ urlVar: true });

        }).then(() => {
            return db.collection("linkUrlAll").add(newComments);
        })

        .then(() => {
                res.json(newComments)
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({ Hata: err.code })
            })

    }
    //twitter


exports.twitterUrlEkle = (req, res) => {


    if (req.body.UrlLinki.trim() === "") {
        return res.status(400).json({ Hata: "Url alanı boş geçilemez!!" });
    }

    const newComments = {
        UrlLinki: `twitter.com/${req.body.UrlLinki}`,
        userHandle: req.user.userHandle,
        urlId: req.params.urlId,
        durumu: true
    }

    db.doc(`/socialkonlar/${req.params.urlId}`).get().then(doc => {

        if (!doc.exists) {
            return res.status(404).json({ Hata: "Bu ikon bulunamadı" })
        }

        //  return doc.ref.update({ urlVar: true });

    }).then(() => {
        return db.collection("linkUrlAll").add(newComments);
    })

    .then(() => {
            res.json(newComments)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ Hata: err.code })
        })

}

//facebook
exports.facebookUrlEkle = (req, res) => {


    if (req.body.UrlLinki.trim() === "") {
        return res.status(400).json({ Hata: "Url alanı boş geçilemez!!" });
    }

    const newComments = {
        UrlLinki: `facebook.com/${req.body.UrlLinki}`,
        userHandle: req.user.userHandle,
        urlId: req.params.urlId,
        durumu: true
    }

    db.doc(`/socialkonlar/${req.params.urlId}`).get().then(doc => {

        if (!doc.exists) {
            return res.status(404).json({ Hata: "Bu ikon bulunamadı" })
        }

        //  return doc.ref.update({ urlVar: true });

    }).then(() => {
        return db.collection("linkUrlAll").add(newComments);
    })

    .then(() => {
            res.json(newComments)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ Hata: err.code })
        })

}



//banka url ekle güncelle
exports.bankaUrlEkle = (req, res) => {
    if (req.body.iban.trim() === "" || req.body.hesabSahibi.trim() === "" || req.body.hesapNumarasi.trim() === "") {

        return res.status(400).json({ Hata1: "Alan boş geçilemez!!" });


    }

    const newComments = {
        iban: req.body.iban,
        hesabSahibi: req.body.hesabSahibi,
        hesapNumarasi: req.body.hesapNumarasi,
        userHandle: req.user.userHandle,
        urlId: req.params.urlId,
    }

    db.doc(`/bankaKonlar/${req.params.urlId}`).get().then(doc => {

            if (!doc.exists) {
                return res.status(404).json({ Hata: "Bu ikon bulunamadı" })
            }

            // return doc.ref.update({ urlVar: true });

        }).then(() => {
            return db.collection("linkUrlAll").add(newComments);
        })
        .then(() => {
            res.json(newComments)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ Hata: err.code })
        })

}

//iletişim Url Linki ekle

exports.iletisimUrlEkle = (req, res) => {

    if (req.body.UrlLinki.trim() === "") {
        return res.status(400).json({ Hata: "Url alanı boş geçilemez!!" });
    }

    const newComments = {
        UrlLinki: req.body.UrlLinki,
        userHandle: req.user.userHandle,
        urlId: req.params.urlId,
    }

    db.doc(`/contactIkons/${req.params.urlId}`).get().then(doc => {

        if (!doc.exists) {
            return res.status(404).json({ Hata: "Bu ikon bulunamadı" })
        }

        return doc.ref.update({ urlVar: true });

    }).then(() => {
        return db.collection("linkUrlAll").add(newComments);
    })

    .then(() => {
            res.json(newComments)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ Hata: err.code })
        })

}

//only contact Number
exports.contactOnlyNumber = (req, res) => {

    if (req.body.UrlLinki.trim() === "") {
        return res.status(400).json({ Hata: "Url alanı boş geçilemez!!" });
    }

    const newComments = {
        UrlLinki: `+90 ${req.body.UrlLinki}`,
        userHandle: req.user.userHandle,
        urlId: req.params.urlId,
    }

    db.doc(`/contactIkons/${req.params.urlId}`).get().then(doc => {

        if (!doc.exists) {
            return res.status(404).json({ Hata: "Bu ikon bulunamadı" })
        }

        return doc.ref.update({ urlVar: true });

    }).then(() => {
        return db.collection("linkUrlAll").add(newComments);
    })

    .then(() => {
            res.json(newComments)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ Hata: err.code })
        })

}


//kullanıcı bilgileri yükle
exports.kullaniciBilgi = (req, res) => {

    let kulbilgi = reducekulbilgi(req.body);

    db.doc(`/userabd/${req.user.userHandle}`).update(kulbilgi).then(() => {
        return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

    if (req.user.onurlLinkiId) {
        db.doc(`/homepageLink/${req.user.onurlLinkiId}`).update(kulbilgi).then(() => {
            return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
        }).catch((err) => {
            console.error(err)
            return res.status(500).json({ err: err.code })
        })
    }



}

//geceModu
exports.GeceModuAktif = (req, res) => {

    let kulGeceModu = reducekulgeceModu(req.body);
    db.doc(`/userabd/${req.user.userHandle}`).update(kulGeceModu).then(() => {
        return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

    //fatura günceller
    if (req.user.onurlLinkiId) {
        db.doc(`/homepageLink/${req.user.onurlLinkiId}`).update(kulGeceModu).then(() => {
            return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
        }).catch((err) => {
            console.error(err)
            return res.status(500).json({ err: err.code })
        })
    }

}

// profile gizle

exports.ProfileGizle = (req, res) => {

    let kulGeceModu = reducekulprofilGizle(req.body);
    db.doc(`/userabd/${req.user.userHandle}`).update(kulGeceModu).then(() => {
        return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

    //fatura günceller
    if (req.user.onurlLinkiId) {
        db.doc(`/homepageLink/${req.user.onurlLinkiId}`).update(kulGeceModu).then(() => {
            return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
        }).catch((err) => {
            console.error(err)
            return res.status(500).json({ err: err.code })
        })
    }

}



//kullanici Fatura bilgi Ekle
exports.kullaniciFatura = (req, res) => {

    let kulFatura = reducekulFatura(req.body);
    db.doc(`/userabd/${req.user.userHandle}`).update(kulFatura).then(() => {
        return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

    //fatura günceller
    if (req.user.onurlLinkiId) {
        db.doc(`/homepageLink/${req.user.onurlLinkiId}`).update(kulFatura).then(() => {
            return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
        }).catch((err) => {
            console.error(err)
            return res.status(500).json({ err: err.code })
        })
    }

}

// Link Url güncell SOCİAL
exports.KullaniciLinkGetir = (req, res) => {

    let kulFatura = reducekulKullaniciURLGetir(req.body);
    // fatura günceller
    db.doc(`/linkUrlAll/${req.params.urlId}`).update(kulFatura).then(() => {
        return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
    }).catch((err) => {

        console.error(err)
        return res.status(500).json({ err: err.code })
    })


}

// CONTACT GÜNCELLE

exports.KullaniciContactUrlGetirGüncelle = (req, res) => {

    let kulFatura = reducekulKullaniciContactURLGetir(req.body);
    // fatura günceller
    db.doc(`/linkUrlAll/${req.params.urlId}`).update(kulFatura).then(() => {
        return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
    }).catch((err) => {

        console.error(err)
        return res.status(500).json({ err: err.code })
    })


}

// BANKA BİLGİLERİ GETİR VE GÜNCELLE
exports.KullaniciBankaGetirGuncelle = (req, res) => {

    let kulFatura = reducekulKullanicbankaGetirGuncelle(req.body);

    // fatura günceller
    db.doc(`/linkUrlAll/${req.params.urlId}`).update(kulFatura).then(() => {
        return res.json({ Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!" })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })


}




//herhangi bir kullanici bilgi al
exports.kullaniciTumBilgiAl = (req, res) => {
    let kulData = {}

    db.doc(`/userabd/${req.params.userHandle}`).get().then((doc) => {
        if (doc.exists) {
            kulData.user = doc.data()

            return db.collection("crier").where("userHandle", "==", req.params.userHandle).orderBy("createdAt", "desc").get();

        } else {
            return res.status(404).json({ Hata: "Böyle bir kullanıcı kayıtlı değil" });
        }

    }).then((data) => {
        kulData.crier = [];
        data.forEach(doc => {
            kulData.crier.push({
                body: doc.data().body,
                createdAt: doc.data().createdAt,
                userHandle: doc.data().userHandle,
                userImage: doc.data().profileUrl,
                Begeni: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                screamid: doc.id
            })
        })
        return res.json(kulData);

    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Hata: err.code })
    })

}



//kayıtlı olan  kullanıcı bilgileri Getir
exports.gecerliKullaniciauthenticated = ((req, res) => {
    let kullaniciData = {}

    db.doc(`/userabd/${req.user.userHandle}`).get().then((doc) => {

        if (doc.exists) {
            kullaniciData.credentials = doc.data(); //userCredentials olabilir

        }

    }).then((data) => {
        return res.json(kullaniciData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })

})

//background Image change
exports.backgorundImageChange = (req, res) => {
    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")

    const busboy = BusBoy({ headers: req.headers })

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        // if (mimetype !== "image/jpeg" || mimetype !== "image/png") {
        //     return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olamk zorunda!!" })
        // }
        if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
            return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olmak zorunda!!" })
        }

        // console.log("fieldname:", fieldname);
        // console.log("filename:", filename);
        // console.log("mimetype", mimetype)
        // console.log("here image:", Object.values(filename)[0]) //to get in a dict

        const trueFile = Object.values(filename)[0]
            //example:abdoul.png we need to get the file name, png
            //const imageExtension = filename.split('.')[filename.split('.').length - 1];
            //const come to me to see all the rest of the work.
        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);

        // if (imageExtension !== "jpeg" || imageExtension !== "png") {
        //     return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olamk zorunda!!" })
        // }

        //transform the image took here to another format: example,83475834895.png
        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);

        imageToBeUploaded = { filePath, mimetype }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on("finish", () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {

            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(() => {
            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;

            if (req.user.onurlLinkiId) {
                db.doc(`/homepageLink/${req.user.onurlLinkiId}`).update({ backgorundImage: imageUrlUploaded })
            }

            return (db.doc(`/userabd/${req.user.userHandle}`).update({ backgorundImage: imageUrlUploaded })

            );
        }).then(() => {
            return res.json({ mesaj: "Profile fotografı başarıyla değiştirildi" });
        }).catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })


    });

    busboy.end(req.rawBody);

}


//profil fotoğrafı yükle
exports.uploadProfile = (req, res) => {
    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")



    const busboy = BusBoy({ headers: req.headers })

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        // if (mimetype !== "image/jpeg" || mimetype !== "image/png") {
        //     return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olamk zorunda!!" })
        // }

        if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
            return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olmak zorunda!!" })
        }

        // var valuey = filename;

        // console.log("fieldname:", fieldname);
        // console.log("filename:", filename);
        // console.log("heretoban: ", Object.values(filename)[2])
        // console.log("mimetype", mimetype)
        // console.log("here image:", Object.values(filename)[0]) //to get in a dict

        const trueFile = Object.values(filename)[0]
            //example:abdoul.png we need to get the file name, png
            //const imageExtension = filename.split('.')[filename.split('.').length - 1];
            //const come to me to see all the rest of the work.
        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);

        // if (imageExtension !== "jpg" || "png") {
        //     return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olmak zorunda!!" })
        // }

        //transform the image took here to another format: example,83475834895.png
        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);

        imageToBeUploaded = { filePath, mimetype }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));


    });
    busboy.on("finish", () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(() => {
            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;

            if (req.user.onurlLinkiId) {
                db.doc(`/homepageLink/${req.user.onurlLinkiId}`).update({ profileUrl: imageUrlUploaded })
            }

            return (db.doc(`/userabd/${req.user.userHandle}`).update({ profileUrl: imageUrlUploaded })





            );
        }).then(() => {
            return res.json({ mesaj: "Profile fotografı başarıyla değiştirildi" });
        }).catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })


    });

    busboy.end(req.rawBody);

}

//bildirim okundu 
exports.bildirimOkundu = (req, res) => {
    let batch = db.batch()
    req.body.forEach(notificationId => {
        const notification = db.doc(`/bildirim/${notificationId}`);
        batch.update(notification, { read: true });

    });
    batch.commit().then(() => {
        return res.json({ Mesaj: "Bildirimler okundu" });

    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Hatta: err.code })
    })
}