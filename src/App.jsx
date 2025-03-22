import React, { Component } from "react";
import { Routes, Route, Link,NavLink,useParams    } from "react-router-dom";
import {NotificationContainer} from 'react-notifications';
//import './css/react-notifications/react-notifications.css';
//import { Form, FormControl } from 'react-bootstrap';

import "./App.css";
// import the library
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import your icons
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

//import SideBar from "./components/sidebar.component";
import AuthService from "./services/security/auth.service";
import EntrepriseDataService from "./services/entreprise.service";
import PermissionsDataService from "./services/security/permissions.service";
import PersonnelsDataService from "./services/personnels.service.js";
import Produits from "./components/gestionStock/produits.component.js";
import Login from "./components/login.component";
import Password from "./components/password.component";
//import Register from "./components/register.component";
import Help from "./components/help.component";
import GestionRH from "./components/gestionRH/gestionRH.component";
import EntrepotProduits from "./components/gestionStock/entrepotProduits.component.js";
import Messagerie from "./components/messagerie/messagerie.component";
import Statistiques from "./components/dashboard/statistiques.component";
import Profile from "./components/profile.component";
import Configuration from "./components/configuration/configuration.component";
import Administration from "./components/administration/administration.component";
import PrivateRoute from "./components/security/private.route";
import AccesRefuse from "./components/security/accessDenied.component";
import NotFound from "./components/security/notFound.component";
import TokenService from "./services/security/token.service";
import Dashboard from "./components/dashboard/dashboard.component";
import FileService from "./services/file.service";
import VenteProduits from "./components/gestionStock/venteProduits.component.js";
import Achats from "./components/gestionStock/achats.component.js"; 
import Fournisseurs from "./components/configuration/stock/fournisseurs.component.js";
import Emplacements from "./components/configuration/stock/emplacements.component.js";
import CategorieProduits from "./components/configuration/stock/categorieProduits.component.js";
import Entrepots from "./components/configuration/stock/entrepots.component.js";
import Users from "./components/administration/users.component.js";
import Roles from "./components/administration/roles.component.js";
import Journals from "./components/administration/journals.component.js";
import {Button,  Modal } from 'react-bootstrap';
import Home from "./components/home.component";
import Utils from "./utils/utils";


import globalObject from './global.js'


import JSZip from 'jszip';


import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print';
//import 'datatables.net-buttons/js/buttons.flash.js';
window.JSZip = JSZip;


 /* eslint-disable */

 const initialPerformState= 
{
        "action":"",
        "result":"",
        "msg":"",      
};
const initialEntrepriseState = 
    {"entrepriseId": "",
    "nomEntreprise": "",
    "logo": "",
    "lienLogo": null,
    "numRue": "",
    "adresse": "",
    "cp": "",
    "ville": {
        "villeId": "",
        "codeVille": "",
        "nomVille": "",
        "province": "",
        "region": "",
        "pays": {
            "paysId": "",
            "codeIsoAlpha2": "",
            "codeIsoAlpha3": "",
            "nomPays": "",
            "monaie": "",
            "symbolMonaie": "",
            "indicatifPays": "",
            "actif": true,
            "dateCreation": null,
            "dateModif": null
        },
        "actif": false,
        "dateCreation": null,
        "dateModif": null
    },
    "telAccueil": "",
    "tel2": "",
    "description": "",
    "licenceKey": "",
    "config": {
        "tauxTVAEntreprise": "",

        "tauxFournisseur": "",
        "userDefaultPassword": "",
        "deviseMonetaire": "",
        "defaultPageSize":0,
        "inactivityTime": 0,
        "jwtRefreshExpiration":0,
        "rdvSansIndicationDuPraticien": false,
        "consultationSansIndicationIntervenants": false,
        "consultationSansRdv": false,
        "factureDansConsultation": false,
        "fluxRss": [],
        "ihmColors": [],       
         "moduleMessagerie": false,
          "moduleTableauDeBord": false,
          "moduleStock": false,
          "moduleDocument": false,
           "moduleCertificat": false,
          "mailConfig": {
            "protocol": "",
            "port": "",
            "host": "",
            "userName": "",
            "password": "",
            "smtpAuth":"",
            "smtpStarttlsEnable": true,
            "smtpStarttlsRequired": true,
            "smtpDebug":false,
             },
          "portailPatient": {
            "rdvMaxPossible": "",
            "rdvMaxNonHonnere": "",
            "rdvNombreDeMois": "",          
             },
            "configRdv": {
            "rdvSansIndicationDuPraticien": false,
            "consultationSansRdv": false, 
            "rappelRdv": false,  
            "rdvDureeAttenteNormale": 0,
            "rdvDureeAttenteAnormale": 0, 
            "jourRappel": 0,            
             }

    },
     "licence": {
        "typeLicence": "",
        "nomEntreprise": "",
        "telephone": "",
        "adresseMac": "",
        "quotaUtilisateur": 0,
        "version": "",
        "modules": [],
        "dateDebutLicence": "",
        "dateFinLicence": "",
        "dateCreation": "",
        "dateModif": ""
    },
    "dateCreation": null,
    "dateModif": null,
    "userId": ""
};
     const initialEntrepriseErrorState= 
{
        "entrepriseId":"",
        "nomEntreprise":"",
        "licenceKey":"", 
    };






class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.onInputchange = this.onInputchange.bind(this);

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.recursiveCheckNewMessage = this.recursiveCheckNewMessage.bind(this);
     this.handleNewMessage = this.handleNewMessage.bind(this);
       this.retreivePermissions = this.retreivePermissions.bind(this);
         this.retreiveActiveModules = this.retreiveActiveModules.bind(this);
         this.checkLicence = this.checkLicence.bind(this);
    this.state = {
      
      currentUser: undefined,  
      professionnelDeSanteId:null,
       patientId:null,
       permissions:[],
        activeModules:[],
      entreprise:initialEntrepriseState,
      perform : initialPerformState,
      show:false,
      errors:initialEntrepriseErrorState,
      logoImg:null,
      userImg:null,
      macVersion:{},
      search:"",
      countNewMessage:"",
      loading:false

    };
  }


async componentDidMount() {



let entreprise=await this.checkLicence()

if(entreprise!=null&&entreprise.licence!=null)
{
   this.setState({ entreprise: entreprise});
         globalObject.entreprise=entreprise;
         if(entreprise?.licence!=null && entreprise?.licence.modules!=null&& entreprise?.licence.modules.length>0)
         /*list=this.retreiveModules(entreprise?.licence.modules)
         this.setState({activeModules:list},() => console.log("activeModules: ",this.state.activeModules))*/
        //AuthService.setData("modules",this.retreiveModules(entreprise?.licence.modules))
          globalObject.modules={}
         globalObject.modules.licenceModules=entreprise?.licence.modules
         globalObject.modules.activeModules=this.retreiveActiveModules(entreprise?.config, entreprise?.licence.modules);
         let  bodyBgColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","bodyBgColor")?.value
         let  menuBgColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","menuBgColor")?.value
         let  menuTextColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","menuTextColor")?.value
         let  menuBgSelectColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","menuBgSelectColor")?.value
         let  menuSelectTextColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","menuSelectTextColor")?.value
         let  tableHeaderBgColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","tableHeaderBgColor")?.value
         let  tableHeaderTextColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","tableHeaderTextColor")?.value
          Utils.setCssSectionColor("body", bodyBgColor)  
          Utils.setCssSectionColor("menu", menuBgColor,menuTextColor, menuBgSelectColor,menuSelectTextColor)    
          Utils.setCssSectionColor("table", tableHeaderBgColor,tableHeaderTextColor) 
       
          //Utils.setCssSectionColor("modal", "yellow","blue") 
         if(entreprise?.logo!=null && entreprise?.logo!="")
         {
          this.getLogo(entreprise?.logo,true);
         }

    //  console.log("checkLicence: ",entreprise); 
     // console.log("globalObject.entreprise: ",globalObject.entreprise); 
}

//A remplacer par check licence en PROD
   
     
     // this.recursiveCheckNewMessage();
      this.recursiveCheckAcivity();
    const user = AuthService.getCurrentUser();  
    console.log ("user in local storage", user)
    //  console.log ("user.roles=======", user.roles)
    if (user!=undefined&& user!=null && user.id!=null) {
      this.setState({
        currentUser: user,
      });
      
     if(globalObject!=null && user.personnelId!=null && user.personnelId!="")
     {
       this.getPersonnel (user.personnelId)  
     }else{
      if(user.patientId!=null)
      this.getPatient (user.patientId)
     }
      
      if(user?.roles!=null&&user.roles.length>0)
        {
         
          user.roles=Utils.filterArrayByFieldNameAndValue(user.roles,"actif",true)

          user.listOfRole=Utils.getAttributeValues(user.roles,"name")
      }
      globalObject.user=user;
      const currentRole=AuthService.getCurrentRole();
      /*const modules=AuthService.getData("modules")
      console.log ("AuthService.getData", modules)*/
      if(currentRole!=null)
      {
         
      
       let role=Utils.trouverObjetDansListObject(globalObject?.user?.roles,"name",currentRole)
       this.retreivePermissions(role?.roleId,globalObject.modules.activeModules) 
      }else
      if(user.listOfRole!=null&&user.listOfRole.length>0)
      { 
        console.log ("user.listOfRole[0]", user.listOfRole[0])
         this.retreivePermissions(user?.roles[0]?.roleId,globalObject.modules.activeModules) 
         AuthService.setCurrentRole(user.listOfRole[0]);
      }
     
     
    }else 
    { 
      let baseurl=process.env.REACT_APP_BACKEND_URL!=""?process.env.REACT_APP_BACKEND_URL:window.location.origin
      // console.log("window.location.pathname: "+window.location.pathname);
       // console.log("baseurl: "+baseurl);
      // console.log("process.env.REACT_APP_FRONTEND_URL: "+process.env.REACT_APP_FRONTEND_URL);
     if ((!window.location.pathname.includes("/login") &&!window.location.pathname.includes("/register")&& !window.location.pathname.includes("/user/password") &&!window.location.pathname.endsWith(baseurl)
      &&! window.location.pathname.endsWith(baseurl+"/"))|| window.location.pathname.endsWith("/logout"))

             {
              if((globalObject?.personnel?.personnelId==null )&&(globalObject?.patient?.patientId==null ))
              window.location.href = window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/login";
              console.log("window.location.pathname: "+window.location.pathname);

         }/**/
        }
     // console.log("window.location.pathname2: "+window.location.pathname)

  
}

checkLicence = async () => {
    const perf=initialPerformState;
 AuthService.setData("modules",{})
 let response=null;
 
  response= await  EntrepriseDataService.checkLicenceAsync(); 
  perf.result=response?.status;      
  if(response!=null && response.status=="200")
   {

      
   
            return await  response.data 

    }else
    {
       if(response!=null)
        {
        perf.result=response.status;
          console.log("error.response==>",response)
           if(response.status=="404" )
            {           
              perf.msg="Aucune information sur la entreprise trouvée"
          
            }else
             {
              if(response.status=="400" )
               {
                 this.setState({ entreprise: response.data});
                if(response?.data?.licenceKey!=null)
                 {
                  perf.msg="La clé de licence n'est pas valide ou a expirée";
                 
                 }  
                 else
                   perf.msg="Aucune clé de licence trouvée"
                

               }else
                 if(response.status=="500" && response?.data?.entrepriseId!=null )
                 {
                   this.setState({ entreprise: response.data});
                    perf.msg="La clé de licence est incorrecte"
                 }else{
                  console.log("error.response",response)
                    if(response?.data?.message!=null)
                       perf.msg=response?.data?.message
                    else
                    perf.msg="Serveur temporairement indisponible...";

                    perf.result="504";
                  }
             }
         this.getMacVersion()  
        }
        else{
                    perf.msg="Chargement en cours...";
                    perf.result="504";
            }
           //perf.result="200";
         this.setState({ perform: perf});
         //console.log("perform",perf)
         this.handleShow(true);

    }
}




 onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value

    });

  }


  onSubmitForm() {

    console.log("search =",this.state.search)
    if(this.state.search.length>2&& this.state.search.split(" ").length>0)
    {
      let lien= window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/gestionPatient?search="+this.state.search;
      window.location.href = window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/gestionPatient?search="+this.state.search;
       //window.history.replaceState(null, "gestionPatient", lien)
    }

  }
handleShow(val) {
 this.setState({show:val});
 if(val==false)
  window.location.reload();
}

handleEntrepriseChange = event => {
  const { name, value } = event.target;
  this.setState({entreprise, [name]: value });
};

async retreivePermissions(roleId,modules)
{
   let resp=null  
   let query="?roleId="+roleId 
      resp= await PermissionsDataService.findAsync(query);
      // console.log("retreivePermissions",query)
      let permissions=[]
     if(resp!=null && resp.status=="200" ) 
     {    
        
             // console.log("PermissionsDataService-modules",modules)
              for(let per of resp.data)
              {
                if(modules.includes(per.module))
                 {
                  let obj={}
                  obj.roleId=per.roleId
                  obj.permissionId=per.permissionId
                  obj.module=per.module
                  obj.ressource=per.ressource
                  obj.action=per.action
                  permissions.push(obj)
                 } 
              }               
         
      }else
           {      var perf=initialPerformState;         
                  if(resp!=null &&resp.status=="204") 
                 perf.msg="Vous ne disposez d'aucun droit d'accès";
                 else
                  perf.msg="Erreur lor de la vérification des droits d'accès";
                
                  
               }
               globalObject.permissions=permissions
                // console.log("globalObject.permissions",globalObject.permissions)
                this.setState({permissions:permissions});
}


retreiveActiveModules(config,listOfModule)
{
//console.log("config====>",config)
//console.log("listOfModule====>",listOfModule)
  let list=[...listOfModule]
  if(config.moduleHospitalisation==false )
   list=list.filter(item => item !=="HOSPITALISATION")
  if(config.moduleMessagerie==false )
    list=list.filter(item => item !=="MESSAGERIE")
 if(config.moduleStock==false)
    list=list.filter(item => item !=="STOCK")
  if(config.moduleDocument==false )
    list=list.filter(item => item !=="DOCUMENT")
  if(config.moduleCertificat==false)
    list=list.filter(item => item !=="CERTIFICAT")
  return list;
 }

updateRoles(role)
{
  //console.log("listOfRole==============>",role)
  globalObject.show={}
  globalObject.show.adminBoard=role=="ROLE_ADMIN" ||role=="ROLE_SUPER_ADMIN";
  globalObject.show.psManagerBoard=role=="ROLE_CHEF_PRATICIEN";
  globalObject.show.cashierBoard=role=="ROLE_CAISSIER";
  globalObject.show.adminBoard=role=="ROLE_ADMIN" ||role=="ROLE_SUPER_ADMIN";
  globalObject.show.administrativeBoard=role=="ROLE_AGENT_ADMINISTRATIF" || role=="ROLE_SUPER_ADMIN";
  //globalObject.show.psBoard=listOfRole.includes("ROLE_PRATICIEN") || listOfRole.includes("ROLE_SUPER_ADMIN");
  globalObject.show.psBoard=role=="ROLE_PRATICIEN" ;
  globalObject.show.billingBoard= role=="ROLE_AGENT_COMPTABLE" || role=="ROLE_SUPER_ADMIN";
  globalObject.show.managerBoard=role=="ROLE_MANAGER" || role=="ROLE_ADMIN" || role=="ROLE_SUPER_ADMIN";
  globalObject.show.patientBoard=role=="ROLE_PATIENT" ;
  globalObject.show.labBoard=role=="ROLE_LABORANTIN" ;

 


}
  

async logOut(query) {


    let response=null; 
      
    response= await  AuthService.logoutAsync();
     /*if(response!=null && response.status=="200" ) 
     {    
         
      }
      TokenService.removeUser();
      localStorage.removeItem("currentRole");
      //window.location.reload();*/
    let redirect=window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/login"
    if(query!=undefined&&query!=null&&query!="")
      redirect=redirect+"?"+query
    
    return window.location.href = redirect;

}

async recursiveCheckAcivity () {
    // do whatever you like here
    const lastActivityTime=TokenService.getLastActivityTime()
     const currentTime=Math.floor((new Date().getTime())/1000);
     const inactivitymaxTime=globalObject!=null && globalObject.entreprise!=null && globalObject?.entreprise?.config.inactivityTime!=null?globalObject?.entreprise?.config.inactivityTime:process.env.REACT_APP_INACTIVITY_TIME
    
    //console.log("recursiveCheckAcivity=====>")
     if(lastActivityTime!=undefined &&currentTime-lastActivityTime>inactivitymaxTime)
     {
      console.log("recursiveCheckAcivity=====>logOut")
       this.logOut("accessDenied=true")
     }else   
    setTimeout(this.recursiveCheckAcivity, inactivitymaxTime);//en ms
}
updateCurrentRole(role) {

  AuthService.setCurrentRole(role);
   /*const listOfRole=[];
   listOfRole.push(role);
    console.log("listOfRole: "+listOfRole)*/
   this.updateRoles(role);

   //window.location.href = window.location.origin+process.env.REACT_APP_FRONTEND_URL+this.getHomePage();
   window.location.href = window.location.origin+process.env.REACT_APP_FRONTEND_URL;
    console.log("---------------->>updateCurrentRole"+window.location.origin+process.env.REACT_APP_FRONTEND_URL+this.getHomePage());
    //this.reload();
   // window.location.reload();
  }


getHomePage() {
  console.log("globalObject?.permissions==>",globalObject?.permissions)
  if(Utils.trouverObjetDansListObject(globalObject?.permissions,"module","ADMINISTRATION")!=null)
    return "/administration"
  /*if(globalObject.show.psManagerBoard||globalObject.show.psBoard ||globalObject.show.administrativeBoard)
   { if(globalObject.ps!=null &&globalObject.ps.professionnelDeSanteId!=null &&globalObject.ps.professionnelDeSanteId!="")
      return "/praticien/"+globalObject.ps.professionnelDeSanteId
    else
      return "/gestionPatient"
  }*/
  else
  
  if(Utils.trouverObjetDansListObject(globalObject?.permissions,"module","RH")!=null )
    return "/gestionRH"
  if(Utils.trouverObjetDansListObject(globalObject?.permissions,"module","STOCK")!=null )
    return "/stocks"
   else
    return "/"

return "";

   


}
//reload=()=>window.location.reload();


capitalizeFist(str){
let s=str.toLowerCase();
return s.charAt(0).toUpperCase() + s.slice(1);
}

isValid  (elt) {
 
    let err=initialEntrepriseErrorState;
    let valid=true;
        
    if( elt.nomEntreprise==null || elt.nomEntreprise.length<2) 
       {
         err.nomEntreprise="Nom incorrecte";
         valid=false;
     } 

     if(elt.licenceKey==null || elt.licenceKey.length<100) 
         {
          err.licenceKey="Licence  incorrecte";
          valid=false;
          
     }
     this.setState({errors:err});
    return valid;

  };

async recursiveCheckNewMessage() {
   console.log("recursiveCheckNewMessage=====>")
 await this.handleNewMessage()
 setTimeout(this.recursiveCheckNewMessage, 60000);

}

async handleNewMessage  () {
  let countNewMsg=await Utils.countNewMessage()
 this.setState({ countNewMessage: countNewMsg});
 //Utils.changeDivContent("#countNewMessage","countNewMsg");
  console.log("countNewMsg===>",countNewMsg)
  }
async  getMacVersion ( ){
    let response=null; 
      
    response= await EntrepriseDataService.getMacVersionAsync();
     if(response!=null && response.status=="200" ) 
     {    
        if(response.data!=null && response.data!="")
          {

              this.setState({macVersion:response.data});
              //console.log(response.data)
          } 
         
      }

  }


async  getLogo (fileId,logo ){
    let response=null; 
      
    response= await FileService.getFilesByIdAsync(fileId);
     if(response!=null && response.status=="200" ) 
     {    
        if(response.data!=null && response.data!="")
          {

                let fileInfo=response.data;
                let img=`data:${fileInfo.fileType};base64,${fileInfo.fileData}`
                if(logo==true)
                {
                  this.setState({logoImg:img});
                  globalObject.logo=img
                  //URL.createObjectURL(fileInfo.fileData)
                }
                else
                   this.setState({userImg:img});
          } 
         
      }
  }




async  getPersonnel (personnelId ){  
    let resp=null    
      resp= await PersonnelsDataService.findPersonnelByIdAsync(personnelId,true);
      console.log("getPersonnel",resp)
     if(resp!=null && resp.status=="200" ) 
     {    
        if(resp.data!=null && resp.data!="")
          {
              globalObject.personnel=resp.data;
              globalObject.personne=resp?.data?.personne;
              console.log("globalObject", globalObject)
              //this.getPS(globalObject.personne.personneId)
                if(resp?.data?.personne.avatar!=null && resp?.data?.personne.avatar!="")
                 {
                  this.getLogo(resp?.data?.personne.avatar,false);
                  
                 }
                //StompClientService.connect();
                 
          } 
         
      }else
           {      var perf=initialPerformState;         
                  if(resp!=null &&resp.status=="400") 
                 perf.msg=" personnel non trouvé ou inactif";
                 else
                  perf.msg="erreur technique";
                  this.setState({perform:perf});
                  
               }
  }
async  getPatient (patientId ){  
    let resp=null    
      resp= await PatientsDataService.findPatientByIdAsync(patientId,true);
     if(resp!=null && resp.status=="200" ) 
     {    
        if(resp.data!=null && resp.data!="")
          {
              globalObject.patient=resp.data;
              globalObject.personne=resp?.data?.personne;
               this.setState({ patientId: globalObject.patient.patientId});
              console.log("globalObject", globalObject)
              
                if(resp?.data?.personne.avatar!=null && resp?.data?.personne.avatar!="")
                 {
                  this.getLogo(resp?.data?.personne.avatar,false);
                 }
                 
          } 
         
      }else
           {      var perf=initialPerformState;         
                  if(resp!=null &&resp.status=="400") 
                 perf.msg=" patient non trouvé ou inactif";
                 else
                  perf.msg="erreur technique";
                  this.setState({perform:perf});
                  
               }
  }
/*
async  getPS (personneId ){      
      let resp= null;
      resp=await PersonnelsDataService.getAsync(personneId);
     if(resp!=null && resp.status=="200" ) 
     {    
        if(resp.data!=null && resp.data!="")
          {
              globalObject.ps=resp.data;
              globalObject.personne=resp?.data?.personne;
              //console.log("globalObject", globalObject)
              this.setState({professionnelDeSanteId:globalObject.ps.professionnelDeSanteId});
              

               if(resp?.data?.personne.avatar!=null && resp?.data?.personne.avatar!="")
                 {
                  this.getLogo(resp?.data?.personne.avatar,false);
                 }
          } 
         
      }else
           {      var perf=initialPerformState;         
                  if(resp.status=="400") 
                 perf.msg="ERREUR " + " : La lincence fournie est invalide";
                 else
                  perf.msg="ERREUR " + " : La licence fournie est incorrecte, assurez-vous d'avoir fourni la bonne clé de licence";
                  this.setState({perform:perf});
                  
               }
  }*/
async saveEntreprise (entreprise)  {
  this.setState({loading:true})
 const elt = {...entreprise};
   var perf=initialPerformState;
     if(this.isValid(elt))
     {    
        let json='{"key":"'+elt.licenceKey+'"}'
        let resp=await EntrepriseDataService.decryptAndValidateAsync(json);
         perf.result=resp.status;
        if(resp!=null && resp.status=="200")
          {
            let licence=resp.data;
           
            elt.nomEntreprise=licence.nomEntreprise;
            elt.telAccueil=licence.telephone;
            }else
               {               
                  if(resp.status=="400") 
                 perf.msg="ERREUR " + " : La licence fournie est invalide";
                 else
                  perf.msg="ERREUR " + " : La licence fournie est incorrecte, assurez-vous d'avoir fourni la bonne clé de licence";
                  this.setState({perform:perf});
                  
               }
      
        if(perf.result=="200")
        {
          console.log("decryptAndValidateAsync",elt)
          let response="";  
          elt.licence=null;
          elt.frontUrl=window.location.origin+process.env.REACT_APP_FRONTEND_URL       
          if(elt.entrepriseId!=null && elt.entrepriseId!="")
           {

            response= await EntrepriseDataService.updateAsync(elt.entrepriseId,elt);

           } 
          else
            {

              response= await EntrepriseDataService.createAsync(elt);
            }
          
           perf.result=response.status;
          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //elt=person.data;
              this.setState({entreprise:response.data});                    
              perf.msg="Mise à jour effectuée avec succès"  
              perf.action="OK" 
                             
            }  
           else
           {            
              perf.msg= response?.data?.message;                         
           } 
            this.setState({perform:perf});             
        }
      }

      this.setState({loading:false})   
  };


render() {
const { currentUser, entreprise,professionnelDeSanteId, patientId,perform,show, userImg, errors,  logoImg, macVersion,countNewMessage,loading,permissions } = this.state;
  //console.log("permissions===>",permissions);
  // console.log("perform in render",currentUser)
//const params = ()=>{return useParams()};
const ProfessionnelDeSanteWrapper = (props) => {
      const params = useParams();
      return <ProfessionnelDeSante  {...{...props, match: {params}} } />
    }
const ProfessionnelDeSanteSpaceWrapper = (props) => {
      const params = useParams();
      return <ProfessionnelDeSanteSpace  {...{...props, match: {params}} } />
    }
const LoginWrapper = (props) => {
      const params = useParams();
      return <Login  {...{...props, match: {useParams}} } />
    }

const PatientWrapper = (props) => {
      const params = useParams();
      return <Patient  {...{...props, match: {params}} } />
    }

const PatientRdvWrapper = (props) => {
      const params = useParams();
      return <PatientRdv  {...{...props, match: {params}} } />
    }
const PatientExamensWrapper = (props) => {
      const params = useParams();
      return <PatientExamens  {...{...props, match: {params}} } />
    }

const bgImg = {
      backgroundColor: `var(--main-container-jumbotron-background-color)`
    }
let homeContent='home-content'
if (currentUser!=undefined&&currentUser!=null) {
   homeContent = 'home-content-bg'
  }
return (



<div className="body" >
 <NotificationContainer style={{top: "unset", bottom:"0"}}  /> 
{
(perform.result!="200") ?(
 <Modal  centered show={show} onHide={() =>this.handleShow(true)} animation={false} dialogClassName='modal-30vw' >
       <Modal.Header >
          <Modal.Title>
         
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
           
                
             {
              (perform.result=="400" || perform.result=="404" ||perform.result=="500")&& (
             <div className="row">     
                <div className="col-md">                                       
                  <div className="form-group">  
                   <label htmlFor="title">Nom de l'établissement</label>             
                      <input
                        type="text"                       
                        id="nomEntreprise"
                        required
                        value={entreprise?.nomEntreprise}
                        onChange={(event) => {  
                                      const { name, value } = event.target;
                                      const clin=entreprise
                                      clin.nomEntreprise=value;
                                       this.setState({entreprise:clin});
                                     }}
                        name="nomEntreprise"
                        placeholder="Nom de l'établissement"
                        maxLength="100"
                        className={`form-control ${errors.nomEntreprise.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.nomEntreprise}</div>
                  </div>
                  <div className="form-group"> 
                   <label htmlFor="title">Licence</label>             
                        <textarea
                            type="text"
                            className={`form-control ${errors.licenceKey.length>0 ? 'is-invalid' : ''}`}
                            id="licenceKey"
                            required
                            value={entreprise.licenceKey}
                            onChange={(event) => {  
                                      const { name, value } = event.target;
                                      const clin=entreprise;
                                      clin.licenceKey=value;
                                       this.setState({entreprise:clin});
                                     }}
                            name="licenceKey"                  
                            placeholder="Licence"
                            rows={5}
                          />                  
                      <div className="invalid-feedback">{errors.licenceKey}</div>                     
                    </div>
                    <div className="form-group"> 
                      <label>N°:{macVersion?.macAddress}/{macVersion?.version}</label> 
                   </div>
                   
                </div>
              </div>
              )}
              <div className="alert alert-danger" role="alert">           
              {perform.msg}       
            </div> 
            
        </Modal.Body>
        <Modal.Footer>  
        {(perform.result=="400"||perform.result=="500" ) &&(  
        
           <Button
                className="btn  btn-block"
                disabled={loading}
                variant="warning"  onClick={() => this.saveEntreprise(entreprise)}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span> Mettre à Jour</span>
              </Button>
          )}
         {(perform.result=="404") &&(  
         
           <Button
                className="btn  btn-block"
                disabled={loading}
                variant="success"  onClick={() => this.saveEntreprise(entreprise)}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>  S'enregistrer</span>
              </Button>
          )}
         {(perform.action=="OK") &&(  
          <Button variant="secondary" onClick={() =>this.handleShow(false)}>

            Fermer
          </Button>)}
      
        
        </Modal.Footer>
      </Modal>):

(

<div className="body " style={{backgroundImage: `url("/img/bg3.png")` ,
       
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition:'top',
    
}}>

 {/*****************bare latéral***************/}
  {currentUser!=undefined && (
  <div className="sidebar">
    <div className="logo-details">
      <i><img className="logoImg rounded mx-auto d-block" 
                            //src={previewImages} 
                            src={logoImg}
                            alt="" 
                            /></i>     
      <span style={{color: "#DCDCDC",fontSize: "x-small", textAlign: "center", display: "block"}}>{entreprise?.nomEntreprise}<br/> {entreprise?.numRue}  {entreprise?.adresse} {entreprise.cp} <br/>{entreprise?.ville!=null &&entreprise?.ville.nomVille} {entreprise?.ville!=null &&entreprise?.ville?.pays!=null && entreprise?.ville?.pays.codeIsoAlpha2} <br/>Tél.: {entreprise?.telAccueil}</span>  

    </div>
      <ul className="nav-links overflow-y-auto">
        <li>
          <NavLink to={"/"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-home']} /></i>
            <span className="links_name">Accueil</span>
          </NavLink>
        </li>
        
        { (Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STOCK/PRODUIT")!=null) && (

        <li>
          <NavLink to={"/produits"} exact="true">
        <i><FontAwesomeIcon icon={['fas', 'fa-box']} /></i>
            <span className="links_name">Produits</span>
          </NavLink>
        </li>)}
        { (Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STOCK/GESTION_ENTREPOT")!=null) && (

        <li>
          <NavLink to={"/stocks"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-boxes']} /></i>
            <span className="links_name">Stocks</span>
          </NavLink>
        </li>)}
        { (Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STOCK/COMMANDE_PRODUIT")!=null) && (

        <li>
          <NavLink to={"/commandes"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-shopping-cart']} /></i>
            <span className="links_name">Commandes</span>
          </NavLink>
        </li>)}
        { (Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STOCK/INVENTAIRE")!=null)&& (

        <li>
          <NavLink to={"/inventaires"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-clipboard-list']} /></i>
            <span className="links_name">Inventaires</span>
          </NavLink>
        </li>)}
        <li>
          <NavLink to={"/demandeProduits"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-shopping-cart']} /></i>
            <span className="links_name">Demandes produits</span>
          </NavLink>
        </li>
        { (Utils.trouverObjetDansListObject(permissions,"module","STATISTIQUE")!=null) && (
        <li>
        <NavLink to={"/statistiques"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-chart-pie']} /></i>
            <span className="links_name">Statistique</span>
          </NavLink>
        </li>)}
        { (Utils.trouverObjetDansListObject(permissions,"module","DASHBOARD")!=null) && (

        <li>
          <NavLink to={"/dashboard"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-chart-line']} /></i>
            <span className="links_name">Tableau de bord</span>
          </NavLink>
        </li>)}
        {Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION")!=null && (

        <li>
          <NavLink to="#" >
          <i><FontAwesomeIcon icon={['fas', 'fa-cogs']} /></i>
            <span className="links_name">Configuration</span>
          </NavLink>
        </li>)}

        {Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION/STOCK/CATEGORIE_PRODUIT")!=null && (

       <li>
       
         <NavLink to={"/categories"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-sitemap']} /></i>
            <span className="links_name">Catégories</span>
          </NavLink>
        </li>)}
        {Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION/STOCK/EMPLACEMENT")!=null && (

        <li>
          <NavLink to={"/emplacements"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-map-marker']} /></i>
            <span className="links_name">Emplacements</span>
          </NavLink>
        </li>)}
        {Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION/STOCK/FOURNISSEUR")!=null && (

        <li>
          <NavLink to={"/fournisseurs"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-industry']} /></i>
            <span className="links_name">Fournisseurs</span>
          </NavLink>
        </li>)}
        {Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION/STOCK/ENTREPOT")!=null && (
        <li>
          <NavLink to={"/entrepots"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-warehouse']} /></i>
            <span className="links_name">Entrepot</span>
          </NavLink>
        </li>)}
        { (Utils.trouverObjetDansListObject(permissions,"module","RH")!=null) && (
        <li>
          <NavLink to={"/gestionRH"}> 
          <i><FontAwesomeIcon icon={['fas', 'fa-user-cog']} /></i>
            <span className="links_name">Ressource Humaine</span>
          </NavLink>
        </li>)}
        <li>
         <NavLink to={"/configuration"} exact="true">
          <i><FontAwesomeIcon icon={['far', 'fa-building']} /></i>
            <span className="links_name">Général</span>
          </NavLink>
        </li>
        {(Utils.trouverObjetDansListObject(permissions,"module","ADMINISTRATION")!=null) && (

        <li>
          <NavLink >
          <i><FontAwesomeIcon icon={['fas', 'fa-cogs']} /></i>
            <span className="links_name">Administration</span>
          </NavLink>
        </li>)}
       
     
        {Utils.filterArrayByFieldNameAndContent(permissions,"ressource","USER")!=null && (

        <li>
          <NavLink to={"/Utilisateurs"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-user-cog']} /></i>
            <span className="links_name">Utilisateurs</span>
          </NavLink>
        </li>)}
        {Utils.filterArrayByFieldNameAndContent(permissions,"ressource","ROLE")!=null && (
        <li>
         <NavLink to={"/roles"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-user-shield']} /></i>
            <span className="links_name">Roles</span>
          </NavLink>
        </li>)}
        {Utils.filterArrayByFieldNameAndContent(permissions,"ressource","JOURNALISATION")!=null && (
        <li>
          <NavLink to={"/historisation"} exact="true">
          <i><FontAwesomeIcon icon={['fas', 'fa-address-book']} /></i>
            <span className="links_name">Journalisation</span>
          </NavLink>
        </li>)}
          <div className="log_out">
          <a href="https://globalesanteplus.com/" target="_blank">
            <i></i>
            <span style={{color: "#DCDCDC",fontSize: "x-small", textAlign: "center", display: "block"}}><img
            src="/img/globalesSolutions.png"
            alt="profile-img"
            className="icone50"
          /> © 2021-{(new Date()).getFullYear()}</span>
          </a>
        </div>
      </ul>
  </div>)}
 {/***************home-section*****************/}

    <section className="home-section" >
     {currentUser!=undefined && (
     <nav>
      <div className="sidebar-button">
        <i className='bx bx-menu sidebarBtn'></i>
        {/*<span className="dashboard"><img
            src="/img/globalesSolutions.png"
            alt="profile-img"
            className="icone50"
          /></span>*/}
      </div>
      {(Utils.trouverObjetDansListObject(permissions,"ressource","STOCK/PRODUIT")!=null) && (
      <div className="search-box">
        <input type="text" name="search" placeholder="Nom du produit..."  value={this.state.search}

              onChange={this.onInputchange}/>
        
            <NavLink to={"/stocks?search="+this.state.search}> 
            
            <i className='bx bx-search' ></i>
          </NavLink>
      </div>)}
      <div className="profile-details">
        {currentUser!=undefined && ( 
       
      <div className=" navbar-expand navbar-dark  navbar-custom">
          {currentUser ? (
            <div className="navbar-nav ml-auto"> 
            {entreprise.config!=null && Utils.trouverObjetDansListObject(permissions,"module","MESSAGERIE")!=null&&(
            <li className="nav-item">         
              <Link to={"/messagerie"} className="navbar-brand">
                {countNewMessage!=""&&(<span className="notify-badge"> &nbsp;{countNewMessage}&nbsp; </span>)}
                   <img src="/img/courriel.png" alt="Messagerie" title="Messagerie" className="icone30"/>
                   <span>&nbsp;&nbsp;</span>
                  </Link>
               </li>)}          
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    { (userImg==null) ?(
                       <img src="/img/avatar_2x.png" title={currentUser.username}  alt="uploader un fichier" className="profile-30-30"/> 
                       ):
                      <img src={userImg} title={currentUser.username}  alt="uploader un fichier" className="profile-30-30"/> 
                    }
                       {currentUser.username}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      
                       
                       <h6 style={{ 'color': `var(--menu-a-link-color)`}} >Roles</h6>
                       <ul>
                       {currentUser.roles &&
                        currentUser.roles.map((role, index) => 
                         <li key={index} >             
                           <a key={index} className="dropdown-item" href="#" onClick={() =>this.updateCurrentRole(role?.name)} > 
                           {(AuthService.getCurrentRole()==role?.name)?<img src="/img/check2.png" alt="profile-img" className="icone16"/>:" "} {this.capitalizeFist(role?.name.replace("ROLE_","").replace("_"," "))}
                           </a>
                          </li>
                          )}

                        </ul>
                        <div className="dropdown-divider"></div>
                        <Link to={"/profile"} className="dropdown-item">
                              Profile
                        </Link>             
                        <div className="dropdown-divider"></div>
                        <Link to={"/logout"} className="dropdown-item" onClick={() =>this.logOut("")}>
                              Déconnexion
                          </Link>
                    </div>
                  </li>
                 <li className="nav-item"> 
                 {Utils.trouverObjetDansListObject(permissions,"module","?????")!=null&&(
               <Link to={"/help"} className="navbar-brand">
                   <img src="/img/question2.png" alt="Aide" title="Aide" className="icone30"/>
                  </Link> )}  
                 </li>
             <li className="nav-item">
                <Link to={"/logout"} className="nav-link" onClick={() =>this.logOut("")}>
                  <img src="/img/logout.png" title="Se déconnecter"  alt="Se déconnecter" className="icone-action-25"/>
                </Link>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Connexion
                </Link>
              </li>

              
            </div>
          )}
        </div>


       )}
      </div>
    </nav>)}

    <div className={homeContent}>
      <Routes>

            <Route exact="true" path="/home" element={<Home/>} />
             
            <Route exact="true" path="/" element={<Home/>} />
           <Route exact="true" path="/logOut" element={<Home/>} />
          {/*  <Route exact="true" path='/register' element={<PrivateRoute isAuthorized={globalObject?.entreprise?.licence.modules?.includes("PORTAIL_PATIENT")&& globalObject?.entreprise.config?.modulePortailPatient}/>}>
                <Route exact="true" path='/register' element={<Register {...{...this.props}} />}/>
            </Route>
           */}
            <Route exact="true" path="/help" element={<Help/>} />
           
            <Route exact="true" path='/profile' element={<PrivateRoute isAuthorized={currentUser!=undefined}/>}>
                <Route exact="true" path='/profile' element={<Profile {...{...this.props}} />}/>
            </Route>
             
            
             <Route exact="true" path='/user/password' element={<PrivateRoute isAuthorized={currentUser==undefined?true:false}/>}>
                <Route exact="true" path='/user/password' element={<Password {...{...this.props}} />}/>
            </Route>
            
              <Route exact="true" path='/login' element={<PrivateRoute isAuthorized={currentUser==undefined?true:false}/>}>
                <Route exact="true" path='/login' element={<Login {...{...this.props}} />}/>
            </Route>
            <Route exact="true" path='/produits' element={<PrivateRoute isAuthorized={Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STOCK/PRODUIT")!=null }/>}>
                <Route exact="true" path='/produits' element={<Produits  />}/>
            </Route>
            <Route exact="true" path='/stocks' element={<PrivateRoute isAuthorized={Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STOCK/GESTION_ENTREPOT")!=null}/>}>
                <Route exact="true" path='/stocks' element={<EntrepotProduits/>}/>
            </Route>

            <Route exact="true" path='/commandes' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STOCK/COMMANDE_PRODUIT")!=null)}/>}>
                <Route exact="true" path='/commandes' element={<Achats  {...{...this.props}}/>}/>
            </Route>

            <Route exact="true" path='/demandeProduits' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STOCK/DEMANDE_PRODUIT")!=null)}/>}>
                <Route exact="true" path='/demandeProduits' element={<VenteProduits  {...{...this.props}}/>}/>
            </Route>
            <Route exact="true" path='/inventaires' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STOCK/INVENTAIRE")!=null)}/>}>
                <Route exact="true" path='/inventaires' element={<Configuration  {...{...this.props}}/>}/>
            </Route>
          <Route exact="true" path='/categories' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION/STOCK/CATEGORIE_PRODUIT")!=null)}/>}>
                <Route exact="true" path='/categories' element={<CategorieProduits  {...{...this.props}}/>}/>
            </Route>
            <Route exact="true" path='/emplacements' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION/STOCK/EMPLACEMENT")!=null)}/>}>
                <Route exact="true" path='/emplacements' element={<Emplacements  {...{...this.props}}/>}/>
            </Route>
            <Route exact="true" path='/fournisseurs' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION/STOCK/FOURNISSEUR")!=null)}/>}>
                <Route exact="true" path='/fournisseurs' element={<Fournisseurs  {...{...this.props}}/>}/>
            </Route>
            <Route exact="true" path='/entrepots' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION/STOCK/ENTREPOT")!=null)}/>}>
                <Route exact="true" path='/entrepots' element={<Entrepots  {...{...this.props}}/>}/>
            </Route>
            <Route exact="true" path='/utilisateurs' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","USER")!=null)}/>}>
                <Route exact="true" path='/utilisateurs' element={<Users  {...{...this.props}}/>}/>
            </Route>
            <Route exact="true" path='/roles' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","ROLE")!=null)}/>}>
                <Route exact="true" path='/roles' element={<Roles  {...{...this.props}}/>}/>
            </Route>
            <Route exact="true" path='/historisation' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","JOURNALISATION")!=null)}/>}>
                <Route exact="true" path='/historisation' element={<Journals  {...{...this.props}}/>}/>
            </Route>
            <Route exact="true" path='/configuration' element={<PrivateRoute isAuthorized={(Utils.filterArrayByFieldNameAndContent(permissions,"ressource","CONFIGURATION")!=null)}/>}>
                <Route exact="true" path='/configuration' element={<Configuration  {...{...this.props}}/>}/>
            </Route>
            
          
            
           
             
             <Route exact="true" path='/administration' element={<PrivateRoute isAuthorized={Utils.trouverObjetDansListObject(permissions,"module","ADMINISTRATION")!=null}/>}>
                <Route exact="true" path='/administration' element={<Administration/>}/>
            </Route>
           
            <Route exact="true" path='/gestionRH' element={<PrivateRoute isAuthorized={Utils.trouverObjetDansListObject(permissions,"module","RH")!=null}/>}>
                <Route exact="true" path='/gestionRH' element={<GestionRH/>}/>
            </Route>
           
           
            <Route exact="true" path='/messagerie' element={<PrivateRoute isAuthorized={Utils.trouverObjetDansListObject(permissions,"module","MESSAGERIE")!=null&&currentUser!=null &&currentUser.personnelId!=null }/>}>
                <Route exact="true" path='/messagerie' element={<Messagerie handleNewMessage={this.handleNewMessage}/>}/>
            </Route>
           
            
             <Route exact="true" path='/statistique' element={<PrivateRoute isAuthorized={Utils.filterArrayByFieldNameAndContent(permissions,"ressource","STATISTIQUE")!=null &&Utils.trouverObjetDansListObject(permissions,"module","PORTAIL_PATIENT")==null}/>}>
                <Route exact="true" path='/statistique' element={<Statistiques/>}/>                                  
            </Route>
            <Route exact="true" path='/dashboard' element={<PrivateRoute isAuthorized={Utils.filterArrayByFieldNameAndContent(permissions,"ressource","DASHBOARD")!=null &&Utils.trouverObjetDansListObject(permissions,"module","PORTAIL_PATIENT")==null}/>}>
                <Route exact="true" path='/dashboard' element={<Dashboard/>}/>                                  
            </Route>
            
             <Route exact="true" path="/403" element={<AccesRefuse/>} />
             <Route exact="true" path="*" element={<NotFound/>} />
          </Routes>
       </div>
    </section>

    {Utils.addLibrary("/js/sidebarBtn.js")}

 
    </div>)}
</div>
 );
  }
}

export default App;
library.add(fab, fas, far)
