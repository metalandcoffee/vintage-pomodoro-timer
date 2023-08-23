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