let clients=[];

const chat=(ws, req)=>{
    clients.push(ws);

    ws.on('message', message=>{
        const json=JSON.parse(message);
        clients.forEach(a=>{ if( a===ws && a.name==null ) a.name=json.user });

        if( json.method!=null ) json.clients=clients.map(a=> a.name);

        clients.forEach(a=>{ a.send(JSON.stringify(json)); });
    });
    ws.on('close', ()=>{
        const name=clients.find(a=> a===ws).name;
        clients=clients.filter(a=> a!==ws);
        clients.forEach(a=>{ a.send(JSON.stringify({ user: name, method: 'close', clients: clients.map(a=>name) })); });
    });
}

module.exports=chat;