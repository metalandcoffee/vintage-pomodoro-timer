import { Timer } from './Timer';
import tmi from 'tmi.js';	

const client = new tmi.Client({
  channels: ['metalandcoffee_']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  console.log(channel, tags, message, self);
  const isBroadcaster: boolean = tags?.badges?.broadcaster === '1';

  // example: !pomo start 15
  if (!isBroadcaster || !message.includes('!pomo')) {
    return;
  }

  const timerArgs: string[] = message.split(' ');
  const startOrStop: string = timerArgs[1] || '';
  const mins: number = parseInt(timerArgs[2]) || 0;
  // @todo what happens if you give this a string?

  if (!startOrStop.includes('stop') && !startOrStop.includes('start')) {
    return;
  }

  let timer: Timer;

  // Start timer.
  if ('start' === startOrStop) {
    timer = new Timer(mins, 0);
    timer.start();
  } else if ('stop' === startOrStop) {
    timer.stop();
  }



});
