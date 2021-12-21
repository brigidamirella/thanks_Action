/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 396:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 153:
/***/ ((module) => {

module.exports = eval("require")("dotenv");


/***/ }),

/***/ 464:
/***/ ((module) => {

module.exports = eval("require")("node-fetch");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
(__nccwpck_require__(153).config)();
const fetch = __nccwpck_require__(464);
const core = __nccwpck_require__(396);
const github = __nccwpck_require__(716);

async function run() {
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
  const TENOR_TOKEN = core.getInput('TENOR_TOKEN') || process.env.TENOR_TOKEN;
  const message = core.getInput('message') || 'Thank you!';
  const searchTerm = core.getInput('searchTerm') || 'thank you';

  if ( typeof TENOR_TOKEN !== 'string' ) {
    throw new Error('Invalid TENOR_TOKEN: did you forget to set it in your action config?');
  }

  if ( typeof GITHUB_TOKEN !== 'string' ) {
    throw new Error('Invalid GITHUB_TOKEN: did you forget to set it in your action config?');
  }

  const randomPos = Math.round(Math.random() * 1000);
  const url = `https://api.tenor.com/v1/search?q=${encodeURIComponent(searchTerm)}&pos=${randomPos}&limit=1&media_filter=minimal&contentfilter=high`

  console.log(`Searching Tenor: ${url}`)

  const response = await fetch(`${url}&key=${TENOR_TOKEN}`);
  const { results } = await response.json();
  const gifUrl = results[0].media[0].tinygif.url;

  console.log(`Found gif from Tenor: ${gifUrl}`);

  const { context = {} } = github;
  const { pull_request } = context.payload;

  if ( !pull_request ) {
    throw new Error('Could not find pull request!')
  };

  console.log(`Found pull request: ${pull_request.number}`);

  const octokit = github.getOctokit(GITHUB_TOKEN)

  await octokit.issues.createComment({
    ...context.repo,
    issue_number: pull_request.number,
    body: `${message}\n\n<img src="${gifUrl}" alt="${searchTerm}" />`
  });
}

run().catch(e => core.setFailed(e.message));
})();

module.exports = __webpack_exports__;
/******/ })()
;