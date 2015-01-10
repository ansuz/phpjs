var http=require("http");
var fs=require("fs");

var readAndDo=function(path,f){
  fs.readFile(path,'utf8',function(err,data){
    if(err)console.log(err);
    else f(data);
  });
};

var route=function(req,res){
  readAndDo('index.phpjs',function(erm){
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
  });
};  

var server=http.createServer(route);
server.listen(8080);
