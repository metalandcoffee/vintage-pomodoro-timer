import {
	addMinutes,
	setMilliseconds,
	intervalToDuration,
	addSeconds,
	differenceInSeconds,
} from 'date-fns';
import tmi from 'tmi.js';



document.addEventListener('DOMContentLoaded', function () {
	const SECOND_IN_MILLISECONDS: number = 1000;

	const PomodoroTimer = {
		settings: {
			minutesLimit: 15,
			secondsLimit: 0,
			timer: null,
			mins: document.getElementById('minutes'),
			secs: document.getElementById('seconds'),
			btn: document.getElementById('start'),
		},
		init(): void {
			// Type guard. Check if null or undefined. Abort if so.
			if (!this.settings.btn || !this.settings.mins || !this.settings.secs) {
				return;
			}
			const btnEl = this.settings.btn as HTMLButtonElement;
			const minsEl = this.settings.mins as HTMLInputElement;
			const secsEl = this.settings.secs as HTMLInputElement;

			btnEl.addEventListener(
				'click',
				this.toggleButton.bind({
					countdownStart: this.countdownStart.bind(this),
					countdownStop: this.countdownStop.bind(this),
					btnEl,
					minsEl,
					secsEl,
					settings: this.settings,
				})
			);
			minsEl.addEventListener('input', this.handlerUpdateMins.bind(this));
			secsEl.addEventListener('input', this.updateSecs.bind(this));

			const settingsBtn = document.querySelector('.settings');
			// Type guard. Check if null or undefined. Abort if so.
			if (!settingsBtn) {
				return;
			}
			const settingsBtnEl = settingsBtn as HTMLButtonElement;
			settingsBtnEl.addEventListener(
				'click',
				this.editTimer.bind(this)
			);
		},
		handlerUpdateMins(e: InputEvent): void {
			const next = e.target as HTMLInputElement;
			this.updateMins(next.valueAsNumber);
		},
		updateMins(mins: number): void {
			console.log(mins);
			this.settings.minutesLimit = isNaN(mins)
				? 0
				: mins;
		},
		handlerUpdateSecs(e: InputEvent): void {
			const next = e.target as HTMLInputElement;
			this.updateSecs(next.valueAsNumber);

		},
		updateSecs(secs: number): void {
			this.settings.secondsLimit = isNaN(secs)
				? 0
				: secs;
		},
		toggleButton(): void {
			const btnText: string | undefined =
				this.btnEl.innerText.toLowerCase();

			if ('start' === btnText) {
				this.countdownStart();
				this.btnEl.innerText = 'stop';
			} else {
				this.countdownStop();
			}
		},
		animateProgress(remainder: number): void {
			const circle = document.getElementById('circle');
			// Type guard.
			if (!circle) {
				return;
			}
			const circleEl = circle as HTMLOrSVGElement;
			circle.style.strokeDashoffset = '1596';
			circle.style.animation =
				'stroke ' + String(remainder) + 's linear forwards';
			/* These properties need to be set via JS on click */
			/* stroke-dashoffset: 1596; */
			/* animation: stroke 10s ease-out forwards; */
		},
		countdownStart(): void {
			let currentTime = new Date();
			currentTime = setMilliseconds(currentTime, 0);
			let endTime = addMinutes(currentTime, this.settings.minutesLimit);
			endTime = addSeconds(endTime, this.settings.secondsLimit);

			const remainder = differenceInSeconds(endTime, currentTime);

			this.animateProgress(remainder);

			const mins = document.getElementById('minutes');
			const secs = document.getElementById('seconds');

			// Type guard and current time check.
			if (!secs || !mins) {
				return;
			}
			const minsEl = mins as HTMLInputElement;
			const secsEl = secs as HTMLInputElement;

			function timerCallback() {
				currentTime = new Date();
				currentTime = setMilliseconds(currentTime, 0);

				const remainingTime = intervalToDuration({
					start: currentTime,
					end: endTime,
				});

				const remainingMins = remainingTime.minutes as number;
				const remainingSecs = remainingTime.seconds as number;

				// Render updated values.
				minsEl.value = remainingMins.toString().padStart(2, '0');
				secsEl.value = remainingSecs.toString().padStart(2, '0');

				if (!remainingTime.minutes && !remainingTime.seconds) {
					clearInterval(this.settings.timer);
				}
			}

			this.settings.timer = setInterval(
				timerCallback.bind(this),
				SECOND_IN_MILLISECONDS
			);
		},
		countdownStop() {
			// Stop countdown and reset values.
			// Type guard. Check if null or undefined. Abort if so.
			if (!this.settings.btn || !this.settings.mins || !this.settings.secs) {
				return;
			}
			const btnEl = this.settings.btn as HTMLButtonElement;
			const minsEl = this.settings.mins as HTMLInputElement;
			const secsEl = this.settings.secs as HTMLInputElement;
			clearInterval(this.settings.timer);
			btnEl.innerText = 'start';
			minsEl.value = this.settings.minutesLimit
				.toString()
				.padStart(2, '0');
			secsEl.value = this.settings.secondsLimit
				.toString()
				.padStart(2, '0');
		},
		editTimer() {
			const mins = document.getElementById('minutes');
			const secs = document.getElementById('seconds');

			// Type guard and current time check.
			if (!secs || !mins) {
				return;
			}
			const minsEl = mins as HTMLInputElement;
			const secsEl = secs as HTMLInputElement;

			minsEl.removeAttribute('disabled');
			secsEl.removeAttribute('disabled');
		},
	};

	PomodoroTimer.init();


	const client = new tmi.Client({
		channels: ['metalandcoffee_']
	});

	client.connect();

	client.on('message', (channel, tags, message, self) => {

		const isBroadcaster: Boolean = tags?.badges?.broadcaster === '1';

		if (!isBroadcaster || !message.includes('!pomo')) {
			return;
		}
		// !pomo start 15
		// !pomo stop
		const timerArgs: Array<string> = message.split(' ');
		const startOrStop: string = timerArgs[1];
		const mins: number = parseInt(timerArgs[2]);

		if (!startOrStop.includes('stop') && !startOrStop.includes('start')) {
			return;
		}

		// Start timer.
		if ('start' === startOrStop) {
			// Type guard. Check if null or undefined. Abort if so.
			if (!PomodoroTimer.settings.mins || !PomodoroTimer.settings.secs) {
				return;
			}
			const minsEl = PomodoroTimer.settings.mins as HTMLInputElement;
			const secsEl = PomodoroTimer.settings.secs as HTMLInputElement;

			// update mins in timer
			PomodoroTimer.updateMins(mins);
			minsEl.value = PomodoroTimer.settings.minutesLimit
				.toString()
				.padStart(2, '0');
			// update secs in timer
			PomodoroTimer.updateSecs(0);
			secsEl.value = PomodoroTimer.settings.secondsLimit
				.toString()
				.padStart(2, '0');
			// start timer
			PomodoroTimer.countdownStart();
		} else if ('stop' === startOrStop) {
			PomodoroTimer.countdownStop();
		}



	});
});
