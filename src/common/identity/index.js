import cookies from 'js-cookie';
import transport from '../transport';
import google from './google';
import facebook from './facebook';

export const removeAuthToken = (token) => (
  new Promise((resolve) => {
    chrome.identity.removeCachedAuthToken({ token }, resolve);
  })
);

const call = (network, interactive) => {
  let request;

  if (network === 'facebook') {
    request = facebook(interactive);
  } else {
    request = google(interactive);
  }

  return request;
};

export const silent = () => {
  const network = cookies.get('network');

  if (network) {
    return call(network, false)
      .then(() => transport.get(`/api/auth/${network}`));
  }

  return Promise.reject({
    name: 'Unauthorised',
    message: 'User is not authorised',
    statusCode: 401,
  });
};

export const login = (network) => {
  const token = cookies.get('token');

  cookies.set('network', network);

  if (token) {
    cookies.remove('token'); // clean token cookie

    return removeAuthToken(token)
      .then(() =>
        call(network, true)
          .then((newToken) => {
            cookies.set('token', newToken);
          })
          .then(() => transport.get(`/api/auth/${network}`))
      );
  }

  return call(network, true)
    .then((newToken) => {
      cookies.set('token', newToken);
    })
    .then(() => transport.get(`/api/auth/${network}`));
};

export const logout = () => {
  const token = cookies.get('token');

  cookies.remove('token');
  cookies.remove('network');

  return removeAuthToken(token)
    .then(() => transport.get('/api/logout'));
};
