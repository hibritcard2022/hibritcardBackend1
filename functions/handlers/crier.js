const { app } = require("firebase-admin");
const { json } = require("stream/consumers");
const { db } = require("../importantsDoc/admin")



exports.getAllCrier = (req, res) => {
    db.collection("crier").orderBy("createdAt", "desc")
        .get().then((data) => {
            let crier = [];
            data.forEach((doc) => {
                crier.push({
                    crierId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount
                })

            });
            return res.json(crier)
        }).catch(err => {
            console.error(err)
        })

}

exports.getAllikons = (req, res) => {


    db.collection("socialkonlar")
        .get().then((data) => {
            let ikonlar = [];
            data.forEach((doc) => {
                ikonlar.push({
                    ikonId: doc.id,
                    ikonImage: doc.data().ikonImage,
                    ikonUrl: doc.data().ikonUrl,
                    urlVar: doc.data().urlVar,
                    userHandle: doc.data().userHandle,

                })

            });
            return res.json(ikonlar)
        }).catch(err => {
            console.error(err)
        })
}

//banka Iconlar
exports.getBankaIkonlar = (req, res) => {
    db.collection("bankaKonlar").orderBy("urlVar", "desc")
        .get().then((data) => {
            let ikonlar = [];
            data.forEach((doc) => {
                ikonlar.push({
                    ikonId: doc.id,
                    ikonImage: doc.data().ikonImage,
                    ikonUrl: doc.data().ikonUrl,
                    urlVar: doc.data().urlVar,
                    userHandle: doc.data().userHandle,
                })

            });
            return res.json(ikonlar)
        }).catch(err => {
            console.error(err)
        })
}

//iletişim tümünü al
exports.getIletisimIkonlar = (req, res) => {
    db.collection("contactIkons")
        .get().then((data) => {
            let ikonlar = [];
            data.forEach((doc) => {
                ikonlar.push({
                    ikonId: doc.id,
                    ikonImage: doc.data().ikonImage,
                    ikonUrl: doc.data().ikonUrl,
                    type: doc.data().type,
                    userHandle: doc.data().userHandle,
                })

            });
            return res.json(ikonlar)
        }).catch(err => {
            console.error(err)
        })
}



exports.postCrier = (req, res) => {

    if (req.body.body.trim() == "") {
        return res.status(400).json({ Body: "Body boş olamaz !!" })
    }

    const createcrier = {
        body: req.body.body,
        userHandle: req.user.userHandle, //normal req.body.userHandle ydi FBAuth gelene kadar verified etmiş olur.
        createdAt: new Date().toISOString(),
        userImage: req.user.profileUrl,
        likeCount: 0,
        commentCount: 0

    }
    db.collection("crier").add(createcrier).then((data) => {
        const resScream = createcrier
        resScream.screamid = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "something went wrong!!" });

        console.error(err)
    })
}



//post instagram ikon
exports.postinstagramUrl = (req, res) => {

    if (req.body.Url.trim() == "") {
        return res.status(400).json({ Body: "Link Veriniz!!" })
    }



    const createInstagramUrl = {
        Url: `https://instagram/${req.body.Url}`,
        userHandle: req.user.userHandle,
        type: "instagram",
        varUrl: false
    }

    db.collection("socialkonlar").add(createInstagramUrl).then((data) => {
        const resScream = createInstagramUrl
        resScream.screamid = data.id
        res.json({ resScream });
    }).catch((err) => {
        res.status(500).json({ error: "instagram Ikonu Eklenemedi!!" });
        console.error(err)
    })
}

//post facebook Url
exports.postfacebookUrl = (req, res) => {

        if (req.body.Url.trim() == "") {
            return res.status(400).json({ Body: "Link Veriniz!!" })
        }

        const createInstagramUrl = {
            Url: `https://facebook/${req.body.Url}`,
            userHandle: req.user.userHandle,
            type: "facebook"
        }

        db.collection("socialkonlar").add(createInstagramUrl).then((data) => {
            const resScream = createInstagramUrl
            resScream.screamid = data.id
            res.json({ resScream });
        }).catch((err) => {
            res.status(500).json({ error: "instagram Ikonu Eklenemedi!!" });
            console.error(err)
        })

    }
    //bana bir ikon getir
exports.getOneIcon = (req, res) => {
    let ikonsData = {}
    db.doc(`/socialkonlar/${req.params.ikonId}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "Ikon bulunmuyor!!!" })

        }
        ikonsData = doc.data()
        ikonsData.ikonId = doc.id

    }).then(() => {
        return res.json(ikonsData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })

}

//bana bir banka ikonu getir
exports.getOneIconBanka = (req, res) => {
    let ikonsData = {}
    db.doc(`/bankaKonlar/${req.params.ikonId}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "Ikon bulunmuyor!!!" })

        }
        ikonsData = doc.data()
        ikonsData.ikonId = doc.id

    }).then(() => {
        return res.json(ikonsData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })

}

//iletişim bilgileri

exports.getOneIconIletisim = (req, res) => {
    let ikonsData = {}
    db.doc(`/contactIkons/${req.params.ikonId}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "Ikon bulunmuyor!!!" })

        }
        ikonsData = doc.data()
        ikonsData.ikonId = doc.id

    }).then(() => {
        return res.json(ikonsData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })

}





exports.getCrier = (req, res) => {
    let crierData = {}

    db.doc(`/crier/${req.params.screamid}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "Crier not found!!" })
        }
        crierData = doc.data()
        crierData.screamid = doc.id
        return db.collection("comments")
            .orderBy("createdAt", "desc")
            .where("screamid", "==", req.params.screamid)
            .get()
    }).then(data => {
        crierData.comments = [];

        data.forEach((doc) => {
            //console.log(crierData.commnents.push(doc.data()))
            crierData.comments.push(doc.data());
            // console.log(crierData.push(doc.data()))

        })
        return res.json(crierData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })
}

//ön tanimli linki bilgileri getir
exports.kullaniciTumOnTanimliUrlBilgiAl = (req, res) => {

    let crierData = {}

    db.doc(`/homepageLink/${req.params.screamid}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "kullanıcı not found!!" })
        }
        crierData = doc.data()
        crierData.screamid = doc.id
        return db.collection("userabd").where("userId", "==", doc.data().userId)
            .get()
    }).then(data => {
        crierData.users = [];

        data.forEach((doc) => {
            //console.log(crierData.commnents.push(doc.data()))
            crierData.users.push(doc.data());
            // console.log(crierData.push(doc.data()))
            //.where("userId", "==", doc.data().userId)

        })
        return res.json(crierData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })

}






//get Social Ikons Without FBAuth
exports.getSocialWithoutAuth = (req, res) => {

    let crierData = {}
    db.doc(`/socialkonlar/${req.params.screamid}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "Crier not found!!" })
        }
        crierData = doc.data()
        crierData.screamid = doc.id
        return db.collection("linkUrlAll")
            .where("urlId", "==", req.params.screamid)
            .get()
    }).then(data => {
        crierData.linkUrlAll = [];
        data.forEach((doc) => {
            //console.log(crierData.commnents.push(doc.data()))
            crierData.linkUrlAll.push(doc.data());
            // console.log(crierData.push(doc.data()))

        })
        return res.json(crierData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })
}


//Bnaka without FBAuth
exports.getBankaWithoutAuth = (req, res) => {

    let crierData = {}
    db.doc(`/bankaKonlar/${req.params.screamid}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "Crier not found!!" })
        }
        crierData = doc.data()
        crierData.screamid = doc.id
        return db.collection("linkUrlAll")
            .where("urlId", "==", req.params.screamid)
            .get()
    }).then(data => {
        crierData.linkUrlAll = [];
        data.forEach((doc) => {
            //console.log(crierData.commnents.push(doc.data()))
            crierData.linkUrlAll.push(doc.data());
            // console.log(crierData.push(doc.data()))

        })
        return res.json(crierData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })

}

//Conatact without FBAuth
exports.getConatctWithoutAuth = (req, res) => {

    let crierData = {}
    db.doc(`/contactIkons/${req.params.screamid}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "Crier not found!!" })
        }
        crierData = doc.data()
        crierData.screamid = doc.id
        return db.collection("linkUrlAll")
            .where("urlId", "==", req.params.screamid)
            .get()
    }).then(data => {
        crierData.linkUrlAll = [];
        data.forEach((doc) => {
            //console.log(crierData.commnents.push(doc.data()))
            crierData.linkUrlAll.push(doc.data());
            // console.log(crierData.push(doc.data()))

        })
        return res.json(crierData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })

}

//bana banka ve Url si getir bana

exports.getBankaKonsandUrl = (req, res) => {
    let crierData = {}

    db.doc(`/bankaKonlar/${req.params.screamid}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "Crier not found!!" })
        }
        crierData = doc.data()
        crierData.screamid = doc.id
        return db.collection("linkUrlAll")
            .where("urlId", "==", req.params.screamid)
            .where("userHandle", "==", req.user.userHandle).get()
    }).then(data => {
        crierData.linkId = data.uid;
        crierData.linkUrlAll = [];
        data.forEach((doc) => {
            //console.log(crierData.commnents.push(doc.data()))
            crierData.linkUrlAll.push(doc.data());
            crierData.linkId = crierData.linkUrlAll.push({ linkIdBurada: doc.id })
                // console.log(crierData.push(doc.data()))

        })
        return res.json(crierData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })
}

// bana Ssocial media ve URLsi getir

exports.getSocialKonsandUrl = (req, res) => {
        let crierData = {}
        db.doc(`/socialkonlar/${req.params.screamid}`).get().then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ Mesaj: "Crier not found!!" })
            }
            crierData = doc.data()
            crierData.screamid = doc.id
            return db.collection("linkUrlAll")
                .where("urlId", "==", req.params.screamid)
                .where("userHandle", "==", req.user.userHandle)
                .get()
        }).then(data => {
            crierData.linkId = data.uid;
            crierData.linkUrlAll = [];



            data.forEach((doc) => {
                //console.log(crierData.commnents.push(doc.data()))
                crierData.linkUrlAll.push(doc.data());
                // console.log(crierData.linkUrlAll.push(linkId = doc.id))
                crierData.linkId = crierData.linkUrlAll.push({ linkIdBurada: doc.id })

                //crierData.linkUrlAll.push(data.uid)

            })



            return res.json(crierData)
        }).catch(err => {
            console.error(err)
            return res.status(500).json({ Mesaj: err.code })

        })
    }
    //bana iletisim ikonu ve Urlsi getir

exports.getiletisimKonsandUrl = (req, res) => {
    let crierData = {}
    db.doc(`/contactIkons/${req.params.screamid}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "Crier not found!!" })
        }
        crierData = doc.data()
        crierData.screamid = doc.id
        return db.collection("linkUrlAll")
            .where("urlId", "==", req.params.screamid).where("userHandle", "==", req.user.userHandle).get()
    }).then(data => {
        crierData.linkId = data.uid;
        crierData.linkUrlAll = [];
        data.forEach((doc) => {
            //console.log(crierData.commnents.push(doc.data()))
            crierData.linkUrlAll.push(doc.data());
            crierData.linkId = crierData.linkUrlAll.push({ linkIdBurada: doc.id })
                // console.log(crierData.push(doc.data()))

        })
        return res.json(crierData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })
}





//be able to post ocmments

exports.postCommnentOnScreen = (req, res) => {

    if (req.body.body.trim() === "") {
        return res.status(400).json({ Hata: "Bu alan boş geçilemez!!" });
    }

    const newComments = {
        body: req.body.body,
        createdAt: "10/10/2020",
        userHandle: req.user.userHandle,
        screamid: req.params.screamid,
        userImage: req.user.profileUrl
    }

    db.doc(`/crier/${req.params.screamid}`).get().then(doc => {


        if (!doc.exists) {
            return res.status(404).json({ Hata: "Bu scream bulunamadı" })

        }
        return doc.ref.update({ commentCount: doc.data().commentCount + 1 });

    }).then(() => {
        return db.collection("comments").add(newComments);
    })

    .then(() => {
            res.json(newComments)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ Hata: err.code })
        })


}






//beğen buttonu
exports.likeScreen = (req, res) => {

    const likeDocument = db.collection("begen").where("userHandle", "==", req.user.userHandle).where("screamid", "==", req.params.screamid).limit(1);
    const crierDocument = db.doc(`/crier/${req.params.screamid}`);

    let crierData;

    crierDocument.get().then(doc => {
        if (doc.exists) {
            crierData = doc.data()
            crierData.screamid = doc.id
            return likeDocument.get()
        } else {
            return res.status(400).json({ Hata: "Crier bulunamadı!!" })
        }
    }).then(data => {
        if (data.empty) {
            return db.collection("begen").add({
                screamid: req.params.screamid,
                userHandle: req.user.userHandle
            }).then(() => {
                crierData.likeCount++;
                return crierDocument.update({ likeCount: crierData.likeCount })
            }).then(() => {
                return res.json(crierData)
            })
        } else {
            return res.status(400).json({ Hata: "Zaten beğendiniz!!!" })
        }
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

//Beğememe fonksyonu
exports.unLikeScreen = (req, res) => {

    const likeDocument = db.collection("begen").where("userHandle", "==", req.user.userHandle).where("screamid", "==", req.params.screamid).limit(1);
    const crierDocument = db.doc(`/crier/${req.params.screamid}`);

    let crierData;

    crierDocument.get().then(doc => {
        if (doc.exists) {
            crierData = doc.data()
            crierData.screamid = doc.id
            return likeDocument.get()
        } else {
            return res.status(400).json({ Hata: "Crier bulunamadı!!" })
        }
    }).then(data => {
        if (data.empty) {
            return res.status(400).json({ Hata: "Zaten Beğenmediniz" })
        } else {
            return db.doc(`/begen/${data.docs[0].id}`).delete()
                .then(() => {
                    crierData.likeCount--;
                    return crierDocument.update({ likeCount: crierData.likeCount })
                }).then(() => {
                    res.json(crierData)
                })
        }
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ err: err.code })
    })
}

//Ikon Sil social media ikonu
exports.deleteIkon = (req, res) => {
    const ikonDocument = db.doc(`/socialkonlar/${req.params.ikonId}`);

    ikonDocument.get().then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({ Hata: "ikon bulunamadı" });
        }
        if (doc.data().userHandle !== req.user.userHandle) {
            return res.status(403).json({ Error: "izniz  yok  !!" })
        } else {
            return ikonDocument.delete();
        }

    }).then(() => {
        return res.json({ Mesaj: "İkon başarıyla silindi !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })

}

//bnaka ikonu sil

exports.deleteIkonBanka = (req, res) => {
    const ikonDocument = db.doc(`/bankaKonlar/${req.params.ikonId}`);

    ikonDocument.get().then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({ Hata: "ikon bulunamadı" });
        }
        if (doc.data().userHandle !== req.user.userHandle) {
            return res.status(403).json({ Error: "izniz  yok  !!" })
        } else {
            return ikonDocument.delete();
        }

    }).then(() => {
        return res.json({ Mesaj: "İkon başarıyla silindi !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })

}

//iletişim ikonu silme

exports.deleteIkoniletisim = (req, res) => {
    const ikonDocument = db.doc(`/contactIkons/${req.params.ikonId}`);

    ikonDocument.get().then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({ Hata: "ikon bulunamadı" });
        }
        if (doc.data().userHandle !== req.user.userHandle) {
            return res.status(403).json({ Error: "izniz  yok  !!" })
        } else {
            return ikonDocument.delete();
        }

    }).then(() => {
        return res.json({ Mesaj: "İkon başarıyla silindi !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })

}


//crier sil
exports.deleteCrier = (req, res) => {
    const crierDocument = db.doc(`/crier/${req.params.screamid}`);

    crierDocument.get().then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({ Hata: "Crier bulunamadı" });
        }
        if (doc.data().userHandle !== req.user.userHandle) {
            return res.status(403).json({ Error: "izin yok buna!!" })
        } else {
            return crierDocument.delete();
        }

    }).then(() => {
        return res.json({ Mesaj: "Başarıyla silindi Crier !!!" })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ Err: err.code })
    })
}


// delete kullanici