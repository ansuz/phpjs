var http=require("http");
var fs=require("fs");
var php={};

var readAndDo=php.readAndDo=function(path,f){
  fs.readFile(path,'utf8',function(err,data){
    if(err)console.log(err);
    else f(data);
  });
  return '';
};

var main=php.main=function(opt){
  opt=opt||{};
  var path=opt.path||"";
  var def=opt.def||'index.phpjs';

  return function(req,res){
    console.log(readAndDo(path+(req.url.slice(1)||def),function(erm){
      var C=0;
      var O={};
      res.end(erm.replace(/<\?js(.|\s)*?\?>/mg,function(x){
        var R="";
        var echo=function(x){
          R+=(x+'\n');
          console.log(x);
          return x;
        };
        eval(x.slice(4,-3));
        return R;  
      }));
    }));
  };
};

if(!module.parent){
  var server=http.createServer(main({path:'views/'}));
  server.listen(8080);
}else{
  module.exports=php;
}
