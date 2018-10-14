var lastMessageID = 0;
var firstMessageID = 0;
var messagesCount = 0;

const roomID = document.head.querySelector('meta[name="roomID"]').content;
const apiToken = 'Bearer ' + document.head.querySelector('meta[name="apiToken"]').content;
const axiosHeaders = {
    Authorization: apiToken,
    Accepts: 'application/json'
}

$(document).ready(function ()
{
    refreshMessagesTimer();

    // Message sending event handler
    $('#room-message-submit').click(function()
    {
        if($('#room-message-input').val().length <= 0)
            return;
        
        axios.post('/api/room/'+ roomID +'/messages',
        {
            message: $('#room-message-input').val()
        },
        {
            headers: axiosHeaders
        })
        .then(function(response)
        {
            $('#room-message-input').val('');
        })
        .catch(function(error){});
    });
});

function refreshMessagesTimer()
{
    var filter = null;
    var el = $('#room-messages-box');
    if(el.scrollTop() == 0 && firstMessageID != 0)
        filter = 'before='+firstMessageID;
    else if(lastMessageID != 0)
        filter = 'after='+lastMessageID;

    var status = grabMessages(filter);

    var timeout = 800;

    if(status == 'empty')
        timeout = 1300;
    else if(status == 'error')
        timeout = 5000;

    if(!document.hasFocus) // no need to spam with requests if we don't even see the page
        timeout = 3000;

    setTimeout(refreshMessagesTimer, timeout);
}

// Make a GET request to the API and grab messages
function grabMessages(filter = null)
{
    axios.get('/api/room/' + roomID + '/messages' + ((filter == null) ? '' : '?'+filter),
    { 
        headers: axiosHeaders
    }) 
    .then(function (response)
    {
        if(response.data.data.length > 0)
        {
            console.log(response.data.data);
            parseMessagesData(response.data);
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

// Parse the messages & append them to the chat
function parseMessagesData(json)
{
    $.each(json.data, function(index, msg)
    {
        let appendAfter; // div id, default

        let msgid = parseInt(msg.id);
        
        if(msgid > lastMessageID && lastMessageID > 0) // if it's a new message, append it after the newest we already have
        {
            appendAfter = '#room-msg-' + lastMessageID;
            lastMessageID = msgid;
        }
        else appendAfter = '#room-messages-top'; // else append it at the top

        messagesCount++;
        
        $(appendAfter).after('<div id="room-msg-'+ msgid +'" class="alert alert-secondary mb-2">'+ msg.message +' ' + msg.created_at +'</div>');
    });

    if(json.meta.first_id < firstMessageID || firstMessageID == 0)
        firstMessageID = json.meta.first_id;

    if(json.meta.last_id > lastMessageID || lastMessageID == 0)
        lastMessageID = json.meta.last_id;
}