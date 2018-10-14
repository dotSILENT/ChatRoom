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
var firstMessageID = 0;
var messagesCount = 0;

var roomID = document.head.querySelector('meta[name="roomID"]').content;
var apiToken = 'Bearer ' + document.head.querySelector('meta[name="apiToken"]').content;
var axiosHeaders = {
    Authorization: apiToken,
    Accepts: 'application/json'
};

$(document).ready(function () {
    refreshMessagesTimer();

    // Message sending event handler
    $('#room-message-submit').click(function () {
        if ($('#room-message-input').val().length <= 0) return;

        axios.post('/api/room/' + roomID + '/messages', {
            message: $('#room-message-input').val()
        }, {
            headers: axiosHeaders
        }).then(function (response) {
            $('#room-message-input').val('');
        }).catch(function (error) {});
    });
});

function refreshMessagesTimer() {
    var filter = null;
    var el = $('#room-messages-box');
    if (el.scrollTop() == 0 && firstMessageID != 0) filter = 'before=' + firstMessageID;else if (lastMessageID != 0) filter = 'after=' + lastMessageID;

    var status = grabMessages(filter);

    var timeout = 800;

    if (status == 'empty') timeout = 1300;else if (status == 'error') timeout = 5000;

    if (!document.hasFocus) // no need to spam with requests if we don't even see the page
        timeout = 3000;

    setTimeout(refreshMessagesTimer, timeout);
}

// Make a GET request to the API and grab messages
function grabMessages() {
    var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    axios.get('/api/room/' + roomID + '/messages' + (filter == null ? '' : '?' + filter), {
        headers: axiosHeaders
    }).then(function (response) {
        if (response.data.data.length > 0) {
            console.log(response.data.data);
            parseMessagesData(response.data);
            return 'success';
        }
    }).catch(function (error) {
        console.error(error);
        return 'error';
    });
    return 'empty';
}

// Parse the messages & append them to the chat
function parseMessagesData(json) {
    $.each(json.data, function (index, msg) {
        var appendAfter = void 0; // div id, default

        var msgid = parseInt(msg.id);

        if (msgid > lastMessageID && lastMessageID > 0) // if it's a new message, append it after the newest we already have
            {
                appendAfter = '#room-msg-' + lastMessageID;
                lastMessageID = msgid;
            } else appendAfter = '#room-messages-top'; // else append it at the top

        messagesCount++;

        $(appendAfter).after('<div id="room-msg-' + msgid + '" class="alert alert-secondary mb-2">' + msg.message + ' ' + msg.created_at + '</div>');
    });

    if (json.meta.first_id < firstMessageID || firstMessageID == 0) firstMessageID = json.meta.first_id;

    if (json.meta.last_id > lastMessageID || lastMessageID == 0) lastMessageID = json.meta.last_id;
}

/***/ })

/******/ });