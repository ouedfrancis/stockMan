import React, {useState, useEffect,useCallback } from "react";
import EntrepriseDataService from "../../services/entreprise.service";
import PaysDataService from "../../services/pays.service";
import VillesDataService from "../../services/villes.service";
import FileService from "../../services/file.service";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';

import LoadFiles from "../loadFiles.component";
//Bootstrap and jQuery libraries
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from 'jquery'; 

import DatePicker , { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr"; 
/********Date management******
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@mui/pickers';*/
import 'date-fns';
import { format, parseISO } from 'date-fns'
import { TextField } from '@mui/material';

/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';
import { Editor } from "@tinymce/tinymce-react";
 /* eslint-disable */
const Entreprise = () => {

/*Create entreprise code*/
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

        "fluxRss": [],
        "ihmColors": [],
          "moduleHospitalisation": false,
          "moduleRdv": false,
         "moduleMessagerie": false,
          "moduleTableauDeBord": false,
          "moduleMedicament": false,
          "moduleFacturation": false,
          "moduleDocument": false,
           "moduleCertificat": false,
          "moduleFluxRss": false,
          "modulePortailPersonnel":false,
           "moduleLaboratoire":false,
           "moduleStock":false,
           "modulePharmacie":false,
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
                    
             "configEditique": {
            "header": "",
            "headerLeft": "",
            "headerRight": "",  

             "headerImg": "",
             "footer": "",
            "footerLeft": "",
            "footerRight": "",  
             "footerImg": "",  
                    
               "imgMaxSizeMB":1,   
             },

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

const initialPaysState = 
    { 
       
            "paysId": "",
            "codeIsoAlpha2": "",
            "codeIsoAlpha3": "",
            "nomPays": "",
            "monaie": "",
            "symbolMonaie": "",
            "indicatifPays": "",
            "actif": "",
       
    };
const initialVilleState = 
    { 
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
            "actif": "",
        },
        "actif": "",
    };

    const initialIhmColor = 
    { 
       "bodyBgColor": "",
        "menuBgColor": "",
        "menuTextColor": "",
        "menuBgSelectColor": "",
        "menuSelectTextColor": "",
        "tableHeaderTextColor": "",
    };

const initialPerformState = 
{
        "action":"",
        "result":"",
        "msg":"",      
    };
const [entreprise, setEntreprise] = useState(initialEntrepriseState);
const [config, setConfig] = useState(initialEntrepriseState.config);
const [mailConfig, setMailConfig] = useState(initialEntrepriseState.config.mailConfig);

const [portailPersonnel, setPortailPersonnel] = useState(initialEntrepriseState.config.portailPersonnel);
const [configEditique, setConfigEditique] = useState(initialEntrepriseState.config.configEditique);
const [payss, setPayss] = useState([]);
const [villes, setVilles] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialEntrepriseState);
const [show, setShow] = useState(false);
const [infraInfo, setInfraInfo] = useState(null);
const [fluxRss, setFluxRss] = useState("");
const [previewImg, setPreviewImg] = useState(null);
const [selectedFile, setSelectedFile] = useState([]);
const [ihmColor, setIhmColor] = useState(initialIhmColor);

const [selectedHeaderImg, setSelectedHeaderImg] = useState([]);
const [selectedFooterImg, setSelectedFooterImg] = useState([]);
const [selectedHomePageImg, setSelectedHomePageImg] = useState([]);
const [loading, setLoading] = useState(false); 
useEffect(() => {
    retrieveEntreprise();
    retrievePayss();
    getInfraInfo ( )
   let perf=perform;
    perf.action="GET";
    setPerform(perf); 
 
  }, []);



const handleLoadFiles  = useCallback((label, returnedFiles) =>{

console.log("returnedFiles========>", returnedFiles)
if(label=="headerImg")
    setSelectedHeaderImg(returnedFiles);
else if(label=="footerImg")
    setSelectedFooterImg(returnedFiles);
else if(label=="homePageImg")
    setSelectedHomePageImg(returnedFiles);
else
    setSelectedFile(returnedFiles)

},[selectedHeaderImg,selectedFooterImg,selectedHomePageImg,setSelectedFile]);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}

function showNotif(perf)
{
setShow(false);
Utils.createNotification(perf.result,"Entreprise", perf.msg); 
setEntreprise(initialEntrepriseState);
setPerform(initialPerformState);      
setErrors(initialEntrepriseState);
setSelectedHeaderImg([]);
setSelectedFooterImg([]);
setSelectedHomePageImg([]);
setSelectedFile([])
retrieveEntreprise();

}
const handleShow = () => setShow(true);

//const today=new Date();
const handleEntrepriseChange = event => {
  const { name, value } = event.target;
  setEntreprise({ ...entreprise, [name]: value });
};
const handleConfigChange = event => {
  const { name, value } = event.target;
  setConfig({ ...config, [name]: value });
};

const handlePortailPersonnelChangeChange = event => {
  const { name, value } = event.target;
  setPortailPersonnel({ ...portailPersonnel, [name]: value });
};
const handleConfigFluxRssChange = event => {
  const { name, value } = event.target;
  setFluxRss(value);
};
const handleMailConfigChange = event => {
  const { name, value } = event.target;
  setMailConfig({ ...mailConfig, [name]: value });
};

const handleConfigEditiqueChange = event => {
  const { name, value } = event.target;
  setConfigEditique({ ...configEditique, [name]: value });
};



const handleIhmColorChange = event => {
  const { name, value } = event.target;
  setIhmColor({ ...ihmColor, [name]: value });
};

  const handlePaysChange = event => {
  const { name, value } = event.target;
  const clin={...entreprise}
  const p=payss.find(elt => elt.paysId==value);
  retrieveVilles(p.paysId, null,true);
  const ville=initialVilleState;
  ville.pays=p;
  clin.ville=ville;
  setEntreprise(clin);

};


 const handleVilleChange = event => {
  const { name, value } = event.target;
  const clin={...entreprise}
  const v=villes.find(elt => elt.villeId==value);
  clin.ville=v;
  setEntreprise(clin);
};

const refreshEntreprise = () => {
     setErrors(initialEntrepriseState);
     setPerform(initialPerformState);
     setPreviewImg(null);
     setSelectedFile(null);
  };


//const reload=()=>window.location.reload();
/******************************************/
async function saveEntreprise (entreprise)  {
    setLoading(true)
 const elt = {...entreprise};


   //setEntreprise(elt);
elt.config={...config}
elt.config.mailConfig={...mailConfig}
elt.config.portailPersonnel={...portailPersonnel}

if(selectedHomePageImg.length>0)
   {
         const base64Data=await Utils.fileToBase64(selectedHomePageImg[0]?.data);
    elt.homePageImg=`data:${selectedHomePageImg[0]?.data.type};base64,${base64Data}`
   } 

//
if(selectedHeaderImg.length>0)
   {
     const base64Data=await Utils.fileToBase64(selectedHeaderImg[0]?.data);
    configEditique.headerImg=`data:${selectedHeaderImg[0]?.data.type};base64,${base64Data}`
   } 
if(selectedFooterImg.length>0)
   {
    const base64Data=await Utils.fileToBase64(selectedFooterImg[0]?.data);
    configEditique.footerImg=`data:${selectedFooterImg[0]?.data.type};base64,${base64Data}`
} 
elt.config.configEditique={...configEditique}

console.log("saveEntreprise===========>",elt) 
   var perf=perform;
     if(isValid(elt))
     {    
        let json='{"key":"'+elt.licenceKey+'"}'
        let resp=await EntrepriseDataService.decryptAndValidateAsync(json);
        

        if(resp!=null && resp.status=="200")
          {

            let licence=resp.data;
            elt.licence=licence;

            }else
               {
                  perf.result="error";
                  if(resp.status=="400") 
                 perf.msg="ERREUR "+resp.status + " : La lincence fourni est invalide";
                 else
                  perf.msg="ERREUR "+resp.status + " : La licence fournie est incorrecte, assurez-vous d'avaoir fourni la bonne clé de licence";
                  showNotif(perf);
                  
               }
        if(perf.result!="error")
        {
          if(selectedFile!=null&& selectedFile!="")
          { 
              let fileInfo="";
            if(elt.logo!="" && elt.logo!=null)
                fileInfo= await FileService.updateAsync(elt.logo,selectedFile[0].data, "Entreprise.Logo",`${elt.nomEntreprise}`);     
             else
                fileInfo= await FileService.uploadAsync(selectedFile[0].data, "Entreprise.Logo",`${elt.nomEntreprise}`);

               
              
               if(fileInfo!=null && (fileInfo.status=="200" || fileInfo.status=="201"))
               {
                  
                  elt.logo=fileInfo.data.fileId;
               }
               else
                {                
                 perf.result="error"; 
                 perf.msg="ERREUR "+fileInfo.status + " : "+ fileInfo.data.message;
                  showNotif(perf);

               }
            }
          }
        if(perf.result!="error")
        {
          
          let colors=[]

          colors.push({"key":"bodyBgColor","value":ihmColor.bodyBgColor})
          colors.push({"key":"menuBgColor","value":ihmColor.menuBgColor})
          colors.push({"key":"menuTextColor","value":ihmColor.menuTextColor})
          colors.push({"key":"menuBgSelectColor","value":ihmColor.menuBgSelectColor})
          colors.push({"key":"menuSelectTextColor","value":ihmColor.menuSelectTextColor})
          colors.push({"key":"tableHeaderBgColor","value":ihmColor.tableHeaderBgColor})
          colors.push({"key":"tableHeaderTextColor","value":ihmColor.tableHeaderTextColor})


          elt.config.ihmColors=colors;
          /*elt.fluxRss=Utils.stringToArray(elt.fluxRss)
          else*/
          
          if(fluxRss!=null&&fluxRss.length>0)
            elt.config.fluxRss=fluxRss.split("\n")
           else
            elt.config.fluxRss=null

          let response="";        
          if(elt.entrepriseId!=null && elt.entrepriseId!="")
            response= await EntrepriseDataService.updateAsync(elt.entrepriseId,elt);
          else
            response= await EntrepriseDataService.createAsync(elt);

          if(response!=null && (response.status=="200"|| response.status=="201") )
            {
              //elt=person.data;
              setEntreprise(response.data);             
              perf.result="success";
              perf.msg="Mise à jour effectuée avec succès" 
              showNotif(perf);  

              Utils.setCssSectionColor("body", ihmColor.bodyBgColor)  
              Utils.setCssSectionColor("menu", ihmColor.menuBgColor,ihmColor.menuTextColor, ihmColor.menuBgSelectColor,ihmColor.menuSelectTextColor)    
              Utils.setCssSectionColor("table", ihmColor.tableHeaderBgColor,ihmColor.tableHeaderTextColor)  
              window.location.href = window.location.href.split( '#' )[0];; 
                             
            }  
           else
           {            
             perf.result="error";
              perf.msg= response.data.message;            
               showNotif(perf);              
           }            
        }
      }  
      setLoading(false) 
  };




async function getInfraInfo ( ){
    let response=null; 
      
    response= await EntrepriseDataService.getMacVersionAsync();
     if(response!=null && response.status=="200" ) 
     {    
        if(response.data!=null && response.data!="")
          {

            setInfraInfo(response.data)
              //this.setState({infraInfo:response.data});
              //console.log(response.data)
          } 
         
      }

  }

async function retrieveEntreprise (){  
    let resp=null;
    resp= await EntrepriseDataService.checkLicenceAsync();  
    if(resp!=null && (resp.status=="200" || resp.status=="400") )          
        {
          setEntreprise(resp.data);  
          setConfig(resp.data.config)     
           setPreviewImg(null);
           if(resp.data.logo!=null && resp.data.logo!="")
           {
              FileService.getFileInfo(resp.data.logo).then(response => {
                
                let fileInfo=response.data;
                let img=`data:${fileInfo.fileType};base64,${fileInfo.fileData}`
                setPreviewImg(img);
                //setPreviewImg(fileInfo);

              })
              .catch(e => {
                console.log(e);
              });   
            }  
        }

  };
async function retrievePayss (){
  
    let resp=await PaysDataService.getActifAsync(); 
    if(resp!=null && resp.status=="200" )          
        {
          setPayss(resp.data);
          
        }
}

async function retrieveVilles(paysId, nomVille,actif){
  setVilles([]);
 let resp=await VillesDataService.findVillActifByPaysIdAsync(paysId, nomVille,actif); 
    if(resp!=null && resp.status=="200" )          
        {
          setVilles(resp.data);   
               
        }
}


 


function isValid  (elt) {
 
    let err=initialEntrepriseState;
    let valid=true;
        console.log("elt======>",elt);
    if( elt.nomEntreprise==null || elt.nomEntreprise.length<2) 
       {
      err.errorMsg+="<br/>-"
       err.errorMsg+=err.nomEntreprise="Nom incorrecte";
         valid=false;
     } 
      if( elt.adresse==null || elt.adresse.length<2) 
       {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.adresse="L'adresse est requis";
         valid=false;
     } 
      if( elt.telAccueil==null || elt.telAccueil.length<2) 
       {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.telAccueil="Le Téléphone est requis";
         valid=false;
     }
      if( elt.ville==null || elt.ville.nomVille==null || elt.ville.nomVille.length<2) 
       {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.ville.nomVille="La ville es requise";
         valid=false;
     }
     if( (elt.ville==null || elt.ville.pays==null) || elt.ville.pays.nomPays==null || elt.ville.pays.nomPays.length<2) 
       {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.ville.pays.nomPays="Le pays est requis";
         valid=false;
     }
     if(elt.licenceKey==null || elt.licenceKey.length<100) 
         {
           err.errorMsg+="<br/>-"
       err.errorMsg+=err.licenceKey="Licence  incorrecte";
          valid=false;
          
     }
 
 if(elt.config!=null &&  (isNaN(elt.config.tauxTVAEntreprise) || elt.config.tauxTVAEntreprise<0||elt.config.tauxTVAEntreprise>100)) 
         {
           err.errorMsg+="<br/>-"
         err.errorMsg+=err.config.tauxTVAEntreprise="Valeur  du taux TVA incorrecte";
          valid=false;
          
     }
  
 if(elt.config!=null &&  (isNaN(elt.config.defaultPageSize) || elt.config.defaultPageSize<10)) 
         {
           err.errorMsg+="<br/>-"
       err.errorMsg+=err.config.defaultPageSize="Valeur du nombre de ligne par page incorrecte:il doit être supérieur ou égale à 10";
          valid=false;
          
     }
  if(elt.config!=null &&  (isNaN(elt.config.inactivityTime) || elt.config.inactivityTime<=0)) 
         {
           err.errorMsg+="<br/>-"
       err.errorMsg+=err.config.inactivityTime="Valeur du temps d'inactivité incorrecte";
          valid=false;
          
     }
      console.log("elt.config.jwtRefreshExpiration",elt.config.jwtRefreshExpiration);
      if(elt.config!=null  && (isNaN(elt.config.jwtRefreshExpiration) || elt.config.jwtRefreshExpiration<=0)) 
         {


           err.errorMsg+="<br/>-"
       err.errorMsg+=err.config.jwtRefreshExpiration="Valeur du jeton de rafraichissement incorrecte";
          valid=false;
          
     }
      if(entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("MESSAGERIE")
        && elt.config!=null &&  elt.config.mailConfig!=null) 
         {
             if(elt.config.mailConfig.port!=null &&elt.config.mailConfig.port!="" &&isNaN(elt.config.mailConfig.port) ) 
             {
               err.errorMsg+="<br/>-"
                err.errorMsg+=err.config.mailConfig.port="Port incorrecte";
              valid=false;              
            }
             if(elt.config.mailConfig.userName==null && elt.config.mailConfig.userName!="" && !Utils.validateEmail(elt.config.mailConfig.userName)) 
            {
                   err.errorMsg+="<br/>-"
                err.errorMsg+=err.config.mailConfig.port="format du mail incorrecte";
                  valid=false;                  
             }         
          
        }
         if(entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("PORTAIL_PATIENT")
        && elt.config!=null &&  elt.config.portailPersonnel!=null) 
         {
             if(elt.config.portailPersonnel.rdvMaxPossible!=null &&elt.config.portailPersonnel.rdvMaxPossible!="" &&isNaN(elt.config.portailPersonnel.rdvMaxPossible) ) 
             {
               err.errorMsg+="<br/>-"
             err.errorMsg+=err.config.portailPersonnel.rdvMaxPossible="Valeur du RDV max possible incorrecte";
              valid=false;              
            }
            if(elt.config.portailPersonnel.rdvMaxNonHonnere!=null &&elt.config.portailPersonnel.rdvMaxNonHonnere!="" &&isNaN(elt.config.portailPersonnel.rdvMaxNonHonnere) ) 
             {
               err.errorMsg+="<br/>-"
         err.errorMsg+=err.config.portailPersonnel.rdvMaxNonHonnere="Valeur du RDV max non honnoré incorrecte";
              valid=false;              
            }
            if(elt.config.portailPersonnel.rdvNombreDeMois!=null &&elt.config.portailPersonnel.rdvNombreDeMois!="" &&isNaN(elt.config.portailPersonnel.rdvNombreDeMois) ) 
             {
               err.errorMsg+="<br/>-"
             err.errorMsg+=err.config.portailPersonnel.rdvNombreDeMois="Valeur du nombre de mois pour le RDV incorrecte";
              valid=false;              
            }
                   
          
        }
         if(valid==false)
        {
            err.errorMsg="Une ou plusieurs erreurs ont été constatées dans le formulaire:"+err.errorMsg;
        }
   console.log("err",err);
  setErrors(err);
    return valid;

  };


const performAction = (entreprise,action) => {
  let perf=null;
  console.log("entreprise=============>",entreprise)
  if(action=="PUT")
  {
    retrieveVilles(entreprise?.ville?.pays?.paysId,null,true);
    let color={...initialIhmColor}
    color.bodyBgColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise.config?.ihmColors,"key","bodyBgColor")?.value
    color.menuBgColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise.config?.ihmColors,"key","menuBgColor")?.value
    color.menuTextColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise.config?.ihmColors,"key","menuTextColor")?.value
    color.menuBgSelectColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise.config?.ihmColors,"key","menuBgSelectColor")?.value
    color.menuSelectTextColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise.config?.ihmColors,"key","menuSelectTextColor")?.value
    color.tableHeaderBgColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise.config?.ihmColors,"key","tableHeaderBgColor")?.value
    color.tableHeaderTextColor=Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise.config?.ihmColors,"key","tableHeaderTextColor")?.value
    setIhmColor(color)
    setMailConfig(entreprise.config.mailConfig)
      setConfigEditique(entreprise.config.configEditique)
     setPortailPersonnel(entreprise.config.portailPersonnel)
    setFluxRss(entreprise.config.fluxRss.join("\n"))

  }
  else
  {
    setEntreprise(initialEntrepriseState);
    retrieveEntreprise();
    retrievePayss();
  }
  
    perf=initialPerformState;

   // setEntreprise(entreprise);      
    setErrors(initialEntrepriseState);
    perf.action=action;
    setPerform(perf);  
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}



const renderShowEntreprise=()=>{

  return (
    <div className="col">
     <section className="accordion">
              <input type="checkbox" name="collapse" id="handle1" defaultChecked />
              <h2 className="handle">
                <label htmlFor="handle1">Info sur l'établissement</label>
              </h2>
              <div className="content">
               <table className='table table-bordered table-sm'>
                <tbody>
                
                    <tr><th className="table-active">Nom </th><td>{entreprise.nomEntreprise}</td></tr>
                    <tr><th className="table-active">Rue</th><td>{entreprise.numRue}</td></tr>
                    <tr><th className="table-active">Adresse</th><td>{entreprise.adresse}</td></tr> 
                    <tr><th className="table-active">Code postal</th><td>{entreprise.cp}</td></tr>   
                    <tr><th className="table-active">Ville</th><td> {entreprise?.ville?.nomVille}</td></tr>    
                    <tr><th className="table-active">Pays</th><td>{entreprise?.ville?.pays.nomPays}</td></tr>                     
                      <tr><th className="table-active">Tél. acceuil</th><td>{entreprise.telAccueil}</td></tr>   
                    <tr><th className="table-active">Tél. autre</th><td>{entreprise.tel2}</td></tr> 
                     <tr><th className="table-active">Lien page d'acceuil</th><td>{entreprise.frontUrl}</td></tr>  
                    <tr><th colSpan="2" className="table-active">Description :</th></tr>
                    <tr><td colSpan="2"> {entreprise.description}</td></tr> 
                     <tr><th className="table-active">Logo </th><td>{previewImg && (                         
                            <img className="image-preview-file" 
                            //src={previewImages} 
                            src={previewImg}
                            //alt={"image-" + i}  
                            style={{maxHheight:'150px',maxWidth:'150px'}}
                            />                   
                      )}</td></tr>  
                      <tr><th className="table-active">Image page d'acceuil</th><td> <img src={entreprise?.homePageImg} alt="Page d'acceuil" style={{maxHheight:'250px',maxWidth:'550px'}} /> </td></tr> 
                                  
                </tbody>
              </table>
              </div>
           </section>   

             <section className="accordion">
              <input type="checkbox" name="collapse" id="handle2"  />
              <h2 className="handle">
                <label htmlFor="handle2">Licence</label>
              </h2>
              <div className="content">
               <table className='table table-bordered table-sm'>
                <tbody>
                    <tr><th className="table-active">Type de Licence</th><td>{entreprise?.licence?.typeLicence}</td></tr>
                    <tr><th className="table-active">Licence pour </th><td>{entreprise?.licence?.nomEntreprise}</td></tr>
                    <tr><th className="table-active">Licence pour maximum</th><td>{entreprise?.licence?.quotaUtilisateur} utilisateurs</td></tr>
                    <tr><th className="table-active">Version</th><td>{entreprise?.licence?.version}</td></tr>
                    <tr><th className="table-active">Modules</th><td>{entreprise?.licence?.modules.join(' / ')}</td></tr>
                    <tr><th className="table-active">Date debut licence</th><td> {entreprise?.licence?.dateDebutLicence}</td></tr>
                    <tr><th className="table-active">Date de fin de licence </th><td>{entreprise?.licence?.dateFinLicence}</td></tr>
                    <tr><th className="table-active">Version </th><td>{entreprise?.licence?.version}</td></tr>
                    <tr><th className="table-active">Code </th><td>{entreprise?.licence!=null && entreprise?.licence?.adresseMac!=null&& entreprise?.licence?.adresseMac.replaceAll("-","")}</td></tr>
                    {/*} <tr><th className="table-active">OS </th><td>{infraInfo?.osName}</td></tr>
                     <tr><th className="table-active">CPU </th><td>{infraInfo?.cpu}</td></tr>
                     <tr><th className="table-active">Carte </th><td>{infraInfo?.motherboard}</td></tr>*/}
                                  
                </tbody>
              </table>
              </div>
           </section>
            {(entreprise.config!=null)&&(
             <section className="accordion">
              <input type="checkbox" name="collapse" id="modules"  />
              <h2 className="handle">
                <label htmlFor="modules">Gestion des modules</label>
              </h2>
              <div className="content">
               <table className='table table-bordered table-sm'>
              
                <tbody>
                    
                    {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("MESSAGERIE")&&(
                    <tr><th className="table-active">Module messagerie</th><td> {entreprise?.config?.moduleMessagerie==true?"Activé":"Déactivé"}</td></tr>
                    )}
                    {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("DOCUMENT")&&(
                    <tr><th className="table-active">Module documents</th><td> {entreprise?.config?.moduleDocument==true?"Activé":"Déactivé"}</td></tr>
                    )}
                     {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("CERTIFICAT")&&(
                    <tr><th className="table-active">Module certificats</th><td> {entreprise?.config?.moduleCertificat==true?"Activé":"Déactivé"}</td></tr>
                    )}  
                    {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("DASHBOARD")&&(
                    <tr><th className="table-active">Tableau de bord</th><td> {entreprise?.config?.moduleTableauDeBord==true?"Activé":"Déactivé"}</td></tr>
                    )} 
                     
                    {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("BILLING")&&(
                    <tr><th className="table-active">Module facturation</th><td> {entreprise?.config?.moduleFacturation==true?"Activé":"Déactivé"}</td></tr>
                    )}
                    {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("REFERENTIEL")&&(
                    <tr><th className="table-active">Module médicaments</th><td> {entreprise?.config?.moduleMedicament==true?"Activé":"Déactivé"}</td></tr>
                    )}
                     {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("FLUX_RSS")&&(
                    <tr><th className="table-active">Flux RSS</th><td> {entreprise?.config?.moduleFluxRss==true?"Activé":"Déactivé"}</td></tr>
                    )}
                     {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("PORTAIL_PATIENT")&&(
                    <tr><th className="table-active">Portail patient</th><td> {entreprise?.config?.modulePortailPersonnel==true?"Activé":"Déactivé"}</td></tr>
                    )}
                
                    {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("STOCK")&&(
                    <tr><th className="table-active">Module de stock</th><td> {entreprise?.config?.moduleStock==true?"Activé":"Déactivé"}</td></tr>
                    )} 
                     {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("PHARMACIE")&&(
                    <tr><th className="table-active">Module de pharmacie</th><td> {entreprise?.config?.modulePharmacie==true?"Activé":"Déactivé"}</td></tr>
                    )}         
                </tbody>
              </table>
              </div>
           </section>)} 
   
 {(entreprise.config!=null)&&(
             <section className="accordion">
              <input type="checkbox" name="collapse" id="handle3"  />
              <h2 className="handle">
                <label htmlFor="handle3">Configuration</label>
              </h2>
              <div className="content">
               <table className='table table-bordered table-sm'>
              
                <tbody>
                   
                    <tr><th className="table-active">Taux entreprise </th><td>{entreprise?.config?.tauxTVAEntreprise}</td></tr>
                    <tr><th className="table-active">Taux praticien</th><td>{entreprise?.config?.tauxFournisseur}</td></tr>
                    <tr><th className="table-active">Devise</th><td>{entreprise?.config?.deviseMonetaire}</td></tr> 
                    <tr><th className="table-active">Nombre d'élements par défaut à afficher</th><td>{entreprise?.config?.defaultPageSize}</td></tr> 
                    <tr><th className="table-active">Periode d'inactivé </th><td>{entreprise?.config.inactivityTime} secondes</td></tr>  
                    <tr><th className="table-active">Durée de validité du jeton </th><td>{entreprise?.config.jwtRefreshExpiration} secondes </td></tr>    
                    <tr><th className="table-active">Mot de passe par defaut</th><td> {entreprise?.config.userDefaultPassword}</td></tr>  
                     <tr><th className="table-active">Créer des consultations sans indication des intervenants</th><td> {entreprise?.config?.consultationSansIndicationIntervenants==true?"Oui":"Non"}</td></tr>   
                    <tr><th className="table-active">Afficher la facture dans l'onglet consultation</th><td> {entreprise?.config?.factureDansConsultation==true?"Oui":"Non"}</td></tr>
                    {/* <tr><th className="table-active">Flux Rss</th><td> {entreprise?.config?.fluxRss!=null &&Utils.replaceAllCustom(entreprise?.config?.fluxRss.join(","),","," \n ")}</td></tr>*/} 
                   <tr><th className="table-active">Flux Rss</th><td>{entreprise?.config.fluxRss.map((item, index) => (<p key={index}>{item}</p>))}</td></tr>

                               
                </tbody>
              </table>
              </div>
           </section>)} 
            {entreprise.config!=null&&(
             <section className="accordion">
              <input type="checkbox" name="collapse" id="configEditique"  />
              <h2 className="handle">
                <label htmlFor="configEditique">Configuration Editique</label>
              </h2>
              <div className="content">
               <table className='table table-bordered table-sm'>
              
                <tbody>

                   <tr><th  colSpan="2" style={{fontWeight:'bold',textAlign:'center', fontSize:'14px'}}>Entête et pied de page</th></tr>
                   <tr><th className="table-active">Entête</th><td><div  dangerouslySetInnerHTML={Utils.createMarkup(entreprise?.config?.configEditique?.header,"\n","<br/>")}/> </td></tr>
                   <tr><th className="table-active">Pied de page</th><td> <div  dangerouslySetInnerHTML={Utils.createMarkup(entreprise?.config?.configEditique?.footer,"\n","<br/>")}/></td></tr>
                    <tr>
                        <td colSpan="2">
                            <table className='table table-bordered table-sm'>
                            <tbody>
                            <tr  >
                    <th colSpan="4" style={{fontWeight:'bold',textAlign:'center', fontSize:'14px'}}>Format et orientation des documents</th></tr>                   
                    <tr>                     
                        <th className="table-active">Vente de produit</th>
                       <td>
                       Format :{entreprise?.config?.configEditique?.venteProduitFormat}<br/>
                       Orientation:{entreprise?.config?.configEditique?.venteProduitOrientation}  
                       </td>
                    </tr>
                    <tr>
                     <th className="table-active">Commande de Produit</th>
                       <td>
                       Format :{entreprise?.config?.configEditique?.commandeProduitFormat}<br/>
                       Orientation:{entreprise?.config?.configEditique?.commandeProduitOrientation}  
                       </td>
                      
                    </tr>
                   </tbody>
                    </table>
                        </td>
                    </tr>
                     
      
                  <tr><th  colSpan="2" style={{fontWeight:'bold',textAlign:'center', fontSize:'14px'}}>Autres paramètres</th></tr>
                   <tr><th className="table-active">Taille max des images en méga octet </th><td> {entreprise?.config?.configEditique?.imgMaxSizeMB} Mo</td></tr>


                </tbody>
              </table>
              </div>
           </section>)}
             
            
            
            {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("MESSAGERIE")&&(
             <section className="accordion">
              <input type="checkbox" name="collapse" id="mailConfig"  />
              <h2 className="handle">
                <label htmlFor="mailConfig">Configuration du mail</label>
              </h2>
              <div className="content">
               <table className='table table-bordered table-sm'>
              
                <tbody>
                   
                    <tr><th className="table-active">Protocol</th><td>{entreprise?.config?.mailConfig?.protocol}</td></tr>
                    <tr><th className="table-active">Port</th><td>{entreprise?.config?.mailConfig?.port}</td></tr>
                    <tr><th className="table-active">Host</th><td>{entreprise?.config?.mailConfig?.host}</td></tr>
                     <tr><th className="table-active">Email </th><td>{entreprise?.config?.mailConfig?.userName}</td></tr>
                    <tr><th className="table-active">Mot de passe</th><td>{(entreprise?.config?.mailConfig?.password!=null &&entreprise?.config?.mailConfig?.password.length>0)?(entreprise?.config?.mailConfig?.password.slice(0,3)+"**********"):""}</td></tr>
                    <tr><th className="table-active">Authentification via SMTP</th><td>{entreprise?.config?.mailConfig?.smtpAuth}</td></tr> 
                    <tr><th className="table-active"> Start TLS Requis</th><td>{entreprise?.config?.mailConfig?.smtpStarttlsRequired}</td></tr>
                    <tr><th className="table-active">Start TLS Activer activé</th><td>{entreprise?.config?.mailConfig?.smtpStarttlsEnable}</td></tr>
                    {/*<tr><th className="table-active">Debug activé</th><td>{entreprise?.config?.mailConfig?.smtpDebug}</td></tr> */} 
                                
                </tbody>
              </table>
              </div>
           </section>)}
                
 {(entreprise.config!=null && entreprise.config.ihmColors.length>0)&&(
             <section className="accordion">
              <input type="checkbox" name="collapse" id="handle4"  />
              <h2 className="handle">
                <label htmlFor="handle4">Configuration IHM</label>
              </h2>
              <div className="content">
                <table className='table table-bordered table-sm'>
              
                <tbody>
                    <tr><th className="table-active"> De fond</th><td><span style={{backgroundColor: `${Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","bodyBgColor")?.value}` }} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td></tr>
                    <tr><th className="table-active"> Du ménu</th><td><span style={{backgroundColor: `${Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","menuBgColor")?.value}` }} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td></tr>
                    <tr><th className="table-active"> Du texte du menu</th><td><span style={{backgroundColor: `${Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","menuTextColor")?.value}` }} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td></tr>
                    <tr><th className="table-active"> Du menu sélectionné</th><td><span style={{backgroundColor: `${Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","menuBgSelectColor")?.value}` }} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td></tr>
                    <tr><th className="table-active"> Du texte du menu sélectionné</th><td><span style={{backgroundColor: `${Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","menuSelectTextColor")?.value}` }} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td></tr>
                    <tr><th className="table-active"> De l'entête du tableau</th><td><span style={{backgroundColor: `${Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","tableHeaderBgColor")?.value}` }} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td></tr>
                    <tr><th className="table-active"> De fond du tableau</th><td><span style={{backgroundColor: `${Utils.filterArrayByFieldNameAndValueAndOneObject(entreprise?.config?.ihmColors,"key","tableHeaderTextColor")?.value}` }} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td></tr>     

                               
                </tbody>
              </table>
              </div>
           </section>   )}
     <div className="modal-footer"> 
                 
                  {(entreprise.entrepriseId!=null)&& (
                      <Button variant="warning"  className="pull-right" onClick={() => performAction(entreprise,"PUT")}>
                        Modifier
                      </Button>)} 
                       
             </div> 
</div>
    )
}

const renderFormEntreprise=()=>{
  return (
<div className="col">


    <section className="accordion">
     <input type="radio" name="collapse" id="handle1" defaultChecked />
        <h2 className="handle">
                <label htmlFor="handle1">Info sur l'établissement</label>
              </h2>
              <div className="content">

                <div className="form-group">  
                     Nom de l'établissement de santé<input
                        type="text"                       
                        id="nomEntreprise"
                        required
                        value={entreprise.nomEntreprise}
                        onChange={handleEntrepriseChange}
                        name="nomEntreprise"
                        placeholder="Nom de l'établissement de santé"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.nomEntreprise.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.nomEntreprise}</div>
                    </div>                                             
                <div className="form-group">    
                    Description de l'établissement de santé :<textarea
                        type="text"
                        className="form-control"
                        id="description"
                        required
                        value={entreprise.description||""}
                        onChange={handleEntrepriseChange}
                        name="Description"
                        maxLength="250"
                        placeholder="Description de l'établissement de santé"
                      />                  
                  <div className="invalid-feedback">{errors.description}</div>                     
                </div>

               <div className="form-group" >  
                    
                     <label> Logo</label> 
                        {<LoadFiles id="logo" key="logo" showImage={true} label={"logo"}  maxSizeMB={0.5} extension="image/*"
                        multiFile={false} action={perform.action} selectedFiles={selectedFile} handleLoadFiles={handleLoadFiles}/>}                     
                   
                {selectedFile?.length==0&&entreprise?.logo?.length>0&&
                    <div className="form-group text-center">
                     <img
                        src={previewImg}
                        alt=""
                        className="image-preview-file"
                        /*onClick={() =>
                          window.open(selectedFiles[i].data, "_blank")
                        }*/
                      />
                    <img
                            src="/img/delete.png"
                            alt="Supprimer"
                            className="icone-action"
                            onClick={() =>
                                  setEntreprise({ ...entreprise, "logo": "" })
                                }
                          />
                    </div>}




               </div>

                 <div className="form-group" >  
                    
                     <label> Image page d'acceuil</label> 
                        {<LoadFiles id="homePageImg" key="homePageImg" showImage={true} label={"homePageImg"}  maxSizeMB={0.5} extension="image/*"
                        multiFile={false} action={perform.action} selectedFiles={selectedHomePageImg} handleLoadFiles={handleLoadFiles}/>}                     
                   {selectedHomePageImg?.length==0&&entreprise?.homePageImg?.length>0&&
                    <div className="form-group text-center">
                     <img
                        src={entreprise?.homePageImg}
                        alt=""
                        className="image-preview-file"
                        /*onClick={() =>
                          window.open(selectedFiles[i].data, "_blank")
                        }*/
                      />
                    <img
                            src="/img/delete.png"
                            alt="Supprimer"
                            className="icone-action"
                            onClick={() =>
                                  setEntreprise({ ...entreprise, "homePageImg": "" })
                                }
                          />
                    </div>}

                 </div>

                 <div className="form-group"> 
                    Licence<textarea
                        type="text"
                        className={`form-control form-control-sm ${errors.licenceKey.length>0 ? 'is-invalid' : ''}`}
                        id="licenceKey"
                        required
                        value={entreprise.licenceKey}
                        onChange={handleEntrepriseChange}
                        name="licenceKey"                  
                        placeholder="Licence"
                        rows={5}
                      />                  
                  <div className="invalid-feedback">{errors.licenceKey}</div>                     
                </div>

               
            </div>
    </section>


    <section className="accordion">
     <input type="radio" name="collapse" id="handle2"  />
        <h2 className="handle">
                <label htmlFor="handle2">Coordonnés</label>
              </h2>
              <div className="content">
               <div className="form-group form-inline"> 
                      Rue: <input
                        type="text"                       
                        id="numRue"
                        required
                        value={entreprise.numRue||""}
                        onChange={handleEntrepriseChange}
                        name="numRue"
                        placeholder="Rue"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.numRue.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.numRue}</div>
                    </div>
                     <div className="form-group form-inline"> 
                      Adresse:<input
                        type="text"                       
                        id="adresse"
                        required
                        value={entreprise.adresse||""}
                        onChange={handleEntrepriseChange}
                        name="adresse"
                        placeholder="Adresse"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.adresse.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.adresse}</div>
                    </div>
                     <div className="form-group form-inline">    
                      Code Postale:<input
                        type="text"                       
                        id="cp"
                        required
                        value={entreprise.cp||""}
                        onChange={handleEntrepriseChange}
                        name="cp"
                        placeholder="Code Postale"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.cp.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.cp}</div>
                    </div>
                   
                     
                <div className="form-group form-inline">
                    Pays:<select id="paysId" name="paysId" onChange={handlePaysChange} value={entreprise?.ville?.pays?.paysId}  className={`form-control form-control-sm ${errors?.ville.nomVille.length>0 ? 'is-invalid' : ''}`}>
                     <option disabled={false} value="">Pays</option>
                      {payss &&
                      payss.map((p, index) => (
                      <option key={index} value={p.paysId}>{p.nomPays}</option>
                      ))}                  
                  </select>
                  <div className="invalid-feedback">{errors?.ville?.pays?.paysId}</div>
                </div> 
                 <div className="form-group form-inline">
                    Ville: <select id="villeId" name="villeId" onChange={handleVilleChange} value={entreprise?.ville?.villeId}  className={`form-control form-control-sm ${errors?.ville.nomVille.length>0 ? 'is-invalid' : ''}`}>
                    <option disabled={true} value="">Ville</option>
                       {villes &&
                      villes.map((v, index) => (
                      <option key={index} value={v.villeId}>{v.nomVille}</option>
                      ))}                     
                  </select>
                  <div className="invalid-feedback">{errors?.ville.villeId}</div>
                </div> 

                 <div className="form-group form-inline"> 
                      Tél. accueil:<input
                        type="text"                       
                        id="telAccueil"
                        required
                        value={entreprise.telAccueil}
                        onChange={handleEntrepriseChange}
                        name="telAccueil"
                        placeholder="Tél. accueil"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.telAccueil.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.telAccueil}</div>
                    </div>
                     <div className="form-group form-inline">
                      Second tél.:<input
                        type="text"                       
                        id="tel2"
                        required
                        value={entreprise.tel2||""}
                        onChange={handleEntrepriseChange}
                        name="tel2"
                        placeholder="Second tél."
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.tel2.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.tel2}</div>
                    </div>  

            </div>
    </section>
<section className="accordion">
     <input type="radio" name="collapse" id="modules"  />
        <h2 className="handle">
                <label htmlFor="modules">Modules</label>
              </h2>
              <div className="content">
             
            
                {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("MESSAGERIE")&&(
                 <div className="form-group form-inline">     
                    Module de messagerie:<select id="moduleMessagerie" name="moduleMessagerie" onChange={handleConfigChange} value={config.moduleMessagerie}  className={`form-control form-control-sm ${errors.config.moduleMessagerie.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module de messagerie</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.moduleMessagerie}</div>
                 </div>
                 )}
              {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("DOCUMENT")&&(
                 <div className="form-group form-inline">     
                    Module de document:<select id="moduleDocument" name="moduleDocument" onChange={handleConfigChange} value={config.moduleDocument}  className={`form-control form-control-sm ${errors.config.moduleDocument.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module document</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.moduleDocument}</div>
                 </div>
                 )}
                {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("CERTIFICAT")&&(
                  <div className="form-group form-inline">     
                    Module de certificats:<select id="moduleCertificat" name="moduleCertificat" onChange={handleConfigChange} value={config.moduleCertificat}  className={`form-control form-control-sm ${errors.config.moduleCertificat.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module de certificat</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.moduleCertificat}</div>
                 </div>)}
                {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("REFERENTIEL")&&(
                 <div className="form-group form-inline">     
                    Module de médicaments:<select id="moduleMedicament" name="moduleMedicament" onChange={handleConfigChange} value={config.moduleMedicament}  className={`form-control form-control-sm ${errors.config.moduleMedicament.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module de médicaments</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.moduleMedicament}</div>
                 </div>)}
                 {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("BILLING")&&(
                 <div className="form-group form-inline">     
                    Module de facturation:<select id="moduleFacturation" name="moduleFacturation" onChange={handleConfigChange} value={config.moduleFacturation}  className={`form-control form-control-sm ${errors.config.moduleFacturation.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module de facturation</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.moduleFacturation}</div>
                 </div>)}
                {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("FLUX_RSS")&&(

                  <div className="form-group form-inline">     
                    Module de flux RSS:<select id="moduleFluxRss" name="moduleFluxRss" onChange={handleConfigChange} value={config.moduleFluxRss}  className={`form-control form-control-sm ${errors.config.moduleFluxRss.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module de flux rss</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.moduleFluxRss}</div>
                 </div>)}
                 {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("DASHBOARD")&&( 
                  <div className="form-group form-inline">     
                    Module de tableau de bord:<select id="moduleTableauDeBord" name="moduleTableauDeBord" onChange={handleConfigChange} value={config.moduleTableauDeBord}  className={`form-control form-control-sm ${errors.config.moduleTableauDeBord.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module de tableau de bord</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.moduleFluxRss}</div>
                 </div>)} 
                  {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("PORTAIL_PATIENT")&&(
                <div className="form-group form-inline">     
                    Module portail patient:<select id="modulePortailPersonnel" name="modulePortailPersonnel" onChange={handleConfigChange} value={config.modulePortailPersonnel}  className={`form-control form-control-sm ${errors.config.modulePortailPersonnel.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module portail patient</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.modulePortailPersonnel}</div>
                 </div>)} 
                 
                  {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("STOCK")&&(
                <div className="form-group form-inline">     
                    Module de stock:<select id="moduleStock" name="moduleStock" onChange={handleConfigChange} value={config.moduleStock}  className={`form-control form-control-sm ${errors.config.moduleStock.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module de stock</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.moduleStock}</div>
                 </div>)} 
                  {entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("PHARMACIE")&&(
                <div className="form-group form-inline">     
                    Module pharmacie:<select id="modulePharmacie" name="modulePharmacie" onChange={handleConfigChange} value={config.modulePharmacie}  className={`form-control form-control-sm ${errors.config.modulePharmacie.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Module pharmacie</option>
                      <option value={true}>Activer</option>
                      <option value={false}>Déactiver</option>
                      
                   </select>        
                      <div className="invalid-feedback">{errors.config.modulePharmacie}</div>
                 </div>)} 
            </div>
    </section>
<section className="accordion">
     <input type="radio" name="collapse" id="handle3"  />
        <h2 className="handle">
                <label htmlFor="handle3">Configuration</label>
              </h2>
              <div className="content">
               <div className="form-group form-inline">  
                      Taux entreprise:<input
                        type="text"                       
                        id="tauxTVAEntreprise"
                        required
                        value={config.tauxTVAEntreprise}
                        onChange={handleConfigChange}
                        name="tauxTVAEntreprise"
                        placeholder="Taux entreprise"
                        maxLength="3"
                        className={`form-control form-control-sm ${errors.config.tauxTVAEntreprise.length>0 ? 'is-invalid' : ''}`}
                      style={{width: "70px"}}/>
                       <div className="invalid-feedback">{errors.config.tauxTVAEntreprise}</div>
                    </div>
               
                   <div className="form-group form-inline">  
                      Taux praticien:<input
                        type="text"                       
                        id="tauxFournisseur"
                        required
                        value={config.tauxFournisseur}
                        onChange={handleConfigChange}
                        name="tauxFournisseur"
                        placeholder="Taux praticien"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.config.tauxFournisseur.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config.tauxFournisseur}</div>
                    </div>
                  
                    <div className="form-group form-inline">  
                      Devise Monétaire:<input
                        type="text"                       
                        id="deviseMonetaire"
                        required
                        value={config.deviseMonetaire||""}
                        onChange={handleConfigChange}
                        name="deviseMonetaire"
                        placeholder="Devise Monaie"
                        maxLength="10"
                        className={`form-control form-control-sm ${errors.config.deviseMonetaire.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config.deviseMonetaire}</div>
                    </div>
                     <div className="form-group form-inline">  
                      Nombre d'élement par défaut à afficher:<input
                        type="text"                       
                        id="defaultPageSize"
                        required
                        value={config.defaultPageSize||""}
                        onChange={handleConfigChange}
                        name="defaultPageSize"
                        placeholder="Nombre d'élement par défaut à afficher"
                        maxLength="10"
                        className={`form-control form-control-sm ${errors.config.defaultPageSize.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config.defaultPageSize}</div>
                    </div>
                     <div className="form-group form-inline">  
                      Temps d'inactivité max avant deconnexion (en seconde):<input
                        type="text"                       
                        id="inactivityTime"
                        required
                        value={config.inactivityTime||""}
                        onChange={handleConfigChange}
                        name="inactivityTime"
                        placeholder="Temps d'inactivité max avant deconnexion (en seconde) "
                        maxLength="10"
                        className={`form-control form-control-sm ${errors.config.inactivityTime.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config.inactivityTime}</div>
                    </div>
                    <div className="form-group form-inline">  
                      Durée de validité du jeton (en secondes):<input
                        type="text"                       
                        id="jwtRefreshExpiration"
                        required
                        value={config.jwtRefreshExpiration||""}
                        onChange={handleConfigChange}
                        name="jwtRefreshExpiration"
                        placeholder="Durée de validité du jeton (en secondes)"
                        maxLength="10"
                        className={`form-control form-control-sm ${errors.config.jwtRefreshExpiration.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config.jwtRefreshExpiration}</div>
                    </div>
                    <div className="form-group form-inline">  
                      Mot de passe par defaut:<input
                        type="text"                       
                        id="userDefaultPassword"
                        required
                        value={config.userDefaultPassword}
                        onChange={handleConfigChange}
                        name="userDefaultPassword"
                        placeholder="Mot de passe par defaut"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.config.userDefaultPassword.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config.userDefaultPassword}</div>
                    </div>
                   
                     
                    
                     
                    

                    <div className="form-group form-inline">  
                      <p>Liens des Flux Rss <span className="text-info">(Indiquer un lien par ligne)</span>:</p><textarea
                        type="text"                       
                        id="fluxRss"
                        required
                        value={fluxRss||""}
                        onChange={handleConfigFluxRssChange}
                        name="fluxRss"
                        placeholder="Liens séparées par des virgules"
                        cols="60" 
                        rows="5"
                        className={`form-control form-control-sm ${errors.config.fluxRss.length>0 ? 'is-invalid' : ''}`}
                      />

                       <div className="invalid-feedback">{errors.config.fluxRss}</div>
                    </div>
                      
                     
            </div>
    </section>

    
             <section className="accordion">
              <input type="checkbox" name="collapse" id="configEditique"  />
              <h2 className="handle">
                <label htmlFor="configEditique">Configuration Editique</label>
              </h2>
              <div className="content">
               <h5 className="sectionTitle">Entête</h5>
               <table className='table table-bordered table-sm' id="header">
              
                <tbody>
                   
                 

                   <tr><th className="table-active">Entête</th>
                   <td> 
                        <Editor
                      apiKey="votre_api_key_tinymce" // Remplacez par une clé API valide ou laissez vide pour le mode gratuit
                      value={configEditique?.header}
                      tinymceScriptSrc="/js/tinymce/tinymce.min.js" // Remplacez par le chemin vers tinymce.min.js
                      init={Utils.initEditor}
                      onEditorChange={(newValue, editor) => {
                        //editor.getContent({ format: "text" }))
                        setConfigEditique({...configEditique,"header":newValue})
                        }}
                    />              
                     </td>
                   </tr>

                  

                </tbody>
              </table>

               <h5 className="sectionTitle">Pied de page</h5>
               <table className='table table-bordered table-sm' id="footer">
              
                <tbody>
                   
                  

                   <tr><th className="table-active">Pied de page</th>
                   <td> 
                        <Editor
                      apiKey="votre_api_key_tinymce" // Remplacez par une clé API valide ou laissez vide pour le mode gratuit
                      value={configEditique?.footer}
                      tinymceScriptSrc="/js/tinymce/tinymce.min.js" // Remplacez par le chemin vers tinymce.min.js
                      init={Utils.initEditor}
                      onEditorChange={(newValue, editor) => {
                        //editor.getContent({ format: "text" }))
                        setConfigEditique({...configEditique,"footer":newValue})
                        }}
                    />                    </td></tr>

                   

                </tbody>
              </table>

         <h5 className="sectionTitle">Autres paramètres</h5>
         <div className="form-group form-inline">  
                     Taille des images (MB):
                     <input
                        type="number"                       
                        id="imgMaxSizeMB"
                        required
                        value={configEditique.imgMaxSizeMB}
                        onChange={handleConfigEditiqueChange}
                        name="imgMaxSizeMB"
                        placeholder="Taille image"
                        className={`form-control form-control-sm `}
                        min="1" max="5"
                      />

                    
                    </div>


              </div>
           </section>



{entreprise.licence!=null && entreprise.licence.modules!=null && entreprise.licence.modules.includes("MESSAGERIE")&&(     
<section className="accordion">
     <input type="radio" name="collapse" id="mailConfig"  />
        <h2 className="handle">
                <label htmlFor="mailConfig">Configuration du mail</label>
              </h2>
              <div className="content">
               <div className="form-group form-inline">  
                      Protocol:<input
                        type="text"                       
                        id="protocol"
                        required
                        value={mailConfig.protocol||""}
                        onChange={handleMailConfigChange}
                        name="protocol"
                        placeholder="Protocol(ex.: smtp) "
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.config?.mailConfig.protocol.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config.mailConfig.protocol}</div>
                    </div>
                    <div className="form-group form-inline">  
                      Port:<input
                        type="text"                       
                        id="port"
                        required
                        value={mailConfig.port||""}
                        onChange={handleMailConfigChange}
                        name="port"
                        placeholder="Ex.: 587"
                        maxLength="6"
                        className={`form-control form-control-sm ${errors.config?.mailConfig.port.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config.mailConfig.port}</div>
                    </div>
                     <div className="form-group form-inline">  
                      Host:<input
                        type="text"                       
                        id="host"
                        required
                        value={mailConfig.host||""}
                        onChange={handleMailConfigChange}
                        name="host"
                        placeholder="Ex.: smtp.gmail.com"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.config?.mailConfig.host.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config.mailConfig.host}</div>
                    </div>
                     <div className="form-group form-inline">  
                      Email:<input
                        type="text"                       
                        id="userName"
                        required
                        value={mailConfig.userName||""}
                        onChange={handleMailConfigChange}
                        name="userName"
                        placeholder="Ex.: user@gmail.com"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.config?.mailConfig.userName.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config?.mailConfig.userName}</div>
                    </div>
                     <div className="form-group form-inline">  
                      Mots de passe:<input
                        type="password"                       
                        id="password"
                        required
                        value={mailConfig.password||""}
                        onChange={handleMailConfigChange}
                        name="password"
                        placeholder="Mot de passe"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.config?.mailConfig.password.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.config?.mailConfig.password}</div>
                    </div>
                   <div className="form-group form-inline">     
                   Authentification via smtp:<select id="smtpAuth" name="smtpAuth" onChange={handleMailConfigChange} value={mailConfig.smtpAuth}  className={`form-control form-control-sm ${errors.config?.mailConfig.smtpAuth.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">SMTP</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                   </select>        
                      <div className="invalid-feedback">{errors.config?.mailConfig.smtpAuth}</div>
                    </div>
                     <div className="form-group form-inline">     
                   Start TLS requis :<select id="smtpStarttlsRequired" name="smtpStarttlsRequired" onChange={handleMailConfigChange} value={mailConfig.smtpStarttlsRequired}  className={`form-control form-control-sm ${errors.config?.mailConfig.smtpStarttlsRequired.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Star TLS</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                   </select>        
                      <div className="invalid-feedback">{errors.config?.mailConfig.smtpStarttlsRequired}</div>
                    </div>
                     <div className="form-group form-inline">     
                   Activer Start TLS:<select id="smtpStarttlsEnable" name="smtpStarttlsEnable" onChange={handleMailConfigChange} value={mailConfig.smtpStarttlsEnable}  className={`form-control form-control-sm ${errors.config?.mailConfig.smtpStarttlsEnable.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Activer Start TLS</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                   </select>        
                      <div className="invalid-feedback">{errors.config?.mailConfig.smtpStarttlsEnable}</div>
                    </div>
                                  
                     
            </div>
    </section>)}

    <section className="accordion">
     <input type="radio" name="collapse" id="handle4"  />
        <h2 className="handle">
                <label htmlFor="handle4">Configuration IHM</label>
              </h2>
              <div className="content">





               <table className='table table-bordered table-sm'>
              
                <tbody>
                    <tr><th className="table-active">Couleur de fond</th><td> <input
                        type="color"                       
                        id="bodyBgColor"
                        required
                        value={ihmColor.bodyBgColor}
                        onChange={handleIhmColorChange}
                        name="bodyBgColor"
                        placeholder="bodyBgColor"
                        maxLength="100"
                        
                      />
                      </td></tr>
                    <tr><th className="table-active"> Couleur du ménu</th><td>
                    <input
                        type="color"                       
                        id="menuBgColor"
                        required
                        value={ihmColor.menuBgColor}
                        onChange={handleIhmColorChange}
                        name="menuBgColor"
                        placeholder="menuBgColor"
                        maxLength="100"
                        
                      />                      </td></tr>
                    <tr><th className="table-active">Couleur de texte du menu</th><td>
                    <input
                        type="color"                       
                        id="menuTextColor"
                        required
                        value={ihmColor.menuTextColor}
                        onChange={handleIhmColorChange}
                        name="menuTextColor"
                        placeholder="menuTextColor"
                        maxLength="100"
                        
                      />                      </td></tr>
                    <tr><th className="table-active"> Couleur du menu sélectionné</th><td>
                    <input
                        type="color"                       
                        id="menuBgSelectColor"
                        required
                        value={ihmColor.menuBgSelectColor}
                        onChange={handleIhmColorChange}
                        name="menuBgSelectColor"
                        placeholder="menuBgSelectColor"
                        maxLength="100"
                        
                      />
                    </td></tr>
                    <tr><th className="table-active"> Couleur du texte du menu sélectionné</th><td>
                 <input
                        type="color"                       
                        id="menuSelectTextColor"
                        required
                        value={ihmColor.menuSelectTextColor}
                        onChange={handleIhmColorChange}
                        name="menuSelectTextColor"
                        placeholder="menuSelectTextColor"
                        maxLength="100"
                        
                      /> 
                    </td></tr>
                    <tr><th className="table-active"> Couleur de l'entête du tableau</th><td>
                    <input
                        type="color"                       
                        id="tableHeaderBgColor"
                        required
                        value={ihmColor.tableHeaderBgColor}
                        onChange={handleIhmColorChange}
                        name="tableHeaderBgColor"
                        placeholder="tableHeaderBgColor"
                        maxLength="100"
                        
                      />                     </td></tr>
                    <tr><th className="table-active"> Couleur du texte de l'entête du tableau</th><td>
                        <input
                        type="color"                       
                        id="tableHeaderTextColor"
                        required
                        value={ihmColor.tableHeaderTextColor}
                        onChange={handleIhmColorChange}
                        name="tableHeaderTextColor"
                        placeholder="tableHeaderTextColor"
                        maxLength="100"
                        
                      />                     </td></tr>     

                               
                </tbody>
              </table>

               
                     
            </div>
    </section>

{(errors?.errorMsg!=null&& errors?.errorMsg.length>0&&<div className="alert alert-danger" role="alert"> <p  dangerouslySetInnerHTML={{__html: errors?.errorMsg}}></p></div>)}

  <div className="row">
               <div className="alert alert-danger"> Une reconnexion sera nécéssaire afin que toutes les modifications soient appliquées. </div>
              </div>
           <div className="modal-footer"> 
                  <span>  </span>
                 
                 <Button
                className="btn  btn-block"
                disabled={loading}
                onClick={() => saveEntreprise(entreprise)}
                variant={'warning'}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>  Mettre à Jour</span>
              </Button>
                 <span>  </span>
                  <Button variant="secondary" onClick={() => performAction(entreprise,"GET")}>
                          Fermer
                 </Button> 
                       
             </div>  
            
             
</div>
    )}
return (
<div className="container">        


<div className="submit-form">
    
{((perform.action=="POST" || perform.action=="PUT"))? (
           
renderFormEntreprise()

):( 
renderShowEntreprise()
              )} 
    </div>
  </div>
  )
};

export default Entreprise;