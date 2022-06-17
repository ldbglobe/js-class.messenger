import EventDispatcher from "js-class.event-dispatcher";

export default class Messenger {

	static ___ = {
		recipients: new Set(),
	}

	constructor(param) {
		param = typeof param ==="string" ? {channel:param}: param || {};
		this.id = (()=>('MSG_'+[1e16]).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16)))();
		this.channels = new Set();
		this.recipients = new Set();

		if(param.channel)
			this.subscribe(param.channel);

		if(window.opener)
			Messenger.___.recipients.add(window.opener);

		this.events = new EventDispatcher(this);
		window.addEventListener('message', this.__handleMessage.bind(this))
	}

	addRecipient(recipientWindow) {
		Messenger.___.recipients.add(recipientWindow)
	}

	subscribe(channel) {
		if(channel && typeof channel === "string")
		{
			console.info(`Messenger ${this.id} connected to ${channel}`);
			this.channels.add(channel)
		}
	}
	unsubscribe(channel) {
		this.channels.delete(channel)
	}

	onMessage(callback,channels=null) {
		channels = typeof channels === "string" ? [channels] : channels;
		channels = channels && channels.length ? channels : [];
		this.events.registerEvent('message',function(callback, channels, data, eventSource) {
			if(channels.length===0 || channels.includes(data.channel))
				callback(data.message,data.channel)
		}.bind(this, callback, channels))
	}

	__handleMessage(e) {

		let data = {}
		try {
			data = typeof e.data === "string" ? JSON.parse(e.data) : (e.data || {});
		}
		catch {
			// nothing to do;
		}

		if(data.format === 'messenger')
		{
			// relay all channel on other windows
			this.send(data.message,data.channel,e.source,true)

			// fire local event if channel is subscribed
			if(this.channels.has(data.channel))
			{
				this.events.fireEvent('message',data);
			}
		}
	}

	send(message,destinationChannel=null,emiter=null,relay=false) {
		if(destinationChannel && !this.channels.has(destinationChannel))
		{
			if(!relay)
				throw `Messenger.send not subscribed to ${destinationChannel}`
		}
		else
		{
			var channels = destinationChannel ? new Set([destinationChannel]) : this.channels;
			if(channels.size>0)
			{
				channels.forEach(function(message,destinationChannel,emiter,channel) {
					if(destinationChannel===null || destinationChannel === channel)
					{
						this.__sendToWindows(JSON.stringify({
							format:'messenger',
							version:1,
							emiter:this.id,
							channel:channel,
							message:message,
						}),emiter);
					}
				}.bind(this,message,destinationChannel,emiter));
			}
			else
			{
				// No destination channels available, Nothing to do ^^
			}
		}
	}

	__sendToWindows(payload,emiter) {
		Messenger.___.recipients.forEach(function(emiter,recipient){
			if(recipient && typeof recipient.postMessage === "function")
			{
				if(emiter!==recipient && !recipient.closed)
					recipient.postMessage(payload,"*");
			}
		}.bind(this,emiter))
	}
}