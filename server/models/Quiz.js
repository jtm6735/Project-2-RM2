const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let QuizModel = {};

// mongoose.types.objectID is a function that converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();


const QuizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  color: {
    type: String,
    required: true,
    trim: true,
  },

  hobby: {
    type: String,
    required: true,
    trim: true,
  },
    
  animal: {
    type: String,
    required: true,
    trim: true,
  }, 
    
  number: {
    type: Number,
    min: 0,
    required: true,
  },
    
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});


QuizSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  color: doc.color,
  hobby: doc.hobby,
  animal: doc.animal,
  number: doc.number,
});

QuizSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return QuizModel.find(search).select('name color hobby animal number').exec(callback);
};

QuizModel = mongoose.model('Quiz', QuizSchema);

module.exports.QuizModel = QuizModel;
module.exports.QuizSchema = QuizSchema;
