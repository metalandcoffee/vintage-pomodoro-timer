import {
	addMinutes,
	setMilliseconds,
	addSeconds,
	differenceInSeconds,
	intervalToDuration,
} from 'date-fns';

export class Timer {

	minutesLimit: number;
	secondsLimit: number;
	timerId: number;
	minsEl: HTMLInputElement;
	secsEl: HTMLInputElement;

	/**
	 * Constructor.
	 */
	constructor() {
		this.minutesLimit = 5;
		this.secondsLimit = 0;
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

	updateMins(mins: number): void {
		this.minutesLimit = isNaN(mins)
			? 0
			: mins;
	}

	updateSecs(secs: number): void {
		this.secondsLimit = isNaN(secs)
			? 0
			: secs;
	}

	countdownStart() {
		let currentTime = new Date();
		currentTime = setMilliseconds(currentTime, 0);
		let endTime = addMinutes(currentTime, this.minutesLimit);
		endTime = addSeconds(endTime, this.secondsLimit);

		// Duration in seconds for circle animation.
		const secsDuration: number = differenceInSeconds(endTime, currentTime);
		this.animateProgress(secsDuration);

		this.timerId = setInterval(
			this.timer.bind(this),
			1000,
			endTime
		);
	}

	timer(endTime: number) {
		let currentTime = new Date();
		currentTime = setMilliseconds(currentTime, 0);

		const remainingTime = intervalToDuration({
			start: currentTime,
			end: endTime,
		});

		const remainingMins = remainingTime.minutes as number;
		const remainingSecs = remainingTime.seconds as number;

		// Render updated values.
		this.minsEl.value = remainingMins.toString().padStart(2, '0');
		this.secsEl.value = remainingSecs.toString().padStart(2, '0');

		if (!remainingTime.minutes && !remainingTime.seconds) {
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