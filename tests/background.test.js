let chrome = require('sinon-chrome/extensions');
window.chrome = chrome;

function getRndInteger(){

    let rndInt = Math.floor((Math.random() * 10) + 1);

    return rndInt;
};

describe('background.js', () => {

    const messageHandler = require('../background').messageHandler;

    const  createContexMenu = require('../background').createContextMenu;

    const sendMsg = require('../background').sendMsg;

    create = jest.fn().mockImplementation((title) => {
    
        return title;
    });

    sendMessage = jest.fn((tabId, type) => {
        
        let result = {
            tabId: tabId,
            message: type
        };
    
        return result;
    });

    query = jest.fn().mockImplementation(() => {
    
            let mockTab = [];
    
            let rndInt = getRndInteger();
    
            for (let index = 0; index < rndInt + 1; index++) {
    
                let value = getRndInteger().toString;
                
                mockTab.push(value);
            };

            return mockTab;
        });

    global.chrome = {
        contextMenus: {
            create
        },
        tabs: {
            sendMessage,
            query
        }
    };
    
    describe('Function messageHandler', () => {
    
        mockMessageCallback = jest.fn();
    
        it('should', () => {
    
            mockType = "mockTestCase";
    
            messageHandler(mockType, mockMessageCallback);
    
            expect(query).toHaveBeenCalled();
        });
    });
    
    describe('Function createContexMenu', () => {
    
        it('should create correct entry for context menu', () => {
    
            let mockTitle = "mockTitle";
    
            let expectedResult = {
                id: "contextMenu",
                title: mockTitle,
                contexts: ["selection"]
            }
    
            createContexMenu(mockTitle);
    
            expect(create).toHaveBeenCalled();
    
            expect(create).toHaveReturnedWith(expectedResult);
        });
    });
    
    describe ('Function sendMsg', () => {
    
        it('should ', () => {
    
            let mockTabId = "1337";
    
            let mockType = "okBoomer";
    
            let expectedResult = {
                tabId: mockTabId,
                message: {
                    message: mockType
                }
            }
    
            sendMsg(mockTabId, mockType);
    
            expect(sendMessage).toHaveBeenCalled();
    
            expect(sendMessage).toHaveReturnedWith(expectedResult);
        });
    });
});