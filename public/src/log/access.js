const log=[];

const access={
    add: (req, res, next)=>{
        log.push({ date: new Date(), method: req.method, path: req.path,
                   ip: req.ip,
                   proxyIP: req.ips,
                   userAgent: req.headers['user-agent'] });

        next();
    },

    get: ()=>{ return log; }
}

module.exports=access;