var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server=require('../app');
var should = chai.should();

chai.use(chaiHttp);


describe('LexicalDensity', function(){
    
    describe('Input error check', function(){
        
        it('Should check over 100 words', (done)=>{
            
            chai.request(server)
                .get("/complexity/")
                .send({'input':'With their precious cargo of salt, the travelers crossed the coastal lowlands and traveled toward the mountains. But Lara’s people never reached the mountaintops; they traveled only as far as the foothills. Many people lived in the forests and grassy meadows of the foothills, gathered in small villages. Among Lara’s people, there was a wooden baby’s crib, suitable for strapping to a cart, that had been passed down for generations. little toys made of wood. Their bartering done, Lara and her people would travel back down the river path to the sea. The island was shaped like that crib, longer than it was wide and pointed at the upriver end, where the flow had eroded both banks.'})
                .end((err, result)=>{
                    result.should.have.status(400);                    
                    console.log ("Result Body:", result.body);
                    done()
                })

        })
        
        it('Should check over 1000 characters', (done)=>{
        
            chai.request(server)
                .get("/complexity/")
                .send({'input':'With their precious cargo of salt, the travelers crossed the coastal lowlands and traveled toward the mountains. But Lara’s people never reached the mountaintops; they traveled only as far as the foothills. Many people lived in the forests and grassy meadows of the foothills, gathered in small villages. In return for salt, these people would give Lara’s people dried meat, animal skins, cloth spun from wool, clay pots, needles and scraping tools carved from bone, and little toys made of wood. Their bartering done, Lara and her people would travel back down the river path to the sea. The cycle would begin again. It had always been like this. Lara knew no other life. She traveled back and forth, up and down the river path. No single place was home. She liked the seaside, where there was always fish to eat, and the gentle lapping of the waves lulled her to sleep at night. She was less fond of the foothills, where the path grew steep, the nights could be cold, and views of great distances made her dizzy. She felt uneasy in the villages, and was often shy around strangers. The path itself was where she felt most at home. She loved the smell of the river on a hot day, and the croaking of frogs at night. Vines grew amid the lush foliage along the river, with berries that were good to eat. Even on the hottest day, sundown brought a cool breeze off the water, which sighed and sang amid the reeds and tall grasses. Of all the places along the path, the area they were approaching, with the island in the river, was Lara’s favorite. The terrain along this stretch of the river was mostly flat, but in the immediate vicinity of the island, the land on the sunrise side was like a rumpled cloth, with hills and ridges and valleys. Among Lara’s people, there was a wooden baby’s crib, suitable for strapping to a cart, that had been passed down for generations. The island was shaped like that crib, longer than it was wide and pointed at the upriver end, where the flow had eroded both banks.'})
                .end((err, result)=>{
                    result.should.have.status(400);                    
                    console.log ("Result Body:", result.body);
                    done()
                })
        })

    })

    describe ('​Lexical density', function(){
        
        it('Should return lexical density', (done)=>{
            
            chai.request(server)
                .get("/complexity/")
                .send({'input':'With their precious cargo of salt, the travelers crossed the coastal lowlands and traveled toward the mountains.'})
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Result Body:", result.body);
                    done()
                })   
        })

        it('Should return lexical density (verbose mode)', (done)=>{
            
            chai.request(server)
                .get("/complexity?mode=verbose")
                .send({'input':'With their precious cargo of salt, the travelers crossed the coastal lowlands and traveled toward the mountains.'})
                .end((err, result)=>{
                    result.should.have.status(200);                    
                    console.log ("Result Body:", result.body);
                    done()
                })   
        })
    })
    
})