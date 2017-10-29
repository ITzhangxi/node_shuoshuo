const crypto = require('crypto');
function md5 (pwd){
    let md5 = crypto.createHash('md5');
    let password = md5.update(pwd).digest('base64');
    return password;
};
module.exports = function(pwd){
    return md5(md5(pwd) + 'zhangxi');
}