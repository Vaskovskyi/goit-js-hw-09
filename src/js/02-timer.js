import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import Notiflix from 'notiflix'

let selectedTime = null
const refs = {
  inputDate: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      Notiflix.Notify.failure('Please choose a date in the future')
      selectedDates[0] = new Date()
    } else {
      refs.startBtn.disabled = false
      selectedTime = selectedDates[0]
    }
  },
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day))
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour))
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute))
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second),
  )

  return { days, hours, minutes, seconds }
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0')
}

class Timer {
  constructor() {
    this.timerID = null
    this.isActive = false
    refs.startBtn.disabled = true
  }

  startTimer() {
    if (this.isActive) {
      return
    }
    this.isActive = true
    this.timerID = setInterval(() => {
      const currentTime = Date.now()
      const deltaTime = selectedTime - currentTime
      const componentsTimer = convertMs(deltaTime)
      this.updateComponentsTimer(componentsTimer)
      if (deltaTime <= 0) {
        this.stopTimer()
      }
    }, 1000)
  }

  updateComponentsTimer({ days, hours, minutes, seconds }) {
    refs.days.textContent = days
    refs.hours.textContent = hours
    refs.minutes.textContent = minutes
    refs.seconds.textContent = seconds
  }

  stopTimer() {
    clearInterval(this.timerID)
  }
}

const timer = new Timer()
flatpickr(refs.inputDate, options)
refs.startBtn.addEventListener('click', () => timer.startTimer())
