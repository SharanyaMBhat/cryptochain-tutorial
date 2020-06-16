const redis = require('redis');
const credentials = {
  publishKey: 'pub-c-e3969874-fad6-405f-a862-8a8365dd9d35',
  subscribeKey:'sub-c-b266914c-3dcb-11ea-8a62-3662be881406',
  secretKey: 'sec-c-MmU5YzhkMjMtZTkwZS00OTBiLWE2NzYtMzIxZjhiNTY2MWI4'
  };

const CHANNELS = {
TEST: 'TEST',
BLOCKCHAIN: 'BLOCKCHAIN',
TRANSACTION : 'TRANSACTION'
};

class PubSub {
  constructor({blockchain, transactionPool}){
      this.blockchain = blockchain;
      this.transactionPool = transactionPool;

      this.publisher = redis.createClient();
      this.subscriber = redis.createClient();
      
      this.subscribeToChannels(); 

      this.subscriber.on('message', (channel,message)=>this.handleMessage(channel,message));
  }  

  handleMessage(channel,message){
  console.log(`Message recieved. Channel: ${channel}. Messaage: ${message}.`)
    const parsedMessage = JSON.parse(message);

    switch(channel){
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage);
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        break;
      default:
        return;

    }
    if(channel === CHANNELS.BLOCKCHAIN){
      
    }
}

  subscribeToChannels(){
    Object.values(CHANNELS).forEach(channel=>{
      this.subscriber.subscribe(channel);
    });
  }

  publish({channel,message}){
    this.subscriber.unsubscribe(channel, () =>{
      this.publisher.publish(channel,message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastChain(){
    this.publish({
      channel:CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    })
  }

  broadcastTransaction(transaction){
    this.publish({
      channel:CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    })
  }

}

module.exports = PubSub; 
   
 