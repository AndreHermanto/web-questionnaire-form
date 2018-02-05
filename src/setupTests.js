// had to do this not as es6 because wallabyjs has some
// problem with using babel on it...no idea
const configure = require('enzyme').configure;
const Adapter = require('enzyme-adapter-react-15');
configure({ adapter: new Adapter() });
