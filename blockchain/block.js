const hexToBinary = require('hex-to-binary')
const {GENESIS_DATA, MINE_RATE} = require('../config');
const {cryptoHash} = require('../util'); 

class Block {
    constructor({timestamp,lastHash,hash,data,nonce,difficulty}){
this.timestamp = timestamp;
this.lastHash = lastHash;
this.hash = hash;
this.data = data;
this.nonce = nonce;
this.difficulty = difficulty;
    } 

    static genesis(){
        return new this(GENESIS_DATA)
    }

    static adjustDifficulty({originalBlock, timestamp}){
        const{difficulty} = originalBlock;
        if(difficulty<1) return 1;
        const difference = timestamp - originalBlock.timestamp
         if(difference > MINE_RATE) return difficulty - 1 ;
        
         return difficulty + 1 ;
    }

     static mineBlock({lastBlock, data}){
    let timestamp, hash ;
    const lastHash = lastBlock.hash 
    let {difficulty} = lastBlock;
    let nonce =0;

    do{
        nonce++;
        timestamp = Date.now();
        difficulty = Block.adjustDifficulty({originalBlock:lastBlock, timestamp})
        hash = cryptoHash(timestamp,lastHash,data,  nonce, difficulty);
    } 
    while(hexToBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty));
 
    return new this({  timestamp, nonce, difficulty, lastHash, data, hash});
    }
}
  
module.exports = Block;