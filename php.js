var http=require("http");
var fs=require("fs");
var ansuz=require("ansuz");
var marked=require("marked");
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
  var debug=opt.debug||false;
  var wait=opt.wait||false;
  var retouch=opt.retouch||function(body){
    return body.replace(/<\?md(.|\s)*?md\?>/mg,
      function(x){
        return marked(x.slice(4,-5));
      })
  };

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
          php.body+=erm.replace(/<\?js(.|\s)*?js\?>/mg,function(x){
            var id=php.id='{PHPJS'+(C++)+'}';
            php.response[id]="";
            var echo=function(x){
              php.response[id]+=x;
              if(debug)console.log(x);
              return x;
            };
            try{
              var FUNCTION_BODY=x.slice(4,-5);
              if(debug)console.log(FUNCTION_BODY);
              eval(FUNCTION_BODY); // eval blocks
              // its processes may not, use php.wait=true
            }catch(err){
              console.log('ERR: '+err);
            }
            php.response[id];
            return id;  
          });
        if(!php.wait){  
          res.end(retouch(ansuz.swap(php.body,php.response)));
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
