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

// send asset files
app.use( '/assets/', express.static( path.resolve( __dirname, 'web-app' ) ) )
app.use( '/assets/', express.static( path.resolve( __dirname, 'node_modules/socket.io-client/dist' ) ) )

// server listens on `9000` port
const server = app.listen( 9000, () => console.log( 'Express server started on port 9000' ) )

if(args.w === true) {
  console.log('Web server only, Booting Coup skiped.')
  var Coup = { close: () => {}, open: () => {} }
  const EventEmitter = require('events')
  const Events = new EventEmitter()
} else {
  console.log('Express web server booted ...')
  console.log('Loading the coup')
  const { Coup, Spinner, Events } = require( './coup' )
}

const io = socketIO( server )

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
    client.send(JSON.stringify({state: Coup.status, event: "status"})
  } )

} )

Events.on( 'closed', (data) => {
  client.send(JSON.stringify({state: Coup.status, event: "closed"})
} )

Events.on( 'opened', (data) => {
  client.send(JSON.stringify({state: Coup.status, event: "opened"})
} )
