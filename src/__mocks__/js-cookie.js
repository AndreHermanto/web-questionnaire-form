const Cookies = {
  get: () => {
    return '1';
  },
  set: (name, value) => {
    console.log(`setting fake cookie ${name} ${value}`);
  }
};
module.exports = Cookies;
