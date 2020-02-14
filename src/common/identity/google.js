export default (interactive) => (
  new Promise((resolve, reject) => {
    chrome
      .identity
      .getAuthToken({ interactive }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
  })
);
