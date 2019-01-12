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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/room_chat.js":
/*!***********************************!*\
  !*** ./resources/js/room_chat.js ***!
  \***********************************/
/*! no static exports found */
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
  lastSeenMessage: 0,
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

    window.Echo.private("room.".concat(app.roomID)).listen('NewMessage', function (msg) {
      app.messages.push(msg);
      app.messagesCount++;
      renderMessages();
    });
  }
};
/** jquery */

var $messagesBox = $('#room-messages-box');
var $messageInput = $('#room-message-input');
var $messageSubmit = $('#room-message-submit');
/* Initialize things on document load just to do it after the page loads */

$(document).ready(function () {
  /** initialize our app */
  var auth = 'Bearer ' + window.apiToken;
  var roomID = document.head.querySelector('meta[name="roomID"]').content;
  app.init('/api', auth, roomID);
  fetchMessages();
});
/**  Message sending event handlers */

$messageInput.on('keyup', function (key) {
  if (key.keyCode == 13) $messageSubmit.click();
});
/** Send the message via api */

$messageSubmit.on('click', function () {
  if ($messageInput.val().length <= 0) return;
  var msg = $messageInput.val();
  $messageInput.val('');
  $messageInput.focus();
  axios.post("".concat(app.api, "/room/").concat(app.roomID, "/messages"), {
    message: msg
  }, {
    headers: app.axiosHeaders
  }).catch(function (error) {});
});
/**
 * Message box scroll event
 * Used for loading older messages
 */

$messagesBox.scroll(function () {
  if ($messagesBox.scrollTop() == 0 && $messagesBox.prop('scrollHeight') > $messagesBox.height()) fetchMessages("before=".concat(app.firstMessageID));
});
/* Handle window resizing event to calculate the messages box max height */

$(window).resize(function () {
  calculateHeights();
});
calculateHeights();
/** An ugly hack for calculating the max-height to fill the screen. Should be made as some actual flexbox solution instead. */

function calculateHeights() {
  var wnHeight = $(window).height();
  var boxHeight = $messagesBox.height();
  var cardHeight = $('#room-messages-card').outerHeight();
  var cardPos = $('#room-messages-card').offset();
  var offset = boxHeight + (wnHeight - (cardHeight + cardPos.top));
  if (offset < 480) offset = 480;
  $($messagesBox).css('max-height', "".concat(offset, "px"));
  $($messagesBox).css('height', "".concat(offset, "px"));
}
/**
 * Fetch an array of messages from the server via AJAX GET
 * Used when loading the page for the first time & for fetching old messages
 * 
 * @param {String} filter Filter to be used for fetching, null by default. Uses: "after=msgid", "before=msgid"
 * @return {String} 'succes' if messages were fetched, 'error' on error and 'empty' if no messages were fetched
 */


function fetchMessages() {
  var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  axios.get("".concat(app.api, "/room/").concat(app.roomID, "/messages") + (filter == null ? '' : "?".concat(filter)), {
    headers: app.axiosHeaders
  }).then(function (response) {
    if (response.data.data.length > 0) {
      var append = false;
      response.data.data.reverse(); // we get the messages in "newest at the top" order, let's reverse it to simplify things

      if (response.data.meta.last_id > app.lastMessageID || !app.lastMessageID) {
        app.lastMessageID = response.data.meta.last_id; // these are the new ones, so they land on the bottom

        append = true;
      }

      if (response.data.meta.first_id < app.firstMessageID || !app.firstMessageID) {
        app.firstMessageID = response.data.meta.first_id; // these messages are older, therefore they need to be pushed at the top

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
 * @param {Boolean} upwards Set true when messages were prepended, to preserve scroll position. False by default.
 */


function renderMessages() {
  var upwards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (app.renderedMessages == app.messagesCount) return; // when upwards = true it means that we load previous messages, therefore if user has scrolled up, we need to calculate an offset to keep him in the same place

  var bottomScrollOffset = $messagesBox.prop('scrollHeight') - $messagesBox.scrollTop(); // we keep the same bottom offset after rendering messages

  var autoScroll = bottomScrollOffset - $messagesBox.height() < 50;
  $('.room-message-block').remove();
  var prevMsg = null;
  var $prevMsgBody = null;
  var $prevMsgBlock = null;
  app.renderedMessages = 0;
  $.each(app.messages, function (index, msg) {
    app.renderedMessages++;

    if (prevMsg == null || prevMsg.user.id !== msg.user.id) {
      // Create the message block first
      $prevMsgBlock = $('<div>', {
        "class": "row room-message-block"
      });
      var $avcol = $('<div>', {
        "class": "col-1 px-0"
      }).append("<img src=\"/storage/avatars/".concat(msg.user.avatar, "\" class=\"img-fluid rounded-circle avatar-small\"/>"));
      $prevMsgBody = $('<div>', {
        "class": "col-11 pl-lg-0"
      }).append($('<h5>', {
        'class': 'text-primary float-left'
      }).text(msg.user.username)).append("<small class=\"text-muted float-right\">".concat(msg.created_at, "</small>\n                    <div class=\"clearfix\"></div>"));
      $avcol.appendTo($prevMsgBlock);
      $prevMsgBody.appendTo($prevMsgBlock);
      $prevMsgBlock.appendTo($messagesBox);
      $prevMsgBlock.append('<hr class="w-100">');
    }

    var $msg = $('<div>', {
      "class": "room-message",
      "data-message-id": msg.id
    }).text(msg.message);
    if (document.hasFocus() && msg.id > app.lastSeenMessage) app.lastSeenMessage = msg.id;else if (!document.hasFocus() && msg.id > app.lastSeenMessage) $msg.addClass('room-new-message');
    $msg.appendTo($prevMsgBody);
    prevMsg = msg;
  });
  var newScroll = $messagesBox.prop('scrollHeight') - bottomScrollOffset;
  if (autoScroll || upwards) $messagesBox.scrollTop(autoScroll ? $messagesBox.prop('scrollHeight') : newScroll);
}

/***/ }),

/***/ 2:
/*!*****************************************!*\
  !*** multi ./resources/js/room_chat.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\Dawid\Desktop\github\ChatRoom\resources\js\room_chat.js */"./resources/js/room_chat.js");


/***/ })

/******/ });