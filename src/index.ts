import { Timer } from './Timer';
import tmi from 'tmi.js';	

const client = new tmi.Client({
    channels: ['metalandcoffee_']
});

client.connect();

init();jjkjkjk // needs to initialize when dom loads and needs to create new Timer instance that chat commands can manipulate.

client.on('message', (channel, tags, message, self) => {
    console.log(channel, tags, message, self);
    const isBroadcaster: boolean = tags?.badges?.broadcaster === '1';

    // example: !pomo start 15
    if (!isBroadcaster || !message.includes('!pomo')) {
        return;
    }

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

document.addEventListener('DOMContentLoaded', () => new Timer());
