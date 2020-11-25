const path = require( 'path' )
const express = require( 'express' )
const socketIO = require( 'socket.io' )
const app = express()

const minimist = require('minimist')

let args = minimist(process.argv.slice(2), {
    alias: {
        w: 'web-only',
    }
})

app.get( '/', ( request, response ) => {
  response.sendFile( path.resolve( __dirname, 'web-app/index.html' ), {
    headers: {
      'Content-Type': 'text/html',
    }
  } )
} )

// Static files
app.use(express.static(__dirname + '/web-app'));

app.get( '/images/:image', ( request, response ) => {
  response.sendFile( path.resolve( __dirname, 'web-app/images/'+request.params.image ), {
    headers: {
      'Content-Type': 'image/jpeg',
    }
  } )
} )

// send asset files
app.use( '/assets/', express.static( path.resolve( __dirname, 'web-app' ) ) )
app.use( '/assets/', express.static( path.resolve( __dirname, 'node_modules/socket.io-client/dist' ) ) )

// server listens on `9000` port
const server = app.listen( 80, () => console.log( 'Express server started on port 9000' ) )

console.log('Express web server booted ...')
console.log('Loading the coup')
const { Coup, Spinner, Events } = require( './coup' )

console.log('Loading the Camera...')

const PiCamera = require('pi-camera');
const myCamera = new PiCamera({
  mode: 'photo',
  output: `./web-app/images/snap.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});

function snap() {
  myCamera.snap()
    .then((result) => {
        console.log('snapped the camera!')
        Events.emit('snap')
    })
    .catch((error) => {
        console.log(error)
    });
}

snap()

setTimeout(snap, 10000)

const io = socketIO( server )

var client = null

io.on( 'connection', ( client ) => {
  console.log( 'SOCKET: ', 'A client connected', client.id )

  client.on( 'open', ( data ) => {
    console.log( 'Received open event.' )
    Coup.open()
  } )

  client.on( 'close', ( data ) => {
    console.log( 'Received close event.' )
    Coup.close()
  } )

  client.on( 'status', ( data ) => {
    console.log( 'Received request for status event.' )
    client.send(JSON.stringify({state: Coup.state, event: "status"}))
  } )

  Events.on( 'closed', (data) => {
      client.send(JSON.stringify({state: Coup.state, event: "closed"}))
  } )

  Events.on( 'opened', (data) => {
      client.send(JSON.stringify({state: Coup.state, event: "opened"}))
  } )

  Events.on( 'snap', (data) => {
      client.send(JSON.stringify({event: "imageRefresh"}))
  } )

} )
