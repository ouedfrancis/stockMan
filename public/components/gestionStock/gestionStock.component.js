import React, { Component } from "react";


import Produits from "../../components/gestionStock/produits.component";
import EntrepotProduits from "../../components/gestionStock/entrepotProduits.component";
import VenteProduits from "../../components/gestionStock/venteProduits.component";
import Achats from "../../components/gestionStock/achats.component";
import Utils from "../../utils/utils";
import Styles from '../../styles.module.css';
import globalObject from '../../global.js'

//import "bootstrap/dist/css/bootstrap.min.css";

//import AuthService from "../../services/auth.service";

export default class gestionStock extends Component {
  constructor(props) {
    super(props);
    let key=Utils.uuidv4();
    this.state = {
      content: "", 
      refreshTypeListe:key, 
       "typeListe":"EntrepotProduit",
         permissionEntrepot:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/GESTION_ENTREPOT"),
        permissionProduit:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/PRODUIT"),
        permissionAchat:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/COMMANDE"),
        permissionVente:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/GESTION_ENTREPOT"),


         
    };
  }

 




  render() { 
    
    const { refreshTypeListe,typeListe,permissionEntrepot,permissionProduit,permissionAchat,permissionVente} = this.state;
  
    return (   
      <div className="container">
        <header className="jumbotron">          
          <h3 className={Styles.HeaderL1} > {/*AuthService.getCurrentRole()*/} Gestion des stocks</h3>       
            

           <div id="htab1">

          

              <ul className="resp-tabs-list ht1">
                <li><select id="typeListe" name="typeListe" onChange={(e) => {
                      this.setState({typeListe: e.target.value,
                        refreshTypeListe:Utils.uuidv4()})  
                    }
            } 
            value={typeListe}
            className={`form-select form-select-sm`} style={{fontWeight:"bold"}} >
                  {permissionAchat!=null &&<option value="Commande" >Commandes de produits</option>}
                  {permissionEntrepot!=null && <option value="EntrepotProduit">Stock de produits</option>}    
                  {permissionVente!=null && <option value="VenteProduit">Prestation pharmaceutique</option>}              
                   {permissionProduit!=null &&<option value="Produit">Gestion des produits</option>} 
                   </select> 
            </li> 
            
              </ul>
              <div className="resp-tabs-container ht1">
                <div id="tab1">{
                  typeListe=="Commande"?
                <Achats key={refreshTypeListe}   />:
                typeListe=="EntrepotProduit"?
                <EntrepotProduits key={refreshTypeListe}   />:
                 typeListe=="VenteProduit"?
                <VenteProduits key={refreshTypeListe}   />:
                 typeListe=="Produit"? 
                 <Produits key={refreshTypeListe}  />:
                ""
              }
                </div>

                  
               </div>
          </div>
          
   
      </header>
       {Utils.addLibrary("/js/easyResponsiveTabs.js")}
      </div>
    );
  }
}


