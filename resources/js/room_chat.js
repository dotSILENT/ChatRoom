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
    init: function(api, authHeader, roomID)
    {
        this.roomID = roomID;
        this.api = api;
        this.axiosHeaders.Authorization = authHeader;

        /**
         * Get broadcasted events like new message etc
         */
        window.Echo.channel(`room.${app.roomID}`)
        .listen('NewRoomMessage', (msg) => {
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
$(document).ready(function()
{
    /** initialize our app */
    let auth = 'Bearer ' + document.head.querySelector('meta[name="apiToken"]').content;
    let roomID = document.head.querySelector('meta[name="roomID"]').content;
    app.init('/api', auth, roomID);

    fetchMessages();
});

/**  Message sending event handlers */
$messageInput.on('keyup', function (key)
{
    if(key.keyCode == 13)
        $messageSubmit.click();
});

/** Send the message via api */
$messageSubmit.on('click', function()
{ 
    if($messageInput.val().length <= 0)
        return;

    let msg = $messageInput.val();
    $messageInput.val('');
    $messageInput.focus();

    axios.post(`${app.api}/room/${app.roomID}/messages`,
    {
        message: msg
    },
    {
        headers: app.axiosHeaders
    })
    .catch(function(error){});
});

/**
 * Message box scroll event
 * Used for loading older messages
 */
$messagesBox.scroll(function ()
{
    if($messagesBox.scrollTop() == 0 && $messagesBox.prop('scrollHeight') > $messagesBox.height())
        fetchMessages(`before=${app.firstMessageID}`);
});

/* Handle window resizing event to calculate the messages box max height */
$(window).resize(function () { calculateHeights() });

calculateHeights();
/** An ugly hack for calculating the max-height to fill the screen. Should be made as some actual flexbox solution instead. */
function calculateHeights()
{
    let wnHeight = $(window).height();
    let boxHeight = $messagesBox.height();
    let cardHeight = $('#room-messages-card').outerHeight();
    let cardPos = $('#room-messages-card').offset();

    let offset = boxHeight + (wnHeight - (cardHeight + cardPos.top));
    if(offset < 480)
        offset = 480;
    $($messagesBox).css('max-height', `${offset}px`);
    $($messagesBox).css('height', `${offset}px`);
}

/**
 * Fetch an array of messages from the server via AJAX GET
 * Used when loading the page for the first time & for fetching old messages
 * 
 * @param {String} filter Filter to be used for fetching, null by default. Uses: "after=msgid", "before=msgid"
 * @return {String} 'succes' if messages were fetched, 'error' on error and 'empty' if no messages were fetched
 */
function fetchMessages(filter = null)
{
    axios.get(`${app.api}/room/${app.roomID}/messages` + ((filter == null) ? '' : `?${filter}`),
    { 
        headers: app.axiosHeaders
    }) 
    .then(function (response)
    {
        if(response.data.data.length > 0)
        {
            let append = false;
            response.data.data.reverse(); // we get the messages in "newest at the top" order, let's reverse it to simplify things
            if(response.data.meta.last_id > app.lastMessageID || !app.lastMessageID)
            {
                app.lastMessageID = response.data.meta.last_id;
                // these are the new ones, so they land on the bottom
                append = true;
            }
            
            if(response.data.meta.first_id < app.firstMessageID || !app.firstMessageID)
            {
                app.firstMessageID = response.data.meta.first_id;
                // these messages are older, therefore they need to be pushed at the top
                append = false;
            }

            if(append)
                app.messages = app.messages.concat(response.data.data);
            else app.messages = response.data.data.concat(app.messages);

            app.messagesCount += response.data.data.length;
            renderMessages(!append);
            return 'success';
        }
    })
    .catch(function (error)
    {
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
function renderMessages(upwards = false)
{
    if(app.renderedMessages == app.messagesCount)
        return;

    // when upwards = true it means that we load previous messages, therefore if user has scrolled up, we need to calculate an offset to keep him in the same place
    let bottomScrollOffset = $messagesBox.prop('scrollHeight') - $messagesBox.scrollTop(); // we keep the same bottom offset after rendering messages
    let autoScroll = (bottomScrollOffset - $messagesBox.height() < 50);

    $('.room-message-block').remove();

    let prevMsg = null;
    let $prevMsgBody = null;
    let $prevMsgBlock = null;
    app.renderedMessages = 0;
    
    $.each(app.messages, function(index, msg)
    {
        app.renderedMessages++;
        if(prevMsg == null || prevMsg.user.username !== msg.user.username)
        {
            // Create the message block first
            $prevMsgBlock = $('<div>', {"class": "row room-message-block"});
            let $avcol = $('<div>', {"class": "col-1 px-0"})
                .append('<div style="height: 40px; width: 40px; border-radius: 50%; background-color: black"></div>');

            $prevMsgBody = $('<div>', {"class": "col-11 pl-lg-0"})
                .append($('<h5>', {'class': 'text-primary float-left'}).text(msg.user.username))
                .append(`<small class="text-muted float-right">${msg.created_at}</small>
                    <div class="clearfix"></div>`);

            $avcol.appendTo($prevMsgBlock);
            $prevMsgBody.appendTo($prevMsgBlock);
            $prevMsgBlock.appendTo($messagesBox);
            $prevMsgBlock.append('<hr class="w-100">');
        }

        let $msg = $('<div>', {"class": "room-message", "data-message-id": msg.id}).text(msg.message);
        
        if(document.hasFocus() && msg.id > app.lastSeenMessage)
            app.lastSeenMessage = msg.id;
        else if(!document.hasFocus() && msg.id > app.lastSeenMessage)
            $msg.addClass('room-new-message');
        
        $msg.appendTo($prevMsgBody);
        prevMsg = msg;
    });

    let newScroll = $messagesBox.prop('scrollHeight') - bottomScrollOffset;

    if(autoScroll || upwards)
        $messagesBox.scrollTop(autoScroll ? $messagesBox.prop('scrollHeight') : newScroll);
}