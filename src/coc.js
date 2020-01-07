module.exports = class CoC{
    constructor(){
        this.cocClients=[];
        this.sessions=[{
                sessionId:"test",
                sessionName:"testSession",
                owener:"testKeeper"
            },{
                sessionId:"test2",
                sessionName:"testSession2",
                owener:"testKeeper"
            },{
                sessionId:"test3",
                sessionName:"testSession3",
                owener:"testKeeper2"
            }
        ];
        this.methods=[];
    }
    getKeeper(){
        return this.cocClients.filter(a=>{
            return a.role == "keeper";
        })
    }
    server(ws,req){
        // 通信してきた相手の情報がwsに入っている
        console.log("open");
        this.cocClients.push(ws);

        ws.on('message', message=>{
            console.log("message");
            const json=JSON.parse(message);

            // セッションに参加する
            this.sub("entry",()=>{
                // Clientのnameとroleを登録
                this.cocClients.forEach(a=>{
                    if( a===ws && a.role==undefined && a.name==null){
                        a.role = json.role;
                        a.id = json.id; 
                        a.name = json.name;
                        a.sessionId = json.sessionId;
                    }
                });
                // 参加中の全てのクライアントに現在接続しているクライアント一覧を送信
                this.cocClients.forEach(a=>{ a.send(JSON.stringify(this.cocClients)); });
            })
            // diceリクエストを投げる※requestに置き換わる予定            
            this.sub("dice",()=>{
                let dice=json.dice;
                this.cocClients.filter(a=>{
                    return a.role == "player";
                }).forEach(a=>{
                    a.send(JSON.stringify(json));
                });
            })
            
            this.sub("response",()=>{
                let response = json;
                let keepers = this.getKeeper();
                keepers.forEach(a=>{
                    a.send(JSON.stringify(response));
                });
            })
            this.sub('join',()=>{
                let join = json;
                
            })
            // 購読されているメソッドだけ実行する
            if(typeof this.methods[json.method] == 'function'){
                console.log(json.method);
                this.methods[json.method]();
            }

            if( json.method!=null ) json.clients=this.cocClients.map(a=> a.name);


        });
        // websocketが閉じたときに呼び出される
        ws.on('close', ()=>{
            console.log("close");
            const name=this.cocClients.find(a=> a===ws).role;
            this.cocClients=this.cocClients.filter(a=> a!==ws);
            this.cocClients.forEach(a=>{ a.send(JSON.stringify({ user: name, method: 'close', clients: this.cocClients.map(a=>name) })); });
        });

    }
    // メソッドを登録するcallbackは、msgとclientを引数に持つ
    sub(method,callback){
        this.methods[method] = callback;
    }
}