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
/******/ 	return __webpack_require__(__webpack_require__.s = 83);
/******/ })
/************************************************************************/
/******/ ({

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(84);


/***/ }),

/***/ 84:
/***/ (function(module, exports) {

/**  app data obj **/
var app = {
    roomID: null,
    api: '/api',
    axiosHeaders: {
        Authorization: null,
        Accepts: 'application/json'
    },
    lastMessageID: 0,
    firstMessageID: 0,
    messagesCount: 0,
    renderedMessages: 0,
    messages: [],
    /**
     * 
     * @param string api Api path, i.e: '/api'
     * @param string authorization API authorization header, i.e: 'Bearer eyJ..'
     * @param string roomID ID of the subscribed room
     */
    init: function init(api, authHeader, roomID) {
        this.roomID = roomID;
        this.api = api;
        this.axiosHeaders.Authorization = authHeader;

        /**
         * Get broadcasted events like new message etc
         */
        window.Echo.channel('room.' + app.roomID).listen('NewRoomMessage', function (msg) {
            app.messages.push(msg);
            app.messagesCount++;
            renderMessages();
        });
    }
};

/** jquery */
var $messagesBox = '#room-messages-box'; // gets changed to actual element specified here under document ready
var $messageInput = '#room-message-input';
var $messageSubmit = '#room-message-submit';

$(document).ready(function () {
    /** initialize our app */
    var auth = 'Bearer ' + document.head.querySelector('meta[name="apiToken"]').content;
    var roomID = document.head.querySelector('meta[name="roomID"]').content;
    app.init('/api', auth, roomID);

    /** initialize some jQuery variables to optimize the code */
    $messagesBox = $($messagesBox);
    $messageInput = $($messageInput);
    $messageSubmit = $($messageSubmit);

    fetchMessages();

    /**  Message sending event handlers */
    $messageInput.on('keyup', function (key) {
        if (key.keyCode == 13) $messageSubmit.click();
    });

    $messageSubmit.click(function () {
        onMessageSubmit();
    });

    /** Messages box scroll event */
    $messagesBox.scroll(function () {
        onMessagesBoxScroll();
    });
});

/**
 * Gets called when a message is sent by the user
 */
function onMessageSubmit() {
    if ($messageInput.val().length <= 0) return;

    var msg = $messageInput.val();
    $messageInput.val('');
    $messageInput.focus();

    axios.post(app.api + '/room/' + app.roomID + '/messages', {
        message: msg
    }, {
        headers: app.axiosHeaders
    }).catch(function (error) {});
}

/**
 * Gets called when the messages box is scrolled
 * Used for fetching older messages
 */
function onMessagesBoxScroll() {
    if ($messagesBox.scrollTop() == 0 && $messagesBox.prop('scrollHeight') > $messagesBox.height()) fetchMessages('before=' + app.firstMessageID);
}

/**
 * Fetch an array of messages from the server via AJAX GET
 * Used when loading the page for the first time & for fetching old messages
 * 
 * @param string filter Filter to be used for fetching, null by default. Uses: "after=msgid", "before=msgid"
 * @return string 'succes' if messages were fetched, 'error' on error and 'empty' if no messages were fetched
 */
function fetchMessages() {
    var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    axios.get(app.api + '/room/' + app.roomID + '/messages' + (filter == null ? '' : '?' + filter), {
        headers: app.axiosHeaders
    }).then(function (response) {
        if (response.data.data.length > 0) {
            var append = false;
            response.data.data.reverse(); // we get the messages in "newest at the top" order, let's reverse it to simplify things
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

/**
 * Render messages onto the messages box
 * 
 * @param bool upwards True when messages were prepended, to preserve scroll position
 */
function renderMessages() {
    var upwards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (app.renderedMessages == app.messagesCount) return;

    // when upwards = true it means that we load previous messages, therefore if user has scrolled up, we need to calculate an offset to keep him in the same place
    var bottomScrollOffset = $messagesBox.prop('scrollHeight') - $messagesBox.scrollTop(); // we keep the same bottom offset after rendering messages
    var autoScroll = bottomScrollOffset - $messagesBox.height() < 50;

    $('.room-message-block').remove();

    var prevMsg = null;
    var $prevMsgBody = null;
    var $prevMsgBlock = null;
    app.renderedMessages = 0;

    $.each(app.messages, function (index, msg) {
        app.renderedMessages++;
        if (prevMsg == null || prevMsg.user.username !== msg.user.username) {
            // Create the message block first
            $prevMsgBlock = $('<div>', { "class": "row room-message-block" });
            var $avcol = $('<div>', { "class": "col-1 px-0" }).append('<div style="height: 40px; width: 40px; border-radius: 50%; background-color: black"></div>');

            $prevMsgBody = $('<div>', { "class": "col-11 pl-lg-0" }).append('<h5 class="text-primary float-left">' + msg.user.username + '</h5>\n                    <small class="text-muted float-right">' + msg.created_at + '</small>\n                    <div class="clearfix"></div>');

            $avcol.appendTo($prevMsgBlock);
            $prevMsgBody.appendTo($prevMsgBlock);
            $prevMsgBlock.appendTo($messagesBox);
            $prevMsgBlock.append('<hr class="w-100">');
        }

        var $msg = $('<div>', { "class": "room-message", "data-message-id": msg.id }).html(msg.message);
        console.log($prevMsgBody);
        $msg.appendTo($prevMsgBody);
        prevMsg = msg;
    });

    var newScroll = $messagesBox.prop('scrollHeight') - bottomScrollOffset;

    if (autoScroll || upwards) $messagesBox.scrollTop(autoScroll ? $messagesBox.prop('scrollHeight') : newScroll);
}

/***/ })

/******/ });