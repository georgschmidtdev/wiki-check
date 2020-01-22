let chrome = require('sinon-chrome/extensions');
window.chrome = chrome;

beforeEach(() => {

    jest.resetModules();
});

describe('background', () => {


});

describe('Function createContexMenu', () => {

    const  createContexMenu = require('../background').createContextMenu;

});

describe ('Function sendMessage', () => {

    const sendMessage = require('../background').sendMessage;

});