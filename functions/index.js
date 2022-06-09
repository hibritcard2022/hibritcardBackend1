const functions = require('firebase-functions');

const app = require('express')();

const {
    getAllCrier,
    postCrier,
    getCrier,
    kullaniciTumOnTanimliUrlBilgiAl,
    getSocialWithoutAuth,
    getConatctWithoutAuth,
    getBankaWithoutAuth,
    postCommnentOnScreen,
    likeScreen,
    unLikeScreen,
    deleteCrier,
    postinstagramUrl,
    getOneIcon,
    deleteIkon,
    postfacebookUrl,
    getAllikons,
    getBankaIkonlar,
    getIletisimIkonlar,
    getOneIconBanka,
    getOneIconIletisim,
    deleteIkonBanka,
    deleteIkoniletisim,
    getBankaKonsandUrl,
    getSocialKonsandUrl,
    getiletisimKonsandUrl

} = require("./handlers/crier")

const {
    kaydolClass,
    kaydolClassOnUrlTanimla,
    giriyapClass,
    giriyapClassUrlTanimla,
    parolaChange,
    uploadProfile,
    backgorundImageChange,
    kullaniciBilgi,
    GeceModuAktif,
    ProfileGizle,
    gecerliKullaniciauthenticated,
    kullaniciTumBilgiAl,
    bildirimOkundu,
    kullaniciFatura,
    KullaniciLinkGetir,
    KullaniciContactUrlGetirGüncelle,
    KullaniciBankaGetirGuncelle,
    postIkon,
    postTanimUret,
    socialUrlEkle,
    whatsapUrlEkle,
    instagramUrlEkle,
    deleteKullanici,
    urlsiSilKartta,
    facebookUrlEkle,
    twitterUrlEkle,
    telegramUrlEkle,
    bankaIconEkle,
    bankaUrlEkle,
    iletisimUrlEkle,
    contactOnlyNumber,
    iletisIconEkle
} = require("./handlers/usersabd");
const { db } = require("./importantsDoc/admin");

const FBAuth = require("./importantsDoc/fbAuth")
    //cd functions and npm i --save cors
const cors = require("cors")
app.use(cors());


//package installed
//express,
//npm i --save busboy //to upload file
//


//hibricard functionları

//Fatura bilgileri ekle
app.post("/kullanici/faturaEkle", FBAuth, kullaniciFatura);

//Edit uRL BİLGİ
app.post("/kullanici/:urlId/editUSerfo", FBAuth, KullaniciLinkGetir);

// edit contact url here
app.post("/kullanici/:urlId/editContactInfo", FBAuth, KullaniciContactUrlGetirGüncelle);

// edit banaka ınfo 
app.post("/kullanici/:urlId/editbanaka", FBAuth, KullaniciBankaGetirGuncelle);


//get all ikons
app.get("/allikons", getAllikons),
    //banka ıkonları
    app.get("/bankakons", getBankaIkonlar),

    //iletsim ikonları get
    app.get("/iletisimkons", getIletisimIkonlar),

    //create IKON
    app.post("/ikonekle", FBAuth, postIkon)


// öncelik yönledirme linki
app.post("/tanimLinkUret", FBAuth, postTanimUret)




//post banka Ikons
app.post("/bankaikonekle", FBAuth, bankaIconEkle)

//iletişim post ikons
app.post("/ileitisimkonekle", FBAuth, iletisIconEkle)

//bana bir ikon getir social media ikonları
app.get("/ikon/:ikonId", getOneIcon)
    //bana bir banka ikonu getir
app.get("/ikonbanka/:ikonId", getOneIconBanka)

//iletisim ikon getir bri tane
app.get("/iletisimbanka/:ikonId", getOneIconIletisim)


//Ikon silme social media ikon sil
app.delete("/ikon/:ikonId", FBAuth, deleteIkon)
    //bir banaka ikonu sil
app.delete("/ikonbankaSil/:ikonId", FBAuth, deleteIkonBanka)

//bir iletişim ikonu silme
app.delete("/ikoniletisimSil/:ikonId", FBAuth, deleteIkoniletisim)


//post URL social media url
app.post("/ikon/:urlId/postUrl", FBAuth, socialUrlEkle),

    //WHATSAPP URL EKLE
    app.post("/whatsapp/:urlId/whatsapUrl", FBAuth, whatsapUrlEkle),
    //instagram url ekle
    app.post("/insta/:urlId/instaUrl", FBAuth, instagramUrlEkle),

    //twitter
    app.post("/twitter/:urlId/twitterUrl", FBAuth, twitterUrlEkle),
    //facebook
    app.post("/facebook/:urlId/facebookUrl", FBAuth, facebookUrlEkle)

//telegram UrlEkle
app.post("/telegram/:urlId/telegramUrl", FBAuth, telegramUrlEkle)

//banka ikonlar url
app.post("/ikonbankaUrl/:urlId/postbankaUrl", FBAuth, bankaUrlEkle),
    //post ilitişi Url Link
    app.post("/ikoniletisimUrl/:urlId/postiletismUrl", FBAuth, iletisimUrlEkle),
    //only number 
    app.post("/contactonlyUrl/:urlId/postcontactonlyUrl", FBAuth, contactOnlyNumber)





//Kullanıcı girme işlemi

//SignUp route
app.post("/kaydol", kaydolClass);

//URL ÜRET VARSA ÜYE OL OLUNCA TANIMLA
app.post("/kaydolUrlTanimla", kaydolClassOnUrlTanimla);

//giriş yap functionu
app.post("/login", giriyapClass);

//reset password
app.post("/resetparola", parolaChange)

//Ön url yoksa ve giriş olduğunda tanımla
app.post("/girisyapurlTanimla", giriyapClassUrlTanimla)
    //kullanıcı bilgileri yukle
app.post("/kullanici/bilgiyukle", FBAuth, kullaniciBilgi);


//geceModu
app.post("/kullanici/geceModu", FBAuth, GeceModuAktif);
app.post("/kullanici/profilKapa", FBAuth, ProfileGizle);



//kullanıcı bilgileri getir
app.get("/kullanici/getir", FBAuth, gecerliKullaniciauthenticated);
//profil fotografı yükle
app.post("/uploadProfile", FBAuth, uploadProfile);
//bakgprund Image change
app.post("/uploadBackgorund", FBAuth, backgorundImageChange);
//herhangi bir kullanıcı al  örnek: hibritCard/Batuhan
app.get("/kullanici/:userHandle", kullaniciTumBilgiAl);



//bildirim okundu işetle
app.post("/bildirimler", FBAuth, bildirimOkundu);


//crier Routes
app.get("/crier", getAllCrier);

//post crier
app.post("/createcrier", FBAuth, postCrier);

//create instagram url
app.post("/createinstagram", FBAuth, postinstagramUrl);
//create facebook ikon
app.post("/createfacebook", FBAuth, postfacebookUrl);



//crier getir en function de id
app.get("/crier/:screamid", getCrier)

//Ön tanımlı linki bilgi getir varsa
app.get("/kullanicip/:screamid", kullaniciTumOnTanimliUrlBilgiAl);

//social İkons Without FBAUTH
app.get("/socialWithout/:screamid", getSocialWithoutAuth)

//banaka ikon without FBAuth
app.get("/bankaWithout/:screamid", getBankaWithoutAuth)

//contacts ikons without FBAuth
app.get("/contactWithout/:screamid", getConatctWithoutAuth)

//get only the number From useer

//bana banka ikonları ve Linkleri getir
app.get("/bankaKonsandUrl/:screamid", FBAuth, getBankaKonsandUrl)

//bana social media ve url si getir
app.get("/socialKonsandUrl/:screamid", FBAuth, getSocialKonsandUrl)

//bana iletişim ikon ve urlsi getir
app.get("/iletisimKonsandUrl/:screamid", FBAuth, getiletisimKonsandUrl)




app.delete("/crier/:screamid", FBAuth, deleteCrier)

// kullanici sil 
app.delete("/kulsil/sil", FBAuth, deleteKullanici)
    //Tanimli url sil
app.delete("tanimliUrl/sil", urlsiSilKartta);

//beğen buttonu
app.get("/crier/:screamid/begen", FBAuth, FBAuth, likeScreen);
//beğenmeme buttonu
app.get("/crier/:screamid/begenme", FBAuth, unLikeScreen);
//yorum at
app.post("/crier/:screamid/postcomment", FBAuth, postCommnentOnScreen)





exports.api = functions.https.onRequest(app);

//firebase Trigger
// get the notification when the user comment or like
exports.createNotificationOnLike = functions.firestore.document("begen/{id}")
    .onCreate((snapshot) => {
        return db.doc(`/crier/${snapshot.data().screamid}`).get().then((doc) => {
            if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                return db.doc(`/bildirim/${snapshot.id}`).set({
                    createdAt: "12/03/2022",
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: "begen",
                    read: false,
                    screamid: doc.id
                })
            }
        }).catch(err => {
            console.error(err)
        })
    })

//able to delete our like 
exports.deleteNotificationOnUnLike = functions.firestore.document("begen/{id}").onDelete((snapshot) => {
    db.doc(`/bildirim/${snapshot.id}`).delete().catch(err => {
        console.error(err);
        return;
    })
})


//comments notifications
exports.createNotificationOnComment = functions.firestore.document("comments/{id}").onCreate((snapshot) => {

    return db.doc(`/crier/${snapshot.data().screamid}`).get().then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
            return db.doc(`/bildirim/${snapshot.id}`).set({
                createdAt: "12/03/2022",
                recipient: doc.data().userHandle,
                sender: snapshot.data().userHandle,
                type: "comments",
                read: false,
                screamid: doc.id
            })
        }
    }).catch(err => {
        console.error(err)
        return;
    })

})

//change the images when the images changes

exports.onUserImageChange = functions.firestore.document('/userabd/{userId}')
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        if (change.before.data().profileUrl !== change.after.data().profileUrl) {
            console.log('icon değişti');
            const batch = db.batch();
            return db
                .collection('homepageLink')
                .where('userHandle', '==', change.before.data().userHandle)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const scream = db.doc(`/homepageLink/${doc.id}`);
                        batch.update(scream, { profileUrl: change.after.data().profileUrl });
                    });
                    return batch.commit();

                });
        } else return true;
    });

// exports.onUserImageChange = functions.firestore.document('/userabd/{userId}')
// .onUpdate((change) => {
//     console.log(change.before.data());
//     console.log(change.after.data());
//     if (change.before.data().profileUrl !== change.after.data().profileUrl) {
//         console.log('icon değişti');
//         const batch = db.batch();
//         return db
//             .collection('crier')
//             .where('userHandle', '==', change.before.data().userHandle)
//             .get()
//             .then((data) => {
//                 data.forEach((doc) => {
//                     const scream = db.doc(`/crier/${doc.id}`);
//                     batch.update(scream, { userImage: change.after.data().profileUrl });
//                 });
//                 return batch.commit();
//             });
//     } else return true;
// });

//delete crier
exports.onScreamDelete = functions.firestore.document('/crier/{screamid}')
    .onDelete((snapshot, context) => {
        const screamId = context.params.screamid;
        const batch = db.batch();
        return db
            .collection('comments')
            .where('screamid', '==', screamid)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                });
                return db
                    .collection('begen')
                    .where('screamid', '==', screamid)
                    .get();

            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/begen/${doc.id}`));
                });
                return db
                    .collection('bildirim')
                    .where('screamid', '==', screamid)
                    .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/bildirim/${doc.id}`));
                });
                return batch.commit();
            })
            .catch((err) => console.error(err));
    });