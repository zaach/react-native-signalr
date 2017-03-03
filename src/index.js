let signalRHubConnectionFunc;
let oldLogger = window.console.debug;

if (!window.addEventListener) {
  window.addEventListener = window.addEventListener = () => {};
}
window.navigator.userAgent = "react-native";
window.jQuery = require('./signalr-jquery-polyfill.js');

import RNEventSource from 'react-native-event-source';

if (!window.EventSource) {
  window.EventSource = RNEventSource;
}

module.exports = {
  setLogger: (logger) => {
    if (window.console && window.console.debug) {
      window.console.debug("OVERWRITING CONSOLE.DEBUG in react-native-signalr");
    } else {
      if (!window.console) {
        window.console = {};
      }
    }
    window.console.debug = logger;
  },
  hubConnection: (serverUrl, options) => {
    window.document = window.document || {
      readyState: 'complete'
    };
    if (!signalRHubConnectionFunc) {
      require('ms-signalr-client');
      signalRHubConnectionFunc = window.jQuery.hubConnection;
    }
    const [protocol, host] = serverUrl.split(/\/\/|\//);
    window.location = {
      protocol: protocol,
      host: host
    };
    window.document = {
      createElement: function() {
        return {
          protocol: protocol,
          host: host
        }
      }
    };

    if (options && options.headers) {
      window.jQuery.defaultAjaxHeaders = options.headers;
    }

    return signalRHubConnectionFunc(serverUrl, options);
  }
};
