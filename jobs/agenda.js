const Agenda = require("agenda");
const mongoConnectionStringLOCAL = require("../config/keys").mongoURI_LOCAL;
const mongoConnectionStringPROD = require("../config/keys").mongoURI;
const pfxDailyRunner = require('../jobs/pfxDailyRunner');
const logger = require('../config/logger');

var agenda;
if (process.env.NODE_ENV === "production") {
    logger.warn("MongoDBPROD Agena....")
    agenda = new Agenda({db: {address: mongoConnectionStringPROD, collection: 'jobRunner', options:{useUnifiedTopology: true}}});
}else{
    logger.info("MongoDB_LOCAL Agena....")
    agenda = new Agenda({db: {address: mongoConnectionStringLOCAL, collection: 'jobRunner', options: {useUnifiedTopology: true}}});
}
            


agenda.define('pfxJOB', {concurrency: 1},(job, done) => {
    pfxDailyRunner.ExecutePfxDaily();
    job.repeatEvery('24 hours', {
    skipImmediate: true,

  });
    job.save();
    done()
  });  

(async function() { // IIFE to give access to async/await
  await agenda.start();
    //check to see if we have our job already scheduled
    const pfxJOB = await agenda.jobs({name: 'pfxJOB'}, {data:-1}, 3, 1);
    //if more than 1 cancel and schdule
    if(pfxJOB.length > 1){
        await agenda.cancel({name: 'pfxJOB'});
        await agenda.schedule('tomorrow at 3am','pfxJOB')
    }
    //else if zero schedule
    else if(pfxJOB.length == 0){
        await agenda.schedule('tomorrow at 3am','pfxJOB')  
    }

})();


module.exports =  agenda;