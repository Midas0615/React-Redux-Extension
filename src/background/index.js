import * as identity from '../common/identity';
import transport from '../common/transport';

const INTERVAL = 21600000; // every 6 hour
const onMessage = Symbol();
const storeList = Symbol();
const notificationEndPoint = '/api/notification/count';

class BackgroundProcess {
  constructor() {
    this[storeList] = [];
    chrome.runtime.onMessage.addListener(this[onMessage].bind(this));
    BackgroundProcess
      .getNotification()
      .then(() => BackgroundProcess.checkNotification())
      .catch(() => BackgroundProcess.checkNotification());
  }

  static checkNotification() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      BackgroundProcess
        .getNotification()
        .then(() => BackgroundProcess.checkNotification())
        .catch(() => BackgroundProcess.checkNotification());
    }, INTERVAL);
  }

  static getNotification() {
    return identity
      .silent()
      .then(() => transport
        .get(notificationEndPoint)
        .then((response) => {
          BackgroundProcess.setBadge(response.total || '');
        })
      );
  }

  static clearNotification() {
    return identity
      .silent()
      .then(() => transport
        .post(notificationEndPoint)
        .then(() => {
          BackgroundProcess.setBadge('');
        })
      );
  }

  static setBadge(text) {
    const color = text ? [255, 0, 0, 1] : [0, 0, 0, 0];

    chrome.browserAction.setBadgeText({ text: String(text) });
    chrome.browserAction.setBadgeBackgroundColor({ color });
  }

  static getActiveTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({
        active: true,
        currentWindow: true,
      }, (tabs) => {
        if (tabs.length === 0) reject('No active tab');
        resolve(tabs[0]);
      });
    });
  }

  getStore(id) {
    return this[storeList].find((item) => item.id === id);
  }

  removeStore(store) {
    return this[storeList].splice(this[storeList].indexOf(store), 1);
  }

  [onMessage](request, sender, response) {
    if (request.origin === '__popup__') {
      BackgroundProcess
        .getActiveTab()
        .then((tab) => {
          let store = this.getStore(tab.id);

          switch (request.uri) {
            case '/browser/badge/reset':
              setTimeout(() => {
                BackgroundProcess
                  .clearNotification()
                  .then(() => response(true));
              }, 10000);
              break;
            case '/browser/page/restore':
              response(store);
              break;
            case '/browser/page/url':
              response(tab.url);
              break;
            case '/browser/page/autodetect':
            case '/browser/page/manual':
              if (!store) {
                store = { id: tab.id };
                this[storeList].push(store);
              }
              chrome.tabs.sendMessage(tab.id, request, response);
              break;
            case '/browser/page/reset':
              if (store) {
                this.removeStore(store);
              }
              chrome.tabs.sendMessage(tab.id, request, response);
              break;
            default:
              response(false);
              break;
          }
        }, () => {
          response(false);
        });
    } else if (request.origin === '__content__') {
      // content request for background to process
      const store = this.getStore(sender.tab.id);

      if (store) {
        switch (request.uri) {
          case '/browser/page/reset':
            // remove store on page refresh and start again
            this.removeStore(store);
            response(true);
            break;
          case '/browser/page/manual':
            // store data from content
            Object.assign(store, request.body);
            response(true);
            break;
          default:
            response(false);
            break;
        }
      } else {
        response(false);
      }
    }

    return true;
  }
}

export default new BackgroundProcess();
