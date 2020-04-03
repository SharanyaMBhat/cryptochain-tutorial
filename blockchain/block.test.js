const Block  = require('./block');
const hexToBinary = require('hex-to-binary')
const {cryptoHash} = require('../util'); 

const {GENESIS_DATA} = require('../config');
const {MINE_RATE} = require('../config');
describe('Block',() => {
    const timestamp = 2000;
    const lastHash = 'foo-last-hash';
    const hash='foo-hash';
    const data= ['block','chain'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({timestamp,lastHash,hash,data, nonce,difficulty});

    it('has a timestamp, hash, lasthash and data', () => {
        expect(block.timestamp).toEqual(timestamp)
        expect(block.hash).toEqual(hash)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.data).toEqual(data)
        expect(block.nonce).toEqual(nonce)
        expect(block.difficulty).toEqual(difficulty)
    });

    describe('genesis()' , ()=>{
        const genesisBlock = Block.genesis();

        it('returns block instance', ()=>{
            expect(genesisBlock instanceof Block).toBe(true);
        });
        it('returns genesis data', ()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA);  
        });
    });

    describe('mineBlock()', ()=>{

        const lastBlock = Block.genesis();
        const data = 'mined data';
        const nonce =1;
        const difficulty =1;
        const minedBlock = Block.mineBlock({lastBlock,data,nonce,difficulty});

        it('returns block instance', ()=>{
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the lastHash to the hash of the last block', ()=>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        it('sets the data', ()=>{
            expect(minedBlock.data).toEqual(data);
        });
        it('sets the timestamp ', ()=>{
            expect(minedBlock.lastHash).not.toEqual(undefined);
        });
        it('creates a SHA-256 hash based on proper inputs',()=>{
            expect(minedBlock.hash).toEqual(
                cryptoHash(
                    minedBlock.timestamp,
                    minedBlock.nonce,
                    minedBlock.difficulty, 
                    minedBlock.lastHash,
                    minedBlock.data))
        })
        it('sets a `hash` that matches the difficulty criteria',()=>{
            expect(hexToBinary(minedBlock.hash).substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
        })
        it('adjusts difficulty',()=>{
            const possibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1]
        expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        })
});

    describe('adjustDifficulty()',()=>{
        it('raises difficulty for quickly mined block',()=>{

            expect(Block.adjustDifficulty({originalBlock:block, timestamp: block.timestamp + MINE_RATE - 100}))
            .toEqual(block.difficulty+1)
    
        })

        it('lowers difficulty for slowly mined block',()=>{
            expect(Block.adjustDifficulty({originalBlock:block, timestamp: block.timestamp + MINE_RATE + 100}))
            .toEqual(block.difficulty-1)
        })
        it('has a lower limit of 1',()=>{
            block.difficulty = -1;
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        })
    })
});