import Cookies from 'js-cookie';

export const getAccessToken = () => Cookies.get('accessTokenForm');
export const setAccessToken = jwt => Cookies.set('accessTokenForm', jwt);
export const removeAccessToken = () => Cookies.remove('accessTokenForm');
