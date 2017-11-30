import { JSDOM } from 'jsdom';

import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

global.document = new JSDOM();
global.window = document.window;
global.navigator = window.navigator;
global.sinon = sinon;
global.expect = expect;
