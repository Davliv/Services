const mongoose = require('mongoose');
const Keys = require('./model');
const Settings = require('./settings');
const ServicesSchema = require('./model');
const services_db = mongoose.createConnection("mongodb://localhost:27017/services", { useNewUrlParser: true });
const services = services_db.model('services', ServicesSchema);

let Key = async function(req, res, next) {
 if (req.body.key) {
   console.log(req.body.key);
     let id = req.params.id;
     try {
         let service = await services.findOne({ _id: id }).exec();
         if (service.key != req.body.key) return res.send({success:false,msg:'Dont have valid key'}).status(Settings.HTTPStatus.NOT_FOUND);
         next();
     } catch(err) {
         console.log('error caught');
         console.log(err);
     }
 } else{
   return res.send({success:false,msg:'NO key'}).status(Settings.HTTPStatus.NOT_FOUND);
 }

};

module.exports = Key;
