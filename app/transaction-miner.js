class TransactionMiner{

    constructor({blockchain,transactionPool, wallet, pubsub}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }
    mineTransactions(){
//get transaction pool's valid transaction

//generate miner's reward

//add block of transactions to BC

//broadcast updated BC

//clear the pool
    }
}

module.exports = TransactionMiner;