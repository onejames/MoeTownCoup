var ip = '192.168.1.221'
// var ip = 'localhost'
var port = '9000'

// get button elements
var button_close = document.getElementById( 'button-close' )
var button_open = document.getElementById( 'button-open' )

var state = {
  door: "closed",
  heater: "off",
  temperature: "70",
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
    $('#processing').show()
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

connection.on( 'message', (data) => {
	data = JSON.parse(data)
  state = data.state

  if(data.event =='status'){
    var degc = Math.round(state.temperature * 10) / 10
    var degf = Math.round( (((degc * 9) / 5) + 32) * 10) / 10

    $('#status').html(state.status)
    $('#temperature').html(degc+"&#176;C, "+degf+"&#176;F")
    $('#humidity').html(Math.round(state.humidity * 10) / 10+"% RH")

    if(state.envStatus == 'heating'){
      $('#heating').show()
      $('#cooling').hide()
      $('#envOff').hide()
    } else if(state.envStatus == 'cooling'){
      $('#cooling').show()
      $('#heating').hide()
      $('#envOff').hide()
    } else if(state.envStatus == 'off' || state.envStatus == null ){
      $('#cooling').hide()
      $('#heating').hide()
      $('#envOff').show()
    }
  } else if (data.event =='opened') {
    $('#status').html('opened')
  } else if (data.event =='closed') {
    $('#status').html('closed')
  } else if (data.event =='imageRefresh') {
    var d = new Date();
    $('#coupImage').attr("src", "/images/snap.jpg?"+d.getTime());
  }

} )

// WebSocket event emitter function
var emitEvent = function( event ) {
  if( ! isConnectionActive ) {
    return alert( 'Server connection is closed!' )
  }

  $('#processing').show()
  $('#status').html('processing')

  if( event.target.id === 'button-close') {
    // disableButtons();
    connection.emit( 'close', {} )
  }
  if( event.target.id === 'button-open') {
    // disableButtons();
    connection.emit( 'open', {} )
  }

}

// add event listeners on button
button_close.addEventListener( 'click', emitEvent )
button_open.addEventListener( 'click', emitEvent )

$( document ).ready(function() {
  updateStatus()
});
