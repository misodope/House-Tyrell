import config from '../../config.js'
import socketIOClient from 'socket.io-client'

// uncomment for ec2 instance
// const socket = socketIOClient(config.ip)
//


// comment this if on localhost
const socket = socketIOClient(config.ip + ':' + '3000');

export default socket;

// process.env.PORT ||
