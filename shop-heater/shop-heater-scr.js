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
          console.log("On Load=createRequest");
          /*console.log("Initial Request", data);*/
          /*console.table(data);*/
          //callback(null, data);

          //----------populate GPIO# field--------------//
        var jason  = data;

        var t2r4c2=document.getElementById("t2r4c2");t2r4c2.innerHTML =(jason[0].pin);
        var t2r4c3=document.getElementById("t2r4c3");t2r4c3.innerHTML =(jason[1].pin);
        var t2r4c4=document.getElementById("t2r4c4");t2r4c4.innerHTML =(jason[2].pin);
        var t2r4c5=document.getElementById("t2r4c5");t2r4c5.innerHTML =(jason[3].pin);
        var t2r4c6=document.getElementById("t2r4c6");t2r4c6.innerHTML =(jason[4].pin);
        var t2r4c7=document.getElementById("t2r4c7");t2r4c7.innerHTML =(jason[5].pin);
        var t2r4c8=document.getElementById("t2r4c8");t2r4c8.innerHTML =(jason[6].pin);
        var t2r4c9=document.getElementById("t2r4c9");t2r4c9.innerHTML =(jason[7].pin);
        var t2r4c10=document.getElementById("t2r4c10");t2r4c10.innerHTML =(jason[8].pin);
        var t2r4c11=document.getElementById("t2r4c11");t2r4c11.innerHTML =(jason[9].pin);
        var t2r4c12=document.getElementById("t2r4c12");t2r4c12.innerHTML =(jason[10].pin);
        var t2r4c13=document.getElementById("t2r4c13");t2r4c13.innerHTML =(jason[11].pin);
           //----------populate Duration field--------------//
        t2r2c2=document.getElementById("t2r2c2");t2r2c2.innerHTML =(jason[0].delayBeforeOff);
        t2r2c3=document.getElementById("t2r2c3");t2r2c3.innerHTML =(jason[1].delayBeforeOff);
        t2r2c4=document.getElementById("t2r2c4");t2r2c4.innerHTML =(jason[2].delayBeforeOff);
        t2r2c5=document.getElementById("t2r2c5");t2r2c5.innerHTML =(jason[3].delayBeforeOff);
        t2r2c6=document.getElementById("t2r2c6");t2r2c6.innerHTML =(jason[4].delayBeforeOff);
        t2r2c7=document.getElementById("t2r2c7");t2r2c7.innerHTML =(jason[5].delayBeforeOff);
        t2r2c8=document.getElementById("t2r2c8");t2r2c8.innerHTML =(jason[6].delayBeforeOff);
        t2r2c9=document.getElementById("t2r2c9");t2r2c9.innerHTML =(jason[7].delayBeforeOff);
        t2r2c10=document.getElementById("t2r2c10");t2r2c10.innerHTML =(jason[8].delayBeforeOff);
        t2r2c11=document.getElementById("t2r2c11");t2r2c11.innerHTML =(jason[9].delayBeforeOff);
        t2r2c12=document.getElementById("t2r2c12");t2r2c12.innerHTML =(jason[10].delayBeforeOff);
        t2r2c13=document.getElementById("t2r2c13");t2r2c13.innerHTML =(jason[11].delayBeforeOff);
        hh=document.getElementById("hh");hh.innerHTML =(jason[0].strt);
        mm=document.getElementById("mm");mm.innerHTML =(jason[1]).strt;

        }
    }
  );  getWeek();
}

function getWeek() {
     sendRequest(
   'http://47.24.20.103:5922/week',
   'get',
   null,
   null,
   function(err, data) {
        if (err) {
          console.log(err);
           //callback(err);
         } else {
          console.log("Get Week");

        var switch1= data;
        var switch1=document.getElementById('switch1');

        //-------The following needs work---------
         if (switch1.checked){
           switch1.setAttribute('checked','true')
           console.log("shop-heater-scr.js  Switch1 is checked.");
         }

      }
    }
  ); getStatus();
 }


function getLog() {
      sendRequest(
   'http://47.24.20.103:5922/log',
   'get',
   null,
   null,
   function(err, data) {
        if (err) {
          console.log(err);
           //callback(err);
         } else {
          console.log("Get Log0",data);
          logData=data;
          //callback(null, data);
        var p1=document.getElementById("p1");p1.innerHTML =(logData);

        /*console.log(p1);*/


        }
    }
  );
}

function getLog1() {
  sendRequest(
'http://47.24.20.103:5922/log1',
'get',
null,
null,
function(err, data) {
    if (err) {
      console.log(err);
       //callback(err);
     } else {
      console.log("Get Log1",data);
      logData=data;
      //callback(null, data);
    var p1=document.getElementById("p1");p1.innerHTML =(logData);

    console.log(p1);


      }
    }
  );
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
      console.log("Raw Temp",data);

      //callback(null, data);
      if (data.length > 4) {
        trimdata= data.substr(0, 4);
      }else{
        trimdata = data;
      }

      var t1=document.getElementById("t1");t1.innerHTML =(trimdata);
      var sw1=document.getElementById('switch1');sw1.innerHTML;

      if (trimdata>70.0 && sw1.checked){
        var p1=document.getElementById('p1');p1.innerHTML;
        p1.style.display ='block';
      }else{
        var p1=document.getElementById('p1');p1.innerHTML;
        p1.style.display='none';
      }
      console.log(t1);
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
         } else {
          console.log("Get Status");
          /*console.log("Get Status", data);*/
          /*console.table(data);*/
          //callback(null, data);

          //----------populate GPIO# field--------------//
        var status = data;

        var z1status=document.getElementById("z1status");z1status.innerHTML =status[0];
        var z2status=document.getElementById("z2status");z2status.innerHTML =status[1];
        var z3status=document.getElementById("z3status");z3status.innerHTML =status[2];
        var z4status=document.getElementById("z4status");z4status.innerHTML =status[3];
        var z5status=document.getElementById("z5status");z5status.innerHTML =status[4];
        var z6status=document.getElementById("z6status");z6status.innerHTML =status[5];
        var z7status=document.getElementById("z7status");z7status.innerHTML =status[6];
        var z8status=document.getElementById("z8status");z8status.innerHTML =status[7];
        var z9status=document.getElementById("z9status");z9status.innerHTML =status[8];
        var z10status=document.getElementById("z10status");z10status.innerHTML =status[9];
        var z11status=document.getElementById("z11status");z11status.innerHTML =status[10];
        var z12status=document.getElementById("z12status");z12status.innerHTML =status[11];

        }
    }
  );
}

function postHrsMins(){
  var data=hm;
  console.log("postHrsMins - "+hm);
  sendRequest(
    'http://47.24.20.103:5922/hm1',
       'post',
       'application/json',
        JSON.stringify(data),
     function(err, data) {
       if (err) {
         console.log(err,data);
         //callback(err);
      } else {
        console.log('Get Hours, Mins', JSON.stringify(data));
        //callback(null, data);
        }
       }
    );
}

function postStatus(){
  var data=[0];
  //console.log("postHrsMins - "+hm);
  sendRequest(
    'http://47.24.20.103:5922/postStat',
       'post',
       'application/json',
        JSON.stringify(data),
     function(err, data) {
       if (err) {
         console.log(err,data);
         //callback(err);
      } else {
        console.log('Post Status', JSON.stringify(status));
        //callback(null, data);
        }
       }
    );
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
        console.log('Manual Mode', mnarr);
        //callback(null, data);
        }
      }
  );
}

function postDays(){
  var data=(wkarr);
  sendRequest(
    'http://47.24.20.103:5922/days',
       'post',
       'application/json',
        JSON.stringify(data),
     function(err, data) {
       if (err) {
         console.log(err,data);
         //callback(err);
      } else {
        console.log('Post days', data);
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

function hrsMins(){
  hm=[];
  var h=[];
  var m=[];
  var hr=0;
  var min=0;
  var l=0;
  var object={hr:h[l],min:m[l]};
    hm.push(object);
          //console.log(hm[0].hr+":"+hm[0].min);
          postHrsMins(hm);
}

function zoneArray(){
  var pin=0;
  var delayBeforeOff=0;
  zonz=[];
   y=[];
   var d=[];
   var h=[];
   var m=[];
   var s=[];

     //------prepare to build pin: object-----------
     y[0]=document.getElementById("r1man").innerHTML;
     y[1]=document.getElementById("t2r4c3").innerHTML;
     y[2]=document.getElementById("t2r4c4").innerHTML;
     y[3]=document.getElementById("t2r4c5").innerHTML;
     y[4]=document.getElementById("t2r4c6").innerHTML;
     y[5]=document.getElementById("t2r4c7").innerHTML;
     y[6]=document.getElementById("t2r4c8").innerHTML;
     y[7]=document.getElementById("t2r4c9").innerHTML;
     y[8]=document.getElementById("t2r4c10").innerHTML;
     y[9]=document.getElementById("t2r4c11").innerHTML;
     y[10]=document.getElementById("t2r4c12").innerHTML;
     y[11]=document.getElementById("t2r4c13").innerHTML;

     //------prepare to build duration object---------
     d[0]=document.getElementById("t2r2c2").innerHTML;
     d[1]=document.getElementById("t2r2c3").innerHTML;
     d[2]=document.getElementById("t2r2c4").innerHTML;
     d[3]=document.getElementById("t2r2c5").innerHTML;
     d[4]=document.getElementById("t2r2c6").innerHTML;
     d[5]=document.getElementById("t2r2c7").innerHTML;
     d[6]=document.getElementById("t2r2c8").innerHTML;
     d[7]=document.getElementById("t2r2c9").innerHTML;
     d[8]=document.getElementById("t2r2c10").innerHTML;
     d[9]=document.getElementById("t2r2c11").innerHTML;
     d[10]=document.getElementById("t2r2c12").innerHTML;
     d[11]=document.getElementById("t2r2c13").innerHTML;

     //----------Populate start hours, minutes-------------
     s[0]=document.getElementById("hh").innerHTML;
     s[1]=document.getElementById("mm").innerHTML;

   for(n=0;n<12;n++){
     var object={pin:y[n],delayBeforeOff:d[n],strt:s[n]};
       zonz.push(object);
     }
      console.log("Zone Array");
      postZones();
        //console.log(JSON.stringify(zonz));
 }


function makeWeek(){
  var x=document.getElementsByClassName("week");
  wkarr=[];
    for(i=0;i<7;i++){
      if(x[i].checked){
        wkarr.push(x[i].value);
      }
    }
       console.log("Make Week");
    /*console.log(wkarr);*/
        postDays();
}

function manualMode(){
  var x=document.getElementsByClassName("manual");
    var mnarr=[];
    var y=[];
     y[0]=document.getElementById("t2r4c2").innerHTML;
     y[1]=document.getElementById("t2r4c3").innerHTML;
     y[2]=document.getElementById("t2r4c4").innerHTML;
     y[3]=document.getElementById("t2r4c5").innerHTML;
     y[4]=document.getElementById("t2r4c6").innerHTML;
     y[5]=document.getElementById("t2r4c7").innerHTML;
     y[6]=document.getElementById("t2r4c8").innerHTML;
     y[7]=document.getElementById("t2r4c9").innerHTML;
     y[8]=document.getElementById("t2r4c10").innerHTML;
     y[9]=document.getElementById("t2r4c11").innerHTML;
     y[10]=document.getElementById("t2r4c12").innerHTML;
     y[11]=document.getElementById("t2r4c13").innerHTML;

      for(i=0;i<12;i++){
        var object={pin:y[i]};
          if(x[i].checked){
             mnarr.push(object);
             }
        }
          console.log("mnarr = "+ mnarr);
        /*console.log(mnarr);*/
          postManual(mnarr);
          getStatus();
}

function logs(){
  window.open('./jeff.html', "./jeff.html", 'width=490,height=550,left=50,top=100,scrollbars=yes');
  console.log("Pop-up opened!");
}

function decide(){
   var b=document.getElementById("0");
   var c=document.getElementById("1");
   var d=document.getElementById("2");

   console.log("Decide function called. "+ b.checked);

   if (b.checked == true){
     console.log("Test0 selected");
    getLog();
   }
   if (c.checked == true){
     console.log("Test1 selected");
     getLog1();
   }
   if (d.checked == true){
     console.log("Test2 selected");
     getLog2();
   }
}


