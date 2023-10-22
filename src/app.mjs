import express from 'express';
import mongoose from 'mongoose';
import './db.mjs';
const app = express();

// to parse json bodies, uncomment the following line:
// app.use(express.json())

import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const Score=mongoose.model('Score');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/scores', async (req, res) => {
    try {
      const scores = await Score.find();
      res.send(scores);
    } catch(error) {
      res.send({error});
    }
  });
app.use(express.json());
app.post('/api/scores', async (req, res) => {
   
    try {
        const score=new Score({
            initials:req.body.initials,
            playerScore:req.body.playerScore,
            computerScore:req.body.computerScore
        });
       

        

        await score.save();
        
        console.log('data saved successfuly');
      // TODO: create and save a document to the db
      // using the values that are passed along from
      // the client via req.body
  
      res.send({score, error: null});
    } catch(error) {
      res.send({error});
    }
  });

app.listen(3000);
