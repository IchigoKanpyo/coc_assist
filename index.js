const path=require('path');
const express=require('express');
const app=express();

// ポートはheroku用の環境変数とローカル用の手動を設定しておく
app.set('port', process.env.PORT || 5050);
// '/public/'以下を静的ファイルの置き場所に指定
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), ()=>{ console.log("Node app is running at localhost:" + app.get('port')); });