var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

const mapNonLex = new Map();
////// mongodb //////
const url = 'mongodb://localhost:27017';
const dbName = 'lexicalDensity';
var db = null;
var nonLexicalCollection;
mongo.MongoClient.connect(url, function(err, client) {
  if (err){
    console.log(err);
  } else {
    console.log('Connected successfully to mongodb server');
    db = client.db(dbName);
    nonLexicalCollection = db.collection('nonLexicalWords');
    nonLexicalCollection.find({}).toArray(function(error, results){
      if (error){
        console.log('Failed to get nonLexicalWords from db');
      } else {
        for(const item of results){
          if (item.word.trim() !== ''){
            mapNonLex.set(item.word.trim().toLowerCase(), item.word.trim());
            //console.log('nonLexWord:', item.word.trim().toLowerCase())
          }          
        }        
        //console.log(mapNonLex);

      }
    })
  }
});

/* GET complexity listing. */
router.get('/', function(req, res, next) {
  var mode = req.query.mode;
  var input = req.body.input;
  var lexicalWordCount = 0;
  var totalWordCount = 0;

  // check the input
  var words = input.split(' ');
  if (!input){
    res.status(400).send({ data: '', message: 'no input text' });
    return;
  } else if (input.length > 1000) {
    res.status(400).send({ data: '', message: 'Only texts with up to 1000 characters are valid input.' });
    return;
  } else if (words.length > 100) {
    res.status(400).send({ data: '', message: 'Only texts with up to 100 words are valid input.' });
    return;
  }

  if (!mode){
    for (const word of words){
      //console.log('raw word:', word);
      if (word !== ''){
        var modifiedWord = word.replace('.','').replace('?','').replace(',','').replace('!','');
        modifiedWord = modifiedWord.toLowerCase().trim();
        //console.log('modified word:', modifiedWord);
        
        totalWordCount += 1;
        var check = mapNonLex.has(modifiedWord);
        //console.log(check);  
        if (!check) {
          lexicalWordCount += 1;
        }

        // var x = mapNonLex.has('to');
        // console.log(x);
      }      
    }
    res.send({ data: { overall_ld: lexicalWordCount/totalWordCount } });
  } else if (mode === 'verbose') {
    var sentenceLd = [];
    var sentences = input.split('?').join('.').split('!').join('.').split('.');    
    for (const sentence of sentences){
      //console.log('raw sentence:', sentence);
      if (sentence !== ''){
        words = sentence.split(' ');

        var sLexicalWordCount = 0;
        var sTotalWordCount = 0;

        for (const word of words){
          //console.log('raw word:', word);
          if (word !== ''){
            var modifiedWord = word.replace('.','').replace('?','').replace(',','').replace('!','');
            modifiedWord = modifiedWord.toLowerCase().trim();
            //console.log('modified word:', modifiedWord);
            
            totalWordCount += 1;
            sTotalWordCount += 1;
            var check = mapNonLex.has(modifiedWord);
            //console.log(check);  
            if (!check) {
              lexicalWordCount += 1;
              sLexicalWordCount += 1;
            }

            // var x = mapNonLex.has('to');
            // console.log(x);
          }          
        }
        sentenceLd.push(sLexicalWordCount/sTotalWordCount);
      }
    }

    res.send({ data: { sentence_ld: sentenceLd, overall_ld: lexicalWordCount/totalWordCount } });

  } else {
    res.status(400).send({ data: '', message: 'mode option usages: "mode=verbose"'});
    return;
  }
});

module.exports = router;
