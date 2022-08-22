(function(){  
    var apiUrl = "http://139.155.90.110:8080"; 
    window.addEventListener("load",function(){	
        var form = document.forms["wpforms-form-152"];
        var bt = document.getElementById('submitBt');
        bt.onclick = function(e){      
         var obj = {};  
       obj.name = form["name"].value;
       obj.update_datetime = form["update_datetime"].value;
       obj.email = form["email"].value;
       obj.phone_number = form["phone_number"].value;
       obj.your_message = form["your_message"].value;
       obj.follow_up_status = 1;  
       var dt = new Date();
       obj.update_datetime = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();                        
       jQuery.ajax({url:apiUrl+"/api/customer_feedback/",type:"POST",contentType:"application/json",data:JSON.stringify(obj),success:function(e){
         if(e.code==200||e.code==2000)
         {
           alert("提交成功");        
         }
         else
         {
           alert("提交失败");
         }
   
       }});  
       };
    });
})();