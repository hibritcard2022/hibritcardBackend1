const admin = require("firebase-admin");
//import { initializeApp } from 'firebase-admin/app';
admin.initializeApp();

//import { getFirestore } from "firebase/firestore";


const db = admin.firestore()

//const db=getFirestore()

module.exports = { admin, db }