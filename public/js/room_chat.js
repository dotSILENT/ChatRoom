/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 37);
/******/ })
/************************************************************************/
/******/ ({

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(38);


/***/ }),

/***/ 38:
/***/ (function(module, exports) {

var lastMessageID = 0;
var roomID = document.head.querySelector('meta[name="roomID"]').content;
var apiToken = 'Bearer ' + document.head.querySelector('meta[name="apiToken"]').content;

window.onload = function () {
    if (!window.jQuery) {
        console.error('jQuery needs to be loaded in order for room chat to work');
    } else {
        setTimeout(refreshMessages, 700);
        console.log(apiToken);
        console.log(roomID);
    }
};

function refreshMessages() {
    var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var status = grabMessages(lastMessageID ? 'after=' + lastMessageID : null);

    var timeout = 800;

    if (status == 'empty') timeout = 1300;else if (status == 'error') timeout = 5000;

    if (!document.hasFocus) // no need to spam with requests if we don't even see the page
        timeout = 3000;

    setTimeout(refreshMessages, timeout);
}

// Make a GET request to the API and grab messages
function grabMessages() {
    var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    axios.get('/api/room/' + roomID + '/messages' + (filter == null ? '' : '?' + filter), {
        headers: {
            Authorization: apiToken,
            Accepts: 'application/json'
        }
    }).then(function (response) {
        if (response.data.data.length >= 0) {
            parseMessages(response.data.data);
            return 'success';
        }
    }).catch(function (error) {
        console.error(error);
        return 'error';
    });
    return 'empty';
}

function parseMessages(data) {
    $.each(data, function (index, msg) {
        if (parseInt(msg.id) > lastMessageID) lastMessageID = parseInt(msg.id);

        $('#room-messages-box').prepend('<div id="room-msg-' + msg.id + '" class="alert alert-secondary">' + msg.message + ' ' + msg.created_at + '</div>');
    });
}

/***/ })

/******/ });