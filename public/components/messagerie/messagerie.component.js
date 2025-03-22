
import React, { Component } from "react";
import Messageries from "../../components/messagerie/messageries.component";
import CharRoom from "../../components/messagerie/chat.component";
import Styles from '../../styles.module.css';
import Utils from "../../utils/utils";
import globalObject from '../../global.js'


  
export default class Configuration extends Component {


  constructor(props) {
    super(props);
    this.state = {
      content: "",
       permissionEnvoi:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","MESSAGERIE/BOITE_ENVOI"),
       permissionReception:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","MESSAGERIE/BOITE_RECEPTION"),
       permissionChat:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","MESSAGERIE/CHAT"),

    };
 


  }

 

  render() { 
   const { 
permissionEnvoi,permissionReception,permissionChat} = this.state;

    return (    

      <div className="container-fluid">
             <div className="jumbotron">
            <div className="row" >
            
        <div className="col-md">
          <h3 className={Styles.HeaderL1} >Messagerie</h3>

        <div id="vtab1">
            <ul className="resp-tabs-list vt1">
              
               {permissionReception!=null&&  <li>Boîte de reception</li>}
                {permissionEnvoi!=null&& <li>Messages envoyés</li> }               
                 {permissionChat!=null&& <li>Chat</li>  }
                

            </ul>
            <div className="resp-tabs-container vt1">
                {permissionReception!=null&& 
                 <div>
                     <h3 className={Styles.HeaderL2} >Boîte de reception</h3>         
                   <Messageries origine="Reception" typeMessage="Mail" handleNewMessage={this.props.handleNewMessage} />               
                 </div>}
                 {permissionEnvoi!=null&& 
                   <div>
                     <h3 className={Styles.HeaderL2} >Messages envoyés</h3>
                     
                    <Messageries origine="Envoi" typeMessage="Mail" />
                    
                </div>}
                {permissionChat!=null&& 
                 <div>
                    <h3 className={Styles.HeaderL2} >Chat</h3>
                    <CharRoom/>
                </div>}
            </div>
        </div>
       
        </div> {Utils.addLibrary("/js/easyResponsiveTabs.js")}
        </div>
        </div>
       
      </div>
    );
  }
}
