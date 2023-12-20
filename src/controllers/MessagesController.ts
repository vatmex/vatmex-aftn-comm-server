import express from 'express';
import message from 'router/message';

import ReceivedMessage = require('../models/ReceivedMessage');
import TransmittedMessage = require('../models/TransmittedMessage');

// TODO: Get from Navdata
const validDestinations = ['MMID', 'MMTY', 'MMEX', 'MMZT', 'MMFR', 'MMZO'];

let messageIdNumber:number = 0;

const getMessageIdNumber = ():string => {
  messageIdNumber += 1;

  // Clamp to 3 digits
  if (messageIdNumber === 1000) {
    messageIdNumber = 1;
  }

  return String(messageIdNumber).padStart(3, '0');
}

const receive = (req:express.Request, res:express.Response) => {
  const rawMessage:string = req.body; // Removes trailing and leading ()
  const splitMessage:string[] = rawMessage.substring(1, req.body.length-1).split('-'); // Splits by field

  let responseCode:number;
  let responseMessage:string;

  // Determine message type
  switch (rawMessage.substring(1,4)) {
    case 'CPL':
      let messageId = splitMessage[0].slice(3);
      let originATS = messageId.split('/')[0];
      let destinationATS = messageId.split('/')[1].substring(0,4);

      // 02: INVALID RECEIVING UNIT
      if (!validDestinations.includes(destinationATS)) {
        responseMessage = `(LRMMMFR/${originATS}${getMessageIdNumber()}CZWG/KZLC021-RMK/06/07/AAL98295)`;
        responseCode = 400;
        break;
      }

      // 06: INVALID ACID.
      // 19: INVALID DESTINATION AERODROME.
      // 23: INVALID TIME DESIGNATOR.
      // 24: MISSING TIME DESIGNATOR.
      // 25: INVALID BOUNDARY POINT DESIGNATOR.
      // 34: INVALID CROSSING CONDITION.
      // 57: INVALID MESSAGE.
      // 59: MESSAGE NOT APPLICABLE TO zzzz ACC

      // Message is valid. Store in db for later delivery.
      ReceivedMessage.storeMessage({
        message: rawMessage,
        origin: originATS,
        destination: destinationATS,
      });

      // Since the message was a hit answer with a LAM.
      responseMessage = `(LAM${destinationATS}/${originATS}${getMessageIdNumber()}${messageId})`;
      responseCode = 200;

      // Now save the response
      TransmittedMessage.storeMessage({
        message: responseMessage,
        origin: destinationATS,
        destination: originATS,
      });

      break;
    default:
      responseCode = 501;
      responseMessage = '(NOT IMPLEMENTED)';
      break;
  }

  // Respond
  res.set('Content-Type', 'text/plain');
  res.statusCode = responseCode;
  res.send(responseMessage);
};

const getMessages = (facility:string) => {

}

module.exports = { receive, getMessages };
