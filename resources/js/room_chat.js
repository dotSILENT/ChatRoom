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
var jqMessagesBox = '#room-messages-box'; // gets changed to actual element specified here under document ready
var jqMessageInput = '#room-message-input';
var jqMessageSubmit = '#room-message-submit';


$(document).ready(function ()
{
    /** initialize our app */
    let auth = 'Bearer ' + document.head.querySelector('meta[name="apiToken"]').content;
    let roomID = document.head.querySelector('meta[name="roomID"]').content;
    app.init('/api', auth, roomID);

    /** initialize some jQuery variables to optimize the code */
    jqMessagesBox = $(jqMessagesBox);
    jqMessageInput = $(jqMessageInput);
    jqMessageSubmit = $(jqMessageSubmit);

    fetchMessages();

    /**  Message sending event handlers */
    jqMessageInput.on('keyup', function (key)
    {
        if(key.keyCode == 13)
            jqMessageSubmit.click();
    });

    jqMessageSubmit.click(function() { onMessageSubmit() });

    /** Messages box scroll event */
    jqMessagesBox.scroll(function () { onMessagesBoxScroll() });
});

/**
 * Gets called when a message is sent by the user
 */
function onMessageSubmit()
{
    if(jqMessageInput.val().length <= 0)
        return;

    let msg = jqMessageInput.val();
    jqMessageInput.val('');
    jqMessageInput.focus();

    axios.post(`${app.api}/room/${app.roomID}/messages`,
    {
        message: msg
    },
    {
        headers: app.axiosHeaders
    })
    .catch(function(error){});
}

/**
 * Gets called when the messages box is scrolled
 * Used for fetching older messages
 */
function onMessagesBoxScroll()
{
    if(jqMessagesBox.scrollTop() == 0 && jqMessagesBox.prop('scrollHeight') > jqMessagesBox.height())
        fetchMessages(`before=${app.firstMessageID}`);
}

/**
 * Fetch an array of messages from the server via AJAX GET
 * Used when loading the page for the first time & for fetching old messages
 * 
 * @param string filter Filter to be used for fetching, null by default. Uses: "after=msgid", "before=msgid"
 * @return string 'succes' if messages were fetched, 'error' on error and 'empty' if no messages were fetched
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
 * @param bool upwards True when messages were prepended, to preserve scroll position
 */
function renderMessages(upwards = false)
{
    if(app.renderedMessages == app.messagesCount)
        return;

    // when upwards = true it means that we load previous messages, therefore if user has scrolled up, we need to calculate an offset to keep him in the same place
    let bottomScrollOffset = jqMessagesBox.prop('scrollHeight') - jqMessagesBox.scrollTop(); // we keep the same bottom offset after rendering messages
    let autoScroll = (bottomScrollOffset - jqMessagesBox.height() < 50);

    $('.room-message-block').remove();

    let prevMsg = null;
    app.renderedMessages = 0;
    $.each(app.messages, function(index, msg)
    {
        app.renderedMessages++;
        if(prevMsg != null && prevMsg.user.username === msg.user.username)
        {
            // just append this message to the message block
            $(`[data-message-id=${prevMsg.id}]`).after(`<div class="room-message" data-message-id="${msg.id}">
                ${msg.message}
            </div>`);
        }
        else // create a new message block
        {
            jqMessagesBox.append(`
                <div class="row room-message-block">
                    <div class="col-1 px-0">
                        <div style="height: 40px; width: 40px; border-radius: 50%; background-color: black"></div>
                    </div>
                    <div class="col-11 pl-lg-0">
                        <h5 class="text-primary float-left">${msg.user.username}</h5>
                        <small class="text-muted float-right">${msg.created_at}</small>
                        <div class="clearfix"></div>
                        <div class="room-message" data-message-id="${msg.id}">
                            ${msg.message}
                        </div>
                    </div>
                    <hr class="w-100">
                </div>`);
        }
        prevMsg = msg;
    });

    let newScroll = jqMessagesBox.prop('scrollHeight') - bottomScrollOffset;

    if(autoScroll || upwards)
        jqMessagesBox.scrollTop(autoScroll ? jqMessagesBox.prop('scrollHeight') : newScroll);
}