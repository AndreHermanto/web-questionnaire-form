import Cookies from 'js-cookie';

export const getAccessToken = () => Cookies.get('jwt');
export const setAccessToken = jwt => Cookies.set('jwt', jwt);
export const removeAccessToken = () => Cookies.remove('jwt');
