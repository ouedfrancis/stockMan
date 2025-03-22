import React, { Component } from "react";


import TabLoader from "../../utils/tabLoader";
import Personnels from "../../components/gestionRH/personnels.component";
import Utils from "../../utils/utils";
import Styles from '../../styles.module.css';
import globalObject from '../../global.js'

//import "bootstrap/dist/css/bootstrap.min.css";

//import AuthService from "../../services/auth.service";

export default class Patient extends Component {
  constructor(props) {
    super(props);
    let key=Utils.uuidv4();
    this.state = {
      content: "",
      refreshPersonnel:key,
      refreshProfessionnelDeSante:key, 
      refreshTypeListe:key, 
      refreshTypePersonnel:key,
       
        permissionPersonnel:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","RH/GESTION_PERSONNEL"),
        permissionPraticien:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","RH/GESTION_PRATICIEN"),
      permissionInterne:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","RH/GESTION_PAIE_INTERNE"),
        permissionExterne:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","RH/GESTION_PAIE_EXTERNE"),
      typeListe:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","RH/GESTION_PERSONNEL")!=null?"Personnel":"Praticien",
        typePersonnel:Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","RH/GESTION_PAIE_INTERNE")!=null?"Interne":"Externe",
    };
  }

  componentDidMount() {    
  

    TabLoader.load();

  }


    refreshPersonnelInfo = () =>
    { 
    this.setState(
    {refreshPersonnel: Utils.uuidv4()})
     console.log("refreshPersonnel",this.refreshPersonnel)
  }
refreshProfessionnelDeSanteInfo = () =>
    { 
    this.setState({refreshProfessionnelDeSante: Utils.uuidv4()})
    console.log("refreshProfessionnelDeSante",this.refreshProfessionnelDeSante)
  }
handleToUpdateRH = (origine) => {
if(origine=="personnel")
   this.refreshProfessionnelDeSanteInfo()
else
  {
    this.refreshPersonnelInfo();

  }
    
}

  render() { 
    
    const { refreshPersonnel, refreshProfessionnelDeSante,refreshTypeListe,typeListe,refreshTypePersonnel,typePersonnel,
     permissionPersonnel,permissionPraticien,permissionInterne,permissionExterne} = this.state;
  
    return (   
      <div className="container">
        <header className="jumbotron">          
          <h3 className={Styles.HeaderL1} > {/*AuthService.getCurrentRole()*/} Gestion des ressources humaines</h3>       


           <div id="htab1">
              <ul className="resp-tabs-list ht1">
              {(permissionPersonnel!=null||permissionPraticien!=null)&&(
                <li><select id="typeListe" name="typeListe" onChange={(e) => {
                      this.setState({typeListe: e.target.value,
                        refreshTypeListe:Utils.uuidv4()})  
                    }
            } 
            value={typeListe}
            className={`form-select form-select-sm`} style={{fontWeight:"bold"}} >
                 {permissionPersonnel!=null &&<option value="Personnel" >Liste du personnel</option>}
                 {permissionPraticien!=null &&<option value="Praticien">Liste des Praticiens</option>}                      
                   </select> 
            </li>)}
            {(permissionInterne!=null||permissionExterne!=null)&&( 
                <li><select id="typePersonnel" name="typePersonnel" onChange={(e) => {
                      this.setState({typePersonnel: e.target.value,
                        refreshTypePersonnel:Utils.uuidv4()})  
                    }
            } 
            value={typePersonnel}
            className={`form-select form-select-sm`} style={{fontWeight:"bold"}} >
                 {permissionInterne!=null && <option value="Interne" >Gestion paie des internes</option>}
                 {permissionExterne!=null &&<option value="Externe">Gestion paie des externes</option>}                      
                   </select>
                   </li>) 
                 }
              </ul>
              
              <div className="resp-tabs-container ht1">
              {(permissionPersonnel!=null||permissionPraticien!=null)&&(
                <div id="tab1">{typeListe=="Personnel"?
                <Personnels key={refreshTypePersonnel}  handleToUpdateRH={this.handleToUpdateRH} />:
               <Personnels key={refreshTypePersonnel}   handleToUpdateRH={this.handleToUpdateRH}/>}
                </div>)}
               {(permissionInterne!=null||permissionExterne!=null)&&( 
                  <div id="tab2" >
                  {typePersonnel=="Interne"?
               
               <Personnels key={typePersonnel} personne={globalObject.personne}/>:
               <Personnels key={typePersonnel} personne={globalObject.personne}/>}
                  </div>)}

               </div>
          </div>


   
      </header>
       {Utils.addLibrary("/js/easyResponsiveTabs.js")}
      </div>
    );
  }
}


