
function sayGood(){
    console.log("good for you.");
}


const schedule = require('node-schedule');

const  scheduleCronstyle = ()=>{
    schedule.scheduleJob('1 * * * * *',()=>{
        sayGood();
        console.log('scheduleCronstyle:' + new Date());
    }); 
}

scheduleCronstyle();

