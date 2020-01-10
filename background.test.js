const chrome = require('sinon-chrome/extensions')
const sinon = require('sinon')

describe('background', () => {
    beforeEach(() => {
        jest.resetModules()
    })
    beforeEach(() => {
        window.chrome = chrome
        require('./background')
        chrome.runtime.onInstalled.addListener.yield() // by this trick we can mock the onInstalled-Event
    })

    describe('onInstalled', () => {
        // var createContextMenu = sinon.spy(createContextMenu)
        it('should create an entry in the context menu', () => {
            sinon.assert.calledWith(createContextMenu, "Search on Wikipedia")
        })
    })
})
 