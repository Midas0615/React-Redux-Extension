/* eslint-disable */
import jsdom from 'jsdom';
import chai from 'chai';
import sinon from 'sinon';
import SinonChai from 'sinon-chai';
import SinonChrome from 'sinon-chrome';
const chaiEnzyme = require('chai-enzyme');
const { mount, shallow, render } = require('enzyme');
const exposedProperties = ['window', 'navigator', 'document'];

global.jsdom = jsdom;
global.document = jsdom.jsdom('', {
  virtualConsole: jsdom.createVirtualConsole().sendTo(console)
});
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

chai.should();
chai.use(SinonChai);
chai.use(chaiEnzyme());

global.expect = chai.expect;
global.assert = chai.assert;

global.simulant = require('simulant');
global.mount = mount;
global.shallow = shallow;
global.render = render;

global.sinon = sinon;
global.chrome = SinonChrome;
