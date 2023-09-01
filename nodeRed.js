import {initializeApp} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import {
    getDatabase,
    ref,
    query,
    onValue,
    limitToLast
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
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
const app = initializeApp(firebaseConfig);
const db = getDatabase();

function addition(arr, start, end, num) {
    let sum = 0;
    for (let i = start; i < end; i++) {
        sum += parseInt(arr[i]);
    }
    return (sum / num).toFixed(2);
}

function convertAverage(arr, num) {
    let inputArray = arr
    inputArray = inputArray.reverse()
    let avgArr = Array.from(Array(60), () => 0)
    for (let i = 0; i < 60; i++) {
        avgArr[i] = addition(inputArray, i * num, (i * num) + num, num);
    }
    return avgArr;
}

const voltageRef = query(ref(db, 'node-db/voltage'), limitToLast(1080));
let mins = [];
let seconds = [];
let hours = []
let avgMins = [];
let avgSeconds = [];
let avgHours = [];
onValue(voltageRef, (snapshot) => {
    let voltage = []

    const data = snapshot.val();
    let count = 0;
    for (let timeline in data) {
        voltage.push(data[timeline])
        let date = new Date(parseInt(timeline));
        let min = date.getMinutes()
        let sec = date.getSeconds()
        mins.push(min);
        seconds.push(sec);
        hours.push(date.getHours());
        count++;
        if (count === 18) {
            avgMins.push(min);
            avgSeconds.push(sec);
            avgHours.push(date.getHours());
            count = 0;
        }

    }
    const averageVoltage = convertAverage(voltage, 18)
    temperatureVoltagePoints.plotPoints(voltage.reverse().slice(-60), "red")//input per 10sec = 18 input/3mins
    temperatureVoltagePoints.ticksLabel(seconds.slice(-60), mins.slice(-60), hours.slice(-60))
    avgVoltagePoints.plotPoints(averageVoltage, "red")
    avgVoltagePoints.ticksLabel(avgSeconds.slice(-60), avgMins.slice(-60), avgHours.slice(-60))
});

const temperatureRef = query(ref(db, 'node-db/temperature'), limitToLast(1080));
onValue(temperatureRef, (snapshot) => {
    const data = snapshot.val();
    let temperature = []
    for (let timeline in data) {
        temperature.push(data[timeline]);
    }
    const averageTemperature = convertAverage(temperature, 18)
    temperatureVoltagePoints.plotPoints(temperature.reverse().slice(-60));
    avgTemperaturePoints.plotPoints(averageTemperature);
    avgTemperaturePoints.ticksLabel(avgSeconds.slice(-60), avgMins.slice(-60), avgHours.slice(-60))
});

