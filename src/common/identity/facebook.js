import config from '../../config';

const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/provider_cb`;
const redirectRegex = new RegExp(`${redirectUri}[#\?](.*)`); // eslint-disable-line no-useless-escape
const url = `https://www.facebook.com/dialog/oauth?
                  client_id=${config.keys.facebook}&
                  response_type=token&
                  access_type=online&
                  redirect_uri=${encodeURIComponent(redirectUri)}`;

const parseFragment = (fragment) => {
  const pairs = fragment.replace('#', '').split(/&/);

  return pairs.reduce((args, pair) => {
    const item = pair.split(/=/);
    args[item[0]] = item[1]; // eslint-disable-line no-param-reassign
    return args;
  }, {});
};

export default (interactive) => (
  new Promise((resolve, reject) => {
    chrome
      .identity
      .launchWebAuthFlow({
        interactive,
        url,
      }, (redirectUrl) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          const matches = redirectUrl.match(redirectRegex);
          if (matches && matches.length > 1) {
            const params = parseFragment(matches[1]);
            resolve(params.access_token);
          } else {
            reject(new Error('Invalid redirect URI'));
          }
        }
      });
  })
);
