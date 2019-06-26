const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
var hash='$2b$10$QZj/xSPskfPXycf7dmAqaedFNwPFzu7OslGO5bll9bGTbkNxmpDv2';
var hash2='$2b$10$bhNXMj5Sw/xwobn0oKxG.eAa4LS3Q2yV.p7EQfyaTtbi.KGYK6j9G';
// bcrypt.hash(myPlaintextPassword, saltRounds, function(err,hash){
//     hash=hash;
//     console.log(hash);
// });
// for(var i=0;i<1000;i++){}
bcrypt.compare(myPlaintextPassword,hash, (err,result)=>{
    console.log(result);
});