const express = require('express');
const bs = require('body-parser');
const mongoose = require('mongoose');
const validation = require('./validator');
const Settings = require('./settings');
const HTTPStatus = require('./settings');
const Config = require('./settings');
const Key = require('./key');
const Model = require('./model');
const Constantss = require('./constants');
const Path =  require('path');
const multer  = require('multer');
const ServiceSchema = require('./model');
const services_db = mongoose.createConnection("mongodb://localhost:27017/services", { useNewUrlParser: true });
const services = services_db.model('services', ServiceSchema);

const app = express();
app.use(bs.json());
app.use(bs.urlencoded({extended: false}));

  const storage = multer.diskStorage({
      destination: './uploads',
      filename: (req,file,cb) => {
      console.log(file);
      cb(null,file.fieldname + "-" + Date.now() + Path.extname(file.originalname));
    }
  });
  const upload = multer({
      storage: storage,
      fileFilter: function(req,file,cb) {
      const fileType = /jpeg|jpg|gif|png/;
      const extName = fileType.test(Path.extname(file.originalname).toLowerCase());
      const mimeType = fileType.test(file.originalname);
      if (extName && mimeType) return cb(null,true);
      else cb("Must be image only");
    }
  }).single('photo');

app.post('/upload/:id',(req, res) => {
    if (!req.params.id) return res.send({success:false,msg:'Id not exist'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    upload(req,res,(err) => {
        if (err) return res.send({success:false,msg:err}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        if (!req.file) return res.send({success:false,msg:'File not exist'}).status(Settings.HTTPStatus.PARAMS_INVALID);
        if (!req.params.id) return res.send({success:false,msg:'Id not exist'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    services.findById(req.params.id, function (err, service) {
        if (err) return res.send({success:false,msg:err}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        if (!service)  return res.send({success:false,msg:'User not found'}).status(Settings.HTTPStatus.NOT_FOUND);
    service.photo = req.file.filename;
    service.save(function(err, doc, numbersAffected) {
        if (err) return res.send({success:false,msg:err}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        else return res.send({success:true,msg:'file success created'}).status(Settings.HTTPStatus.OK);
          });
        });
      });
    });
app.get('/services', (req, res) => {
        if (!req.params) return res.send('no params').status(Settings.HTTPStatus.NOT_FOUND);
    services.find({
      }, (err, result) => {
        if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        return res.send(result).status(HTTPStatus.OK);
      });
    });

app.get('/services/:id', (req, res) => {
      let id = req.params.id;
        if (!id) return res.send({success:false,msg:'Id not exist'}).status(Settings.HTTPStatus.NOT_FOUND);
    services.findOne({
        _id: id
      }, (err, result) => {
        if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        return res.send(result).status(HTTPStatus.OK);
      });
    });

app.post('/services', (req, res) => {
    if (req.body.name && req.body.address && req.body.phone && req.body.rating) {
        if (!validation.validateName(req.body.name)) {
        return res.send('no name');
        return res.send({success:false,msg:'Not valid name'}).status(Settings.HTTPStatus.NOT_FOUND);
      }
    if (!validation.validateAddress(req.body.address)) {
        return res.send('no address');
        return res.send({success:false,msg:'Not valid address'}).status(Settings.HTTPStatus.NOT_FOUND);
      }
    if (!validation.validatePhone(req.body.phone)) {
        return res.send('no phone');
        return res.send({success:false,msg:'Not valid phone'}).status(Settings.HTTPStatus.NOT_FOUND);
      }
    if (!validation.validateRating(req.body.rating)) {
        return res.send('no rating');
        return res.send({success:false,msg:'Not valid rating'}).status(Settings.HTTPStatus.NOT_FOUND);
      }
    services.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        photo: req.body.photo,
        rating: req.body.rating,
        role: req.body.role
      }, (err, result) => {
      if (err) return res.send({success:false,msg:'Server error'});
      return res.send({success:true,msg:'Services created'});
      });
     }
   });

app.put('/services/:id',Key ,(req, res) => {
    let id = req.params.id;
    let queryObject = {};
      if (req.body.name && req.body.name.length) {
        if(!validation.validateName(req.body.name)) return res.send({success:false,msg:'Not valid name'}).status(Settings.HTTPStatus.NOT_FOUND);
          queryObject.name = req.body.name;
      }
      if (req.body.address && req.body.address.length) {
        if (!validation.validateAddress(req.body.address)) return res.send({success:false,msg:'Not valid address'}).status(Settings.HTTPStatus.NOT_FOUND);
        queryObject.address = req.body.address;
      }
      if (req.body.phone && req.body.phone.length) {
        if (!validation.validatePhone(req.body.phone)) return res.send({success:false,msg:'Not valid phone'}).status(Settings.HTTPStatus.NOT_FOUND);
        queryObject.phone = req.body.phone;
      }
      if (req.body.rating && req.body.rating.length) {
        queryObject.rating = req.body.rating;
        if (!validation.validateRating(req.body.rating)) return res.send({success:false,msg:'Not valid rating'}).status(Settings.HTTPStatus.NOT_FOUND);
      }
      if (Object.keys(queryObject).length) {
        services.updateOne({_id: id},queryObject, (err, result) => {
          if (err) return res.send('server error').status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
          return res.send(result).status(Settings.HTTPStatus.OK);
        });
            } else {
            return res.send('empty form');
        }
    });

app.delete('/services/:id', (req, res) => {
      let adminID = req.params.id;
      let serviceToDelete = req.body.id;
    services.findOne({
        _id: adminID
      }, (err, result) => {
          if (err) return res.send('server error').status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
          if (result.role != Constantss.ServiceRoles.ADMIN) return res.send({success:false,msg:'No Admin'}).status(Settings.HTTPStatus.NOT_FOUND);
    services.deleteOne({_id: serviceToDelete}, (err,result) => {
          if (err) return res.send('server error').status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
          return res.send('services deleted').status(Settings.HTTPStatus.OK);
        });
      });
    });

app.listen(3000);
