before(() => {
  console.log('before all');
});

after(() => {
  console.log('after all');
  chrome.runtime.onConnect.removeListeners();
  chrome.runtime.onMessage.removeListeners();
  chrome.reset();
});
