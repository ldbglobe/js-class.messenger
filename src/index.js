import EventDispatcher from "js-class.event-dispatcher";

window.MessengerWelcome_260b9b39071b9918 = function(w=null)
{
	if(w)
		Messenger.___.recipients.add(w)
	else
	{
		if(window.opener && typeof window.opener.MessengerWelcome_260b9b39071b9918 === "function")
			window.opener.MessengerWelcome_260b9b39071b9918(window);
	}
}

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

		window.MessengerWelcome_260b9b39071b9918();
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
		let data = typeof e.data === "string" ? JSON.parse(e.data) : (e.data || {});
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
				throw `Messenger.send no destination channels available`
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