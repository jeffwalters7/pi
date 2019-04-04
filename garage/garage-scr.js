function sendRequest(endpoint, type, contentType, data, callback) {
  var x = new XMLHttpRequest();
  x.open(type, endpoint);
  x.addEventListener('load', function(data) {
    if (data.currentTarget.status === 200) {
      if (data.currentTarget.responseText.length > 0) {
        if (x.getResponseHeader('Content-Type')) {
          if (x.getResponseHeader('Content-Type').indexOf('application/json') !== -1) {
            var response = {};
            try {
              response = JSON.parse(data.currentTarget.responseText);
            } catch(e) {
              return callback(e);
            }

            callback(null, response);
          } else {
            callback(null, data.currentTarget.responseText);
          }
        } else {
          callback(null, data.currentTarget.responseText);
        }
      } else {
        callback(null, data.currentTarget.responseText);
      }
    } else {
      callback(new Error('invalid response code: ' + data.currentTarget.status + ', ' + data.currentTarget.statusText));
    }
  });

  x.addEventListener('error', function(data) {
    callback(data);
  });

  if (contentType !== null) {
    x.setRequestHeader('Content-Type', contentType);
  }

  if (data !== null) {
    x.send(data);
  } else {
    x.send();
  }
}

function createRequest() {
    sendRequest(
   'http://47.24.20.103:5922/',
   'get',
   null,
   null,
   function(err, data) {
        if (err) {
          console.log(err);
           //callback(err);
         } else {
            console.log("Initial Request", JSON.stringify(data));
            /*console.table(data);*/

            //----------populate GPIO# field--------------//
            var jason  = data;

            document.getElementById("pin1").innerHTML =(jason[0].pin);
            document.getElementById("pin2").innerHTML =(jason[1].pin);
            document.getElementById("pin3").innerHTML =(jason[2].pin);
            document.getElementById("pin4").innerHTML =(jason[3].pin);
            document.getElementById("pin5").innerHTML =(jason[4].pin);
            document.getElementById("pin6").innerHTML =(jason[5].pin);
            document.getElementById("pin7").innerHTML =(jason[6].pin);

        }
    }
  );
     getStatus();

}

function getTemp() {
  sendRequest(
'http://47.24.20.103:5922/temp',
'get',
null,
null,
function(err, data) {
    if (err) {
      console.log(err);
       //callback(err);
     } else {
        console.log("scr - RawTemp",data);
        console.log('Temp is array? '+ Array.isArray(data));

        document.getElementById("t1").innerHTML =data[0];
        document.getElementById("t2").innerHTML =data[1];
      }
    }
  );
}

function getStatus() {
    sendRequest(
   'http://47.24.20.103:5922/getStatus',
   'get',
   null,
   null,
    function(err, data) {
        if (err) {
          console.log(err);
           //callback(err);
         }else{
            //console.log("Get Status");
            console.log("Pin Status = "+ data);
            /*console.table(data);*/
            //callback(null, data);

            //----------populate GPIO# field--------------//
           var status = data;
            console.log('Array? '+ Array.isArray(data));
            document.getElementById("input1").innerHTML =status[0];
            document.getElementById("input2").innerHTML =status[1];
            document.getElementById("miscOut1").innerHTML =status[2];
            document.getElementById("miscOut2").innerHTML =status[3];
            document.getElementById("relay1").innerHTML =status[4];
            document.getElementById("relay2").innerHTML =status[5];
            //document.getElementById("relay3").innerHTML =status[6];

           if(status[4]==false){
             document.getElementById("b2").innerHTML="Htr on";
           }else{
             document.getElementById("b2").innerHTML="Htr off";
           }
        }
    });
      getTemp();
  }

function postManual(mnarr){
  var data=(mnarr);
  sendRequest(
    'http://47.24.20.103:5922/manual',
       'post',
       'application/json',
        JSON.stringify(data),
     function(err, data) {
      if (err) {
         console.log(err,mnarr);
         //callback(err);
      } else {
        console.log('postManual - ', JSON.stringify(mnarr));
        //callback(null, data);
      }
     }
  );
}

function postMomentary(){
  var data=({'pin':'40'});
  sendRequest(
    'http://47.24.20.103:5922/momentary',
       'post',
       'application/json',
        JSON.stringify(data),
     function(err, data) {
      if (err) {
         console.log(err,data);
         //callback(err);
      } else {
        console.log('postMomentary - ', JSON.stringify(data));
        //callback(null, data);
      }
     }
  );
}

function postZones(){
  var data=(zonz);
  sendRequest(
    'http://47.24.20.103:5922/zones',
       'post',
       'application/json',
        JSON.stringify(data),
     function(err, data) {
       if (err) {
         console.log(err,data);
         //callback(err);
      } else {
        console.log('Post Zones');
        /*console.log('Post Zones',data);*/
        /*console.table(data);*/
     }
    }
  ); makeWeek();
}

function manualMode(){
  var y=[];
  var x=document.getElementsByClassName("manual");
  var mnarr=[];
  y[0]=document.getElementById("pin3").innerHTML;
  y[1]=document.getElementById("pin4").innerHTML;
  y[2]=document.getElementById("pin5").innerHTML;
  y[3]=document.getElementById("pin6").innerHTML;
  //y[4]=document.getElementById("pin7").innerHTML;

  for(i=0;i<4;i++){
    var object={pin:y[i]};
    if(x[i].checked == true) {
       mnarr.push(object);
       console.log("manual Mode: " + mnarr);
    }
       //console.log('inside manualMode: '+ mnarr);
  }
   /*console.log('Mnarr = '+ JSON.stringify(mnarr));
   if(mnarr[0].pin==40){
     console.log('Mnarr manualMode = '+mnarr);
     postMomentary();
   }else{
     console.log('Else----->');
     postManual(mnarr);
   }*/
   postManual(mnarr);
   getStatus();
}
