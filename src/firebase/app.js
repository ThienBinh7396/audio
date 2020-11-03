import firebase from 'firebase/app'
import credentials from './credentials'


let a = firebase.initializeApp(credentials.config);

export const app = a;