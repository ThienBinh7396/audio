const requireModule = require.context('.', true, /\.js$/)

var path = [];
requireModule.keys().forEach(fileName => {
    if (fileName === './index.js') return;

    var im = requireModule(fileName).default;
    if (im) {
        path = path.concat(im)
    }

})

export default path;