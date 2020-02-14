import EventEmitter from 'events';
import cookies from 'js-cookie';
import { default as fetch } from 'request-promise-native';

const send = Symbol();
const request = Symbol();
const isBrowser = Symbol();

class Transport extends EventEmitter {
  [isBrowser](uri) {
    return uri.indexOf('/browser') > -1;
  }

  [send](uri, method = 'GET', body) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        origin: '__popup__',
        uri,
        method,
        body,
      }, (response) => {
        if (!response) {
          reject(chrome.runtime.lastError || response);
        } else {
          resolve(response);
        }
      });
    });
  }

  [request](uri, method = 'GET', body) {
    return fetch({
      scheme: 'http',
      baseUrl: process.env.API_URL,
      headers: { access_token: cookies.get('token') },
      json: true,
      body,
      method,
      uri,
    });
  }

  get(uri) {
    if (this[isBrowser](uri)) {
      return this[send](uri);
    }

    return this[request](uri);
  }

  post(uri, body) {
    if (this[isBrowser](uri)) {
      return this[send](uri, 'POST', body);
    }

    return this[request](uri, 'POST', body);
  }

  put(uri, body) {
    if (this[isBrowser](uri)) {
      return this[send](uri, 'PUT', body);
    }

    return this[request](uri, 'PUT', body);
  }

  delete(uri) {
    if (this[isBrowser](uri)) {
      return this[send](uri, 'DELETE');
    }

    return this[request](uri, 'DELETE');
  }
}

export default new Transport();
