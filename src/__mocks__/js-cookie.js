const Cookies = {
  get: () => {
    return '1';
  },
  set: (name, value) => {
    console.log(`setting fake cookie ${name} ${value}`);
  },
  remove: name => {
    console.log(`fake cookie removed ${name}`);
  }
};
module.exports = Cookies;
