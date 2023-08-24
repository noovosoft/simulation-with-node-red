import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import {getDatabase, ref, get, onValue, child} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDO_pd4HCHJufLCSLkTvqmOzF1d5ZY-Nn8",
    authDomain: "node-db-c183e.firebaseapp.com",
    databaseURL: "https://node-db-c183e-default-rtdb.firebaseio.com",
    projectId: "node-db-c183e",
    storageBucket: "node-db-c183e.appspot.com",
    messagingSenderId: "665986311817",
    appId: "1:665986311817:web:0ce2ebf339dac115b44858"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

const voltageRef = ref(db, 'node-db/voltage');
onValue(voltageRef, (snapshot) => {
    let voltage = []
    const data = snapshot.val();
    for(let key in data) {
        //console.log(key + " " + data[key])
        voltage.push(data[key])
    }

    temperatureVoltage.plotPoints(voltage.slice(-60), "red")
    voltageObj.plotPoints(voltage.slice(-60), "red")
});

const temperatureRef = ref(db, 'node-db/temperature');
onValue(temperatureRef, (snapshot) => {
    const data = snapshot.val();
    let temperature = []
    //console.log(data);
    for(let key in data) {
        temperature.push(data[key]);
    }
    temperatureVoltage.plotPoints(temperature.slice(-60));
    temperatureObj.plotPoints(temperature.slice(-60));
    //console.log(temp)
});

