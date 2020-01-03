const histories=[];
const min=1;

setInterval(()=>{ histories.push({ date: new Date(), memory: process.memoryUsage(), cpu: process.cpuUsage() }) }, 1000*60*min);

const usage={
    get: ()=>{ return histories; },
}

module.exports=usage;