import {
	addMinutes,
	setMilliseconds,
	addSeconds,
	intervalToDuration,
} from 'date-fns';
import alarm from './alarm.wav';

export class Timer {

	minutesLimit: number;
	secondsLimit: number;
	timerId: number;
	minsEl: HTMLInputElement;
	secsEl: HTMLInputElement;

	/**
	 * Constructor.
	 */
	constructor(minutesLimit: number, secondsLimit: number) {
		this.minutesLimit = minutesLimit;
		this.secondsLimit = secondsLimit;
		this.timerId = 0;
		this.minsEl = document.getElementById('minutes') as HTMLInputElement;
		this.secsEl = document.getElementById('seconds') as HTMLInputElement;

		this.init();
	}

	/**
	 * Initialize the timer.
	 */
	init() {
		// Set up numbers.
		this.minsEl.innerText = this.minutesLimit
			.toString()
			.padStart(2, '0');
		this.secsEl.innerText = this.secondsLimit
			.toString()
			.padStart(2, '0');
	}

	/**
	 * Start the timer.
	 */
	start() {
		console.log('pineapple');
		let currentTime = new Date();
		currentTime = setMilliseconds(currentTime, 0);
		let endTime = addMinutes(currentTime, this.minutesLimit);
		endTime = addSeconds(endTime, this.secondsLimit);

		// Set up interval to run countdown function every second.
		this.timerId = setInterval(
			this.countdown.bind(this),
			1000,
			endTime
		);
	}

	/**
	 * Countdown function.
	 * @param endTime 
	 */
	countdown(endTime: number) {
		console.log('watermelon');
		let currentTime = new Date();
		currentTime = setMilliseconds(currentTime, 0);

		const remainingTime = intervalToDuration({
			start: currentTime,
			end: endTime,
		});

		const remainingMins = remainingTime.minutes as number;
		const remainingSecs = remainingTime.seconds as number;

		// Render updated values.
		this.minsEl.innerText = remainingMins.toString().padStart(2, '0');
		this.secsEl.innerText = remainingSecs.toString().padStart(2, '0');

		if (!remainingTime.minutes && !remainingTime.seconds) {
			// play sound.
			const audio = new Audio('alarm.wav');
			audio.play();
			clearInterval(this.timerId);
		}
	}

	countdownStop() {
		// Stop countdown and reset values.
		clearInterval(this.timerId);
		this.minsEl.value = this.minutesLimit
			.toString()
			.padStart(2, '0');
		this.secsEl.value = this.secondsLimit
			.toString()
			.padStart(2, '0');
	}
}