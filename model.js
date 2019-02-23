const mongoose = require('mongoose');
const Settings = require('./settings');
const keygen = require('keygenerator');
const Constants = require('constants');


function generateAPIKey() {
    return (keygen._({ length: 2 }) + '-' + keygen._({ length: 6 })
        + '-' + keygen.number()
        + '-' + keygen._({ length: 6 })
        + '-' + keygen._({ length: 8 })).replace(/&/g, '');
}

const PhotosSchema = new mongoose.Schema({
    image:{ data: Buffer, contentType: String },
    userId: { type:mongoose.Schema.Types.ObjectId },
    //entity_id: { type: Schema.ObjectId, index: true }
});


const ServiceSchema = new mongoose.Schema( {
  name: {
    type: String,
    minlength: Settings.Config.username_minlength,
    maxlength: Settings.Config.username_maxlength
  },
  phone: String,
  rating: Number,

    role: { type: String, enum:Constants.service_role_values, default: 'service' },
  key: {
      type: String,
      default: generateAPIKey,
      index: {unique: true}
  },
  photo: {
    type: String,
    default: null,
    required: false
  }

});
module.exports = ServiceSchema;
