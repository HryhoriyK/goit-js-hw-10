import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


const picker = document.getElementById("datetime-picker");
const startButton = document.querySelector(".start-button");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate;
let timerInterval;

flatpickr(picker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        if (userSelectedDate <= new Date()) {
            iziToast.error({
                title: "Помилка",
                message: "Please choose a date in the future",
                position: "topRight",
            });
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector(".start-button");
    startButton.disabled = true;
});


startButton.addEventListener("click", () => {
    startButton.disabled = true;
    picker.disabled = true;
    startCountdown();
});

function startCountdown() {
    timerInterval = setInterval(() => {
        const timeLeft = userSelectedDate - new Date();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            picker.disabled = false;
            startButton.disabled = true;
            return;
        }
        updateTimer(convertMs(timeLeft));
    }, 1000);
}

function convertMs(ms) {
    return {
        days: Math.floor(ms / (1000 * 60 * 60 * 24)),
        hours: Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((ms % (1000 * 60)) / 1000),
    };
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function updateTimer({ days, hours, minutes, seconds }) {
    daysEl.textContent = days;
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}