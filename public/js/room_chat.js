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

var roomID = document.head.querySelector('meta[name="roomID"]').content;
var apiToken = 'Bearer ' + document.head.querySelector('meta[name="apiToken"]').content;
var axiosHeaders = {
    Authorization: apiToken,
    Accepts: 'application/json'
};

var jqMessagesBox = '#room-messages-box'; // gets changed to actual element specified here under document ready
var jqMessageInput = '#room-message-input';
var jqMessageSubmit = '#room-message-submit';

/**  app data **/
var app = {
    lastMessageID: 0,
    firstMessageID: 0,
    messagesCount: 0,
    renderedMessages: 0,
    messages: []
};

$(document).ready(function () {
    // initialize some jQuery variables to optimize the code
    jqMessagesBox = $(jqMessagesBox);
    jqMessageInput = $(jqMessageInput);
    jqMessageSubmit = $(jqMessageSubmit);

    refreshMessagesTimer();

    // Message sending event handler
    jqMessageInput.on('keyup', function (key) {
        if (key.keyCode == 13) jqMessageSubmit.click();
    });

    jqMessageSubmit.click(function () {
        onMessageSubmit();
    });
});

/** Called when message submit event is fired */
function onMessageSubmit() {
    if (jqMessageInput.val().length <= 0) return;

    axios.post('/api/room/' + roomID + '/messages', {
        message: jqMessageInput.val()
    }, {
        headers: axiosHeaders
    }).then(function (response) {
        jqMessageInput.val('');
    }).catch(function (error) {});
}

function refreshMessagesTimer() {
    var filter = null;
    if (jqMessagesBox.scrollTop() == 0 && app.firstMessageID != 0) filter = 'before=' + app.firstMessageID;else if (app.lastMessageID != 0) filter = 'after=' + app.lastMessageID;

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
            var append = false;
            response.data.data.reverse(); // we get the messages in "newest at the bottom" order, let's reverse it to simplify things
            if (response.data.meta.last_id > app.lastMessageID || !app.lastMessageID) {
                app.lastMessageID = response.data.meta.last_id;
                // these are the new ones, so they land on the bottom
                append = true;
            }

            if (response.data.meta.first_id < app.firstMessageID || !app.firstMessageID) {
                app.firstMessageID = response.data.meta.first_id;
                // these messages are older, therefore they need to be pushed at the top
                append = false;
            }

            if (append) app.messages = app.messages.concat(response.data.data);else app.messages = response.data.data.concat(app.messages);

            app.messagesCount += response.data.data.length;
            renderMessages(!append);
            return 'success';
        }
    }).catch(function (error) {
        console.error(error);
        return 'error';
    });
    return 'empty';
}

function renderMessages() {
    var upwards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (app.renderedMessages == app.messagesCount) return;

    // when upwards = true it means that we load previous messages, therefore if user has scrolled up, we need to calculate an offset to keep him in the same place
    var bottomScrollOffset = jqMessagesBox.prop('scrollHeight') - jqMessagesBox.scrollTop(); // we keep the same bottom offset after rendering messages
    var autoScroll = bottomScrollOffset - jqMessagesBox.height() < 50;

    $('.room-message-block').remove();

    var prevMsg = null;
    $.each(app.messages, function (index, msg) {
        app.renderedMessages++;
        if (prevMsg != null && prevMsg.user.username === msg.user.username) {
            // just append this message to the message block
            $('[data-message-id=' + prevMsg.id + ']').after('<div data-message-id="' + msg.id + '">\n                ' + msg.message + '\n            </div>');
        } else // create new message block
            {
                jqMessagesBox.append('<div class="room-message-block mb-2 mr-1">\n                <div class="row">\n                    <div class="col-1">\n                        <div style="height: 40px; width: 40px; border-radius: 100%; background-color: black"></div>\n                    </div>\n                    <div class="col pl-0">\n                        <h5 class="alert-heading text-primary float-left">' + msg.user.username + '</h5>\n                        <small class="text-muted float-right">' + msg.created_at + '</small>\n                        <div class="clearfix"></div>\n                        <div class="room-message" data-message-id="' + msg.id + '">\n                            ' + msg.message + '\n                        </div>\n                    </div>\n                </div>\n                <hr>\n            </div>');
            }
        prevMsg = msg;
    });

    var newScroll = jqMessagesBox.prop('scrollHeight') - bottomScrollOffset;

    if (autoScroll || upwards) jqMessagesBox.scrollTop(autoScroll ? jqMessagesBox.prop('scrollHeight') : newScroll);
}

/***/ })

/******/ });