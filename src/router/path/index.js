const requireModule = require.context(".", true, /\.js$/);

let path = [];
requireModule.keys().forEach((fileName) => {
  if (fileName === "./index.js") return;

  const moduleName = requireModule(fileName).default;
  if (moduleName) {
    path = path.concat(moduleName);
  }
});

export default path;
