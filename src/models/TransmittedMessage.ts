import mongoose from "mongoose";

const transmittedMessageSchema = new mongoose.Schema({
  message: { type:String, required: true },
  origin: { type:String, required: true },
  destination: { type:String, required: true},
  transmitted_at: { type:Date, default: Date.now },
});

export const TransmittedMessageModel = mongoose.model('TransmittedMessage', transmittedMessageSchema);

export const storeMessage = (values:Record<string, any>) => new TransmittedMessageModel(values)
  .save().then((message) => message.toObject());
