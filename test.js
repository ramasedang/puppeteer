
const pp = require('./pp');


(async () => {
    await pp.init();
    await pp.start();
    await pp.scapre();
})();
