let cocClients=[];

const chat=(ws, req)=>{
    // 通信してきた相手の情報がwsに入っている
    console.log("open");
    cocClients.push(ws);

    ws.on('message', message=>{
        console.log("message");
        const json=JSON.parse(message);
        switch (json.method) {
            case "entry":
                console.log("entry");
                entry();
                cocClients.forEach(a=>{ if( a===ws && a.role==undefined && a.name==null) a.role=json.role });
                cocClients.forEach(a=>{ a.send(JSON.stringify(cocClients)); });
                break;
            case "dice":
                console.log("dice");
                dice=json.dice;
                cocClients.filter(a=>{
                    return a.role == "player";
                }).forEach(a=>{
                    a.send(JSON.stringify(json));
                });
                break;
            default:
                break;
        }

        if( json.method!=null ) json.clients=cocClients.map(a=> a.name);


    });
    ws.on('close', ()=>{    
        console.log("close");
        const name=cocClients.find(a=> a===ws).role;
        cocClients=cocClients.filter(a=> a!==ws);
        cocClients.forEach(a=>{ a.send(JSON.stringify({ user: name, method: 'close', clients: cocClients.map(a=>name) })); });
    });
}
const entry = function(){
    console.log("test");
}
module.exports=chat;