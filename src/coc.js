<<<<<<< HEAD
let cocClients=[];
let sessions=[];
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
                cocClients.forEach(a=>{ a.send(JSON.stringify(sessions));});
                break;
            case "session/create":// セッションを作成するmethod
                let keeper = cocClients.find(a=>{ return a===ws && a.role!=undefined});
                if(keeper.role != undefined && keeper.role == "keeper"){
                    let session = json.session;
                    sessions.push(session);
                    let result = {code:200,msg:"success"};
                    json.result = result;
                    keeper.send(JSON.stringify(json));
                }else if(keeper.role != undefined && keeper.role == "player"){
                    let result = {code:403,msg:"not allowed"};
                    json.result = result;
                    keeper.send(JSON.stringify(json));
                }else{
                    let result = {code:402,msg:"bad request"};
                    json.result = result;       
                    keeper.send(JSON.stringify(json));
                }
                break;
            case "session/join":
                let keeper = cocClients.find(a=>{ return a===ws && a.role!=undefined});
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
=======
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
>>>>>>> 1305ff5f4b58c78c672f1037145c7dd3fd365b7e


        });
        ws.on('close', ()=>{    
            console.log("close");
            const name=this.cocClients.find(a=> a===ws).role;
            this.cocClients=this.cocClients.filter(a=> a!==ws);
            this.cocClients.forEach(a=>{ a.send(JSON.stringify({ user: name, method: 'close', clients: this.cocClients.map(a=>name) })); });
        });
    }
}