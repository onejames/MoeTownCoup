var ip = '192.168.1.221'
// var ip = 'localhost'
var port = '9000'

// get button elements
var button_close = document.getElementById( 'button-close' )
var button_open = document.getElementById( 'button-open' )

var state = {
  door: "closed",
  heater: "off",
  temprature: "70",
  humidity: "60"
}

// check for active connection
var isConnectionActive = false

// connect to the Web Socket server
var connection = io( 'http://'+ip+':'+port )

updateStatus = function() {
  if(isConnectionActive) {
    connection.emit( 'status', {} )
  } else {
    $('#statusContent').html('<img class="mx-auto d-block" src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" />')
  }
}

connection.on( 'connect', () => {
  isConnectionActive = true
  updateStatus()
  setInterval(updateStatus, 10000)
} )

connection.on( 'disconnect', () => {
  isConnectionActive = false
  updateStatus()
} )

connection.on( 'status', (data) => {
    console.log(data)
    state = data
    $('#statusContent').html(state)
} )

// WebSocket event emitter function
var emitEvent = function( event ) {
  if( ! isConnectionActive ) {
    return alert( 'Server connection is closed!' )
  }

  // change button state
  if( event.target.id === 'button-close') {
      connection.emit( 'close', {} )
  }
  if( event.target.id === 'button-open') {
      connection.emit( 'open', {} )
  }

}

// add event listeners on button
button_close.addEventListener( 'click', emitEvent )
button_open.addEventListener( 'click', emitEvent )

$( document ).ready(function() {
  updateStatus()
});
