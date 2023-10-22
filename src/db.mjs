import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
    initials: {
        type:String,
        required:true
    },
    playerScore:{ 
        type:Number,
        required:true
    },
    computerScore:{
        type:Number,
        required:true
  }});
  
  mongoose.model('Score', ScoreSchema);
  mongoose.connect('mongodb://127.0.0.1:27017/hw07');
