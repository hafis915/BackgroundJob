const { timeout } = require('cron');
const cron = require('node-cron')

let count = 0 
var task = cron.schedule('*/2 * * * * *', () =>  {
    if (count >= 5 &&  count < 8 ) {
        task.stop()
        setTimeout(() => {
            count = 0 
            task.start()
        }, 2000);
    }
    else {
        count++
        console.log('will execute every minute until stopped', count);
    }
  });
