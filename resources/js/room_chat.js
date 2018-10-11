let lastMessageID = 0;
const roomID = document.head.querySelector('meta[name="roomID"]').content;
const apiToken = 'Bearer ' + document.head.querySelector('meta[name="apiToken"]').content;

window.onload = function() {
    if (!window.jQuery)
    {
        console.error('jQuery needs to be loaded in order for room chat to work');
    }
    else
    {
        setTimeout(refreshMessages, 700);
        console.log(apiToken);
        console.log(roomID);
    }
}


function refreshMessages(filter = null)
{
    var status = grabMessages(lastMessageID ? 'after='+lastMessageID : null);

    var timeout = 800;

    if(status == 'empty')
        timeout = 1300;
    else if(status == 'error')
        timeout = 5000;

    if(!document.hasFocus) // no need to spam with requests if we don't even see the page
        timeout = 3000;

    setTimeout(refreshMessages, timeout);
}

// Make a GET request to the API and grab messages
function grabMessages(filter = null)
{
    axios.get('/api/room/' + roomID + '/messages' + ((filter == null) ? '' : '?'+filter),
    { 
        headers: 
        { 
            Authorization: apiToken,
            Accepts: 'application/json'
        }
    }) 
    .then(function (response)
    {
        if(response.data.data.length >= 0)
        {
            parseMessages(response.data.data);
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


function parseMessages(data)
{
    $.each(data, function(index, msg)
    {
        if(parseInt(msg.id) > lastMessageID)
            lastMessageID = parseInt(msg.id);
        
        $('#room-messages-box').prepend('<div id="room-msg-'+ msg.id +'" class="alert alert-secondary">'+ msg.message +' ' + msg.created_at +'</div>');
    });
}