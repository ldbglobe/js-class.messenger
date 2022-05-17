(()=>{"use strict";var e={r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}};
/*!********************************!*\
  !*** ./src/app.js + 2 modules ***!
  \********************************/
e.r({});class n{constructor(e){this.eventSource=e,this.events=new Set}registerEvent(e,n){"function"==typeof n&&(this.events[e]||(this.events[e]=new Set),this.events[e].add(n))}unregisterEvent(e,n){this.events[e]&&this.events[e].delete(n)}fireEvent(e,n){this.events[e]&&this.events[e].forEach(function(t,s){t(n,{eventSource:this.eventSource,eventName:e,data:n})}.bind(this))}}function t(e,n){for(var t=0;t<n.length;t++){var s=n[t];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}window.MessengerWelcome_260b9b39071b9918=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;e?r.___.recipients.add(e):window.opener&&"function"==typeof window.opener.MessengerWelcome_260b9b39071b9918&&window.opener.MessengerWelcome_260b9b39071b9918(window)};var s,i,o,r=function(){function e(t){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),t="string"==typeof t?{channel:t}:t||{},this.id=("MSG_"+[1e16]).replace(/[018]/g,(function(e){return(e^16*Math.random()>>e/4).toString(16)})),this.channels=new Set,this.recipients=new Set,t.channel&&this.subscribe(t.channel),window.opener&&e.___.recipients.add(window.opener),this.events=new n(this),window.addEventListener("message",this.__handleMessage.bind(this)),window.MessengerWelcome_260b9b39071b9918()}var s,i,o;return s=e,i=[{key:"subscribe",value:function(e){e&&"string"==typeof e&&(console.info("Messenger ".concat(this.id," connected to ").concat(e)),this.channels.add(e))}},{key:"unsubscribe",value:function(e){this.channels.delete(e)}},{key:"onMessage",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;n=(n="string"==typeof n?[n]:n)&&n.length?n:[],this.events.registerEvent("message",function(e,n,t,s){(0===n.length||n.includes(t.channel))&&e(t.message,t.channel)}.bind(this,e,n))}},{key:"__handleMessage",value:function(e){var n="string"==typeof e.data?JSON.parse(e.data):e.data||{};"messenger"===n.format&&(this.send(n.message,n.channel,e.source),this.channels.has(n.channel)&&this.events.fireEvent("message",n))}},{key:"send",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;if(n&&!this.channels.has(n))throw"Messenger.send not subscribed to ".concat(n);var s=n?new Set([n]):this.channels;if(!(s.size>0))throw"Messenger.send no destination channels available";s.forEach(function(e,n,t,s){null!==n&&n!==s||this.__sendToWindows(JSON.stringify({format:"messenger",version:1,emiter:this.id,channel:s,message:e}),t)}.bind(this,e,n,t))}},{key:"__sendToWindows",value:function(n,t){e.___.recipients.forEach(function(e,t){t&&"function"==typeof t.postMessage&&(e===t||t.closed||t.postMessage(n,"*"))}.bind(this,t))}}],i&&t(s.prototype,i),o&&t(s,o),Object.defineProperty(s,"prototype",{writable:!1}),e}();s=r,i="___",o={recipients:new Set},i in s?Object.defineProperty(s,i,{value:o,enumerable:!0,configurable:!0,writable:!0}):s[i]=o,window.Messenger=r})();
//# sourceMappingURL=app.js.map