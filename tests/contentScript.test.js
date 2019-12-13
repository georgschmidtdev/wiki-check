const insertWrapper = require('../contentScript');

describe('insertWrapper', () => {

    it('should insert HTML Wrapper into website', () =>{

        insertWrapper();
        let wrapper = document.getElementById('wrapper');

        expect(wrapper).toBeDefined;
    })
})