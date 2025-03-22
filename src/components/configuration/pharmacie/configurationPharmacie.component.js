
import React, { Component } from "react";



import Pharmacies from "../../../components/configuration/pharmacie/pharmacies.component";

import Styles from '../../../styles.module.css';
import Utils from "../../../utils/utils";
import Actes from "../../../components/configuration/actes.component";

  
export default class Configuration extends Component {


  constructor(props) {
    super(props);
    this.state = {
      content: "", 
    };
 


  }

 

  render() { 
  
    return (    

      <div className="container-fluid">
             <div className="jumbotron">
            <div className="row" >
            
        <div className="col-md">
          <h3 className={Styles.HeaderL1} > {/*AuthService.getCurrentRole()*/} Configuration / Hospitalisation</h3>

        <div id="vtab1">
            <ul className="resp-tabs-list vt1">
               <li>Pharmacie</li>
                <li>Gestion des pharmacies</li>
                


            </ul>
            <div className="resp-tabs-container vt1">
                    <div>
                     <h3 className={Styles.HeaderL2} >Hospitalisation</h3>
                    
                      <Actes typeActe="Hospitalisation" titleActe="type d'hospitalisation"/>
                </div>
                 <div>
                     <h3 className={Styles.HeaderL2} >Lit</h3>
                    <Pharmacies/>
                </div>
                   

            </div>
        </div>
       
        </div> {Utils.addLibrary("/js/easyResponsiveTabs.js")}
        </div>
        </div>
       
      </div>
    );
  }
}
