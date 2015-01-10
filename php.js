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
  var F404=function(req,res){
    res.end('404');
  };

  return function(req,res,next){
    var target=path+(req.url.slice(1)||def);
    fs.exists(target,function(e){
      if(!e)return (next||F404)(req,res);
      else{
        readAndDo(target,function(erm){
          var C=0;
          var O={};
          console.log('\n'+target);
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
        });
      }
    });
  };
};

if(!module.parent){
  var server=http.createServer(main({path:'views/'}));
  server.listen(8080);
}else{
  console.log("exporting self");
  module.exports=php;
}
