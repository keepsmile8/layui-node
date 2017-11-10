var rf = require("fs");  
rf.readFile("config.json", 'utf-8', function(err,data){  
    if(err){  
        console.log("error");  
    }else{  
        console.log(data);  
    }  
});  
