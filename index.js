const path=require('path');
const express=require('express');
const app=express();



// ポートはheroku用の環境変数とローカル用の手動を設定しておく
app.set('port', process.env.PORT || 5050);
// '/public/'以下を静的ファイルの置き場所に指定
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), ()=>{ console.log("Node app is running at localhost:" + app.get('port')); });

const log=require('./src/log');
app.use(log.access.add); // accessログに記録するためのミドルウェア

// JSON形式でリソースログを返すAPI
app.get('/log/usage', (req, res)=>{ res.send(log.usage.get()) }); 
// JSON形式でアクセスログを返すAPI
app.get('/log/access', (req, res)=>{ res.send(log.access.get()) }); 
