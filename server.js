const path = require( 'path' );
const express = require( 'express' );
const socketIO = require( 'socket.io' );
const app = express();

const minimist = require('minimist');

let args = minimist(process.argv.slice(2), {
    alias: {
        w: 'web-only',
    }
});

app.get( '/', ( request, response ) => {
  response.sendFile( path.resolve( __dirname, 'web-app/index.html' ), {
    headers: {
      'Content-Type': 'text/html',
    }
  } );
} );

// send asset files
app.use( '/assets/', express.static( path.resolve( __dirname, 'web-app' ) ) );
app.use( '/assets/', express.static( path.resolve( __dirname, 'node_modules/socket.io-client/dist' ) ) );

// server listens on `9000` port
const server = app.listen( 9000, () => console.log( 'Express server started on port 9000' ) );

if(args.w === true) {
  console.log('Web server only, Booting Coup skiped.')
  const Coup = {}
} else {
  console.log('Express web server booted ...')
  console.log('Loading the coup')
  const { Coup, Spinner } = require( './coup' );
}

const io = socketIO( server );

io.on( 'connection', ( client ) => {
  Spinner.stop(true)
  console.log( 'SOCKET: ', 'A client connected', client.id );
  Spinner.start()

  client.on( 'open', ( data ) => {
    Spinner.stop(true)
    console.log( 'Received open event.' );
    Coup.open()
    Spinner.start()
  } );

  client.on( 'close', ( data ) => {
    Spinner.stop(true)
    console.log( 'Received close event.' );
    Coup.close()
    Spinner.start()
  } );

  client.on( 'status', ( data ) => {
    Spinner.stop(true)
    console.log( 'Received request for status event.' );
    Coup.close()
    Spinner.start()
  } );

} );
