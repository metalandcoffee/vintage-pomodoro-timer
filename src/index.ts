import { Timer } from './Timer';
import tmi from 'tmi.js';	

class Controller {
  private client: tmi.Client;
  private timer: Timer | null = null;

  constructor(channels: string[]) {
    this.client = new tmi.Client({ channels });
    this.client.connect();
    this.setupListeners();
  }

  // Set up message event listeners.
  private setupListeners(): void {
    this.client.on('message', (channel, tags, message, self) => {
      this.handleMessage(channel, tags, message, self);
    });
  }

  // Handle messages sent in the chat
  private handleMessage(channel: string, tags: tmi.ChatUserstate, message: string, self: boolean): void {
    if (self) return; // Ignore messages from the bot itself

    const isBroadcaster = tags?.badges?.broadcaster === '1';

    // Only respond to messages containing "!pomo" sent by the broadcaster
    if (!isBroadcaster || !message.includes('!pomo')) {
      return;
    }

    const timerArgs: string[] = message.split(' ');
    const startOrStop: string = timerArgs[1] || '';
    const mins: number = parseInt(timerArgs[2], 10) || 0;

    // Validate the command
    if (!startOrStop.includes('stop') && !startOrStop.includes('start')) {
      return;
    }

    // Start or stop the timer based on the command
    if (startOrStop === 'start') {
      this.timer = new Timer(mins, 0);
      this.timer.start();
    } else if (startOrStop === 'stop') {
      this.timer?.stop();
    }
  }

}

document.addEventListener('DOMContentLoaded', () => new Controller(['metalandcoffee_']));