module.exports = class CoC{
    constructor(){
        this.cocClients=[];
        this.sessions=[];
    }
    server(ws,req){
        // 通信してきた相手の情報がwsに入っている
        console.log("open");
        this.cocClients.push(ws);

        ws.on('message', message=>{
            console.log("message");
            const json=JSON.parse(message);
            switch (json.method) {
                case "entry":
                    console.log("entry");
                    this.cocClients.forEach(a=>{ if( a===ws && a.role==undefined && a.name==null) a.role=json.role });
                    this.cocClients.forEach(a=>{ a.send(JSON.stringify(this.cocClients)); });
                    break;
                case "dice":
                    console.log("dice");
                    let dice=json.dice;
                    this.cocClients.filter(a=>{
                        return a.role == "player";
                    }).forEach(a=>{
                        a.send(JSON.stringify(json));
                    });
                    break;
                case "dice/response":
                    break;
                default:
                    break;
            }

            if( json.method!=null ) json.clients=this.cocClients.map(a=> a.name);


        });
        ws.on('close', ()=>{    
            console.log("close");
            const name=this.cocClients.find(a=> a===ws).role;
            this.cocClients=this.cocClients.filter(a=> a!==ws);
            this.cocClients.forEach(a=>{ a.send(JSON.stringify({ user: name, method: 'close', clients: this.cocClients.map(a=>name) })); });
        });
    }
}