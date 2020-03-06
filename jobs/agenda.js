const Agenda = require("agenda");
const mongoConnectionString = require("../config/keys").mongoURI_LOCAL;

const agenda3Second = new Agenda({db: {address: mongoConnectionString, collection: 'jobRunner'}});

agenda3Second.define('running job', async job => {
  console.log("Running, running, running!")
});

(async function() { // IIFE to give access to async/await
  await agenda3Second.start();

  await agenda3Second.every('3 seconds', 'running job');


  // Alternatively, you could also do:
//   await agenda.every('*/3 * * * *', 'delete old users');
})();


module.exports =  agenda3Second;