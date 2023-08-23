import {
	addMinutes,
	setMilliseconds,
	addSeconds,
	differenceInSeconds,
	intervalToDuration,
} from 'date-fns';

export class Timer {
	// Properties.
	minutesLimit: number;
	secondsLimit: number;
	timerId: number;
	minsEl: HTMLInputElement;
	secsEl: HTMLInputElement;
	btnEl: HTMLButtonElement;

	constructor() {
		this.minutesLimit = 5;
		this.secondsLimit = 0;
		this.timerId = 0;
		this.minsEl = document.getElementById('minutes') as HTMLInputElement;
		this.secsEl = document.getElementById('seconds') as HTMLInputElement;
		this.btnEl = document.getElementById('start') as HTMLButtonElement;

		this.init();
	}

	init() {
		// Set up numbers.
		this.minsEl.value = this.minutesLimit
			.toString()
			.padStart(2, '0');
		this.secsEl.value = this.secondsLimit
			.toString()
			.padStart(2, '0');
			
		// Start button listener.
		this.btnEl.addEventListener(
			'click',
			() => {
				const btnText: string =
					this.btnEl.innerText.toLowerCase();
				if ('start' === btnText) {
					this.countdownStart();
					this.btnEl.innerText = 'stop';
				} else {
					this.countdownStop();
				}
			}

		);

		this.minsEl.addEventListener('input', (e: Event) => {
			const value = ((e as InputEvent).target as HTMLInputElement).valueAsNumber;
			this.updateMins(value);
		});

		this.secsEl.addEventListener('input', (e: Event) => {
			const value = ((e as InputEvent).target as HTMLInputElement).valueAsNumber;
			this.updateSecs(value);
		});

		const settingsBtnEl = document.querySelector('.settings') as HTMLButtonElement;
		settingsBtnEl.addEventListener(
			'click',
			this.editTimer
		);
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
		this.animateReset();
		clearInterval(this.timerId);
		this.btnEl.innerText = 'start';
		this.minsEl.value = this.minutesLimit
			.toString()
			.padStart(2, '0');
		this.secsEl.value = this.secondsLimit
			.toString()
			.padStart(2, '0');
	}

	animateProgress(seconds: number): void {
		const circle = document.getElementById('circle') as HTMLElement;
		circle.style.strokeDashoffset = '1596';
		circle.style.animation =
			'stroke ' + String(seconds) + 's linear forwards';
	}

	animateReset(): void {
		const circle = document.getElementById('circle') as HTMLElement;
		circle.style.strokeDashoffset = '0';
		circle.style.animation = 'unset';
	}

	editTimer() {
		this.minsEl.removeAttribute('disabled');
		this.secsEl.removeAttribute('disabled');
	}
}