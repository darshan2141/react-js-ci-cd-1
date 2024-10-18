import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyCDZoW518Wu3cgYvUMVZ53uQRcd_PJz9J0",
    authDomain: "fieldr-community.firebaseapp.com",
    projectId: "fieldr-community",
    storageBucket: "fieldr-community.appspot.com",
    messagingSenderId: "1089955249543",
    appId: "1:1089955249543:web:9c2e523af303d989f7e722",
    measurementId: "G-N7LKM3JZP7"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };