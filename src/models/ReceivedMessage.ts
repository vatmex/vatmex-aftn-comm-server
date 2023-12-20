import mongoose from "mongoose";

const receivedMessageSchema = new mongoose.Schema({
  message: { type:String, required: true },
  origin: { type:String, required: true },
  destination: { type:String, required: true},
  received_at: { type:Date, default: Date.now },
  delivered: { type:Boolean, default: false },
  delivered_at: { type:Date },
});

export const ReceivedMessageModel = mongoose.model('ReceivedMessage', receivedMessageSchema);

export const storeMessage = (values:Record<string, any>) => new ReceivedMessageModel(values)
  .save().then((message) => message.toObject());
