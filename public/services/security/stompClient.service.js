
import globalObject from '../../global.js'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient =null;
class StompClientService  {



    connect (){
        let url= process.env.REACT_APP_BACKEND_URL!=""?process.env.REACT_APP_BACKEND_URL+"/clinGest/ws" : window.location.origin+"/clinGest/ws";

        let Sock = new SockJS(url);
        stompClient = over(Sock);
        stompClient.debug = null
        var thisheaders={
                    login: globalObject?.user?.username,
                   passcode: '',
                  // additional header
                  'client-id': 'my-client-id'   
                };       
        stompClient.connect(thisheaders,this.onConnected, this.onError);
        console.log("connected, session id: " + Sock.sessionId);
    }

    onConnected () {
      var chatMessage = {
            id: globalObject?.personne?.personneId,
            user:globalObject?.personne?.nom+ " "+globalObject?.personne?.prenoms,
            login:globalObject?.user?.username,
            status:"CONNECTED"
          };
          stompClient.send("/app/sessions", {}, JSON.stringify(chatMessage));
        globalObject.stompClient ={};
        globalObject.stompClient=stompClient
    }

    disconnect () {
          if(stompClient != null) {
                    stompClient.disconnect();
                    //globalObject.stompClient=null;
              }
            console.log("Disconnected");
      }
  
   onError (error) {
      console.log('STOMP: ' + error);
    //setTimeout(() =>this.connect, 5000);
    console.log('STOMP: Reconecting in 5 seconds');
          
      }

}






export default new StompClientService();
