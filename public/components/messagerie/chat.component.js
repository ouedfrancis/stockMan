import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import globalObject from '../../global.js'
import Utils from "../../utils/utils";
import SocketUserRegistrysDataService from "../../services/messagerie/socketUserRegistrys.service";
import ChatMessagesDataService from "../../services/messagerie/chatMessages.service";
var stompClient =null;
const ChatRoom = (props) => {
    //const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab,setTab] =useState("CHATROOM");
    const [chatData, setChatData] = useState({
        emeteurId:globalObject?.personne?.personneId , //globalObject?.user?.username,
        emeteur: globalObject?.personne?.nom+" "+globalObject?.personne?.prenoms,//globalObject?.user?.username,
        destinataireId: '',
        destinataireName:'',
        connected: false,
        message: '',
        dateCreation:''
      });
    const [chatUsers, setChatUsers] = useState(new Map()); 
      const [chatMessages, setChatMessages] = useState([]); 
    /* const [chatUser, setChatUser] = useState({
        id: '', //globalObject?.personne?.personneId,
        login: '',//globalObject?.user?.username,
        user:'', //globalObject?.personne?.nom //globalObject?.personne?.prenoms
        sessionId: '',
        messages:[],
        status: '',
        
      });*/
    useEffect(() => {

      console.log(chatData);
      if(globalObject.stompClient!=null)
      {
        stompClient=globalObject.stompClient;
        subscribe()
      }
    }, []);

  /*  const connect =(username)=>{
        let url= process.env.REACT_APP_BACKEND_URL!=""?process.env.REACT_APP_BACKEND_URL+"/clinGest/ws" : window.location.origin+"/clinGest/ws";

        let Sock = new SockJS(url);

        stompClient = over(Sock);
        stompClient.debug = null
        var thisheaders={
                    login: globalObject?.user?.username,
                   passcode: '',
                  'client-id': 'my-client-id'
                      
                };
       
        stompClient.connect(thisheaders,onConnected, onError);
        console.log("connected, session id: " + Sock.sessionId);
    }
     const disconnect=()=> {
                if(stompClient != null) {
                    stompClient.disconnect();
                }
                setChatData({...chatData,"connected": false});
                console.log("Disconnected");
            }
            */

    const subscribe = () => {
        setChatData({...chatData,"connected": true});
        stompClient.subscribe('/sessions', onConnexionMessageReceived);
        stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
        stompClient.subscribe('/users/'+chatData.emeteurId+'/chat', onPrivateMessageReceived);
         stompClient.subscribe('/users/'+chatData.emeteurId+'/chat/lu', onMessageRead);
       // userJoin();
        retrieveUsersAndChatMessages();
    }

   
   /* const userJoin=()=>{
          var chatMessage = {
            id: globalObject?.personne?.personneId,
            user:globalObject?.personne?.nom+ " "+globalObject?.personne?.prenoms,
            login:globalObject?.user?.username,
            status:"CONNECTED"
          };
          stompClient.send("/app/sessions", {}, JSON.stringify(chatMessage));
    }*/

    const onConnexionMessageReceived = (payload)=>{
       // console.log("payload",payload)
        var payloadData = JSON.parse(payload.body);     
        retrieveSocketUserRegistry()
        let messages=getMessages()
         console.log("onConnexionMessageReceived-chatUsers",chatUsers);

    }
    const onPublicMessageReceived = (payload)=>{
      //  console.log("payload",payload)
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.destinataireId){
            case "CHATROOM":
              /*if(tab=="CHATROOM")
               {
                payloadData.lu=true
                ChatMessagesDataService.updateAsync(payloadData.chatMessageId,payloadData)
               }*/
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
            break;
        }
        console.log("onPublicMessageReceived-publicChats",publicChats);
    }
    
    const onMessageRead = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        let user=chatUsers.get(payloadData.emeteurId)
        const index = user.messages.findIndex(msg => msg.chatMessageId===payloadData.chatMessageId);
        //user.messages[index].lu = true;
         user.messages[index]=payloadData
        chatUsers.set(payloadData.emeteurId,user);
        setChatUsers(new Map(chatUsers));
        console.log("onMessageRead-chatUsers",chatUsers);

        }
    const onPrivateMessageReceived = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
           if(payloadData.destinataireId==tab)
           {
            payloadData.lu=true
            ChatMessagesDataService.updateAsync(payloadData.chatMessageId,payloadData)
           }
        let user=chatUsers.get(payloadData.emeteurId)
        if(user){
            user.messages.push(payloadData)
            chatUsers.set(payloadData.emeteurId,user);
            setChatUsers(new Map(chatUsers));
        }else{
            
            let user={}
            user.id=payloadData.emeteurId
            user.user=payloadData.emeteur
           // user.login=payloadData.emeteurId
            user.messages=[]
            user.messages.push(payloadData);
            user.status="CONNECTED"
            user.sessionId=""
            chatUsers.set(payloadData.emeteurId,user);
            setChatUsers(new Map(chatUsers));
        }

        console.log("onPrivateMessageReceived-chatUsers",chatUsers);
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setChatData({...chatData,"message": value});
    }
    const sendValue=()=>{
            if (stompClient) {
              var chatMessage = {
                emeteurId: chatData.emeteurId,
                emeteur: chatData.emeteur,
                message: chatData.message,
                destinataireId:tab,
                //status:"MESSAGE",
                lu:true,
                dateCreation: Utils.currentDateTime()
              };
              console.log(chatMessage);
              stompClient.send("/app/public-chat", {}, JSON.stringify(chatMessage));
              setChatData({...chatData,"message": ""});
            }
          
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            emeteurId: chatData.emeteurId,
            emeteur: chatData.emeteur,
            destinataireId:tab,
            message: chatData.message,
            status:"MESSAGE",
            dateCreation: Utils.currentDateTime()
          };
          
          if(chatData.emeteurId !== tab)
          {
            let user=chatUsers.get(tab)
            if(user){
                user.messages.push(chatMessage)
                chatUsers.set(tab,user);
                setChatUsers(new Map(chatUsers));
                /* console.log("sendPrivateValue-chatUsers",chatUsers);
                 chatUsers.forEach ((user, index)=>(
                    console.log("==========>>>user :"+user.id+" login:"+user.login))
                 )*/
            }
          }
          stompClient.send("/app/private-chat", {}, JSON.stringify(chatMessage));
          setChatData({...chatData,"message": ""});
        }
    }

  

    const getMessages=(id)=>{
       let user=chatUsers.get(id)
       /*chatUsers.forEach ((user, index)=>(
                    console.log("==========>>>user :",user)
                    )
                 )
      console.log("getMessages============>ID",id)
      console.log("getMessages============>user:",user)*/
      if(user!=null)
       {
        console.log("getMessages============>",user.messages)
        return user.messages
       } 
      else
        return []
    }


    async function retrieveSocketUserRegistry (){      
      let resp=null;
      let query="";
      query=`?status=CONNECTED`;
      resp= await SocketUserRegistrysDataService.findAsync(query);  
      if(resp!=null && resp.status=="200" )          
          {
            for(let elt of resp.data)
            {
               let obj={}
               obj=elt
            obj.messages=[]    
            chatUsers.set(obj.id,obj);
            console.log("user===========>",obj)
            }
             setChatUsers(new Map(chatUsers));
             return await resp.data
          }

    }


     async function retrieveUsersAndChatMessages ()
    {   
      let resp=null;
      let query="";
      query=`?status=CONNECTED`;
       query=``;
      resp= await SocketUserRegistrysDataService.findAsync(query);  
      if(resp!=null && resp.status=="200" )          
        {
            
            query=`?emeteurOrdestinataireId=${chatData.emeteurId}`;
            let chatMessages=await retrieveChatMessages(query);
            for(let elt of resp.data)
            {
               let obj={}
               obj=elt
               let messages=chatMessages.filter(item => (item.emeteurId==elt.id || item.destinataireId==elt.id));
               obj.messages=messages; 
               //obj.messages=[]  
               chatUsers.set(obj.id,obj);
               console.log("user===========>",obj)
            }
             setChatUsers(new Map(chatUsers));
        }

    }

    async function retrieveChatMessages (query){ 
      let resp=null;
      
      resp= await ChatMessagesDataService.findAsync(query);  
      if(resp!=null && resp.status=="200" )          
          {        
             return await resp.data;
          }
          return await []
    }
    async function onClickTab (tab){ 

      if(tab=="CHATROOM")
        console.log("MAJ des messages dans CHATROOM")
        else
        {
            let user=chatUsers.get(tab)
            let messages=user.messages.filter(item => (item.lu==false));
           for(let elt of messages)
           {
             elt.lu=true
              console.log("message to update",elt)
            ChatMessagesDataService.updateAsync(elt.chatMessageId,elt)
           }
        }
        setTab(tab)

    }
    return (
    <div className="container">
        {chatData.connected&&
        <div className="chat-box">
            
        <aside>
        {(chatUsers.size>0) &&(
            <div className="chat-card-container">
              <div className="chat-top-card">
                <img  src="/img/avatar_2x.png" />
                
              </div>
              <div className="chat-bottom-card">
                  <h2>{chatUsers.get(chatData.emeteurId).user}</h2>
                <span className={`status ${chatUsers.get(chatData.emeteurId).status=="CONNECTED"?"green":"orange"}`}></span>
                 <h3>{(chatUsers.get(chatData.emeteurId).status=="CONNECTED"?"En ligne":"Hors ligne")} </h3>                  
              </div>
            </div>
       )}
        
         {/*(chatUsers.size>0) &&(
          <ul> 
         <li>
            
                <div>
                    <h2>{chatUsers.get(chatData.emeteurId).user}</h2>
                    <h3>
                        <span className={`status ${chatUsers.get(chatData.emeteurId).status=="CONNECTED"?"green":"orange"}`}></span>
                        {(chatUsers.get(chatData.emeteurId).status=="CONNECTED"?"En ligne":"Hors ligne")}
                    </h3>
                </div>
            </li>
        </ul> )*/}
         <header>
            <input type="text" placeholder="search"/>
        </header>
        <ul>
         <li onClick={()=>{setTab("CHATROOM")}} className={`${tab==="CHATROOM" && "active"}`}>
                <img src="/img/avatar_2x.png" alt=""/>
                <div>
                    <h2>Tous  </h2>
                    <h3>
                        <span className={`status green`}></span>
                        En ligne
                    </h3>
                </div>
            </li>
         {[...chatUsers].map(([key, user])=>(
            (user.id!==chatData.emeteurId) &&(
            <li onClick={()=>{onClickTab(user.id)}} className={`${tab===user.id && "active"}`} key={key}>
                <img src="/img/avatar_2x.png" alt=""/>
                <div>
                    <h2>{user.user}</h2>
                    <h3>
                        <span className={`status ${user.status=="CONNECTED"?"green":"orange"}`}></span>
                        {(user.status=="CONNECTED"?"En ligne":"Hors ligne")}
                    </h3>
                </div>
            </li>)
             ))}
        </ul>
        </aside>
        <main>
        <header>
            <img src="/img/avatar_2x.png" alt=""/>
            <div>
                <h2>{tab==="CHATROOM"?"Tous":chatUsers.get(tab)?.user}</h2>
                <h3>{tab==="CHATROOM"?publicChats?.length:(chatUsers.get(tab)?.messages?.length)} messages</h3>
            </div>
            
        </header>

        
            {tab==="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                        <li className={`bubble ${chat.emeteurId === chatData.emeteurId ? "bubble-right":"bubble-left"}`} key={index}>
                            {/*chat.emeteurId !== chatData.emeteurId && <div className="avatar">{chat.emeteurId}</div>*/}
                            <div className="message-data">
                            <b>{chat.emeteur}</b> <br/>{chat.message}<br/>
                             <p className="text-secondary text-end">{chat?.dateCreation.replace(" ", " à ").slice(0,-3)} </p>
                            </div>
                            {/*chat.emeteurId === chatData.emeteurId && <div className="avatar self">{chat.emeteurId}</div>*/}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <textarea type="text" className="input-message" placeholder="Entrer le message" value={chatData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendValue}>Envoyer</button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {getMessages(tab).map((chat,index)=>(
                        <li className={`bubble ${chat.emeteurId === chatData.emeteurId ? "bubble-right":"bubble-left"}`} key={index}>
                            <div className="message-data">
                            {/*<b>{chat.emeteur}</b><br/>*/}
                            {chat.message}<br/>
                             <p className="text-secondary text-end">{chat?.dateCreation.replace(" ", " à ").slice(0,-3)} {chat.lu==true&&<>&#10003;</>}</p>
                            </div>
                    </li>
                    ))}
                </ul>

                <div className="send-message">
                    <textarea type="text" className="input-message" placeholder="Entrer le message" value={chatData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendPrivateValue}>Envoyer</button>
                </div>
            </div>}
       
        </main> 
      </div>
        /*:
        <div className="register">
            <input
                id="user-name"
                placeholder="Enter your name"
                name="userName"
                value={chatData.emeteurId}
                onChange={handleUsername}
                margin="normal"
              />
              <button type="button" onClick={registerUser}>
                    connect
              </button> 
        </div>*/
     }
    </div>
    )
}

export default ChatRoom
