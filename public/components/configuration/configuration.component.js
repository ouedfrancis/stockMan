
import React, { Component } from "react";



import Pays from "../../components/configuration/pays.component";
import Villes from "../../components/configuration/villes.component";
import Modeles from "../../components/configuration/modeles.component";



import Fournisseurs from "../../components/configuration/stock/fournisseurs.component";
import Entrepots from "../../components/configuration/stock/entrepots.component";
import CategorieProduits from "../../components/configuration/stock/categorieProduits.component";
import Emplacements from "../../components/configuration/stock/emplacements.component";

//import "bootstrap/dist/css/bootstrap.min.css";
import Styles from '../../styles.module.css';
import Utils from "../../utils/utils";
import globalObject from '../../global.js'

  
export default class Configuration extends Component {


  constructor(props) {
    super(props);
    this.state = {
      content: "",
      typeGenerale:"Modèles", 
       typeActe:"Type de consultations",
       typeAntecedent:"Allergies",
       typePraticien:"Catégorie de praticiens",
       typePrestation:"Assureurs",
       typeHospitalisation:"Hospitalisation",
       typeEntrepot:"Entrepot",
       typePharmacie:"Pharmacie",
        permissionGenerale:Utils.filterArrayByFieldNameAndContent(globalObject?.permissions,"ressource","CONFIGURATION/GENERALE"),
        permissionAntecedent:Utils.filterArrayByFieldNameAndContent(globalObject?.permissions,"ressource","CONFIGURATION/ANTECEDENT"),
        permissionActe:Utils.filterArrayByFieldNameAndContent(globalObject?.permissions,"ressource","CONFIGURATION/ACTE"),
        permissionPraticien:Utils.filterArrayByFieldNameAndContent(globalObject?.permissions,"ressource","CONFIGURATION/PRATICIEN"),
        permissionAssurance:Utils.filterArrayByFieldNameAndContent(globalObject?.permissions,"ressource","CONFIGURATION/ASSURANCE"),
        permissionPharmacie:Utils.filterArrayByFieldNameAndContent(globalObject?.permissions,"ressource","CONFIGURATION/PHARMACIE"),
        permissionStock:Utils.filterArrayByFieldNameAndContent(globalObject?.permissions,"ressource","CONFIGURATION/STOCK"),
        permissionHospitalisation:Utils.filterArrayByFieldNameAndContent(globalObject?.permissions,"ressource","CONFIGURATION/HOSPITALISATION"),

    };
 


  }

 

  render() { 
   const { typeGenerale,refreshGenerale,typeAntecedent,refreshAntecedent,typeActe,refreshActe
   ,typePraticien,refreshPraticien,typePrestation,refreshPrestation,typeHospitalisation,refreshHospitalisation,
   typeEntrepot,refreshEntrepot,typePharmacie,refreshPharmacie,
permissionGenerale,permissionAntecedent,permissionActe,permissionPraticien,permissionAssurance,permissionStock,permissionPharmacie,permissionHospitalisation} = this.state;
   console.log("permissionPharmacie",permissionPharmacie)
  
    return (    

      <div className="container-fluid">
             <div className="jumbotron">
            <div className="row" >
            
        <div className="col-md">
          <h3 className={Styles.HeaderL1} > {/*AuthService.getCurrentRole()*/} Configuration</h3>

        <div id="vtab1">
            <ul className="resp-tabs-list vt1">
               {permissionGenerale!=null&& <li>Générale 
                <select id="typeGenerale" name="typeGenerale" onChange={(e) => {
                      this.setState({typeGenerale: e.target.value,
                      refreshGenerale:Utils.uuidv4()}) }} 
                    value={typeGenerale}
                    className={`form-select form-select-sm`} style={{fontWeight:"bold"}} >
                  {Utils.filterArrayByFieldNameAndContent(permissionGenerale,"ressource","MODELE")!=null&&   <option value="Modèles" >Modèles</option>}
                  {Utils.filterArrayByFieldNameAndContent(permissionGenerale,"ressource","FINANCE")!=null&& <option value="Catégorie de finance">Catégorie de finance</option> }
                  {Utils.filterArrayByFieldNameAndContent(permissionGenerale,"ressource","VILLE")!=null&& <option value="Villes">Ville</option>}
                  {Utils.filterArrayByFieldNameAndContent(permissionGenerale,"ressource","PAYS")!=null&& <option value="Pays">Pays</option> }                     
                   </select>
                   </li>}
               
          
               
                
  
        {(permissionStock!=null )&&
            <li>Stock
                 <select id="typeEntrepot" name="typeEntrepot" onChange={(e) => {
                      this.setState({typeEntrepot: e.target.value,
                      refreshEntrepot:Utils.uuidv4()}) }} 
                    value={typeEntrepot}
                    className={`form-select form-select-sm`} style={{fontWeight:"bold"}} >
                   
                   {Utils.filterArrayByFieldNameAndContent(permissionStock,"ressource","ENTREPOT")!=null&&  <option value="Entrepot">Entrepots</option> } 
                   {Utils.filterArrayByFieldNameAndContent(permissionStock,"ressource","FOURNISSEUR")!=null&&  <option value="Fournisseur" >Fournisseurs</option>}
                   {Utils.filterArrayByFieldNameAndContent(permissionStock,"ressource","CATEGORIE_PRODUIT")!=null&&  <option value="CategorieProduit" >Categorie de produit</option>}
                   {Utils.filterArrayByFieldNameAndContent(permissionStock,"ressource","EMPLACEMENT")!=null&&  <option value="Emplacement" >Emplacements</option> }  
                   </select>
                </li>}

                
            </ul>
            <div className="resp-tabs-container vt1">
            {permissionGenerale!=null&&
                <div>
                  <h3 className={Styles.HeaderL2} >{typeGenerale}</h3>
                  {typeGenerale=="Modèles"?
                     <Modeles key={refreshGenerale} />:
                
                typeGenerale=="Villes"?
                     <Villes key={refreshGenerale}/>:
                typeGenerale=="Pays"?
                     <Pays key={refreshGenerale}/>:""}
                </div>}
              
                
                
                
               
               {(permissionStock!=null)&&
                <div>
                     <h3 className={Styles.HeaderL2} >{typeEntrepot}</h3>
                  { typeEntrepot=="Entrepot"?
                     <Entrepots key={refreshEntrepot} />:
                  typeEntrepot=="Fournisseur"?
                     <Fournisseurs key={refreshEntrepot}/>:
                      typeEntrepot=="CategorieProduit"?
                     <CategorieProduits key={refreshEntrepot}/>:
                      typeEntrepot=="Emplacement"?
                     <Emplacements key={refreshEntrepot}/>:""}                   
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
