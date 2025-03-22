import React, {useState, useEffect,useCallback } from "react";
import {Link } from "react-router-dom";
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import PersonnelDataService from "../../services/personnels.service";
import PersonneDataService from "../../services/personne.service"; 
import RolesDataService from "../../services/roles.service";
import VilleDataService from "../../services/villes.service";
import PaysDataService from "../../services/pays.service";
import ContactProDataService from "../../services/contactPro.service";
import FileService from "../../services/file.service";
import PieceIdentiteDataService from "../../services/pieceIdentite.service";
import UserDataService from "../../services/security/user.service";
import UploadFile from "../../components/uploadFile.component";
import LoadFiles from "../../components/loadFiles.component";
import Utils from "../../utils/utils";
import globalObject from '../../global.js'
import CreatableSelect from 'react-select/creatable';
import ModelesDataService from "../../services/modeles.service";

import Select from 'react-select';
import { Button,  Modal } from 'react-bootstrap';



//Bootstrap and jQuery libraries
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from 'jquery'; 

import 'date-fns';
import { TextField } from '@mui/material';

/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 /* eslint-disable */
const Personnels = (props) => {

    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",
       
    };

const initialObjectState = {

   
       "personnel": {
        "personnelId": null,
        "personneId":null,
       
        "numPersonnel": "",
        
        "fonction": "",
        "typePersonnel": "",
        "salaire":0,
        "dateDebutExercice":"",
        "avatar": "",
       
        "profession": "",
        "contactPro": {},
        "actif": true,
        "dateCreation": null,
        "dateModif": null,
        "remarque": "",
        "personne":{},
        "contactPro":{},
        "userId":null
     },
     "contactPro": {
        "contactProId": null,
        "personneId":null,          
        "telFixePro": "",
        "telMobilePro": "",
         "emailPro": "",
        "actif": "",
        "dateCreation": null,
        "dateModif": null,       
        "userId":null
     },
     "user": {
        "id": null,
        "personneId":null,
        "username": "",
        "contactPro": {},
        "email": "",
        "actif": null,
        "dateCreation": null,
        "dateModif": null,
        "roles": [],
        "remarque": "",
        "createdBy":null
     },
        
        "personne": {
            "PersonneId": null,
           
            "nom": "",
            "civilite": "",
            "nomJeuneFille": "",
            "prenoms": "",
            "situationFamilial": "",
            "dateNaissance": "",
            "lieuNaissance": {
                "villeId": null,
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
                    "actif": null,
                    "dateCreation": null,
                    "dateModif": null,       
                     "userId":null
                },
                "actif": true,
                "dateCreation": null,
                "dateModif": null,       
                 "userId":null
            },
            "dateDeces": "",
            "sexe": "",
            "photo": "NA",
            "avatar": "",
            "lienPhoto": "NA",
            "pieceIdentite": {
                "pieceIdentiteId": null,
                "numPieceIdentite": "",
                "typePiece": "",
                "dateDelivrance":"",
                "dateValidite": "",
                "delivrerPar": "",
                "scanPieces": [],
                "remarque": "",
                "dateCreation": null,
                "dateModif": null,       
                 "userId":null
            },
            "numRue": "",
            "adresse": "",
            "cp": "",
            "ville": {
                "villeId": null,
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
                    "actif": null,
                    "dateCreation": null,
                    "dateModif": null,       
                     "userId":null
                },
                "actif": true,
                "dateCreation": null,
                "dateModif": null,       
                 "userId":null
            },
            "telFixe": "",
            "telMobile": "",
            "smsAutorise":true ,
            "email": "",
            "profession": "",
            "status": "",
            "dateCreation": "",
            "dateModif": "",
            "remarque": "",
            "actif": null,       
            "userId":null
        },
       
       // "lieuNaissanceAutre":"",
      // "villeAutre":"",
       "errorMsg":""
        
    };




    const initialQueryState = {

            "numPersonnel": "",
            "nom": "",
            "prenoms": "",
            "telMobilePro": "",
            "actif": "",
}
const [personne, setPersonne] = useState(initialObjectState.personne);

const [contactPro, setContactPro] = useState(initialObjectState.contactPro);
const [pieceIdentite, setPieceIdentite] = useState(initialObjectState.personne.pieceIdentite);
const [ville, setVille] =  useState(initialObjectState.personne.ville);
const [villes, setVilles] = useState([]);

const [pays, setPays] =  useState(initialObjectState.personne.ville.pays);
const [payss, setPayss] = useState([]);
const [paysNais, setPaysNais] =  useState(initialObjectState.personne.lieuNaissance.pays);
//const [payssNais, setPayssNais] = useState([]);
const [lieuNaissances, setLieuNaissances] =  useState([]);
const [lieuNaissance, setLieuNaissance] =  useState(initialObjectState.personne.lieuNaissance);

const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialObjectState);
const [scanAvatarGuid, setScanAvatarGuid] = useState("");
const [scanPieceIdentitesGuid, setScanPieceIdentitesGuid] = useState("");
const [scanAvatar, setScanAvatar] = useState([]);
//const [selectedFile, setSelectedFile] = useState([]);
const [scanPieceIdentites, setScanPieceIdentites] = useState([]);
const [showPersonnels, setShowPersonnels] = useState(false);
const [personnels, setPersonnels] = useState([]);
const [personnel, setPersonnel] = useState(initialObjectState.personnel);
const [showPersonnelsLoading, setShowPersonnelsLoading] = useState(false);



const [query, setQuery] = useState(initialQueryState);
const [errorsQuery, setErrorsQuery] = useState(initialQueryState);



const [showCard, setShowCard] = useState(true)
//const [showLoading, setShowLoading] = useState(false);
const [showUploadModal, setShowUploadModal] = useState(false)
const [upload, setUpload] = useState(null);
const [professions, setProfessions] = useState([]);


const [loading, setLoading] = useState(false);
const [roles, setRoles] = useState([]);
const permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","RH/GESTION_PERSONNEL")

useEffect(() => {
    retrievePersonnels(actifPersonnel);
     // retrieveVilles();
      retrievePayss();
     retrieveRoles()
retrieveProfessions();
      //console.log("lieuNaissance:",lieuNaissance)
  }, []);


const handlePersonnelsClose = (close) => {
if(close!=null && close==true)
  setShowPersonnels(false);
else
 setShowPersonnels(true);
  /*let perf=perform;
  perf.result="";  
  setPerform(perf);*/
  //retrievePersonnels();
}
const handlePersonnelsCloseAndReload = (close) => {
if(close!=null && close==true)
  { setShowPersonnels(false);
    refreshPersonnel();
    
    retrievePersonnels(actifPersonnel);
    }
}

const handleShowPersonnels = () => setShowPersonnels(true);
const handlePersonnelChange = event => {
  const { name, value } = event.target;
  setPersonnel({ ...personnel, [name]: value });
};





const handlePaysNaisChange = event => {
  const { name, value } = event.target;
  setPaysNais({ ...paysNais, [name]: value });
  //console.log("paysNais",paysNais)       
 retrieveVilles(value,true)
};
/*const handleLieuNaissanceChange = event => {
  const { name, value } = event.target;
  setLieuNaissance({ ...lieuNaissance, [name]: value }); 
  if(value=="0")     
  {
    setLieuNaissanceAutre("");
  }       
};*/
const handlePaysChange = event => {
  const { name, value } = event;
  setPays({ ...pays, [name]: value });       
 retrieveVilles(value,false)
};
/*const handleVilleChange = event => {
  const { name, value } = event.target;
  setVille({ ...ville, [name]: value });
  if(value=="0")     
  {
    setVilleAutre("");
  }  
};
*/

const handleContactProChange = event => {
  const { name, value } = event.target;
  setContactPro({ ...contactPro, [name]: value });
  
};

const handlePersonneChange = event => {
  const { name, value } = event.target;
  setPersonne({ ...personne, [name]: value });
  
};

const handlePieceIdentiteChange = event => {
  const { name, value } = event.target;
  setPieceIdentite({ ...pieceIdentite, [name]: value });
};

const handleActifPersonnelChange = (event) => {
  //let act=event.target.checked;
  actifPersonnel=event.target.checked;
  retrievePersonnels(actifPersonnel);
}



const handleQueryChange = event => {
  const { name, value } = event.target;
  setQuery({ ...query, [name]: value });
};

const reload=()=>window.location.reload();

const refreshListPersonnels = () => {
    setQuery({...initialQueryState})
    retrievePersonnels(actifPersonnel);
  };

const refreshPersonnel = () => {
    setPersonnel({...initialObjectState.personnel})
     setPieceIdentite({...initialObjectState.personne.pieceIdentite});
     setVille({...initialObjectState.personne.ville});
     setLieuNaissance({...initialObjectState.personne.lieuNaissance});
     setPays({...initialObjectState.personne.ville.pays});
     setPaysNais({...initialObjectState.personne.lieuNaissance.pays});
     setPersonne({...initialObjectState.personne})
     setContactPro({...initialObjectState.contactPro})

     setErrors({...initialObjectState});
     setScanAvatar([]);
     setScanPieceIdentites([]);
      let guid=Utils.uuidv4()
     setScanPieceIdentitesGuid(guid)
     guid=Utils.uuidv4()
     setScanAvatarGuid(guid)
     setPerform({...initialPerformState});

     
  };



async function  retrieveVilles  (paysId, isLieuNaissance) {
     
       
        let list=[]
      
         let resp="";
         let query="?paysId="+paysId+"&actif=true"
      if(paysId!=null && paysId!="")
      {
      resp= await VilleDataService.findLiteAsync(query); 
        if(resp!=null && resp.status=="200" )          
            {
                
               list= await resp.data
               //console.log("VilleDataService==>",resp.data)  
            }
     }
             
             if(isLieuNaissance==true)
                setLieuNaissances(list);
             else
             setVilles(list);
        

};

async function  retrieveRoles  () {
     
       
        let list=[]
      
         let resp="";
         let query="?actif=true"
     
      resp= await RolesDataService.getAllAsync(); 
        if(resp!=null && resp.status=="200" )          
            {
              for( const elt of resp.data)
                if(!elt.name.includes("SUPER_ADMIN"))
               list.push(elt)
               //console.log("VilleDataService==>",resp.data)  
            }
    
             setRoles(list);
        

};
async function retrieveProfessions (){
    let  query=`?typeModele=Profession&actif=true`;   
    let resp= await ModelesDataService.findAsync(query); 
          
    if(resp!=null && resp.status=="200" )          
        {
           setProfessions(resp.data);
          //console.log("actes==>",resp.data);
        }else 
        {
          setProfessions([]);
        }
}
async function retrievePayss (){
  
    let resp=await PaysDataService.getActifAsync(); 
    if(resp!=null && resp.status=="200" )          
        {
          setPayss(resp.data);
          //setPayssNais(resp.data);
        }

}
const newPersonnel = () => {
 
    refreshPersonnel();
    
   
 let perf={...initialPerformState};
 perf.action="POST";
  updatePerform(perf);
  setShowPersonnels(true)

};


function isValid  (obj) {
 
    let err={...initialObjectState};
    let valid=true;
    //console.log("is valide",obj)
    if(obj.personne.nom==null || obj.personne.nom.length<2) 
     {
      err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.nom="Le nom est réquis";
      valid=false;
      errorMsg=errorMsg+ " ["+err.personne.nom+"]"
     }
         
    if(obj.personne.prenoms==null || obj.personne.prenoms.length<2) 
      {
      err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.prenoms="Prenom incorrecte";
       errorMsg=errorMsg+ " ["+err.personne.prenoms+"]"
    

      valid=false;
     } 
    if(obj.personne.situationFamilial==null || obj.personne.situationFamilial=="") 
      {
      err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.situationFamilial="Situation familial incorecte";
      errorMsg=errorMsg+ " ["+err.personne.situationFamilial+"]"
      valid=false;
     } 
     if(obj.personne.sexe==null || obj.personne.sexe=="") 
      {
      err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.sexe="Sexe incorecte";
      errorMsg=errorMsg+ " ["+err.personne.sexe+"]"
      valid=false;
     } 

    if( obj.personne.lieuNaissance.pays.paysId==null || obj.personne.lieuNaissance.pays.paysId=="")  
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.lieuNaissance.pays.paysId="Pays de Naissance incorrecte";
         errorMsg=errorMsg+ " ["+ err.personne.lieuNaissance.pays.paysId+"]"
         valid=false;
     }  
    if( ((obj.personne.lieuNaissance.villeId==null || obj.personne.lieuNaissance.villeId=="") && obj.personne.lieuNaissance.nomVille=="") || (obj.personne.lieuNaissance.villeId==null && (obj.personne.lieuNaissance.nomVille=="" || obj.personne.lieuNaissance.nomVille.length<2))) 
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.lieuNaissance.villeId="Lieu de Naissance incorrecte";
         errorMsg=errorMsg+ " ["+err.personne.lieuNaissance.villeId+"]"
         valid=false;
     } 
  
    if(obj.personne.dateNaissance==null || !Utils.validDate(Utils.formatDate(obj.personne.dateNaissance))) 
         {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.dateNaissance="Date de naissance incorrecte";
          errorMsg=errorMsg+ " ["+err.personne.dateNaissance+"]"
          valid=false;
     } 
     if(obj.personne.dateDeces!=null && obj.personne.dateDeces.length>0 && !Utils.validDate(Utils.formatDate(obj.personne.dateDeces))) 
         {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.dateDeces="Date de décès incorrecte";
          errorMsg=errorMsg+ " ["+err.personne.dateDeces+"]"
          valid=false;
     } 
    
    if( obj.personne.telFixe.length>0 && !Utils.validateMobileNumber(obj.personne.telFixe)) 
       {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.telFixe="Tél. fixe incorrecte";
          errorMsg=errorMsg+ " ["+err.personne.telFixe+"]"
          valid=false;
     } 
    
    if( obj.personne.telMobile=="" || (obj.personne.telMobile.length>0 && !Utils.validateMobileNumber(obj.personne.telMobile))) 
        {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.telMobile="Tél. mobile personnel incorrecte";
          errorMsg=errorMsg+ " ["+err.contactPro.telMobilePro+"]"
          valid=false;
        }
    if( obj.personne.telMobile.length>0 && obj.personne.smsAutorise.length==0) 
        {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.smsAutorise="Indiqué si le SMS est Autorisé";
          errorMsg=errorMsg+ " ["+err.personne.smsAutorise+"]"
          valid=false;
        }
    if( obj.personne.email.length>0 && !Utils.validateEmail(obj.personne.email)) 
       {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.email="Email incorrecte";
          errorMsg=errorMsg+ " ["+err.personne.email+"]"
          valid=false;
     }
     if(obj.personne.pieceIdentite!=null)
     {
          if( (obj.personne.pieceIdentite.typePiece.length>0 || obj.personne.pieceIdentite.dateValidite.length>0 ||
            obj.personne.pieceIdentite.dateDelivrance.length>0 || obj.personne.pieceIdentite.delivrerPar.length>0 ) &&
          obj.personne.pieceIdentite.numPieceIdentite.length==0 ) 
           {
              err.errorMsg+="<br/>-"
       err.errorMsg+=err.personne.pieceIdentite.numPieceIdentite="N° de piece d'identité incorrecte";
              errorMsg=errorMsg+ " ["+err.personne.pieceIdentite.numPieceIdentite+"]"
              valid=false;
         }

         if( (obj.personne.pieceIdentite.numPieceIdentite.length>0 && obj.personne.pieceIdentite.dateDelivrance=="") ||
          obj.personne.pieceIdentite.dateDelivrance.length>0 && !Utils.validDate(Utils.formatDate(obj.personne.pieceIdentite.dateDelivrance))    ) 
           {
              err.errorMsg+="<br/>-"
             err.errorMsg+=err.personne.pieceIdentite.dateDelivrance="Date de délivrance incorrecte";
              errorMsg=errorMsg+ " ["+err.personne.pieceIdentite.dateDelivrance+"]"
              valid=false;
         }
         if( (obj.personne.pieceIdentite.numPieceIdentite.length>0 && obj.personne.pieceIdentite.dateValidite=="") ||
          obj.personne.pieceIdentite.dateValidite.length>0 && !Utils.validDate(Utils.formatDate(obj.personne.pieceIdentite.dateValidite))) 
           {
              err.errorMsg+="<br/>-"
                err.errorMsg+=err.personne.pieceIdentite.dateValidite="Date de validité  incorrecte";
              errorMsg=errorMsg+ " ["+err.personne.pieceIdentite.dateValidite+"]"
              valid=false;
         }
         if( obj.personne.pieceIdentite.numPieceIdentite.length>0 && obj.personne.pieceIdentite.delivrerPar=="") 
           {
              err.errorMsg+="<br/>-"
             err.errorMsg+=err.personne.pieceIdentite.delivrerPar="Préciser délivrer par";
              errorMsg=errorMsg+ " ["+err.personne.pieceIdentite.delivrerPar+"]"
              valid=false;
         }
         if( obj.personne.pieceIdentite.numPieceIdentite.length==0 && scanPieceIdentites.length>0) 
           {
              err.errorMsg+="<br/>-"
                err.errorMsg+=err.personne.pieceIdentite.scanPieces[0]="Préciser les informations de la piece d'identité";
              err.errorMsg+="<br/>-"
              err.errorMsg+=err.personne.pieceIdentite.numPieceIdentite="N° de piece d'identité incorrecte";
              err.errorMsg+="<br/>-"
              err.errorMsg+=err.personne.pieceIdentite.typePiece="Type de piece incorrecte";
              err.errorMsg+="<br/>-"
              err.errorMsg+=err.personne.pieceIdentite.dateValidite="Date de validité  incorrecte";
              err.errorMsg+="<br/>-"
              err.errorMsg+=err.personne.pieceIdentite.dateDelivrance="Date de délivrance incorrecte";

              valid=false;
         }

          if( obj.personne.pieceIdentite.numPieceIdentite.length>0 && obj.personne.pieceIdentite.typePiece=="") 
           {
              err.errorMsg+="<br/>-"
              err.errorMsg+=err.personne.pieceIdentite.typePiece="Type de piece incorrecte";
              errorMsg=errorMsg+ " ["+err.personne.pieceIdentite.typePiece+"]"
              valid=false;
         }

      }
     
      if((obj.personnel.dateDebutExercice==null) || (obj.personnel.dateDebutExercice=="")|| (obj.personnel.dateDebutExercice.length>0 && !Utils.validDate(Utils.formatDate(obj.personnel.dateDebutExercice))) ) 
        {
              err.errorMsg+="<br/>-"
              err.errorMsg+=err.personnel.dateDebutExercice="Date de debut d'exercice incorrecte";
              errorMsg=errorMsg+ " ["+ err.personnel.dateDebutExercice+"]"
              valid=false;
         }
     if( obj.contactPro.emailPro.length>0 && !Utils.validateEmail(obj.contactPro.emailPro)) 
       {
          err.errorMsg+="<br/>-"
              err.errorMsg+=err.contactPro.emailPro="Email Pro incorrecte";
          errorMsg=errorMsg+ " ["+err.contactPro.emailPro+"]"
          valid=false;
     }

     if( obj.contactPro.telFixePro.length>0 && !Utils.validateMobileNumber(obj.contactPro.telFixePro)) 
        {
          err.errorMsg+="<br/>-"
              err.errorMsg+=err.contactPro.telFixePro="Tél. fixe pro incorrecte";
          errorMsg=errorMsg+ " ["+err.contactPro.telFixePro+"]"
          valid=false;
        }
       if( obj.contactPro.telMobilePro=="" || (obj.contactPro.telMobilePro.length>0 && !Utils.validateMobileNumber(obj.contactPro.telMobilePro))) 
        {
          err.errorMsg+="<br/>-"
              err.errorMsg+=err.contactPro.telMobilePro="Tél.mobile pro incorrecte";
          errorMsg=errorMsg+ " ["+err.contactPro.telMobilePro+"]"
          valid=false;
        }
        

        if( (obj.personnel.dateDebutExercice==null)|| (obj.personnel.dateDebutExercice=="") ||
          obj.personnel.dateDebutExercice.length>0 && !Utils.validDate(Utils.formatDate(obj.personnel.dateDebutExercice))    ) 
           {
              err.errorMsg+="<br/>-"
              err.errorMsg+=err.personnel.dateDebutExercice="Date de debut d'exercice incorrecte";
              //errorMsg=errorMsg+ " ["+err.personnel.dateDebutExercice+"]"
              valid=false;
         }

      
         if( obj.personnel.fonction=="") 
        {
          err.errorMsg+="<br/>-"
              err.errorMsg+=err.personnel.fonction="Indiquer le poste occupé ";
          errorMsg=errorMsg+ " ["+ err.personnel.fonction+"]"
          valid=false;
        }
        if( obj.personnel.typePersonnel=="") 
        {
          err.errorMsg+="<br/>-"
              err.errorMsg+=err.personnel.typePersonnel="Indiquer le type de personnel";
          errorMsg=errorMsg+ " ["+err.personnel.typePersonnel+"]"
          valid=false;
        }
        if(obj.personnel.typePersonnel=="Interne")
        {
             
             if(obj.personnel.salaire==null || obj.personnel.salaire==""|| isNaN(obj.personnel.salaire) ||Number(obj.personnel.salaire)<=Number(0)) 
                 {
                 err.errorMsg+="<br/>-"
                 err.errorMsg+=err.personnel.salaire="Salaire requis et doit être supérieur à 0";
                errorMsg=errorMsg+ " ["+err.personnel.salaire+"]"
                valid=false;
             }
         }
       /* if( obj.personne.profession=="") 
        {
          err.personne.profession="Indiquer la profession ";
          errorMsg=errorMsg+ " ["+err.personne.profession+"]"
          valid=false;
        }*/
         if(obj.personnel.actif==null || obj.personnel.actif.length<2) 
         {
          err.errorMsg+="<br/>-"
              err.errorMsg+=err.personnel.actif="Indiquer le statut actif oui ou non ";
          errorMsg=errorMsg+ " ["+err.personnel.actif+"]"
          valid=false;
       }

        if(valid==false)
        {
            err.errorMsg="Une ou plusieurs erreurs ont été constatées dans le formulaire:"+err.errorMsg;
        }

  setErrors(err);
  
    //console.log("error",err);
    return valid;
    //return false;
  };

function isValidFile  (obj) {
 
    let err={"valid":true,"msg":""};
   
    //console.log("obj============>",obj)
    if(obj.personne.nom==null || obj.personne.nom.length<2) 
     {
      err.msg="Le nom est réquis";
      err.valid=false;
     }
    if(err.valid)   
    if(obj.personne.prenoms==null || obj.personne.prenoms.length<2) 
      {
      err.msg="Prenom incorrecte";    
      err.valid=false;
     } 
       if(err.valid) 
    if(obj.personne.situationFamilial==null || obj.personne.situationFamilial=="") 
      {
      err.msg="Situation familial incorecte";
      err.valid=false;
     } 
       if(err.valid) 
     if(obj.personne.sexe==null || obj.personne.sexe=="") 
      {
      err.msg="Sexe incorecte";
      err.valid=false;
     } 
  if(err.valid) 
    if( obj.personne.lieuNaissance.pays.nomPays=="")  
       {
         err.msg="Pays de Naissance incorrecte";
         err.valid=false;
     }  
       if(err.valid) 
    if( obj.personne.lieuNaissance.nomVille=="" ) 
       {
         err.msg="Lieu de Naissance incorrecte";
         err.valid=false;
     } 
    if(err.valid) 
    if(obj.personne.dateNaissance==null || !Utils.validDate(Utils.formatDate(obj.personne.dateNaissance))) 
         {
          err.msg="Date de naissance incorrecte";
          err.valid=false;
     }
       if(err.valid)  
     if(obj.personne.dateDeces!=null && obj.personne.dateDeces.length>0 && !Utils.validDate(Utils.formatDate(obj.personne.dateDeces))) 
         {
          err.msg="Date de décès incorrecte";
          err.valid=false;
     } 
      if(err.valid) 
    if( obj.personne.telFixe!=null && obj.personne.telFixe.length>0 && !Utils.validateMobileNumber(obj.personne.telFixe)) 
       {
          err.msg="Téléphone fixe incorrecte";
          err.valid=false;
     } 
       if(err.valid) 
    if( obj.personne.telMobile!=null && obj.personne.telMobile.length>0 && !Utils.validateMobileNumber(obj.personne.telMobile)) 
        {
          err.msg="Téléphone mobile incorrecte";
          err.valid=false;
        } 
          if(err.valid) 
    if( obj.personne.telMobile!=null && obj.personne.telMobile.length>0 && obj.personne.smsAutorise.length==0) 
        {
          err.msg="Indiqué si le SMS est Autorisé";
          err.valid=false;
        }
          if(err.valid) 
    if( obj.personne.email!=null &&obj.personne.email.length>0 && !Utils.validateEmail(obj.personne.email)) 
       {
          err.msg="Email incorrecte";
          err.valid=false;
     }
       if(err.valid) 
     if(obj.personne.pieceIdentite!=null)
     {

          if( ((obj.personne.pieceIdentite.typePiece&&obj.personne.pieceIdentite.typePiece.length>0) || (obj.personne.pieceIdentite.dateValidite!=null &&obj.personne.pieceIdentite.dateValidite.length>0) ||
            (obj.personne.pieceIdentite.dateDelivrance!=null && obj.personne.pieceIdentite.dateDelivrance.length>0) || (obj.personne.pieceIdentite.delivrerPar!=null&&obj.personne.pieceIdentite.delivrerPar.length>0) ) &&
          (obj.personne.pieceIdentite.numPieceIdentite!=null && obj.personne.pieceIdentite.numPieceIdentite.length==0) ) 
           {
              err.msg="N° de piece d'identité incorrecte";
              err.valid=false;
         }

         if( (obj.personne.pieceIdentite.numPieceIdentite!=null && obj.personne.pieceIdentite.numPieceIdentite.length>0 && obj.personne.pieceIdentite.dateDelivrance!=null &&obj.personne.pieceIdentite.dateDelivrance=="") ||
         obj.personne.pieceIdentite.dateDelivrance!=null &&   obj.personne.pieceIdentite.dateDelivrance.length>0 && !Utils.validDate(Utils.formatDate(obj.personne.pieceIdentite.dateDelivrance))    ) 
           {
              err.msg="Date de délivrance de la pièce incorrecte";
              err.valid=false;
         }
         if( (obj.personne.pieceIdentite.numPieceIdentite!=null &&obj.personne.pieceIdentite.numPieceIdentite.length>0 && obj.personne.pieceIdentite.dateDelivrance!=null &&obj.personne.pieceIdentite.dateValidite=="") ||
          obj.personne.pieceIdentite.dateValidite!=null && obj.personne.pieceIdentite.dateValidite.length>0 && !Utils.validDate(Utils.formatDate(obj.personne.pieceIdentite.dateValidite))) 
           {
              err.msg="Date de validité de la pièce  incorrecte";
              err.valid=false;
         }
         if( obj.personne.pieceIdentite.numPieceIdentite!=null &&obj.personne.pieceIdentite.numPieceIdentite.length>0 && obj.personne.pieceIdentite.delivrerPar!=null &&obj.personne.pieceIdentite.delivrerPar=="") 
           {
              err.msg="Préciser délivrer par";
              err.valid=false;
         }
        

          if( obj.personne.pieceIdentite.numPieceIdentite!=null &&obj.personne.pieceIdentite.numPieceIdentite.length>0 && obj.personne.pieceIdentite.typePiece=="") 
           {
              err.msg="Type de piece incorrecte";
              err.valid=false;
         }

      }
        
       if(err.valid) 
      if((obj.personnel.dateDebutExercice==null) || (obj.personnel.dateDebutExercice=="")|| (obj.personnel.dateDebutExercice.length>0 && !Utils.validDate(Utils.formatDate(obj.personnel.dateDebutExercice))) ) 
        {
              err.msg="Date de debut d'exercice incorrecte";
              err.valid=false;
         }
           if(err.valid) 
     if( obj.contactPro.emailPro!=null && obj.contactPro.emailPro.length>0 && !Utils.validateEmail(obj.contactPro.emailPro)) 
       {
          err.msg="Email Pro incorrecte";
          err.valid=false;
     }
  if(err.valid) 
     if( obj.contactPro.telFixePro!=null && obj.contactPro.telFixePro.length>0 && !Utils.validateMobileNumber(obj.contactPro.telFixePro)) 
        {
          err.msg="Téléphone fixe pro incorrecte";
          err.valid=false;
        }
          if(err.valid) 
       if( obj.contactPro.telMobilePro==null ||obj.contactPro.telMobilePro=="" || (obj.contactPro.telMobilePro.length>0 && !Utils.validateMobileNumber(obj.contactPro.telMobilePro))) 
        {
          err.msg="Téléphone mobile pro incorrecte";
          err.valid=false;
        }
        
  if(err.valid) 
        if( (obj.personnel.dateDebutExercice==null)|| (obj.personnel.dateDebutExercice=="") ||
          obj.personnel.dateDebutExercice.length>0 && !Utils.validDate(Utils.formatDate(obj.personnel.dateDebutExercice))    ) 
           {
              err.msg="Date de debut d'exercice incorrecte";
              err.valid=false;
         }
 
    if(err.valid) 
         if( obj.personnel.fonction=="") 
        {
          err.msg="Indiquer le poste occupé ";
          err.valid=false;
        }
          if(err.valid) 
        if( obj.personnel.typePersonnel=="") 
        {
          err.msg="Indiquer le type de personnel";
          err.valid=false;
        }
         /* if(err.valid) 
        if( obj.personne.profession=="") 
        {
          err.msg="Indiquer la profession ";
          err.valid=false;
        }*/
        if(err.valid) 
         if(obj.personnel.actif==null || obj.personnel.actif.length<2) 
         {
          err.msgf="Indiquer le statut actif oui ou non ";
          err.valid=false;
       }

 
  
    //console.log("error",err);
    return err;
    //return false;
  };





const handleLoadFiles  = useCallback((label, returnedFiles) =>{
if(label=="scanPieceIdentites")
{
    setScanPieceIdentites(returnedFiles)
    //setScanPieceIdentitesGuid(Utils.uuidv4())
}
else
{
    setScanAvatar(returnedFiles)
   // setScanAvatarGuid(Utils.uuidv4())
}

},[scanPieceIdentites,scanAvatar]);


async function  saveFiles  (previousFiles, selectedFiles,libelle,description) {
    let perf={...initialPerformState}
    perf.action=perform.action
    let existFiles=[]
         let newFiles=[]
                        
            for( const file of selectedFiles)
            {
              if(file.id==null || file.id=="")
              {
                newFiles.push(file.data)
              }else 
              existFiles.push(file.id)
            }

            if(previousFiles.length>0  )
                {
                  let removedFiles = previousFiles.filter(x => !existFiles.includes(x));
                  if(removedFiles.length>0)
                  {
                    let query="userId="+globalObject.user.id
                    let response=null;
                     for(const fileId of removedFiles)
                        query=query+"&fileId="+fileId
                     //console.log("delete query",query)

                      response= await FileService.deleteMultileFilesAsync(query);   
                      //setShowPersonnelsLoading(false);  
                      if(response==null || response.status!="200")
                       {
              
                         perf.result="error"; 
                         if(response!=null)
                         perf.msg= response.data.message;
                       else
                         perf.msg="ERREUR inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction";
                          showNotif(perf);
                          return perf
                       }
                  }
                }

            if(perf.result!="error" )
            {
                           
                if (newFiles.length>0)
                {
                  //setShowPersonnelsLoading(true);
                    let listFileinfo= await FileService.createMulipleFilesAsync(newFiles, libelle,description,globalObject.user.id);     
                 // setShowPersonnelsLoading(false);
                  if(listFileinfo!=null && listFileinfo.status=="201")
                   {
                    for( const file of listFileinfo.data)
                      existFiles.push(file.fileId); 
                      return await existFiles                 
                   }else
                    {                
                     perf.result="error"; 
                     if(listFileinfo!=null && listFileinfo.status!="201")
                     perf.msg="ERREUR "+listFileinfo.status + " : "+ listFileinfo.data.message;
                    else
                      perf.msg="ERREUR inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction";
                      showNotif(perf);
                    return perf
                   }
                 }else 
                  return existFiles;
            }else 
                  return perf;
          
    }

async function  savePersonne  (obj) {
         let perf={...initialPerformState}
            perf.action=perform.action
          let resp="";
          if(obj.personneId!=null && obj.personneId!="")
            resp= await PersonneDataService.updateAsync(obj.personneId,obj);
          else    
            resp= await PersonneDataService.createAsync(obj);
          
          if(resp!=null && (resp.status=="200" || resp.status=="201"))
          {
            obj=  resp.data;
            return await  obj 
          }else
          {
              perf.result="error";
              perf.msg=resp.data.message;
              showNotif(perf);    
                return await perf           
           }
    }
async function  saveVille  (obj) {

     let response="";
      let perf={...initialPerformState}
      perf.action=perform.action
          if(obj.villeId!=null && obj.villeId!="")
            response= await VilleDataService.updateAsync(obj.villeId,obj);
          else
            response= await VilleDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              obj= response.data;
              return await  obj                            
            }  
           else
           {
            
              perf.result="error";
              perf.msg= response.data.message;
             
               showNotif(perf);
               return await perf  
              
           }   
    }


async function  checkUserQuota (nb) {

     let response="";
      let perf={...initialPerformState}
      perf.action=perform.action
 if(globalObject.entreprise!=null && globalObject.entreprise.licence.quotaUtilisateur!=null)
 {
      response= await UserDataService.countPersonnelsAsync();

    if(response!=null && (response.status=="200"))
    {
              let  obj= response.data;
              //console.log("checkUserQuota current User=",obj.value+" qutoMax:"+globalObject.entreprise.licence.quotaUtilisateur+ "nouveau :"+nb)
              if(Number(obj.value)+nb <= Number(globalObject.entreprise.licence.quotaUtilisateur))
              {
                 //perf.result="success";
                 return perf;
              }else
               {
               perf.result="error";
               perf.action="POST"
               if(nb==1)
               perf.msg="Impossible de créer le personnel car le nombre maximum d'utilisateur est atteint.";
                else
                 perf.msg="Impossible de créer les personnels car le nombre maximum d'utilisateur sera dépassé. Il est limité actuellement à "+globalObject.entreprise.licence.quotaUtilisateur+".";
               showNotif(perf);
               return await perf
              }

        } else
           {
             perf.action="POST"
              perf.result="error";
              perf.msg= response.data.message;
             
               showNotif(perf);
               return await perf  
              
           }
     } else
           {
             perf.action="POST"
              perf.result="error";
              perf.msg="ERREUR lors de l'évaluation du quotas d'utilisateur";
             
               showNotif(perf);
               return await perf  
              
           }  
    }

async function  saveContactPro  (obj) {
          let resp="";
          let perf={...initialPerformState}
            perf.action=perform.action
          if(obj.contactProId!=null && obj.contactProId!="")
            resp= await ContactProDataService.updateAsync(obj.contactProId,obj);
          else
            resp= await ContactProDataService.createAsync(obj);

          if(resp!=null && (resp.status=="200"||resp.status=="201"))
            {             
              obj= resp.data;             
             return  await obj                                              
            }  
           else
           {
            
              perf.result="error";
              perf.msg=resp.data.message;
              showNotif(perf); 
              return await perf                          
           }
    }
async function  savePersonnel  (obj) {
     let resp="";
     let perf={...initialPerformState}
            perf.action=perform.action
            //obj.fonction= Utils.capitalizeFist(obj.fonction).replace("ROLE_","").replace("_"," ") 
          if(obj.personnelId!=null && obj.personnelId!="")
            resp= await PersonnelDataService.updateAsync(obj.personnelId,obj);
          else
            resp= await PersonnelDataService.createAsync(obj);

          if(resp!=null && (resp.status=="200"||resp.status=="201"))
            {             
              obj=  resp.data;             
             
              if(perf.action=="PUT")
               { perf.result="success";
                perf.msg="Mise à jour effectuée avec succès" 
                showNotif(perf);
               } 
             return await obj                                              
            }  
           else
           {
            
              perf.result="error";
              perf.msg=resp.data.message; 
              showNotif(perf);
              return await perf                          
           }
    }

async function  savePieceIdentite  (obj) {
            let resp="";
            let perf={...initialPerformState}
            perf.action=perform.action
            if(obj.pieceIdentiteId!=null && obj.pieceIdentiteId!="")
              resp= await PieceIdentiteDataService.updateAsync(obj.pieceIdentiteId,obj);
            else
              resp= await PieceIdentiteDataService.createAsync(obj);         
            if(resp!=null && (resp.status=="200" ||resp.status=="201") )
              {
                  obj=resp.data; 
                  return  await obj          
              }
               else
               {               
                perf.result="error";
                perf.msg=resp.data.message;                        
              showNotif(perf);
                return await perf               
               }
                
}



async function  saveUser  (obj) {
            let resp="";
            let perf={...initialPerformState}
            perf.action=perform.action
            //console.log("obj.personnelId",obj.personnelId)
            //console.log("obj.personnelId",obj.personnelId)
            if(obj.personnelId!=null &&perf.action=="POST")
              resp= await UserDataService.createAsync(obj);

            if(resp!=null && (resp.status=="201") )
              { 
                  obj=resp.data; 
                  perf.result="success";
                   perf.msg="Enregistrement effectué avec succès"
                    showNotif(perf);
                  
                 
                  return await obj          
              }
               else
               {               
                perf.result="error";
                if(resp==null)
                    perf.msg="L'identifiant du personnel est requis"; 
                else
                perf.msg=resp.data.message;                          
               showNotif(perf);
                return await perf               
               }
                
}
async function save ()  {
   
   setLoading(true)
 const obj = {...initialObjectState};

   obj.personne={...personne};   
   obj.personne.pieceIdentite = {...pieceIdentite};
   obj.personne.lieuNaissance={...lieuNaissance}; 
   obj.personne.lieuNaissance.pays={...paysNais}
   if(obj.personne.lieuNaissance.villeId=="0")
    {
        obj.personne.lieuNaissance.villeId=null
        //obj.personne.lieuNaissance.nomVille=lieuNaissanceAutre
    }
    
   obj.personne.ville={...ville}; 
   obj.personne.ville.pays={...pays}
   //console.log("obj.personne",obj.personne)
   if(obj.personne.ville.villeId=="0")
    {
        obj.personne.ville.villeId=null
       // obj.personne.ville.nomVille=villeAutre
    }
   


    obj.contactPro={...contactPro};
     obj.personnel={...personnel};
  
   //console.log("before",obj)
   let perf={...perform};
    //console.log("before perf", perf)

    if(perform.action=="POST")
         {
            perf= await checkUserQuota(1);
         }

    if(perf.result!="error" &&isValid(obj))
     {  setShowPersonnelsLoading(true);

        let resp=null;
         

        
        if((obj.personne.lieuNaissance.villeId==null ) && obj.personne.lieuNaissance.nomVille!="")
        {  
            obj.personne.lieuNaissance.userId=globalObject.user.id
             //console.log("obj.personne.lieuNaissance",obj.personne.lieuNaissance)
            resp=await saveVille(obj.personne.lieuNaissance);
            if(resp.villeId!=null)
                obj.personne.lieuNaissance=resp
            else
                perf=resp;
        }
     //console.log(resp);
     //console.log("perf", perf)
    if( perf.result!="error" && (obj.personne.ville.villeId==null) && obj.personne.ville.nomVille!="")
        { 
            if(obj.personne.ville.nomVille.toLowerCase()!=obj.personne.lieuNaissance.nomVille.toLowerCase() && obj.personne.ville.pays.paysId!=obj.personne.lieuNaissance.pays.paysId)
                {  
                    resp=null;
                   obj.personne.ville.userId=globalObject.user.id
                    //console.log("obj.personne.ville",obj.personne.ville)
                     resp=await saveVille(obj.personne.ville);
                    if(resp.villeId!=null)
                        obj.personne.ville=resp
                    else
                        perf=resp;
                }else
                {
                    obj.personne.ville=obj.personne.lieuNaissance
                }
           
        }
     
       if( perf.result!="error" && obj.personne.pieceIdentite!=null && ((scanPieceIdentites!=null && scanPieceIdentites.length>0) || (scanPieceIdentites.length==0 && obj.personne.pieceIdentite.scanPieces.length>0)))
        {
            let response=await saveFiles(obj.personne.pieceIdentite.scanPieces, scanPieceIdentites,"pieceIdentite", obj.personne.nom+ " "+obj.personne.prenoms)
            if(response!=null && response.result==null)
            {   
                if(scanPieceIdentites.length==0 && obj.personne.pieceIdentite.scanPieces.length>0)
                {
                    obj.personne.pieceIdentite.scanPieces=[]
                }else
                obj.personne.pieceIdentite.scanPieces=response

                 //console.log("saveFiles scanPieces",resp);
            }else
                perf=response
        }
          //console.log(resp);
        //  console.log("perf", perf)
        if( perf.result!="error" &&  obj.personne!=null &&obj.personne.pieceIdentite!=null &&  obj.personne.pieceIdentite.numPieceIdentite!="")
        {  
            obj.personne.pieceIdentite.userId=globalObject.user.id
            //console.log("obj.personne.pieceIdentite",obj.personne.pieceIdentite)
           resp=await savePieceIdentite(obj.personne.pieceIdentite);
            if(resp.pieceIdentiteId!=null)
                obj.personne.pieceIdentite=resp
            else
                perf=resp;
        } 
          if( perf.result!="error" && ((scanAvatar!=null && scanAvatar.length>0) ||  (obj.personne.avatar!="")))
        {
            let scans=[]
            if(obj.personne.avatar!=null && obj.personne.avatar!="")
            scans.push(obj.personne.avatar)
            resp=await saveFiles(scans, scanAvatar,"personne",obj.personne.personneId+":" +obj.personne.nom+ " "+obj.personne.prenoms)
            if(resp!=null && resp.result==null)
            {
                if(scanAvatar.length==0 && obj.personne.avatar!="")
                    obj.personne.avatar=""
                else
                    obj.personne.avatar=resp[0]
                //console.log("obj.personnel.avatar",obj.personnel.avatar);
                }
             //console.log("saveFiles",resp);
        }
        //console.log(resp);
        //console.log("perf", perf)
          if( perf.result!="error" &&  obj.personne !=null)
        { obj.personne.userId=globalObject.user.id
            //console.log("obj.personne",obj.personne)
           resp=await savePersonne(obj.personne);
            if(resp.personneId!=null)
              {
                obj.personne=resp
                obj.personnel.personne=resp
                
                obj.contactPro.personneId=resp.personneId
              }  
            else
                perf=resp;
        }

        if( perf.result!="error" &&  obj.contactPro!=null &&  (obj.contactPro.telMobilePro!="" ||obj.contactPro.telFixePro!=""|| obj.contactPro.emailPro!="") )
        { 
            obj.contactPro.userId=globalObject.user.id
           // console.log("obj.contactPro",obj.contactPro)
           resp=await saveContactPro(obj.contactPro);
            if(resp.contactProId!=null)
               {
                obj.contactPro=resp
                obj.personnel.contactPro= obj.contactPro
               } 
            else
                perf=resp;
        }
        //console.log(resp);
        //console.log("perf", perf)
       
        if( perf.result!="error" &&  obj.personnel !=null )
        { 
            obj.personnel.userId=globalObject.user.id
             //console.log("obj",obj)
           resp=await savePersonnel(obj.personnel);
            if(resp.personnelId!=null)
               {
                obj.personnel= resp

               } 
            else
                perf=resp;

        }
       // console.log(resp); 
       
        if( perf.result!="error" &&  perf.action=="POST" && obj.personnel !=null )
        { 
           resp=await saveUser(obj.personnel);
            if(resp.id!=null)
               {
                obj.user=resp
                
               } 
            else
                perf=resp;

        }
        //console.log("after",obj); 

        setShowPersonnelsLoading(false);   
        if(obj.personnel.personnelId!=null && obj.personnel.personnelId!="")
            {
                props.handleToUpdateRH("personnel");
            }

     } 

setLoading(false)
  };

async function deletePersonnel(obj) {
    setLoading(true)
  if(obj.personnelId!=null && obj.personnelId!="")
  {
      obj.actif=false;
      let perf=perform;
    let resp=await PersonnelDataService.updateAsync(obj.personnelId,obj);
    if(resp!=null && resp.status=="200")
      {
          setPersonnel(resp.data);             
          perf.result="success";
          perf.msg="Suppression effectué avec succès"  
          showNotif(perf);    
                                        
      } 
        else
        {           
              perf.result="error";
              perf.msg=resp.data.message;
               showNotif(perf);
        }

    }
    setLoading(false)
  };

async function rechercherPersonnels (){

   if ($.fn.dataTable.isDataTable('#tListOfPersonnel')) {
        $('#tListOfPersonnel').DataTable().destroy();       
    }
    let resp=null;
    setShowPersonnelsLoading(true)
    let q=""
   let  err=initialQueryState
   //console.log("query",query)
   // console.log("err",err)
    if(query.numPersonnel!="" && query.numPersonnel.length>5)
      q+="numPersonnel="+query.numPersonnel+"&"
    else
      {
        if(query.numPersonnel!="")
        {
          err.numPersonnel="N° personnel incorrect"
       }
      } 

    if(query.nom!="" && query.prenoms!="" )
      q+="nom="+query.nom+"&"
    else
       if(query.nom!="" &&query.prenoms=="" )
        err.prenoms="Le prenom est requis"

    if(query.prenoms!="" )
      q+="prenoms="+query.prenoms+"&"

     if(query.telMobilePro!="" && Utils.validateMobileNumber(query.telMobilePro))
      q+="telMobilePro="+query.telMobilePro+"&"
    else
      {
        if(query.telMobilePro!="" && !Utils.validateMobileNumber(query.telMobilePro))
        {
          err.telMobilePro="Tél. mobile incorrect"
       }
      } 
    if(query.actif!="")
      q+="actif="+query.actif+"&"

    

    if(q.startsWith("actif"))
     { 
      err.actif="Renseigner au moins un autre champ"
    
    }
    else
    {
        if(q!="")
        resp= await PersonnelDataService.getByQueryAsync(q);
        else
          {
            if(err.prenoms=="" && err.telMobilePro=="")
            err.remarque="Aucun champ renseigné"
            
           
          } 
    }
    
      setErrorsQuery(err);

    //console.log("query",query)
    //console.log("err",err)
     //console.log("q",q)
  
    if(resp!=null && resp.status=="200" )          
        {

             let listPerso=[]
            for (const perso of resp.data)
             {        
                if(perso?.personne.avatar!=null &&perso?.personne.avatar!="")
                    {
                        let imgInfo= await FileService.getFilesByIdAsync(perso?.personne.avatar)
                        if(imgInfo!=null&&imgInfo.status=="200")
                        {
                            perso.personne.avatarImg=`data:${imgInfo.data.fileType};base64,${imgInfo.data.fileData}`;                      
                        }
                    }
                    listPerso.push(perso)
                           
            }
          setPersonnels(listPerso);          
        }else  
        setPersonnels([])

    if(showCard)
      buildTableCard()
    else
     buildTable()
    setShowPersonnelsLoading(false)
}

async function retrievePersonnels (act){

 if ($.fn.dataTable.isDataTable('#tListOfPersonnel')) {
        $('#tListOfPersonnel').DataTable().destroy();       
    }
   //setShowPersonnelsLoading(true)
    let defaultPageSize=100
    if(globalObject.entreprise!=null && globalObject.entreprise.config!=null&&globalObject.entreprise.config.defaultPageSize!=null&& globalObject.entreprise.config.defaultPageSize!="")
      defaultPageSize=globalObject.entreprise.config.defaultPageSize


    let resp=null
    let q="page=0&pageSize="+defaultPageSize

    resp= await PersonnelDataService.getByQueryAsync(q);
  
    if(resp!=null && resp.status=="200" )          
        {
          let listPerso=[]
            for (const perso of resp.data)
             {        
                if(perso?.personne.avatar!=null &&perso?.personne.avatar!="")
                    {
                        let imgInfo= await FileService.getFilesByIdAsync(perso?.personne.avatar)
                        if(imgInfo!=null&&imgInfo.status=="200")
                        {
                            perso.personne.avatarImg=`data:${imgInfo.data.fileType};base64,${imgInfo.data.fileData}`;                      
                        }
                    }
                    listPerso.push(perso)
                           
            }
          setPersonnels(listPerso);        
        }else  
        setPersonnels([])
   if(showCard)
      buildTableCard()
    else
     buildTable()
   
   // setShowPersonnelsLoading(false)
}
async function buildTable (){
    
 
setTimeout(()=>{                        
    $('#tListOfPersonnel').DataTable(

      {  dom: 'lBfrtip',//"l" to show pagelength, B for button,
        /*buttons: [
            //'copyHtml5',
           
            //'csvHtml5',
            'excelHtml5',
            'pdfHtml5',
            'print',
            'colvis'
        ],*/
        buttons: [
           /* {
                extend:    'copyHtml5',
                text:      '<i className="fa fa-files-o"></i>',
                titleAttr: 'Copy'
            },*/
            {
                extend:    'excelHtml5',
              //  text:      '<i className="fa fa-file-excel-o"></i>',
                titleAttr: 'Excel',
                title: 'liste_du_personnel',
                autoFilter: true,
                sheetName: 'Liste du personnel',
                exportOptions: {
                    //columns: [ 0, ':visible' ]
                    columns: [ 1, 2,3,4, 5,6,7,9,10,11]
                }
            },
            /*{
                extend:    'csvHtml5',
                text:      '<i className="fa fa-file-text-o"></i>',
                titleAttr: 'CSV'
            },*/
            {
                extend:    'pdfHtml5',
              //  text:      '<i className="fa fa-file-pdf-o"></i>',
                titleAttr: 'PDF',
                 title: 'liste_du_personnel',
                 download: 'open',
                exportOptions: {
                    columns: [ 1, 2,3,4, 5,6,7,9,10,11 ]

                }
            },
             {
                extend:    'print',
               text: 'Imprimer',
               exportOptions: {
                    columns: [ 1, 2,3,4, 5,6,7,9,10,11 ]

                }
            },
             
          
        ],
        "autoWidth": false,
          "scrollX":false,
        "scrollCollapse": true,
        "paging": true,
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
        ],
         "language": {
            "lengthMenu": "Afficher _MENU_ /page",
            "zeroRecords": "Liste vide",
            "info": " page _PAGE_ sur _PAGES_ / Total (_MAX_)",
            "infoEmpty": "Aucun enregistrement trouvé",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "searchPlaceholder": "Filtrer", 
             "search": "",
            'paginate': {
                    'previous': '<<',
                    'next': '>>'
                  },
             'searchPanes': {
                'count': '{total} found',
                'countFiltered': '{shown} / {total}'
                }
          },
          
            'layout': {
                'top1': {
                    'searchPanes': {
                        'viewTotal': true
                    }
                }
            },
          "fnInitComplete": function ( oSettings ) {
               oSettings.oLanguage.sZeroRecords = "No matching records found"
           }
    }
      );

  }, 200);


  };


async function changeAffichage (showCard){
    if ($.fn.dataTable.isDataTable('#tListOfPersonnel')) {
        $('#tListOfPersonnel').DataTable().destroy();       
    }
    if(showCard==false)
    {
        setShowCard(true)
        buildTableCard ();
     }else {
        setShowCard(false)
        buildTable ()
     }

}
async function buildTableCard (){
setTimeout(()=>{                        
    $('#tListOfPersonnel').DataTable(
      { 
        "autoWidth": false,
        "scrollX":false,
        "scrollCollapse": true,
       //"order": [[ 0, "desc" ]],
       /* "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            },
            { "width": "300", "targets": 6 }
        ],*/
         "language": {
            "lengthMenu": "Afficher _MENU_ /page",
            "zeroRecords": "<b>Aucun personnel trouvé</b>",
            "info": " page _PAGE_ sur _PAGES_ / Total (_MAX_)",
            "infoEmpty": "",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "searchPlaceholder": "Filtrer", 
             "search": "",
            'paginate': {
                    'previous': '<<',
                    'next': '>>'
                  }
          }
    }
      );

  }, 400);


  };


  async function handleStatus(obj) {
  if(obj.actif==true)
  {
      obj.actif=false;
   }else 
       obj.actif=true;
    
    let perf=perform;
    let resp=await PersonnelDataService.updateStatutAsync(obj.personnelId,obj);
    if(resp!=null && resp.status=="200")
      {
          setPersonnel(resp.data);             
         retrievePersonnels(actifPersonnel);   
                                        
      } 
        else
        {           
              perf.result="error";
              perf.msg=resp.data.message;
               showNotif(perf);
        }

    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShowPersonnels(false);
  setShowPersonnels(true);
}
function showNotif(perf)
{
 Utils.createNotification(perf.result,"Personnel", perf.msg);                         
 handlePersonnelsCloseAndReload(true)
}

async function getListofFiles (query ){
    let response=null; 
      
    response= await FileService.getFilesAsync(query);
     if(response!=null && response.status=="200" &&response.data!=null && response.data!="") 
     {          
                   let files=[]
                     for( const file of response.data)
                     {
                      let item={}
                      item.id=file.fileId
                      item.data=`data:${file.fileType};base64,${file.fileData}`
                      //new File([`${file.fileData}`],`${file.fileName}`, {type:`${file.fileType}`}); 
                      //;
                      item.name=file.fileName
                      files.push(item)
                     }
                     //setScanPieceIdentites(files)
                     return await files;
          }       
          else
                {
                  let perf=initialPerformState
                       perf.result="error";
                    if(response!=null && response.status!=null)
                    perf.msg= response.data.message;    
                    else 
                        perf.msg="Une erreur inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction.";           
                    showNotif(perf);
                    return await perf;
                }        
      
    }


async function retreiveScanPieceIdentites  (scan) {
    if(scan.length>0)
      {

        let listOfFileId=[]
        for(const file of scanPieceIdentites)
        {
           listOfFileId.push(file.id)
        }
       if(scan.length!=listOfFileId.length || scan.sort().toString()!=listOfFileId.sort().toString())
       {
        setShowPersonnelsLoading(true);
          let query=""
          
         for(const fileId of scan)
           {
            query=query+"&fileId="+fileId
           }          
            let resp= await getListofFiles(query)
            if(resp.result==null)
                setScanPieceIdentites(resp)
            else
                setScanPieceIdentites([])
        //console.log("SetScanPieceIdentites",resp)
          setShowPersonnelsLoading(false);
        }
              
       }else 
       setScanPieceIdentites([]); 
        let guid=Utils.uuidv4()
       setScanPieceIdentitesGuid(guid)
    }


async function retreiveScanAvatar  (scan) {
    if(scan.length>0)
      {

        let listOfFileId=[]
        for(const file of scanAvatar)
        {
           listOfFileId.push(file.id)
        }
        //console.log("listOfFileId", listOfFileId)
        //console.log("==>new avatar", scan.sort().toString())
        //console.log("==>preview avatar", listOfFileId.sort().toString())
       if(scan.length!=listOfFileId.length || scan.sort().toString()!=listOfFileId.sort().toString())
       {
        setShowPersonnelsLoading(true);
          let query=""
          
         for(const fileId of scan)
           {
            query=query+"&fileId="+fileId
           }          
            let resp= await getListofFiles(query)
            if(resp.result==null)
               {
                setScanAvatar(resp)
                //console.log("file scanAvatar",resp)
               } 
            else
                setScanAvatar([])

          setShowPersonnelsLoading(false);
        }
              
       }else 
       setScanAvatar([]); 
       let guid=Utils.uuidv4()
      setScanAvatarGuid(guid)
     //console.log("-----------get scanAvatar----------",guid)
    }

const performAction = (obj, action) => {

    handlePersonnelsClose(true);
   
    setErrors({...initialObjectState});
  
  
    console.log("performAction personnel",obj)
    setPersonnel(obj);

  
    if (obj.personne!=null) {
      setPersonne(obj.personne);
    } else {
       setPersonne({...initialObjectState.personne});
    }
    if (obj.personne.pieceIdentite!=null) {
      setPieceIdentite(obj.personne.pieceIdentite);
      
    } else {
       setPieceIdentite({...initialObjectState.personne.pieceIdentite});
    }
   
   
   if (obj.personne.ville!=null) 
      {
        setVille(obj.personne.ville);
        if(obj.personne.ville.pays!=null && obj.personne.ville.pays.paysId!=null && obj.personne.ville.pays.paysId!="") 
           {
            setPays(obj.personne.ville.pays)
            retrieveVilles  (obj.personne.ville.pays.paysId, false);
           } 
        else
            setPays({...initialObjectState.personne.ville.pays})
    } else {
       setVille({...initialObjectState.personne.ville});
       setPays({...initialObjectState.personne.ville.pays})
    }

    if (obj.personne.lieuNaissance!=null) {
      setLieuNaissance(obj.personne.lieuNaissance);
      if(obj.personne.lieuNaissance.pays!=null &&obj.personne.lieuNaissance.pays.paysId!=null && obj.personne.lieuNaissance.pays.paysId!="") 
         {
            setPaysNais(obj.personne.lieuNaissance.pays)
            retrieveVilles  (obj.personne.lieuNaissance.pays.paysId, true);
         }   
        else
            setPaysNais({...initialObjectState.personne.lieuNaissance.pays})
    } else {
       setLieuNaissance({...initialObjectState.personne.lieuNaissance});
       setPaysNais({...initialObjectState.personne.lieuNaissance.pays})
    }
   // console.log("setLieuNaissance======>",lieuNaissance)
    //console.log("setPaysNais==========>",paysNais)
     if (obj.contactPro!=null) {
      setContactPro(obj.contactPro);
    } else {
       setContactPro({...initialObjectState.contactPro});
    }
   
  


    //if((action=="GET" || action=="PUT" || action=="DELETE") )
    { 

        if(obj.personne.avatar!=null&&obj.personne.avatar!="")
          {
            let scans=[]
            scans.push(obj.personne.avatar)
             
           retreiveScanAvatar(scans)
            //console.log("-----------after get scanAvatar----------",scanAvatarGuid+" /"+Utils.uuidv4())
            
             }
         else 
             {
                setScanAvatar([]);
                let guid=Utils.uuidv4()
                 setScanAvatarGuid(guid)
            }

        if(obj.personne.pieceIdentite!=null &&obj.personne.pieceIdentite.scanPieces!=null &&obj.personne.pieceIdentite.scanPieces.length>0)
            retreiveScanPieceIdentites(obj.personne.pieceIdentite.scanPieces)
         else 
             {                            
               setScanPieceIdentites([]);
              let guid=Utils.uuidv4()
              setScanPieceIdentitesGuid(guid)
            }
    }
      //console.log("-----------show scanAvatar----------",scanAvatarGuid)
     let perf={...perform};
     perf.action=action;
     setPerform(perf);
     setShowPersonnels(true);

  };


/*************************************upload functionalities****************/
const handleCloseLoadingModal = (close) => {
    if(close!=null && close==true)
  setShowPersonnelsLoading(false);
else
     setShowPersonnelsLoading(true); 
}
 const uploadFile=(type)=>{
 let up={}
 up.type=type;
 up.key=Utils.uuidv4();
 setUpload(up);
 let  perf=perform;
  perf.action="PATCH";
  setPerform(perf);
 }

async function importFilePersonnel (obj)  {
 
         let response="";
         

         //console.log(JSON.stringify(obj));
         //console.log(obj);
         response= await PersonnelDataService.bulkAsync(obj,globalObject.user.id);
         let perf=perform;
          if(response!=null && (response.status=="201"))
            {
                if(response.data.detail ==null )
               {
                perf.result="success";
                 perf.msg=response.data.message
               }
               else      
               {
                perf.result="error";        
                  perf.msg=response.data.message + ". " +response.data.detail 
              }            
              showNotif(perf);                 
           //  retrievePersonnels(actifPersonnel);
             
                                       
            }  
           else
            if(response!=null && (response.status=="400"))
            {
               perf.result="error";             
             perf.msg=response.data.message + ". " +response.data.detail          
              showNotif(perf);                 
             //retrievePersonnels(actifPersonnel);                          
            }else 
           {
             perf.result="error";             
              if(response!=null && response.status!=null)
              perf.msg= response.data.message;
              else
                 perf.msg="Une erreur inattendue s'est produite"
             
               showNotif(perf);
               //setPerform(perf);
               //setShowPersonnels(true);              
           }           
        
  };

async function returnData (data){
setShowPersonnelsLoading(true)
 //console.log(data)
 let list=fromDataToPersonnel(data);
 let perf=null
if(list!=null)
perf=await checkUserQuota (list.length) 

if(perf!=null && perf.result!="error")
{ 
 if(list!=null)
  await importFilePersonnel(list);
  setShowPersonnelsLoading(false)  
   handleCloseLoadingModal(true)
   props.handleToUpdateRH("personnel");
}else 
 setShowPersonnelsLoading(false)  
  //setShowPersonnels(true); 
  

}


 function getFonction (fonc){

    if(fonc!=null&& fonc!="")
    {
        fonc=fonc.toUpperCase()
        
        if(fonc.includes("CHEF") &&fonc.includes("PRATICIEN") )
             return "ROLE_CHEF_PRATICIEN"
         else 
          if(fonc.includes("PRATICIEN") )
             return "ROLE_PRATICIEN"
         else
             if(fonc.includes("MANAGER") )
             return "ROLE_MANAGER"
         else
            if(fonc.includes("CAISSIER") )
             return "ROLE_CAISSIER"
         else
             if(fonc.includes("COMPTABLE") )
             return "ROLE_AGENT_COMPTABLE"
          else
             if(fonc.includes("ADMINISTRATIF") )
             return "ROLE_AGENT_ADMINISTRATIF"
          else
             if(fonc.includes("LABORANTIN") )
             return "ROLE_LABORANTIN"
         else
             return "ROLE_SIMPLE_AGENT"

    }else
    return "ROLE_SIMPLE_AGENT"
 }
 function fromDataToPersonnel (data){

    //let list=[]
    errorMsg=""
if(data.length>0)
{
    let dataKeys=Object.keys(data[0])
    //console.log("dataKeys==>",dataKeys.join(","))

    //console.log("dataKeysList",dataKeysList)
    const keys=["civilite","nom","nomJeuneFille","prenoms","sexe","situationFamilial","dateNaissance","villeNaissance","paysNaissance","dateDeces",
    "numRue","adresse","cp","ville","pays","telFixe","telMobile","smsAutorise","email",
    "typePersonnel","profession","fonction","dateDebutExercice","actif",
    "telFixePro","telMobilePro","emailPro",
    "numPieceIdentite","typePiece","dateDelivrance","dateValidite","delivrerPar","remarquePiece"
    ]
    //test if all datakeys elt are in keys

    if(dataKeys.every(v => keys.includes(v)))
    {
        // console.log("Structure du fichier CSV incorrecte")

           let list= data.map(elt => (
                {
                 "personne": {
                    "PersonneId": null,
                     "nom": elt.nom?.trim(),
                    "civilite": elt.civilite?.trim(),
                    "nomJeuneFille": elt.nomJeuneFille?.trim(),
                    "prenoms": elt.prenoms?.trim(),
                    "situationFamilial": elt.situationFamilial?.trim(),
                    "dateNaissance": Utils.convertDateTOAnMoisJour(elt.dateNaissance),
                    "lieuNaissance": {
                        "villeId": null,
                        //"codeVille": "",
                        "nomVille": elt.villeNaissance?.trim(),
                        /*"province": "",
                        "region": "",*/
                        "pays": {
                            "paysId": "",
                           /* "codeIsoAlpha2": "",
                            "codeIsoAlpha3": "",*/
                            "nomPays": elt.paysNaissance?.trim(),
                           /* "monaie": "",
                            "symbolMonaie": "",
                            "indicatifPays": "",
                            "actif": null,
                            "dateCreation": null,
                            "dateModif": null, */      
                             "userId":null
                        },
                        "actif": true,
                        /*"dateCreation": null,
                        "dateModif": null,       
                         "userId":globalObject.user.id*/
                    },
                    "dateDeces": Utils.convertDateTOAnMoisJour(elt.dateDeces?.trim()),
                    "sexe": elt.sexe,
                    /*"photo": "NA",
                    "lienPhoto": "NA",*/
                    "pieceIdentite": {
                        "pieceIdentiteId": null,
                        "numPieceIdentite": elt.numPieceIdentite?.trim(),
                        "typePiece": elt.typePiece?.trim(),
                        "dateDelivrance":Utils.convertDateTOAnMoisJour(elt.dateDelivrance?.trim()),
                        "dateValidite": Utils.convertDateTOAnMoisJour(elt.dateValidite?.trim()),
                        "delivrerPar": elt.delivrerPar?.trim(),
                        //"scanPieces": [],
                        "remarque": elt.remarquePiece?.trim(),
                       /* "dateCreation": null,
                        "dateModif": null,       
                         "userId":globalObject.user.id*/
                    },
                    "numRue": elt.numRue?.trim(),
                    "adresse": elt.adresse?.trim(),
                    "cp": elt.cp?.trim(),
                    "ville": {
                        "villeId": null,
                        //"codeVille": "",
                        "nomVille": elt.ville?.trim(),
                        //"province": "",
                        //"region": "",
                        "pays": {
                            "paysId": "",
                           /* "codeIsoAlpha2": "",
                            "codeIsoAlpha3": "",*/
                            "nomPays": elt.pays?.trim(),
                           /* "monaie": "",
                            "symbolMonaie": "",
                            "indicatifPays": "",
                            "actif": null,
                            "dateCreation": null,
                            "dateModif": null,       
                             "userId":null*/
                        },
                        "actif": true,
                       /* "dateCreation": null,
                        "dateModif": null,       
                         "userId":globalObject.user.id*/
                    },
                    "telFixe": elt.telFixe?.trim(),
                    "telMobile": elt.telMobile?.trim(),
                    "smsAutorise":(elt.smsAutorise?.trim()!=null&&elt.smsAutorise?.trim().length>0)?elt.smsAutorise?.trim():false ,
                    "email": elt.email?.trim(),
                    "profession": elt.profession?.trim(),
                    /*"status": "",
                    "dateCreation": "",
                    "dateModif": "",
                    "remarque": "",
                    "actif": true,       
                    "userId":globalObject.user.id*/
                },
    
     "personnel": {
        "personnelId": null,
        "personneId":null,
        "psId":null,
        "numPersonnel": "",
        "titreAcademique":elt.titreAcademique,
        "fonction": getFonction(elt.fonction),
        "typePersonnel": elt.typePersonnel,
        "dateDebutExercice":Utils.convertDateTOAnMoisJour(elt.dateDebutExercice),
       // "avatar": "",
        //"contactPro": {},
        "actif": elt.actif,
       /* "dateCreation": null,
        "dateModif": null,*/
        "remarque": elt.remarqueProfession,
        /*"personne":{},
        "contactPro":{},
        "userId":globalObject.user.id*/
     },
     "contactPro": {
        "contactProId": null,
        "personneId":null,          
        "telFixePro": (elt.telFixePro!=null&&elt.telFixePro.length>0)?elt.telFixePro:"",
        "telMobilePro": (elt.telMobilePro!=null&&elt.telMobilePro.length>0)?elt.telMobilePro:((elt.telMobile!=null&&elt.telMobile.length>0)?elt.telMobile:""),
         "emailPro": elt.emailPro,
      
     },
     /*"user": {
        "id": null,
        "personneId":null,
        "username": "",
        //"contactPro": {},
        "email": "",
        "actif": null,
        "dateCreation": null,
        "dateModif": null,
        "roles": [],
        "remarque": "",
        "createdBy":globalObject.user.id
     }*/
            


}




        
                 ));
       
        if(list[list.length-1].personne.nom==undefined)
           {
            list.pop()//remove last element
             //console.log("list[list.length-1].personne.nom",list)
            if(list.length==0)
               { 
                let perf={...perform};
                 perf.result="error";
                 perf.msg="Le fichier selectionné ne contient aucun enregistrement";
                 showNotif(perf); 
                 setShowPersonnels(true);
                return null
            }
           } 

        let i=1;
        for (let elt of list) {
            let obj={}
          
            obj.personne=elt.personne
            obj.contactPro=elt.contactPro
            obj.personnel=elt.personnel
            let check=isValidFile(obj);
            if(!(check?.valid))
            {
                 let perf={...perform};
                 perf.result="error";
                 perf.msg="Erreur à la ligne "+i+" du fichier :"+check.msg;
                 
                showNotif(perf); 
                // setShowPersonnels(true);
                return null
            }
            i++;
            //console.log("elt",elt)
        }
        //console.log("list before return",list)
        return list

    }else{ 
    let perf={...perform};
         perf.result="error";
         perf.msg="L'entête du fichier est incorrecte";
        showNotif(perf); 
         //setShowPersonnels(true);
      return null   
   
    }
  }else{ 
    let perf={...perform};
         perf.result="error";
         perf.msg="Le fichier est vide";
         showNotif(perf); 
        // setShowPersonnels(true);
      return null   
    
    }
}

const handleCloseLoading = () => {
  setShowPersonnelsLoading(true);
}


const renderTableTd=(perso,index) =>{
return (
     <td>
            <div className="row p-2 bg-white border rounded product-card">
                <div className="col-md-2">
                {/*<img className="img-fluid img-responsive rounded product-image" src="/img/avatar_2x.png"/>*/}
                <img className="img-fluid img-responsive rounded product-image" key={perso?.personne.avatar}
                        //src={previewImages} 
                        src={perso?.personne.avatarImg!=null?perso?.personne.avatarImg:"/img/avatar_2x.png"}
                        alt={perso?.personne.avatar}  
                        />
                </div>
                <div className="col-md-8 ">
                    <h6><b>N°:</b>{perso.numPersonnel}  </h6>                   
                    <h6>{perso.titreAcademique} {perso.personne.nom} {perso.personne.prenoms}</h6>                   
                    <div className="mt-1 mb-1 spec-1"><span>{Utils.capitalizeFist(perso.fonction.replaceAll("ROLE_","").replaceAll("_"," "))} ({perso.typePersonnel})</span></div>
                    <div className="mt-1 mb-1"><b>Tél.:</b> <span className="spec-1">{perso.contactPro?.telFixePro}/{perso.contactPro?.telMobilePro}</span></div>
                    <div className="mt-1 mb-1"><b>Email.:</b> <span className="spec-1">{perso.contactPro?.emailPro}</span></div>
                </div>
            <div className="col-md-2 ">
                 <div className="btn-group-vertical" role="group">
                      <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(perso, "GET")}><i className="fa fa-eye"></i> </Button>
                    {permission?.action?.includes("U")&&
                    <Button  variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(perso, "PUT")}><i className="fa fa-edit fa-sm"></i></Button>  
                    }
                    {permission?.action?.includes("U")&&(perso.actif==false? 
                        <Button  variant="light" className="btn-sm" 
                              title="Activer" onClick={() => handleStatus(perso)}>
                           <i className="fa fa-toggle-off"></i>
                    </Button>:
                     <Button  variant="light" className="btn-sm" 
                             title="Déactiver" onClick={() => handleStatus(perso)}>
                            <i className="fa fa-toggle-on"></i>
                    </Button>)} 
              </div>
            </div>
        </div>
     </td>
    )}
/*********************************************RENDER*******************************************/

const renderListPersonnel=() =>{
return (
<div className="table-responsive">   
{(!showCard)?(        
      <table id="tListOfPersonnel" className="table table-striped table-bordered display compact "  >
          <thead>
            <tr>
             <th>Date de Modif</th>
              <th>N° Personnel</th>
              <th>Nom</th>            
                <th>Prenoms</th>
                <th>Sexe</th>
                <th>Type personnel</th>
                
                 <th>Poste</th>
                <th>Tel. Fixe (PRO)</th>
                <th>Tel. Mobile (PRO)</th>
                 <th>Email</th>
                <th>Actif</th>
               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {personnels &&
            personnels.map((perso, index) => (
                <tr key={index}>      
              
                 <td>{perso.dateModif}</td> 
                  <td>{perso.numPersonnel}</td>
                 <td>{perso.personne.nom}</td>
                  <td>{perso.personne.prenoms}</td>                  
                  <td>{perso.personne.sexe.charAt(0)}</td>              
                  <td>{perso.typePersonnel}</td>
                   
                    <td>{Utils.capitalizeFist(perso.fonction.replaceAll("ROLE_","").replaceAll("_"," "))}</td>
                    <td>{perso.contactPro?.telFixePro}</td> 
                  <td>{perso.contactPro?.telMobilePro}</td> 
                     <td>{perso.contactPro?.emailPro}</td> 
                   <td>{perso.actif==true?"Oui":"Non"}</td> 
                 
                  <td>

                     <div className="btn-group">
                          <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(perso, "GET")}><i className="fa fa-eye"></i> </Button>
                            {permission?.action?.includes("U")&&
                            <Button  variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(perso, "PUT")}><i className="fa fa-edit fa-sm"></i></Button>  
                            }
                            {permission?.action?.includes("U")&&(perso.actif==false? 
                                <Button  variant="light" className="btn-sm" 
                                      title="Activer" onClick={() => handleStatus(perso)}>
                                   <i className="fa fa-toggle-off"></i>
                            </Button>:
                             <Button  variant="light" className="btn-sm" 
                                     title="Déactiver" onClick={() => handleStatus(perso)}>
                                    <i className="fa fa-toggle-on"></i>
                            </Button>)} 
                        </div>
                   </td>              
                </tr>
          ))}        
          </tbody>         
        </table>):
        (

 <table id="tListOfPersonnel"  >
          <thead style={{ "display":"none"}}>
            <tr>              
              <th></th>
              <th></th>
               <th></th>                                     
            </tr>
          </thead>
          <tbody style={{ "width":"600px"}} >
           {personnels &&
           
            personnels.map(( perso, index) => index%3==0?(
                <tr key={index}>      
                {renderTableTd(personnels[index],index)}
                {(index+1<personnels.length)?(renderTableTd(personnels[index+1],index+1)):(<td ></td>)}
                {(index+2<personnels.length)?(renderTableTd(personnels[index+2],index+2)):(<td ></td>)}    

           </tr>
          ):(null)

            )}        
          </tbody>         
        </table>
            )}         
        </div>
   )
}


const renderShowPersonnelsInfoPS=()=>{
  return (
              <div className="col">

            <section className="accordion">
              <input type="radio" name="collapse" id="handle1" defaultChecked />
              <h2 className="handle">
                <label htmlFor="handle1">Etat civil</label>
              </h2>
              <div className="content">
               <table className='table table-bordered table-sm'>
                <tbody>
                    <tr><th className="table-active">Nom</th><td style={{wordWrap: "break-word",wordBreak: "break-all", whiteSpace: "normal !important"}}>{personne.nom}</td></tr>
                    <tr><th className="table-active">Nom de Jeune Fille</th><td style={{wordWrap: "break-word",wordBreak: "break-all", whiteSpace: "normal !important"}}>{personne.nomJeuneFille}</td></tr>
                    <tr><th className="table-active">Prenoms</th><td style={{wordWrap: "break-word",wordBreak: "break-all", whiteSpace: "normal !important"}}>{personne.prenoms}</td></tr> 
                    <tr><th className="table-active">Situation Familiale</th><td>{personne.situationFamilial}</td></tr>
                    <tr><th className="table-active">Sexe</th><td>{personne.sexe}</td></tr> 
                    <tr><th className="table-active">Date de Naissance</th><td>{personne.dateNaissance}</td></tr>
                    <tr><th className="table-active">Lieu de Naissance</th><td>{personne.lieuNaissance!=null ?( `${personne.lieuNaissance.nomVille} (${personne.lieuNaissance?.pays?.codeIsoAlpha2})`):""}</td></tr> 
                    <tr><th className="table-active">Date de Décès</th><td>{personne.dateDeces}</td></tr>                              
                    <tr><th colSpan="2" className="table-active">Remarque :</th></tr>
                    <tr><td colSpan="2">{personne.remarque}</td></tr>                 
                </tbody>
              </table> 
                
              </div>
            </section>
        <section className="accordion">
              <input type="radio" name="collapse" id="handle2"  />
              <h2 className="handle">
                <label htmlFor="handle2">Coordonnés</label>
              </h2>
              <div className="content">
              <table className='table table-bordered table-sm' >
                <tbody>
                    <tr><th className="table-active">N° de Rue</th><td>{personne.numRue}</td></tr>
                    <tr><th className="table-active">Adresse</th><td>{personne.adresse}</td></tr>
                    <tr><th className="table-active">Code Postal</th><td>{personne.cp}</td></tr> 
                      <tr><th className="table-active">Ville</th><td style={{wordWrap: "break-word",wordBreak: "break-all", whiteSpace: "normal !important"}}>{personne.ville!=null ?( `${personne.ville.nomVille} (${personne.ville?.pays?.codeIsoAlpha2})`):""}</td></tr>
                    <tr><th className="table-active">Tél. fixe</th><td>{personne.telFixe}</td></tr>
                    <tr><th className="table-active">Tél. Mobile</th><td style={{wordWrap: "break-word",wordBreak: "break-all", whiteSpace: "normal !important"}}>{personne.telMobile}</td></tr> 
                      <tr><th className="table-active">SMS Autorisé</th><td>{personne.smsAutorise==true?"Oui":(personne.smsAutorise==false?"Non":"")}</td></tr>
                    <tr><th className="table-active">Email</th><td style={{wordWrap: "break-word",wordBreak: "break-all", whiteSpace: "normal !important"}}>{personne.email}</td></tr>
                     <tr><th className="table-active">Email PRO</th><td style={{wordWrap: "break-word",wordBreak: "break-all", whiteSpace: "normal !important"}}>{contactPro.emailPro}</td></tr>
                    <tr><th className="table-active">Tél. Fixe PRO</th><td style={{wordWrap: "break-word",wordBreak: "break-all", whiteSpace: "normal !important"}}>{contactPro.telFixePro}</td></tr> 
                     <tr><th className="table-active">Tél. Mobile PRO</th><td style={{wordWrap: "break-word",wordBreak: "break-all", whiteSpace: "normal !important"}}>{contactPro.telMobilePro}</td></tr>                               
  

                </tbody>
              </table>
                
              </div>
            </section>


             <section className="accordion">
              <input type="radio" name="collapse" id="handle3"  />
              <h2 className="handle">
                <label htmlFor="handle3">Piéce d'identité</label>
              </h2>
              <div className="content">
              <table className='table table-bordered table-sm' >
                <tbody>
                    <tr><th className="table-active">Type de piece d'identité</th><td> {personne?.pieceIdentite?.typePiece}</td></tr>
                    <tr><th className="table-active">N° piece d'identité</th><td>{personne?.pieceIdentite?.numPieceIdentite}</td></tr>
                    <tr><th className="table-active">Date de délivrance</th><td>{personne?.pieceIdentite?.dateDelivrance}</td></tr>    
                      <tr><th className="table-active">Valide jusqu'a</th><td>{personne?.pieceIdentite?.dateValidite}</td></tr>
                   
                    <tr><th className="table-active">Délivrer par</th><td>{personne?.pieceIdentite?.delivrerPar}</td></tr>
                     
                    
                     <tr><th colSpan="2" className="table-active">Remarque :</th></tr>
                    <tr><td colSpan="2">{personne?.pieceIdentite?.remarque}</td></tr>  
                    <tr><th colSpan="2" className="table-active">Scan pieces :</th></tr>
                    <tr><td colSpan="2">   
                    {scanPieceIdentitesGuid.length>0 &&(           
                       <div className="form-group for" >  
                        {<LoadFiles key={scanPieceIdentitesGuid} showImage={false} label={"scanPieceIdentites"} multiFile={true} action={perform.action} selectedFiles={scanPieceIdentites} handleLoadFiles={handleLoadFiles}/>}
                    </div>   
                    )}                                                           
                  
                  </td></tr>                                           
                                   
                </tbody>
              </table>
                
              </div>
            </section>



               <section className="accordion">
              <input type="radio" name="collapse" id="handle4"  />
              <h2 className="handle">
                <label htmlFor="handle4">Détail sur le poste</label>
              </h2>
              <div className="content">
                <table className='table table-bordered table-sm'>
                 <tbody>
                    
                   <tr><th className="table-active">N° de personnel</th><td>{personnel.numPersonnel}</td></tr> 
                   <tr><th className="table-active">Type de personnel</th><td>{personnel.typePersonnel}</td></tr> 
                       <tr><th className="table-active">Profession</th><td>{personne.profession}</td></tr> 
                    <tr><th className="table-active">Poste occupé</th><td>{Utils.capitalizeFist(personnel.fonction.replaceAll("ROLE_","").replaceAll("_"," "))}</td></tr> 
                    <tr><th className="table-active">Date debut d'exercice</th><td>{personnel.dateDebutExercice}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{personnel.actif==true? "Oui":"Non"}</td></tr>                                
                    <tr><th colSpan="2" className="table-active">Remarque :</th></tr>
                    <tr><td colSpan="2">{personnel.remarque}</td></tr>   

                                                              
                </tbody>
              </table>
                
              </div>
            </section>

             <section className="accordion">
              <input type="radio" name="collapse" id="photo"  />
              <h2 className="handle">
                <label htmlFor="photo">Photo</label>
              </h2>
              <div className="content">                
                    {scanAvatarGuid.length>0 &&(                
                        <LoadFiles key={scanAvatarGuid} showImage={true} label={"scanAvatar"} multiFile={true} action={perform.action} selectedFiles={scanAvatar} handleLoadFiles={handleLoadFiles}/>
                    )}                                                           
                                
              </div>
            </section>
       </div>

    )
}


const renderFormPS=()=>{

return (
            <div className="col">

        <section className="accordion">
              <input type="radio" name="collapse" id="handle1" defaultChecked />
              <h2 className="handle">
                <label htmlFor="handle1">Etat civil</label>
              </h2>
              <div className="content row">
              <div className="col-6">
              <div className="form-group">             
                      <input
                        type="text"                       
                        id="nom"
                        required
                        value={personne.nom}
                        onChange={handlePersonneChange}
                        name="nom"
                        placeholder="Nom"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.personne.nom.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.personne.nom}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="nomJeuneFille"
                        required
                        value={personne.nomJeuneFille}
                        onChange={handlePersonneChange}
                        name="nomJeuneFille"
                        placeholder="Nom de Jeune Fille"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.personne.nomJeuneFille.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.personne.nomJeuneFille}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                         
                        id="prenoms"
                        required
                        value={personne.prenoms}
                        onChange={handlePersonneChange}
                        name="prenoms"
                        placeholder="Prenoms"
                        maxLength="150"
                        className={`form-control form-control-sm ${errors.personne.prenoms.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.personne.prenoms}</div>
                    </div>
                    <div className="form-group"> 
                    <select id="situationFamilial" name="situationFamilial" onChange={handlePersonneChange} value={personne.situationFamilial}  className={`form-select form-select-sm ${errors.personne.situationFamilial.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Situation Familiale</option>
                      <option value="Célibataire">Célibataire</option>
                       <option value="Concubinage">Concubinage</option>
                      <option value="Marié">Marié</option>
                      <option value="Séparé">Séparé</option>
                      <option value="Divorcé">Divorcé</option>
                      <option value="Veuf">Veuf</option>
                   </select>            
                     <div className="invalid-feedback">{errors.personne.situationFamilial}</div>
                    </div>
                    <div className="form-group">     
                    <select id="sexe" name="sexe" onChange={handlePersonneChange} value={personne.sexe}  className={`form-select form-select-sm ${errors.personne.sexe.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Sexe</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Feminin">Feminin</option>
                      <option value="Intersexe">Intersexe</option>
                   </select>                          
                      <div className="invalid-feedback">{errors.personne.sexe}</div>
                    </div>
                    <div className="form-group">                   
                     <TextField
                        id="dateNaissance"
                        label="Date de Naissance"
                        type="date" variant="standard"                    
                        //defaultValue="2017-05-24"                       
                        name="dateNaissance"
                        value={personne.dateNaissance}
                        onChange={handlePersonneChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={`form-control form-control-lg ${errors.personne.dateNaissance.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.personne.dateNaissance}</div>
                    </div>
                </div>
              <div className="col-6">
                     <div className="form-group">     
                    <Select

                       defaultValue={paysNais.paysId!=null&&paysNais.paysId!=""?paysNais:""}
                       getOptionLabel={e => e.nomPays}
                        getOptionValue={e => e.paysId}
                        isClearable={true}
                       onChange={(e) => {
                         let elt=paysNais;
                        if(e!=null)       
                           { 
                            elt=e
                           
                           }
                          else
                            {
                              elt={...initialObjectState.personne.lieuNaissance.pays} 
                            } 

                            setPaysNais(elt)
                            //lieuNaissance={...initialObjectState.personne.lieuNaissance}                    
                            setLieuNaissance({...initialObjectState.personne.lieuNaissance})                            
                             retrieveVilles(elt.paysId,true)                           
                           
                        }}
                        options={payss}
                        placeholder={`Pays de naissance`}
                        noOptionsMessage={() => "Aucun resultat"}
                        className={`${errors?.personne.lieuNaissance.pays.paysId.length>0 ? 'is-invalid' : ''}`}
                        />        
                 
                      <div className="invalid-feedback">{errors?.personne.lieuNaissance.pays.paysId}</div>
                    </div> 

                   <div className="form-group">     
                    <CreatableSelect
                        isClearable
                       value={lieuNaissance.villeId!=null &&lieuNaissance.villeId!=""?{"value":lieuNaissance.villeId, "label":lieuNaissance.nomVille,"key":lieuNaissance.pays?.paysId}:""}
                      
                        onChange={(obj, actionMeta) => {
                             if(obj!=null)
                             {
                                let elt={...initialObjectState.personne.lieuNaissance}
                                elt.nomVille=obj.label
                                elt.pays=paysNais
                                if(obj.key==null)
                                {
                                     elt.villeId="0"
                                     lieuNaissances.push(obj)
                                     setLieuNaissance(elt); 
                                }    
                                else
                                {
                                     elt.villeId=obj.value
                                     lieuNaissances.push(obj)
                                     setLieuNaissance(elt);
                                } 
                                 //console.log("lieuNaissance===>",elt)
                             }
                            
                          }}
                       
                        options={lieuNaissances}
                        placeholder={`Lieu de naissance`}
                         name="lieuNaissanceVille"
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
						menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                        />        
                 
                      <div className="invalid-feedback">{errors?.personne.lieuNaissance?.villeId}</div>
                    </div>
                       <div className="invalid-feedback">{errors?.personne.lieuNaissance?.villeId}</div>       
                    <div className="form-group">
                    <TextField
                        id="dateDeces"
                        label="Date de Décès"
                        type="date" variant="standard"                    
                        //defaultValue="2017-05-24"                       
                        name="dateDeces"
                        value={personne.dateDeces||""}
                        onChange={handlePersonneChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={`form-control form-control-lg ${errors.personne.dateDeces.length>0 ? 'is-invalid' : ''}`}
                      />                                 
                      <div className="invalid-feedback">{errors.personne.dateDeces}</div>
                    </div>  
                      <div className="form-group">

                       <select id="profession" name="profession" onChange={handlePersonneChange} value={personne.profession}  className={`form-select form-select-sm ${errors.personne.profession.length>0 ? 'is-invalid' : ''}`}>
                            <option disabled={true} value="">Profession</option>
                            {professions!=null && professions.map((option) => (
                              <option key={option.modeleId} value={option.nomModele}>{option.nomModele}</option>
                            ))}                    
                      </select>             
                   
                      <div className="invalid-feedback">{errors.personne.profession}</div>
                    </div>                 
                     <div className="form-group">             
                      <textarea 
                        type="text"
                        className="form-control"
                        id="remarque"
                        required
                        value={personne.remarque||""}
                        onChange={handlePersonneChange}
                        name="remarque"
                        placeholder="Remarque"
                        maxLength="250"
                      />
                    </div>
                </div>
              </div>
            </section>






         <section className="accordion">
              <input type="radio" name="collapse" id="handle2"  />
              <h2 className="handle">
                <label htmlFor="handle2">Coordonnées</label>
              </h2>
              <div className="content row">
              <div className="col-6">
             
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="numRue"
                        required
                        value={personne.numRue}
                        onChange={handlePersonneChange}
                        name="numRue"
                        placeholder="N° de Rue"
                        maxLength="10"
                        className={`form-control form-control-sm ${errors.personne.numRue.length>0 ? 'is-invalid' : ''}`}

                      />
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="adresse"
                        required
                        value={personne.adresse}
                        onChange={handlePersonneChange}
                        name="adresse"
                        placeholder="Adresse"
                        maxLength="150"
                      className={`form-control form-control-sm ${errors.personne.adresse.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.personne.adresse}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="cp"
                        required
                        value={personne.cp}
                        onChange={handlePersonneChange}
                        name="cp"
                        placeholder="Code postale"
                        maxLength="50"
                      className={`form-control form-control-sm ${errors.personne.cp.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.personne.cp}</div>
                    </div>



                    <div className="form-group">     
                    <Select

                       defaultValue={pays.paysId!=null&&pays.paysId!=""?pays:""}
                       getOptionLabel={e => e.nomPays}
                        getOptionValue={e => e.paysId}
                        isClearable={true}
                       onChange={(e) => {
                         let elt=pays;
                        if(e!=null)       
                           { 
                            elt=e
                           
                           }
                          else
                            {
                              elt={...initialObjectState.personne.ville.pays} 
                            } 
                           setPays(elt)
                            //ville={...initialObjectState.personne.ville}                            
                            setVille({...initialObjectState.personne.ville})                             
                             retrieveVilles(elt.paysId,false)                                                       
                        }}
                        options={payss}
                        placeholder={`Pays de résidence`}
                        noOptionsMessage={() => "Aucun resultat"}
                        className={`${errors?.personne.ville.pays.paysId.length>0 ? 'is-invalid' : ''}`}
                        />        
                 
                      <div className="invalid-feedback">{errors?.personne.ville.pays.paysId}</div>
                    </div> 

                     <div className="form-group">     
                    <CreatableSelect
                        isClearable
                       value={ville.villeId!=null &&ville.villeId!=""?{"value":ville.villeId, "label":ville.nomVille,"key":ville.pays?.paysId}:""}
                      
                        onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null)
                             {
                                let elt={...initialObjectState.personne.ville}
                                elt.nomVille=obj.label
                                elt.pays=pays
                                if(obj.key==null)
                                {
                                     elt.villeId="0"
                                     villes.push(obj)
                                     setVille(elt); 
                                }    
                                else
                                {
                                     elt.villeId=obj.value
                                     villes.push(obj)
                                     setVille(elt);
                                } 
                                 
                             }
                            
                          }}
                       
                        options={villes}
                        placeholder={`Ville de résidence`}
                         name="ville"
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                        />        
                 
                      <div className="invalid-feedback">{errors?.personne.ville?.villeId}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        required
                        value={personne.email}
                        onChange={handlePersonneChange}
                        name="email"
                        placeholder="Email"
                        maxLength="50"
                     className={`form-control form-control-sm ${errors.personne.email.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.personne.email}</div>
                    </div>
                     <div className="form-group">             
                            <input
                              type="text"                       
                              id="emailPro"
                              required
                              value={contactPro.emailPro}
                              onChange={handleContactProChange}
                              name="emailPro"
                              placeholder="Email PRO"
                              maxLength="100"
                              className={`form-control form-control-sm ${errors.contactPro.emailPro.length>0 ? 'is-invalid' : ''}`}
                            />
                             <div className="invalid-feedback">{errors.contactPro.emailPro}</div>
                          </div>
                    </div>
              <div className="col-6">
                    <div className="form-group">             
                      <input
                        type="phone"
                        className="form-control"
                        id="telFixe"
                        required
                        value={personne.telFixe}
                        onChange={handlePersonneChange}
                        name="telFixe"
                        placeholder="Téléphone Fixe"
                        maxLength="20"
                      className={`form-control form-control-sm ${errors.personne.telFixe.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.personne.telFixe}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="phone"
                        className="form-control"
                        id="telMobile"
                        required
                        value={personne.telMobile}
                        onChange={handlePersonneChange}
                        name="telMobile"
                        placeholder="Téléphone Mobile"
                       maxLength="20"
                      className={`form-control form-control-sm ${errors.personne.telMobile.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.personne.telMobile}</div>
                    </div>
                    <div className="form-group">
                    <select id="smsAutorise" name="smsAutorise" onChange={handlePersonneChange} value={personne.smsAutorise}  className={`form-select form-select-sm ${errors.personne.smsAutorise.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">SMS Autorisé</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                    
                   </select>               
                   
                       <div className="invalid-feedback">{errors.personne.smsAutorise}</div>
                    </div>

                    
                           <div className="form-group">             
                            <input
                              type="text"                       
                              id="telFixePro"
                              required
                              value={contactPro.telFixePro}
                              onChange={handleContactProChange}
                              name="telFixePro"
                              placeholder="Tél. Fixe PRO"
                              maxLength="20"
                              className={`form-control form-control-sm ${errors.contactPro.telFixePro.length>0 ? 'is-invalid' : ''}`}
                            />
                             <div className="invalid-feedback">{errors.contactPro.telFixePro}</div>
                          </div>
                           <div className="form-group">             
                            <input
                              type="text"                       
                              id="telMobilePro"
                              required
                              value={contactPro.telMobilePro}
                              onChange={handleContactProChange}
                              name="telMobilePro"
                              placeholder="Tél. Mobile PRO"
                              maxLength="20"
                              className={`form-control form-control-sm ${errors.contactPro.telMobilePro.length>0 ? 'is-invalid' : ''}`}
                            />
                             <div className="invalid-feedback">{errors.contactPro.telMobilePro}</div>
                          </div>
                </div>
              </div>
            </section>


              <section className="accordion">
              <input type="radio" name="collapse" id="handle3"  />
              <h2 className="handle">
                <label htmlFor="handle3">Piéce d'identité</label>
              </h2>
              <div className="content row">
              <div className="col-6">
               <div className="form-group"> 
                    <select id="typePiece" name="typePiece" onChange={handlePieceIdentiteChange} value={pieceIdentite.typePiece}  
                    className={`form-select form-select-sm ${errors.personne.pieceIdentite.typePiece.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Type de piece d'identité</option>
                      <option value="Carte Nationale d'Identité">Carte Nationale d'identité</option>
                      <option value="Passeport">Passeport </option>
                      <option value="Permis de Conduire">Permis de Conduire</option>
                      <option value="Carte Professionnelle">Carte Professionnelle</option> 
                      <option value="Carte d'étudiant">Carte d'étudiant</option>                                          
                      <option value="Carte de Séjour/Résident">Carte de séjour/résident</option>
                     <option value="Carte securité social">Carte securité social</option>
                      <option value="Autre">Autre</option>
                   </select>                                     
                      <div className="invalid-feedback">{errors.personne.pieceIdentite.typePiece}</div>
                    
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"        
                        id="numPieceIdentite"
                        required
                        value={pieceIdentite.numPieceIdentite}
                        onChange={handlePieceIdentiteChange}
                        name="numPieceIdentite"
                        placeholder="Numéro piece d'identite"
                       maxLength="20"
                     className={`form-control form-control-sm ${errors.personne.pieceIdentite.numPieceIdentite.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.personne.pieceIdentite.numPieceIdentite}</div>
                    
                    </div>
                    <div className="form-group">   
                    <TextField
                        id="dateDelivrance"
                        label="Date de délivrance"
                        type="date" variant="standard"                    
                        //defaultValue="2017-05-24"                       
                        name="dateDelivrance"
                        value={pieceIdentite.dateDelivrance}
                        onChange={handlePieceIdentiteChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={`form-control form-control-lg ${errors.personne.pieceIdentite.dateDelivrance.length>0 ? 'is-invalid' : ''}`}
                      />          
                    
                      <div className="invalid-feedback">{errors.personne.pieceIdentite.dateDelivrance}</div>
                    </div>
                    <div className="form-group"> 
                     <TextField
                        id="dateValidite"
                        label="Date de fin de validité"
                        type="date" variant="standard"                    
                        //defaultValue="2017-05-24"                       
                        name="dateValidite"
                        value={pieceIdentite.dateValidite}
                        onChange={handlePieceIdentiteChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={`form-control form-control-lg ${errors.personne.pieceIdentite.dateValidite.length>0 ? 'is-invalid' : ''}`}
                      />          
             
                      <div className="invalid-feedback">{errors.personne.pieceIdentite.dateValidite}</div>
                    </div>
                </div>
              <div className="col-6">
                    <div className="form-group">             
                      <input
                        type="text"
                        id="delivrerPar"
                        required
                        value={pieceIdentite.delivrerPar}
                        onChange={handlePieceIdentiteChange}
                        name="delivrerPar"
                        placeholder="Délivrer par"
                        maxLength="50"
                     className={`form-control form-control-sm ${errors.personne.pieceIdentite.delivrerPar.length>0 ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.personne.pieceIdentite.delivrerPar}</div>
                    </div>
                     <div className="form-group">             
                      <input
                        type="text"
                        className="form-control"
                        id="remarque"
                        required
                        value={pieceIdentite.remarque}
                        onChange={handlePieceIdentiteChange}
                        name="remarque"
                        maxLength="250"
                        placeholder="Remarque à propos de la piéce d'identité"
                      />
                    </div>
                    <div className="form-group for" >  
                     <label> Scan des documents d'identité</label> 
                     <div className="text-danger" style={{ fontSize:"12px"}}>{errors.personne.pieceIdentite.scanPieces.length>0? errors.personne.pieceIdentite.scanPieces[0]:""}</div>
                     { (scanPieceIdentitesGuid.length>0) &&( 
                        <LoadFiles key={scanPieceIdentitesGuid} showImage={false} label={"scanPieceIdentites"} multiFile={true} action={perform.action} selectedFiles={scanPieceIdentites} handleLoadFiles={handleLoadFiles}/>
                    )}
                    </div>

                </div>
              </div>
            </section>

             

              <section className="accordion">
              <input type="radio" name="collapse" id="handle4"  />
              <h2 className="handle">
                <label htmlFor="handle4">Poste/Fonction</label>
              </h2>
              <div className="content row">
              <div className="col-6">                 
                    <div className="form-group"> 
                    <select id="fonction" name="fonction" 
                    onChange= {(event) => {
                      const { name, value } = event.target;
                     
                      let pers={...personnel}
                      pers.fonction=value                
                        setPersonnel(pers)

                      //if(value!=null && value!="")

                     //setPersonnel({ ...personnel, "fonction": Utils.capitalizeFist(value).replace("ROLE_","").replace("_"," ") });

                    }}
                     value={personnel.fonction}  className={`form-select form-select-sm ${errors.personnel.fonction.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Fonction</option>
                      {roles &&
                             roles.map((role, index) => (
                             <option key={index} value={role.name}>{Utils.replaceAllCustom(role.name,"_"," ")?.toLowerCase()}</option>
                             ))}
                     
                  </select>            
                     
                      <div className="invalid-feedback">{errors.personnel.fonction}</div>
                    </div>
                    <div className="form-group">

                       <select id="typePersonnel" name="typePersonnel" onChange={handlePersonnelChange}
                        value={personnel.typePersonnel}  className={`form-select form-select-sm ${errors.personnel.typePersonnel.length>0 ? 'is-invalid' : ''}`}>
                            <option disabled={true} value="">Type de personnel</option>
                           
                            <option value="Interne">Agent interne</option>
                            <option value="Externe">Agent externe</option>
    
                      </select>             
                   
                      <div className="invalid-feedback">{errors.personnel.typePersonnel}</div>
                    </div>
                    {personnel.typePersonnel!=null && personnel.typePersonnel=="Interne"&&(
                     <div className="form-group">

                      <input
                        type="text"
                        className="form-control"
                        id="salaire"
                        required
                        value={personnel.salaire}
                        onChange={handlePersonnelChange}
                        name="salaire"
                        placeholder="Salaire"
                        maxLength="10"
                      className={`form-control form-control-sm ${errors.personnel.salaire.length>0 ? 'is-invalid' : ''}`}
                      /> {globalObject?.entreprise.config?.deviseMonetaire}     
                   
                      <div className="invalid-feedback">{errors.personnel.salaire}</div>
                    </div>)}
                    <div className="form-group">
                            <TextField
                                id="dateDebutExercice"
                                label="Date Debut Exercice"
                                type="date" variant="standard"                    
                                //defaultValue="2017-05-24"                       
                                name="dateDebutExercice"
                                value={personnel.dateDebutExercice}
                                onChange={handlePersonnelChange}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                className={`form-control form-control-lg ${errors.personnel?.dateDebutExercice!="" ? 'is-invalid' : ''}`}
                              />                                 
                              <div className="invalid-feedback">{errors.personnel.dateDebutExercice}</div>
                            </div> 
                     

                    </div>
              <div className="col-6">   
                         
                    <div className="form-group">             
                            <textarea
                              type="text"
                              className="form-control"
                              id="remarque"
                              required
                              value={personnel.remarque||""}
                              onChange={handlePersonnelChange}
                              name="remarque"
                              placeholder="Remarque"
                              maxLength="250"
                              className={`form-control form-control-sm ${errors.personnel.remarque.length>0 ? 'is-invalid' : ''}`}
                            />
                             <div className="invalid-feedback">{errors.personnel.remarque}</div>
                          </div>
                            <div className="form-group">     
                            <select id="actif" name="actif" onChange={handlePersonnelChange} value={personnel.actif}  className={`form-select form-select-sm ${errors.personnel.actif!=null && errors.personnel?.actif.length>0 ? 'is-invalid' : ''}`}>
                              <option disabled={true} value="">Actif</option>
                              <option value={true}>Oui</option>
                              <option value={false}>Non</option>
                              
                           </select>        
                 
                          <div className="invalid-feedback">{errors.personnel?.actif}</div>
                        </div>
                    
             
                 
               </div> 
             </div>
            </section>
             <section className="accordion">
              <input type="radio" name="collapse" id="photo"  />
              <h2 className="handle">
                <label htmlFor="photo">Photo</label>
              </h2>
              <div className="content">                
                       <div className="form-group for" >  
                     <label> Photo</label> 
                        { (scanAvatarGuid.length>0 ) &&( 
                        <LoadFiles key={scanAvatarGuid} showImage={true} label={"scanAvatar"} multiFile={false} action={perform.action} selectedFiles={scanAvatar} handleLoadFiles={handleLoadFiles}/>
                   )} 
                </div>          
              </div>
            </section>


    {(errors?.errorMsg!=null&& errors?.errorMsg.length>0&&<div className="alert alert-danger" role="alert"> <p  dangerouslySetInnerHTML={{__html: errors?.errorMsg}}></p></div>)}
            </div>

  )

}


const renderRecherchePersonnel=() =>{
return (

<div className="container">
<div className="col-md-6 " >
Rechercher
<div className="row border border-secondary p-2" >

    <div className="col-md-4" >
    
            <div className="form-group">             
                      <input
                        type="text"                       
                        id="numPersonnel"
                        required
                        value={query.numPersonnel}
                        onChange={handleQueryChange}
                        name="numPersonnel"
                        placeholder="N° du personnel"
                        maxLength="100"
                        className={`form-control form-control-sm ${errorsQuery.numPersonnel.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errorsQuery.numPersonnel}</div>
                    </div>
                  <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleQueryChange} value={query.actif}  className={`form-select form-select-sm ${errorsQuery.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={false} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errorsQuery.actif}</div>
                    </div> 

        </div>
         <div className="col-md-6" >
    
             <div className="form-group">             
                      <input
                        type="text"                       
                        id="nom"
                        required
                        value={query.nom}
                        onChange={handleQueryChange}
                        name="nom"
                        placeholder="Nom"
                        maxLength="100"
                        className={`form-control form-control-sm ${errorsQuery.nom.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errorsQuery.nom}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="prenoms"
                        required
                        value={query.prenoms}
                        onChange={handleQueryChange}
                        name="prenoms"
                        placeholder="Prenoms"
                        maxLength="100"
                        className={`form-control form-control-sm ${errorsQuery.prenoms.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errorsQuery.prenoms}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="telMobilePro"
                        required
                        value={query.telMobilePro}
                        onChange={handleQueryChange}
                        name="telMobilePro"
                        placeholder="Tél. Mobile PRO"
                        maxLength="25"
                        className={`form-control form-control-sm ${errorsQuery.telMobilePro.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errorsQuery.telMobilePro}</div>
                    </div>
<div className="text-danger" style={{ fontSize:"12px"}}>{errorsQuery.remarque}</div>
        </div>
     <div className="col-md-2 align-self-end" >
      
 
         <i className="fa fa-search btn-search"
                      onClick={() => rechercherPersonnels()} /> 
         
     </div>
 
    </div>
</div>
<div className="col-md" >
</div>

</div>
  )}
return (
<div className="container">  
 <NotificationContainer/>        



{renderRecherchePersonnel()}
{(upload?.type!=null)&&(
       <UploadFile type={upload.type} key={upload.key}  returnData={returnData}/>)} 


<div className="submit-form">

    <div className="text-right">
    {/* <div className="custom-control custom-checkbox custom-control-inline">
        <input type="checkbox" className="custom-control-input" id="afficherTousPersonnel" defaultChecked={actifPersonnel}  
        onChange={handleActifPersonnelChange}/>
        <label className="custom-control-label" htmlFor="afficherTousPersonnel">Afficher Tous</label>
      </div>*/}


         <img  src={`${ showCard? '/img/list_card.png' : '/img/list.png'}`}  title="Changer affichage"  alt="Changer affichage" className="iconeButtonRectangle"
                      onClick={() => changeAffichage(showCard)}/> 


         <Button  variant="info" className="btn-sm" 
                      title="Rafraichir" onClick={() => refreshListPersonnels()}>
                <i className="fa fa-refresh"></i>
          </Button>
      {permission?.action?.includes("CRUD")&&
        <Button  variant="secondary" className="btn-sm" 
                      title="Uploader un fichier" onClick={() => uploadFile(".csv")}>
                <FontAwesomeIcon icon={['fas', 'file-upload']} />
          </Button>
        }
        {permission?.action?.includes("C")&&
        <Button  variant="success" className="btn-sm" 
                      title="Nouveau Personnel" onClick={() => newPersonnel()}>
               <FontAwesomeIcon icon={['fas', 'user-nurse']} />

          </Button> }


    </div>
      <Modal  centered show={showPersonnels} onHide={()=>handlePersonnelsClose} animation={false} dialogClassName={`${perform.result.length>0 ? 'modal-30vw' : 'modal-60vw'}`}>
   <Modal.Header >
            <Modal.Title >
      {perform.action=="POST"?("Nouveau personnel"): 
          (perform.action=="GET")? ("Détail sur le personnel "):
          (perform.action=="PUT")?("Modification de personnel " ):
          (perform.action=="DELETE")?("Supression de personnel "):
         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             {( (perform.action=="POST" || perform.action=="PUT"))? (
              renderFormPS()
              ):(perform.action=="GET" || perform.action=="DELETE")?(
              renderShowPersonnelsInfoPS()
              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(permission?.action?.includes("U")&&personnel.personnelId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(personnel, "PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
           <Button
                className="btn  btn-block"
                disabled={loading}
               variant="success"  onClick={() => save()}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>  Enregister</span>
              </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
           
                <Button
                className="btn  btn-block"
                disabled={loading}
               variant="warning"  onClick={() => save()}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>  Mettre à Jour</span>
              </Button>
          ):(perform.action=="DELETE" && perform.result=="")?(
            
           <Button
                className="btn  btn-block"
                disabled={loading}
               variant="danger" onClick={() => deletePersonnel()}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>  Supprimer</span>
              </Button>
          ):""
        }
        
          <Button variant="secondary" onClick={() =>handlePersonnelsClose(true)}>
            Fermer
          </Button>
      
        </Modal.Footer>
      </Modal>
    
    </div>

    {renderListPersonnel()}
      </div>

  );
};
let actifPersonnel=true;
let errorMsg=""
export default Personnels;