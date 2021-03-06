const Transaction = require('../wallet/transaction')

class TransactionMiner{

constructor({blockchain,transactionPool, wallet, pubsub}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    } 
    
mineTransactions(){

    //get transaction pool's valid transaction
    const validTransactions = this.transactionPool.validTransactions(); 

    if(this.transactionPool.validTransactions().length!==0)
    {
        //generate miner's reward
        validTransactions.push(
        Transaction.rewardTransaction({minerWallet: this.wallet})
        );

        //add block of transactions to BC
        this.blockchain.addBlock({data: validTransactions})

        //broadcast updated BC
        this.pubsub.broadcastChain();

        //clear the pool
        this.transactionPool.clear();
    }
    else {
        alert("No transactions available to mine")
    }
   
}
}

module.exports = TransactionMiner;