global.itWill = (description, callback) => {
    it(description,(done) => {
        setTimeout(() => {
            callback();
            done();
        }, 10);
    })
}

global.fitWill = (description, callback) => {
    fit(description,(done) => {
        setTimeout(() => {
            callback();
            done();
        }, 10);
    })
}

global.xitWill = (description, callback) => {
    xit(description,(done) => {
        setTimeout(() => {
            callback();
            done();
        }, 10);
    })
}