import Cookies from 'js-cookie';

export const getAccessToken = () => Cookies.get('accessToken');
export const setAccessToken = jwt => Cookies.set('accessToken', jwt);
export const removeAccessToken = () => Cookies.remove('accessToken');
