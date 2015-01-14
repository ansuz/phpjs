var http=require("http");
var fs=require("fs");
var $=require("ansuz");
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
  var wait=opt.wait||false;

  return function(req,res,next){
    var target=path+(req.url.slice(1)||def);
    fs.exists(target,function(e){
      if(!e)return (next||F404)(req,res);
      else{
        readAndDo(target,function(erm){
          var php={
            wait:wait
            ,response:{}
            ,body:""
            ,end:function(){
              res.end($.swap(php.body,php.response));
            }
          };
          var C=0;
          php.body+=erm.replace(/<\?js(.|\s)*?\?>/mg,function(x){
            var id=php.id='{PHPJS'+(C++)+'}';
            php.response[id]="";
            var echo=function(x){
              php.response[id]+=(x+'\n');
              console.log(x);
              return x;
            };
            try{
              eval(x.slice(4,-3)); // eval blocks
              // its processes may not, use php.wait=true
            }catch(err){
              console.log('ERR: '+err);
            }
            php.response[id];
            return id;  
          });
        if(!php.wait){  
          res.end($.swap(php.body,php.response));
        }
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
