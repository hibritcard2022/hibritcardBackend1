const isEmail = (email) => {
    const regEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.match(regEX)) {
        return true;
    } else {
        return false;
    }

}

const isEmpty = (string) => {
    if (string.trim() === "") {
        return true
    } else {
        return false
    }
}

// const minLength = (String) => {
//     if (String.length >= 6) {
//         return true
//     } else {
//         return false
//     }

// }

exports.validateSignUpData = (data) => {

    //kontrol eğer göne-derilen veriler boşsa

    let hatalar = {} //hataların objesi

    if (isEmpty(data.email)) {
        hatalar.email = "E-mail boş olamaz,geçilemez!";

    } else if (!isEmail(data.email)) {
        hatalar.email = "Geçerli bir e-mail adresi giriniz!"
    }

    if (isEmpty(data.nameSurname)) {
        hatalar.nameSurname = "Ad Soyad Giriniz!!"
    }


    if (isEmpty(data.password)) {
        hatalar.password = "Boş geçilemez.."
    }

    // if (minLength(data.password)) {
    //     hatalar.password = "Şifre en az 6 karakterden oluşmalıdır."

    // }


    if (data.password !== data.confirmPassword) {
        hatalar.confirmPassword = "Şifreler uyuşmuyor!"
    }
    if (isEmpty(data.userHandle)) {
        hatalar.userHandle = "Boş geçilemez!"
    }

    return {
        hatalar,
        valid: Object.keys(hatalar).length === 0 ? true : false
    }

}

exports.validateLoginData = ((data) => {
    let hatakisigiris = {}
        //kontrol eğer gönderilen verilen boşsa kontrol yap
    if (isEmpty(data.email)) {
        hatakisigiris.email = "Boş geçilemez!!"
    }
    if (isEmpty(data.password)) {
        hatakisigiris.password = "Boş geçilemez!!"
    }
    return {
        hatakisigiris,
        valid: Object.keys(hatakisigiris).length === 0 ? true : false
    }

})


//validator Reset password
exports.validateResetData = ((data) => {
    let hatakisigiris = {}
        //kontrol eğer gönderilen verilen boşsa kontrol yap
    if (isEmpty(data.email)) {
        hatakisigiris.email = "Boş geçilemez!!"
    }

    return {
        hatakisigiris,
        valid: Object.keys(hatakisigiris).length === 0 ? true : false
    }

})


//kullanıcı bilgileri kontrol ve kaydetme
exports.reducekulbilgi = (data) => {
    let kuldtails = {}

    //biography
    if (!isEmpty(data.bio.trim())) {
        kuldtails.bio = data.bio
    }
    //website linki
    if (!isEmpty(data.website.trim())) {
        //https:website.com
        if (data.website.trim().substring(0, 4) !== "http") {
            kuldtails.website = `http://${data.website.trim()}`;

        } else {
            kuldtails.website = data.website
        }

    }
    //şirketi
    if (!isEmpty(data.company.trim())) {
        kuldtails.company = data.company
    }
    //positionu 
    if (!isEmpty(data.position.trim())) {
        kuldtails.position = data.position
    }
    //Telefon Numarası
    if (!isEmpty(data.phoneNumber.trim())) {
        kuldtails.phoneNumber = data.phoneNumber
    }
    if (!isEmpty(data.nameSurname.trim())) {
        kuldtails.nameSurname = data.nameSurname
    }

    return kuldtails;

}


//fatura bilgi Ekle
//kullanıcı bilgileri kontrol ve kaydetme
exports.reducekulFatura = (data) => {
    let kuldFaturatails = {}

    //vergi Numarasi
    if (!isEmpty(data.vergiNumarasi.trim())) {
        kuldFaturatails.vergiNumarasi = data.vergiNumarasi
    }
    //vergi dairesi
    if (!isEmpty(data.vergidairesi.trim())) {
        kuldFaturatails.vergidairesi = data.vergidairesi
    }
    //Fırma Ünvanı
    if (!isEmpty(data.firmaUnvani.trim())) {
        kuldFaturatails.firmaUnvani = data.firmaUnvani
    }
    //ofis maili
    if (!isEmpty(data.ofisMaili.trim())) {
        kuldFaturatails.ofisMaili = data.ofisMaili
    }
    //Ofis Telefonu
    if (!isEmpty(data.ofistelefonu.trim())) {
        kuldFaturatails.ofistelefonu = data.ofistelefonu
    }
    //Konum yeri
    if (!isEmpty(data.location.trim())) {
        kuldFaturatails.location = data.location
    }

    return kuldFaturatails;

}

// rduce Kullanici güncelle
exports.reducekulKullaniciURLGetir = (data) => {
    let kuldFaturatails = {}

    //vergi Numarasi
    if (!isEmpty(data.UrlLinki.trim())) {
        kuldFaturatails.UrlLinki = data.UrlLinki
    }

    return kuldFaturatails;

}

exports.reducekulKullaniciContactURLGetir = (data) => {
    let kuldFaturatails = {}

    //vergi Numarasi
    if (!isEmpty(data.UrlLinki.trim())) {
        kuldFaturatails.UrlLinki = data.UrlLinki
    }

    return kuldFaturatails;

}

//banka bilgi getir ve gücelle
exports.reducekulKullanicbankaGetirGuncelle = (data) => {

    let kuldFaturatails = {}


    if (!isEmpty(data.hesabSahibi.trim())) {
        kuldFaturatails.hesabSahibi = data.hesabSahibi
    }

    if (!isEmpty(data.hesapNumarasi.trim())) {
        kuldFaturatails.hesapNumarasi = data.hesapNumarasi
    }

    if (!isEmpty(data.iban.trim())) {
        kuldFaturatails.iban = data.iban
    }



    return kuldFaturatails;

}

exports.reducekulgeceModu = (data) => {
    let kuldFaturatails = {}

    //gece Modu
    if (!isEmpty(data.geceModu.trim())) {
        kuldFaturatails.geceModu = data.geceModu
    }

    return kuldFaturatails;

}

exports.reducekulprofilGizle = (data) => {
    let kuldFaturatails = {}

    //gece Modu
    if (!isEmpty(data.profilKapa.trim())) {
        kuldFaturatails.profilKapa = data.profilKapa
    }

    return kuldFaturatails;

}