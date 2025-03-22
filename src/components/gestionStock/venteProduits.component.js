import React, {useState, useEffect, useCallback } from "react";
import EntrepotProduitsDataService from "../../services/stock/entrepotProduits.service";
import EntrepotsDataService from "../../services/stock/entrepots.service";
import ModelesDataService from "../../services/modeles.service";
import PharmaciesDataService from "../../services/stock/pharmacies.service";
import ProduitsDataService from "../../services/stock/produits.service";
import VenteProduitsDataService from "../../services/stock/venteProduits.service";
import VenteProduitLignesDataService from "../../services/stock/venteProduitLignes.service";
import PersonnelDataService from "../../services/personnels.service";
import CategorieProduitsDataService from "../../services/stock/categorieProduits.service";

import MouvementStocks from "../../components/gestionStock/mouvementStocks.component";
import RechercherIndividu from "../../components/rechercherIndividu.component";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import Styles from '../../styles.module.css';
import Select from 'react-select';
import globalObject from '../../global.js'
import $ from 'jquery'; 

import CreatableSelect from 'react-select/creatable';

/********Date management******
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@mui/pickers';*/
import 'date-fns';
import { TextField } from '@mui/material';

/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 /* eslint-disable */
const VenteProduits = (props) => {


const initialVenteProduitLigneState = 
    { 
       
        "venteProduitLigneId": "",
        "venteProduitId": "",
        "numeroCommande": "",
        "entrepotProduitId": "", 
        "codeProduit": "",
        "venteProduitId": "",
        "produitId": "",
        "produitLibelle": "",
        "unite": "",
        "prixUnitaire": 0.0,
        "qte": 0.0,
        //"qteMaxReservable":0.0,
        "montant": 0.0,
        "tva": 0.0,
        "reduction": 0.0,
        "typeReduction": "",
        "motifReduction": "",
        "statut":0,
        "lotIds":[],
        "dateExpiration": "", 
        "dateExpedition": "", 
        "remarque": "",
        "toDelete": false,
         "actif": true,
         "userId": "",
               
    }

/*Create entrepotProduit code*/
const initialVenteProduitState = 
    { 
        "venteProduitId": "",
        "numeroCommande": "", 
        "entrepot": {},  
        "entrepotId": "",     
        "statut": "",
        "typeDeVente": "",
        "demanderPar": "",
        "dateDemande":"",
        "venteProduitLignes": [],
        "patientId":"",
        "patientNomPrenoms":"",
        "typeActe":"",
        "typeActeId":"",
        "typeLibelle":"",
        "acte":"",
        "deciderPar": "",
        "typeDecision":"",
         "dateDecision": "",
         "livrerPar":"",
         "dateLivraisonProduit": "",
         "remisePar": "",
         "dateRemiseProduit": "",
         "montantTotal": 0.0,
         "deviseMonetaire":globalObject?.entreprise.config?.deviseMonetaire,
         "typeReduction": "",
         "reduction": 0.0,
         "dateVente": "",  
        "remarque": "",
        "actif": true,
        "userId": "",
       
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };


const [pharmacies, setPharmacies] = useState([]);
const [entrepots, setEntrepots] = useState([]);
const [entrepot, setEntrepot] = useState({});
const [venteProduit, setVenteProduit] = useState(initialVenteProduitState);
const [venteProduits, setVenteProduits] = useState([]);
const [entrepotProduits, setEntrepotProduits] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialVenteProduitState);
const [showVenteProduit, setShowVenteProduit] = useState(false);
const [personnels, setPersonnels] = useState([]);

const [categorieProduits, setCategorieProduits] = useState([]);
const [categorieProduit, setCategorieProduit] = useState(true);

const [venteProduitLigne, setVenteProduitLigne] = useState(initialVenteProduitLigneState);
const [errorVenteProduitLigne, setErrorVenteProduitLigne] = useState(initialVenteProduitLigneState);
const [venteProduitLignes, setVenteProduitLignes] = useState([]);
const [venteProduitLignesToDelete, setVenteProduitLignesToDelete] = useState([]);
const [guid, setGuid] = useState(Utils.uuidv4());
const [actifVenteProduit, setActifVenteProduit] = useState(true);
const [error, setError] = useState(null); // Pour gérer les erreurs comme les doublons de libellé

const permissionStock=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/DEMANDE_PRODUIT");
//const permission=props?.permissionPrestaionPharmacie!=undefined?props?.permissionPrestaionPharmacie:""
const permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/DEMANDE_PRODUIT");
const [rechercher, setRechercher] = useState(null);
const QTE_MAX_RESERVABLE=9999999
useEffect(() => {

   retrieveVenteProduits();
   //initVenteProduit()
    retrievePersonnels();

  }, []);



  const [editIndex, setEditIndex] = useState(null);

async function initVenteProduit()
 {
  let venteP={...initialVenteProduitState}
  if(props?.origine=="consultations"||props?.origine=="examens"||props?.origine=="soins"||props?.origine=="hospitalisations")
  {
   
    venteP.typeActeId=props?.acteInfo?.typeActeId
    venteP.typeActe=props?.acteInfo?.acte?.typeActe
    venteP.typeActeLibelle=props?.acteInfo?.acte?.libelleActe
     venteP.typeActeParentId=props?.acteInfo?.typeActeParentId
     venteP.typeActeParentType=props?.acteInfo?.typeActeParentType
     venteP.acte=props?.acteInfo?.acte
     venteP.factureId=props?.facture?.factureId
     venteP.numFacture=props?.facture?.numFacture
    venteP.demanderPar=props?.demanderPar!=undefined?props?.demanderPar:globalObject?.personnel?.personnelId
    venteP.demanderParNomPrenoms=venteP.demanderPar==""?"":globalObject?.personnel?.personne?.nom+" "+globalObject?.personnel?.personne?.prenoms
    venteP.patientId=props?.patient?.patientId
    venteP.patientNomPrenoms=props?.patient?.patientNomPrenoms

    /*console.log("venteProduit",venteP)
     console.log("props.permissionPrestaionPharmacie",props.permissionPrestaionPharmacie)
      console.log("isLocked",props.isLocked)*/
  }
  setVenteProduit(venteP)

  
  
 }
 


function estFacturable  (entProduit,facturerProduitEnSus) {
  if(entProduit?.modaliteFacturationActe==0)
      return true
      else
        if(entProduit?.modaliteFacturationActe==-1)
          return false
        else 
        if(facturerProduitEnSus==false)
          return false
        else
          return true
}

 // Ajouter un article avec vérification d'unicité du libellé
  const addVenteProduitLigne = (eProduit) => {
    setError("")
    if (!eProduit?.entrepotProduitId.trim()) {
      setError("Le produit ne peut pas être vide.");
      return;
    }

    // Vérifier si le libellé existe déjà
    const exists = venteProduitLignes.some((item) => item.entrepotProduitId.toLowerCase() === eProduit?.entrepotProduitId.toLowerCase());
    const item=Utils.trouverObjetDansListObject(venteProduitLignesToDelete,"entrepotProduitId",eProduit?.entrepotProduitId)
    if (exists) {
      setError("Ce produit existe déjà dans la liste.");
    } else 
    if(item!=null)
    {
      item.toDelete=false

       setVenteProduitLignes([...venteProduitLignes, item]);
       setVenteProduitLignesToDelete((venteProduitLignesToDelete) => venteProduitLignesToDelete.filter((objet) => objet.venteProduitId !== item.venteProduitId));

    }else
    {
      let ventePL={...initialVenteProduitLigneState}
      ventePL.entrepotProduitId=eProduit?.entrepotProduitId
      ventePL.qte=parseFloat(1)
      if(estFacturable(eProduit, props?.acteInfo?.acte?.facturerProduitEnSus))
      ventePL.prixUnitaire=parseFloat(eProduit?.prixVente)
      else
          ventePL.prixUnitaire=parseFloat(0)

      ventePL.unite=eProduit?.uniteDeMesure
      ventePL.codeProduit=eProduit?.produit?.codeProduit
      ventePL.produitId=eProduit?.produit?.produitId
      ventePL.produitLibelle=eProduit?.produit?.libelle
      ventePL.unite=eProduit.uniteDeMesure
      //ventePL.qteMaxReservable=parseFloat(eProduit?.qte)+parseFloat(eProduit?.qteReserve)
      ventePL.actif=true
      ventePL.entrepotProduitId=eProduit?.entrepotProduitId
      //setVenteProduitLignes([...venteProduitLignes, { entrepotProduitId: eProduit?.entrepotProduitId, qte: parseFloat(1),prixUnitaire:parseFloat(eProduit?.prixVente) }]);
      setVenteProduitLignes([ventePL,...venteProduitLignes ]);

      resetInputs();
      setError(null); // Réinitialiser le message d'erreur si l'ajout est réussi
    }
  };

// Valider la quantité pour un article existant (vérifie si c'est un entier > 0)
  const validateQuantity = (value) => {
    const num = parseFloat(value);
    return isNaN(num) || num < 1 ? 1 :Math.min(num, QTE_MAX_RESERVABLE) ;
  };


{/*
// Valider la quantité (doit être un entier supérieur à 0)
  const validateQuantity = (value) => {
    const num = parseFloat(value);
    return isNaN(num) || num < 1 ? 1 : num;
  };
*/}
  // Valider le prix (doit être un nombre supérieur ou égal à 0)
  const validatePrice = (value) => {
    const num = parseFloat(value);
    return isNaN(num) || num < 0 ? 0 : num;
  };


 // Mettre à jour un champ (produitLibelle ou quantité) d'un article existant
  const handleVenteProduitLigneChange = (index, key, value) => {
      const updatedItems = venteProduitLignes.map((item, i) =>
      i === index
        ? { ...item, [key]: key === 'qte' ? validateQuantity(value) : key === 'prixUnitaire' ? validatePrice(value) : value }
        : item
    );
    setVenteProduitLignes(updatedItems);
    
  };



    // Supprimer un article
  const deleteItem = (index) => {
    
    let item={...venteProduitLignes[index]};
    if(item?.venteProduitId!=null&&item?.venteProduitId!="")
    {  item.toDelete=true;
       setVenteProduitLignesToDelete([...venteProduitLignesToDelete, item]);
    }

    const newItems = venteProduitLignes.filter((_, i) => i !== index);
    setVenteProduitLignes(newItems);
   //console.log("venteProduitLignes===>",item)
    
    
  };

  // Réinitialiser les champs d'entrée
  const resetInputs = () => {
    setVenteProduitLigne(initialVenteProduitLigneState);
  };

  
  // Calculer le total pour chaque article
  const calculateTotalForItem = (item) => {
    return item.qte * item.prixUnitaire;
  };

  // Calculer la quantité totale de tous les articles
  const totalQuantity = venteProduitLignes.reduce((total, item) => total + item.qte, 0);

  // Calculer le prix total (total général) pour tous les articles
  const totalPrice = venteProduitLignes.reduce((total, item) => total + calculateTotalForItem(item), 0);


// Incrémenter la quantité
{/*  const incrementQuantity = (index) => {
    const updatedItems = venteProduitLignes.map((item, i) =>
      i === index ? { ...item, qte: item.qte + 1 } : item
    );
    setVenteProduitLignes(updatedItems);
  };

  // Décrémenter la quantité (minimum 1)
  const decrementQuantity = (index) => {
    const updatedItems = venteProduitLignes.map((item, i) =>
      i === index ? { ...item, qte: Math.max(1, item.qte - 1) } : item
    );
    setVenteProduitLignes(updatedItems);
  };
*/}
  // Incrémenter la quantité
 const incrementQuantity = (index) => {
    const updatedItems = venteProduitLignes.map((item, i) =>
      i === index ? { ...item, qte: Math.min( parseFloat(item.qte) + 1,parseFloat(QTE_MAX_RESERVABLE)) } : item
    );
    setVenteProduitLignes(updatedItems);
  };

  // Décrémenter la quantité
  const decrementQuantity = (index) => {
    const updatedItems = venteProduitLignes.map((item, i) =>
      i === index ? { ...item, qte: Math.max(1, parseFloat(item.qte) - 1) } : item
    );
    setVenteProduitLignes(updatedItems);
  };


const retrieveIndividu=(typeIndiv)=>{
 console.log("call RechercherIndividu")
 let rech={}
 rech.typeIndividu=typeIndiv;
 rech.key=Utils.uuidv4();
 setShowVenteProduit(false);
 setRechercher(rech);

 }


 async function returnIndividu (typeIndiv, indiv){

    //console.log(typeIndiv,":",indiv)
    let obj={...venteProduit};
    if(typeIndiv=="Patient")
    { 
      obj.patientId=indiv.id;
      obj.patientNom=indiv.nom;
      obj.patientPrenoms=indiv.prenoms;
      obj.patientNomPrenoms=indiv.nom+" "+indiv.prenoms
      setVenteProduit(obj);
    }
  
    setShowVenteProduit(true);

}
const handleClose = () => {
  setShowVenteProduit(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);

//if(props?.hideParentModal!=undefined&&props.hideParentModal!=null) 
//        props?.hideParentModal(false)    
}
const handleCloseAndReload = () => {
setShowVenteProduit(false);
refreshVenteProduit()
retrieveVenteProduits(entrepot?.entrepotId);
//if(props?.hideParentModal!=undefined&&props.hideParentModal!=null) 
  //      props?.hideParentModal(false)    
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"VenteProduit", perf.msg);                         
handleCloseAndReload()
}

const handleActifventeProduitChange = (event) => {
  //let act=event.target.checked;
  actifVenteProduit=event.target.checked;
  retrieveVenteProduits(entrepot?.entrepotId);
}

const handleShowVenteProduit = () => setShowVenteProduit(true);

//const today=new Date();
const handleVenteProduitChange  = event => {
  const { name, value } = event.target;
  setVenteProduit({ ...venteProduit, [name]: value });
};

  const refreshList = () => {
    retrieveVenteProduits(entrepot?.entrepotId);
  };

const refreshVenteProduit = () => {
    initVenteProduit()
    setVenteProduitLignes([])
     setVenteProduitLignesToDelete([])
     setError("")
     setErrors(initialVenteProduitState);
     setPerform(initialPerformState);
     
  };


/*async function handleToUpdateVenteProduit  (obj) 
{
  if(obj.venteProduitId!=null)
  {
    retrieveVenteProduits()
    
  }
}*/


async function retrieveEntrepots (){

  
    let resp=null;
    let query="?"
    
      query+="actif=true"

      if(props?.origine=="consultations"||props?.origine=="examens"||props?.origine=="soins"||props?.origine=="hospitalisations")
      {
        query+="&accepteDemandeSortieProduit=true"
      }
      //+"&employes="+globalObject?.personnel?.personnelId
      resp= await EntrepotsDataService.findAsync(query); 
          
    if(resp!=null && resp.status=="200" )          
      {
        setEntrepots(resp.data);
      }  
      else   
     setEntrepots([])

    //setShowVenteProduitPatientsLoading(false)
}


async function retrieveCategorieProduits (){

  
    let resp=null;
    let query="?"
    
      query+="actif=true"

      
      //+"&employes="+globalObject?.personnel?.personnelId
      resp= await CategorieProduitsDataService.findAsync(query); 
          
    if(resp!=null && resp.status=="200" )          
      {
        setCategorieProduits(resp.data);
      }  
      else   
     setCategorieProduits([])

    //setShowVenteProduitPatientsLoading(false)
}
async function retrievePersonnels (){
    let resp=null
    let q="personnel=true"


    resp= await PersonnelDataService.getByPersonnelsLiteAsync(q);
  
    if(resp!=null && resp.status=="200" )          
        {
          setPersonnels(resp.data);   
          //console.log("setPersonnels====>",resp.data)      
        }else 
         setPersonnels([])


}
/*
async function retrievePersonnels (){
    let resp=null
    let q="personnel=true"


    resp= await PersonnelDataService.getByPersonnelsLiteAsync(q);
  
    if(resp!=null && resp.status=="200" )          
        {
          setPersonnels(resp.data);   
          //console.log("setPersonnels====>",resp.data)      
        }else 
         setPersonnels([])


}*/


//const reload=()=>window.location.reload();
/******************************************/
async function saveVenteProduit (venteProduit)  {
 const obj = {...venteProduit};
  obj.userId=globalObject?.user?.id

if(perform.action=="POST")
{
obj.entrepot=entrepot
obj.entrepotId=entrepot?.entrepotId
}
//console.log("venteProduitLignes=========>",venteProduitLignes)
//console.log("venteProduitLignesToDelete=========>",venteProduitLignesToDelete)
obj.venteProduitLignes=[...venteProduitLignes,...venteProduitLignesToDelete]

  //console.log("saveVenteProduit=========>",obj)
  //    console.log("personnels=========>",personnels)
   var perf=perform;
     if(isValid(obj))
     {     

      
          let response=null;
         
          if(obj.venteProduitId!=null && obj.venteProduitId!="")
            response= await VenteProduitsDataService.updateAsync(obj.venteProduitId,obj);
          else
            response= await VenteProduitsDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              //setVenteProduit(response.data);             
              perf.result="success";
              if(perf.action=="POST")
                perf.msg="Enregistrement effectué avec succès" 
              else
                perf.msg="Mise à jour effectuée avec succès" 
              showNotif(perf);    
              
                                          
            }  
           else
           {
            if(response!=null&&response.status=="206")
            {
              setError(response.data.message);
            }else
             {
              perf.result="error";
              perf.msg= response.data.message;
             
               showNotif(perf);
              }
               
              
           }            
        } 
  };


  async function handleStatus(obj, statut) {
    obj.userId=globalObject?.user?.id
    if(statut==2||statut==-2)
    {
      obj.deciderPar=globalObject?.personnel?.personnelId
    }

    if(statut==3)
    {
      obj.livrerPar=globalObject?.personnel?.personnelId
    }

    obj.statut=statut
  
  console.log("VenteProduitsDataService.updateAsync===>",obj)
      let perf=perform;
    let response=await VenteProduitsDataService.updateAsync(obj.venteProduitId,obj);
    if(response!=null && response.status=="200")
      {
                      
         perf.result="success";          
          perf.msg="Mise à jour effectuée avec succès" 
          showNotif(perf);   

      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrieveVenteProduits (entrepotId){


if ($.fn.dataTable.isDataTable(`#tListOfVenteProduit-${props.origine}`)) {
        $(`#tListOfVenteProduit-${props.origine}`).DataTable().destroy();
       
    }
    let resp=null;
    
      let query="?actif=true"
      
    if(entrepotId!=null && entrepotId!="")
    {

      query+="&entrepotId="+entrepotId
    }

    if(props?.acteInfo!=null && props?.acteInfo?.typeActeId!="")
    {
      console.log("acteInfo===========>>>",props?.acteInfo)
      query+="&typeActeId="+props?.acteInfo?.typeActeId
    }
      resp= await VenteProduitsDataService.findAsync(query);  
     
    if(resp!=null && resp.status=="200" )          
        {
          setVenteProduits(resp.data);
         
           console.log("VenteProduitsDataService",resp.data)
        }else 
         setVenteProduits([])
   
          //setGuid(Utils.uuidv4())

setTimeout(()=>{ 
    //$(`#tListOfVenteProduit-${props.origine}`).DataTable().destroy();                       
    $(`#tListOfVenteProduit-${props.origine}`).DataTable(

      {
        
        "autoWidth": false,
       
        "scrollX":false,
        "scrollCollapse": true,
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            },
            // { "width": "20%", "targets": 2 }
        ],
       responsive: true,
        destroy: true,
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
                  }
          },
          "fnInitComplete": function ( oSettings ) {
               oSettings.oLanguage.sZeroRecords = "No matching records found"
           }
    }
      );
  }, 200);


  };

async function retrieveVenteProduitLignes (venteProduitId){

  
    let resp=null;
    let query="?"
    
      query+="actif=true&venteProduitId="+venteProduitId
      //+"&employes="+globalObject?.personnel?.personnelId
      resp= await VenteProduitLignesDataService.findAsync(query); 
          
    if(resp!=null && resp.status=="200" )          
      {
        setVenteProduitLignes(resp.data);
        
        /*if(resp.data.length>0)
          {

            retrieveVenteProduits(resp.data[0]?.entrepot?.entrepotId);
            setPharmacie(resp.data[0])
          }*/
      }  
      else   
     setVenteProduitLignes([])
      setVenteProduitLignesToDelete([])

    //setShowVenteProduitPatientsLoading(false)
}
      //init Datatable  
async function retrieveEntrepotProduits (entrepotId,categorieProduitId){

if ($.fn.dataTable.isDataTable(`#tListOfEntrepotProduit-${props.origine}`)) {
        $(`#tListOfEntrepotProduit-${props.origine}`).DataTable().destroy();
       
    }



    let resp=null;
    
      let query="?"
    if(entrepotId!=null && entrepotId!="")
    {

      query+="entrepotId="+entrepotId
      if(props?.origine=="consultations"||props?.origine=="examens"||props?.origine=="soins"||props?.origine=="hospitalisations")
      {
        query+="&accepteDemandeSortieProduit=true"
      }
      if(categorieProduitId!=null&&categorieProduitId!="")
        query+="&categorieProduitId="+categorieProduitId
      resp= await EntrepotProduitsDataService.findAsync(query);  
     
    if(resp!=null && resp.status=="200" )          
        {
          setEntrepotProduits(resp.data);
         /*if(perform.action=="GET_IN_OUT"&&venteProduit.venteProduitId!=null)
         {
          let entrepotP=Utils.trouverObjetDansListObject(resp.data,"venteProduitId",venteProduit.venteProduitId)
          setEntrepotProduits({...entrepotP})
          setGuid(Utils.uuidv4())
          console.log("setVenteProduit",entrepotP)
         }*/
          //setGuid(Utils.uuidv4())
        }else 
         setEntrepotProduits([])
     }else 
         setEntrepotProduits([])


setTimeout(()=>{ 
    //$(`#tListOfEntrepotProduit-${props.origine}`).DataTable().destroy();                       
    $(`#tListOfEntrepotProduit-${props.origine}`).DataTable(

      {
        
        "autoWidth": false,
       
        "scrollX":false,
        "scrollCollapse": true,
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            },
            // { "width": "20%", "targets": 2 }
        ],
       responsive: true,
        destroy: true,
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
                  }
          },
          "fnInitComplete": function ( oSettings ) {
               oSettings.oLanguage.sZeroRecords = "No matching records found"
           }
    }
      );
  }, 200);
  };


function isValid  (obj) {
 
    let err=initialVenteProduitState;
    let valid=true;
        console.log(obj); 

    if( obj.entrepot==null || obj.entrepot.entrepotId==null || obj.entrepot.entrepotId.length<2) 
       {
         err.entrepotId="Entrepot incorrecte";
         valid=false;
     }
    if( venteProduitLignes==null || venteProduitLignes.length==0) 
       {
        
         setError("Ajouter au moins un produit dans le panier")
         valid=false;
     } 
  
   
  setErrors(err);
    return valid;

  };


const performAction = (venteProduit,action) => {
  let perf=null;
  refreshVenteProduit();
  if(action=="POST")
  {
    
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
    
  }else
  {
    perf=perform;
    handleClose();
    setVenteProduit(venteProduit);      
    setErrors(initialVenteProduitState);
    if(venteProduit?.venteProduitLignes!=null&&venteProduit?.venteProduitLignes.length>0)
    retrieveVenteProduitLignes(venteProduit?.venteProduitId)
    //setEntrepot(venteProduit?.entrepot)
    
      
    perf.action=action;
    setPerform(perf);
    }

    if(action=="PUT")
      {
        retrieveEntrepotProduits(venteProduit?.entrepotId);
        setEntrepot(venteProduit?.entrepot)

      }

      if((action=="PUT"||action=="POST") &&categorieProduits.length==0)
         retrieveCategorieProduits();
       if((action=="PUT"||action=="POST") &&entrepots.length==0)
         retrieveEntrepots()
    //retrievePharmacies()
   
  
    /*if(props?.hideParentModal!=undefined&&props.hideParentModal!=null) 
      {
        //console.log("props executed",props?.hideParentModal)
         //hideParentModal(false)  
        // props?.hideParentModal(true)
         
      } */ 
        setShowVenteProduit(true)
                         
    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShowVenteProduit(false);
  setShowVenteProduit(true);
}




$(document).ready( function () {

$(`#tListOfVenteProduit-${props.origine}`).on('click', 'tr', function () {
  var table = $(`#tListOfVenteProduit-${props.origine}`).DataTable();
   var data = table.row( this ).data();
   // below some operations with the data
   // How can I set the row color as red?
  $(this).addClass('highlight').siblings().removeClass('highlight');
});

$(`#tListOfVenteProduit-${props.origine}`).on('draw.dt', function () {
  $(this).find('.highlight').removeClass('highlight');
});

$(`#tListOfEntrepotProduit-${props.origine}`).on('click', 'tr', function () {
  var table = $(`#tListOfEntrepotProduit-${props.origine}`).DataTable();
   var data = table.row( this ).data();
   // below some operations with the data
   // How can I set the row color as red?
  $(this).addClass('highlight').siblings().removeClass('highlight');
});

$(`#tListOfEntrepotProduit-${props.origine}`).on('draw.dt', function () {
  $(this).find('.highlight').removeClass('highlight');
});

} );
const renderListOfVenteProduit=() =>{
  
return (

      <div className="table-responsive">

      <table id={`tListOfVenteProduit-${props.origine}`}  className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>             
                <th>N°</th>
             <th>Initiateur</th>
               <th>Acte</th>
               <th>Montant</th>
               <th>Statut</th>
               {/*<th style={{"display": perform.action=="GET_IN_OUT"?"none":""}}></th>*/}                  
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {
            venteProduits!=null&&venteProduits.length>0&& venteProduits.map((item, index) => (
                <tr key={index}> 
                 <td>{item?.dateModif?.slice(0,-3)}</td> 
               
                <td>{item?.numeroCommande}</td> 
             <td>{Utils.filterArrayByFieldNameAndValueAndOneObject(personnels,"key",item?.demanderPar)?.value}</td>          
                  <td>{item?.typeActe}</td>
                  <td>{item?.montantTotal} {item?.deviseMonetaire}</td> 
                   <td>
                  {
                    (item.statut)==-2  ?
                    <span className="badge rounded-pill bg-danger">Réfusée</span>:
                    (item.statut)==-1  ?
                    <span className="badge rounded-pill bg-secondary">Annulée</span>:
                    (item.statut==0)  ?
                    <span className="badge rounded-pill bg-info text-dark">En création</span>:
                    item.statut==1  ?
                     <span className="badge rounded-pill bg-primary">Soumise</span>:
                    item.statut==2  ?
                     <span className="badge rounded-pill bg-success">Validée</span>:
                      item.statut==3  ?
                     <span className="badge rounded-pill bg-success text-dark">Livrée</span>:""
                    }



                   </td> 
                   
                  <td>
                 
                    <div className="btn-group">
                      <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(item, "GET")}><i className="fa fa-eye"></i> </Button>                
                     </div>
                     {permission?.action?.includes("U")&&(item.statut==0)&&(
                     <Button  variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(item, "PUT")}>
                     <i className="fa fa-edit fa-sm"></i>
                     </Button>)
                     } 
                  {((item.statut==0&&venteProduit?.demanderPar==globalObject?.personnel?.personnelId&&permission?.action?.includes("U"))||
                    ((item.statut==1||item.statut==2)&&(entrepot?.gestionnaireIds?.includes(globalObject?.personnel?.personnelId)||permissionStock?.action?.includes("U"))
                    ))&&(
                     <div className="btn-group" role="group">
                      <button id="btnGroupDrop1" type="button" className="btn btn-sm btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa fa-indent"></i>
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><a className="dropdown-item disabled" aria-disabled="true">Changer le statut</a></li>
                        {(item.statut==0&&venteProduit?.demanderPar==globalObject?.personnel?.personnelId)&&<li><a className="dropdown-item" onClick={() => handleStatus(item,-1)}>Annuler</a></li>}
                        {(item.statut==0&&venteProduit?.demanderPar==globalObject?.personnel?.personnelId)&&<li><a className="dropdown-item" onClick={() => handleStatus(item,1)}>Soumettre</a></li>}
                        {(item.statut==1)&&(entrepot?.gestionnaireIds?.includes(globalObject?.personnel?.personnelId)||permissionStock?.action?.includes("U"))&&<li><a className="dropdown-item" onClick={() => handleStatus(item,-2)}>Réfuser</a></li>}
                        {(item.statut==1)&&(entrepot?.gestionnaireIds?.includes(globalObject?.personnel?.personnelId)||permissionStock?.action?.includes("U"))&&<li><a className="dropdown-item" onClick={() => handleStatus(item,2)}>Valider</a></li>}
                        {(item.statut==2)&&(entrepot?.gestionnaireIds?.includes(globalObject?.personnel?.personnelId)||permissionStock?.action?.includes("U"))&&<li><a className="dropdown-item" onClick={() => handleStatus(item,3)}>Livrer</a></li>}
                      </ul>
                    </div> )}               
                   </td>              
                </tr>

          ))}          
          </tbody>          
        </table> 

</div>
  )}


const renderListOfEntrepotProduit=() =>{


return (
  <div className="col">

           <div className="form-group custom-control-inline form-inline " >     
                   Sélectionner l'entrepot <Select
                       defaultValue={entrepot!=null&&entrepot.entrepotId!=null?entrepot:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.entrepotId}
                       isClearable={true}
                       onChange={(newValue) => { 

                               setEntrepot(newValue);
                               let venteP={...venteProduit}
                               venteP.entrepotId=newValue?.entrepotId
                               venteP.entrepot=newValue
                               setVenteProduit(venteP)
                               setVenteProduitLignes([])
                                setVenteProduitLignesToDelete([])
                                 setError("")
                                 setCategorieProduit(null)
                              // console.log("setVenteProduit===>",newValue)
                               //retrieveVenteProduits(newValue?.entrepotId);
                               retrieveEntrepotProduits(newValue?.entrepotId,null);

                              }
                          }
                        isDisabled={perform.action=="POST" ? false : true}
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={entrepots}
                        placeholder={`Entrepot`}
                        className={`form-control-sm   }`}   
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}                     
                        />                       
                   
                
      </div>
      {venteProduit?.entrepotId!=null&&venteProduit?.entrepotId!=""&&(
         <div className="form-group custom-control-inline form-inline " >     
                   Catégorie de produit<Select
                       defaultValue={categorieProduit!=null&&categorieProduit.categorieProduitId!=null?categorieProduit:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.categorieProduitId}
                       isClearable={true}
                       onChange={(newValue) => { 
                              

                               setCategorieProduit(newValue);
                               retrieveEntrepotProduits(venteProduit?.entrepotId,newValue?.categorieProduitId);

                              }
                          }
                        /*isDisabled={perform.action=="POST" ? false : true}*/
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={categorieProduits}
                        placeholder={`Catégorie de produit`}
                        className={`form-control-sm   }`}   
                        menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}                     
                        />                       
                   
          <p>&nbsp;</p>        
      </div>)}

      {entrepot!=null&&entrepot?.entrepotId!=null&&(
      <div className="row">
      <h5 className="sectionTitle">Choix des produits à dispenser</h5>
      <div className="table-responsive">         
      <table id={`tListOfEntrepotProduit-${props.origine}`}   className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>            
                <th>Catégorie</th>
                {/*<th>Code</th>*/}
                <th>Produit</th>      
                <th>Stock</th>
                <th>Prix ({globalObject?.entreprise.config?.deviseMonetaire})</th>                               
               <th></th>             
            </tr>
          </thead>
          <tbody >
           {entrepotProduits &&
            entrepotProduits.map((item, index) => (
                <tr key={index}> 
                 <td>{item.dateModif}</td>             
                <td>{item?.produit?.categorieProduit?.libelle}</td> 
                {/*<td>{item?.produit?.codeProduit}</td>*/}
                  <td>{item?.produit?.libelle}</td>           
                  <td>{Number(item.qte)-Number(item.qteReserve)}</td>
                  <td>{estFacturable(item, props?.acteInfo?.acte?.facturerProduitEnSus) ?item?.prixVente:(<span><s>{item?.prixVente}</s> 0.0</span>)   }</td>                   
                  <td>
                    <div className="btn-group">
                      {permission?.action?.includes("C")&&(Number(item.qte)-Number(item.qteReserve))>0?
                      <Button variant="primary" className="btn-xs" 
                             title="Ajouter au panier" onClick={() => addVenteProduitLigne(item)}>
                      <FontAwesomeIcon icon={['fas', 'cart-arrow-down']} />
                     </Button>:<div className="badge rounded-pill bg-secondary">En rupture</div>}               
                     </div>                  
                   </td>              
                </tr>
          ))}          
          </tbody>          
        </table> 
        </div>
      </div>)}
</div>
  )}
const renderShowVenteProduit =()=> {
return (
   <div className="row">

                <div className="row">       
                 

                   <div className="col-md-8"> 
                   
                   <table className={Styles.styledTable}>
                    <thead>
            <tr>
              <th className="table-active" colSpan="4">Information sur la prestation</th>          
            </tr>
          </thead>
                <tbody>
                      {(props?.origine=="consultations"||props?.origine=="examens"||props?.origine=="soins"||props?.origine=="hospitalisations")&&  
                     <tr><th className="table-active">Bénéficiaire</th><td>{venteProduit?.patientNomPrenoms} </td></tr> }
                 
                      <tr><th className="table-active">Acte</th><td>{venteProduit?.typeActe} </td></tr>                           
                  
                   <tr><th className="table-active">Entrepot</th><td>{venteProduit?.entrepot?.libelle}</td></tr>
                   <tr><th className="table-active">Gestionnaires</th><td>{Utils.getAttributeValues(venteProduit?.entrepot.gestionnaires,"value")?.join(", ")}</td></tr>
                     <tr><th className="table-active">Initiateur</th><td>{Utils.filterArrayByFieldNameAndValueAndOneObject(personnels,"key",venteProduit?.demanderPar)?.value}</td></tr>
                  {venteProduit?.dateDemande?.length>0&&  <tr><th className="table-active">Date demande</th><td>{venteProduit?.dateDemande}</td></tr>}
                   {venteProduit?.deciderPar?.length>0&& <tr><th className="table-active">Décidé par</th><td>{Utils.filterArrayByFieldNameAndValueAndOneObject(personnels,"key",venteProduit?.deciderPar)?.value}</td></tr>}
                   {venteProduit?.dateDecision?.length>0&& <tr><th className="table-active">Date décision</th><td>{venteProduit?.dateDecision}</td></tr>}     
                   {venteProduit?.dateDecision?.length>0&& <tr><th className="table-active">Validation Automatique</th><td>{venteProduit?.decisionAutomatique?"Oui":"Non"}</td></tr>}
           
                   {venteProduit?.livrerPar?.length>0&& <tr><th className="table-active">Livrer par</th><td>{Utils.filterArrayByFieldNameAndValueAndOneObject(personnels,"key",venteProduit?.livrerPar)?.value}</td></tr> }
                   {venteProduit?.dateLivraisonProduit?.length>0&& <tr><th className="table-active">Date livraison</th><td>{venteProduit?.dateLivraisonProduit}</td></tr>}                
                   <tr><th className="table-active">Statut</th><td>
                   {
                    (venteProduit.statut)==-2  ?
                    <span className="badge rounded-pill bg-danger">Réfusée</span>:
                    (venteProduit.statut)==-1  ?
                    <span className="badge rounded-pill bg-secondary">Annulée</span>:
                    (venteProduit.statut==0)  ?
                    <span className="badge rounded-pill bg-info text-dark">En création</span>:
                    venteProduit.statut==1  ?
                     <span className="badge rounded-pill bg-primary">Soumise</span>:
                    venteProduit.statut==2  ?
                     <span className="badge rounded-pill bg-success">Validée</span>:
                      venteProduit.statut==3  ?
                     <span className="badge rounded-pill bg-success text-dark">Livrée</span>:""
                    }
                   </td></tr>
                   <tr><th className="table-active">Remarque</th><td>{venteProduit.remarque}</td></tr>
                   {/* <tr><th className="table-active">Actif</th><td>{venteProduit.actif==true? "Oui":"Non"}</td></tr> */} 
                   {permissionStock?.action?.includes("U")&& <tr><th className="table-active">User</th><td>{venteProduit.userId}</td></tr>}
                   {permissionStock?.action?.includes("U")&& <tr><th className="table-active">Modifié le</th><td>{venteProduit.dateModif}</td></tr>}                              
                                 
                </tbody>
              </table>                           
          </div>
      </div>

            <div className="row"> 
                 <section className="accordion">
                          <input type="radio" name="collapse" id="inOut" defaultChecked/>
                          <h2 className="handle">
                            <label htmlFor="inOut">Panier ({venteProduitLignes.length})</label>
                          </h2>
                          <div className="content" style={{"display": "block","overflow": "auto","maxHeight": "400px", "minWidth":"100%"}}>
                          <div className="col-md-11">
                  {(error!=null&& error.length>0&&<div className="alert alert-danger" role="alert"> {error}</div>)}
            </div>
              <table className={Styles.styledTable} >
                    <thead>
                      <tr>
                        <th>Libellé</th>
                        <th>Quantité</th>
                        <th>Prix Unitaire ({venteProduit?.deviseMonetaire})</th>
                        {/* <th>Facturable</th>*/}
                        <th>Total</th>
                        
                      </tr>
                    </thead>
                    <tbody >
                      {venteProduitLignes.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {
                              item.produitLibelle
                            }
                          </td>
                          <td>
                            
                           {item.qte}
                           
                          </td>
                           <td>
                          
                            {item?.facturable?item?.prixUnitaire:(<span><s className=" bg-warning text-dark">{item?.prixUnitaire}</s> 0.0</span>)} {venteProduit?.deviseMonetaire}/{item.unite}                 

                          </td>
                          {/* <td>
                            
                           {item?.facturable?<span>Oui</span>:<span className="badge rounded-pill bg-warning text-dark">Non</span>}
                           
                          </td>*/}
                           <td>{item?.montant}</td>
                         
                        </tr>
                      ))}

                     
                    </tbody>
                    <tfoot>
                      <tr>
                        <th><strong>Total</strong></th>
                        <th><strong>{totalQuantity}</strong></th>
                        <th></th>
                       
                        <th><strong>{venteProduit?.montantTotal} {venteProduit?.deviseMonetaire}</strong></th>
                        
                      </tr>
                    </tfoot>
                  </table>
              </div>
          </section>
        </div> 
      </div>
  )}





const renderFormVenteProduit=()=>{
  return(
  <div className="row">

<h5 className="sectionTitle">Dispensation de produits</h5>
 <div className="row">
 <div className={`${perform.action=="POST"? 'col-md-8' : 'col-md-8'}`}>

        <table className={Styles.styledTable}>
         <thead>
            <tr>
              <th className="table-active" colSpan="4">Information sur la prestation</th>          
            </tr>
          </thead>
                <tbody>
                      <tr><th className="table-active">Bénéficiaire</th><td>
                      {venteProduit?.patientNomPrenoms!=""?venteProduit?.patientNomPrenoms :(
                        <div className="form-group form-inline">             
                      <input
                        type="text"                       
                        id="patientId"
                         disabled={true}
                        value={ (venteProduit.patientId!=null && venteProduit.patientId!="")?(`${venteProduit.patientNom} ${venteProduit.patientPrenoms}`):"Anonyme"}
                        onChange={handleVenteProduitChange}
                        name="patientId"
                        placeholder="Selectionner le client"
                        maxLength="150"
                        className={`form-control form-control-sm ${errors?.patientId!=null&&errors?.patientId?.length>0 ? 'is-invalid' : ''}`}
                        style={{width: "75%"}}
                      /> 
                      {(perform.action=="POST")&&(
                       <img src="/img/search.png" title="Selectionner le client"  alt="Voir details" className="icone-action-25"
                      onClick={() => retrieveIndividu("Patient")}/>)} 
                      
                       <div className="invalid-feedback">{errors?.patientId}</div>
                    </div> 
                        )}

                      </td></tr>
                    <tr><th className="table-active">Acte</th><td>{venteProduit?.typeActeLibelle} </td></tr>                           
                    <tr><th className="table-active">Initiateur</th><td>{Utils.filterArrayByFieldNameAndValueAndOneObject(personnels,"key",venteProduit?.demanderPar)?.value}</td></tr>
                  {venteProduit?.dateDemande?.length>0&&venteProduit?.dateDemande!=""&&  <tr><th className="table-active">Date demande</th><td>{venteProduit?.dateDemande}</td></tr>}
                   <tr><th className="table-active">Gestionnaire</th><td>{Utils.getAttributeValues(venteProduit?.entrepot?.gestionnaires,"value")?.join(", ")}</td></tr>
                   {venteProduit?.deciderPar?.length>0&&venteProduit?.deciderPar!=""&& <tr><th className="table-active">Décidé par</th><td>{Utils.filterArrayByFieldNameAndValueAndOneObject(personnels,"key",venteProduit?.deciderPar)?.value}</td></tr> }
                   {venteProduit?.dateDecision?.length>0&&venteProduit?.dateDecision!=""&& <tr><th className="table-active">Date décision</th><td>{venteProduit?.dateDecision}</td></tr>}                
                   {venteProduit?.dateDecision?.length>0&& <tr><th className="table-active">Validation Automatique</th><td>{venteProduit?.decisionAutomatique?"Oui":"Non"}</td></tr>}

                   {venteProduit?.livrerPar?.length>0&& venteProduit?.livrerPar!=""&& <tr><th className="table-active">Livré par</th><td>{Utils.filterArrayByFieldNameAndValueAndOneObject(personnels,"key",venteProduit?.livrerPar)?.value}</td></tr> }
                   {venteProduit?.dateLivraisonProduit?.length>0&&venteProduit?.dateLivraisonProduit!=""&& <tr><th className="table-active">Date livraison</th><td>{venteProduit?.dateLivraisonProduit}</td></tr>}                

                </tbody>
              </table>
        </div>
              <p>&nbsp;</p>
  </div>
<div className="row">
  
        <section className="accordion">
                          <input type="radio" name="collapse" id="inOut" defaultChecked/>
                          <h2 className="handle">
                            <label htmlFor="inOut">Panier ({venteProduitLignes.length})</label>
                          </h2>
                          <div className="content" style={{"display": "block","overflow": "auto","maxHeight": "400px", "minWidth":"100%"}}>
                          <div className="col-md-11">
                  {(error!=null&& error.length>0&&<div className="alert alert-danger" role="alert"> {error}</div>)}
            </div>
              <table className={Styles.styledTable} >
                    <thead>
                      <tr>
                        <th>Libellé</th>
                        <th>Quantité</th>
                        <th>Prix Unitaire ({venteProduit?.deviseMonetaire})</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody >
                      {venteProduitLignes.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {
                              item.produitLibelle
                            }
                          </td>
                          <td>
                            
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button  style={{borderRadius:'50% 0 0 50%',padding: '1.5px 7px'}} onClick={()=>decrementQuantity(index)}>-</button>
                                 <input
                              type="number"
                              value={item.qte}
                              maxLength={6}
                              onChange={(e) => handleVenteProduitLigneChange(index, 'qte', e.target.value)}
                              style={{ width: '50px', textAlign: 'center' }}
                            />
                                <button style={{borderRadius:'0 50% 50% 0',padding: '1.5px 7px'}} onClick={()=>incrementQuantity(index)}>+</button>
                              </div>
                           
                          </td>
                           <td>
                            {item.prixUnitaire} {venteProduit?.deviseMonetaire}/{item.unite}
                          </td>
                           <td>{calculateTotalForItem(item).toFixed(2)}</td>
                          <td>                              
                              <Button  variant="danger" className="btn-sm"  title="Supprimer" onClick={() => deleteItem(index)}><i className="fa fa-trash fa-sm"></i></Button>                
                          </td>
                        </tr>
                      ))}
                      {/*<tr>
                        <td>
                          <input
                            type="text"
                            placeholder="Libellé"
                            value={produit.produitLibelle}
                            onChange={(e) => setProduit({ ...produit, produitLibelle: e.target.value })}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button onClick={decrementQuantity}>-</button>
                            <input
                              type="text"
                              placeholder="Quantité"
                              value={produit.qte}
                              onChange={(e) => setProduit({ ...produit, qte: e.target.value })}
                              style={{ width: '50px', textAlign: 'center' }}
                            />
                            <button onClick={incrementQuantity}>+</button>
                          </div>
                        </td>
                        <td>
                          <button onClick={addVenteProduitLigne}>Ajouter</button>
                        </td>
                      </tr>*/}
                     
                    </tbody>
                     <tfoot>
                      <tr>
                        <th><strong>Total</strong></th>
                        <th style={{ textAlign: 'center' }}><strong>{totalQuantity}</strong></th>
                        <th></th>
                       
                        <th><strong>{totalPrice.toFixed(2)}{globalObject?.entreprise.config?.deviseMonetaire}</strong></th>
                        
                      </tr>
                    </tfoot>
                  </table>
          </div>
          </section> 
</div>









   {/* Affichage du message d'erreur s'il existe */}
  
       </div>
  )
}


return (
<div className="container" > 
  
      
  <header className="jumbotron">
       <h3 className={Styles.HeaderL1} >Demande de produits</h3>
       

<div className="container-body">

<p>&nbsp;</p>
 <div className="row">
        <div className={`${(perform.action=="GET_IN_OUT")? 'col-md-7' :(perform.action=="GET_HISTO"? 'col-md-8': 'col-md')}`}>  
<div className="submit-form">
    
    <div className="text-right">    
       <div className="custom-control custom-checkbox custom-control-inline">
      
        <Button  variant="info" className="btn-sm" 
                      title="Rafraichir" onClick={() => retrieveVenteProduits()}>
                <i className="fa fa-refresh"></i>
          </Button>
      
     {permission?.action?.includes("C") &&<Button  variant="success" className="btn-sm" 
                      title="Nouvelle vente de produit" onClick={() => performAction(venteProduit,"POST")}>
                 <FontAwesomeIcon icon={['fas', 'cart-arrow-down']} />
          </Button>  
        } 
        </div>
    </div>
      <Modal  centered show={showVenteProduit} onHide={()=>handleClose} animation={false} dialogClassName={`${perform.action=="GET" ? 'modal-60vw' : 'modal-75vw'}`} >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouvelle prestation pharmaceutique"): 
          (perform.action=="GET")?("Détail sur la prestation"):
          (perform.action=="PUT")?("Modifier la prestation" ):
          (perform.action=="DELETE")?("Supprimer la prestation" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { (perform.action=="GET" || perform.action=="DELETE")?(

             renderShowVenteProduit()

              ):""}      
       { ( (perform.action=="POST" || perform.action=="PUT"))&& (
        <div className="row">
            <div className="col-md">
           {renderListOfEntrepotProduit()}
             </div>
            <div className="col-md">            
              {renderFormVenteProduit()}  
           </div>
           </div>  
           )} 
        
        </Modal.Body>
        <Modal.Footer>
          {(venteProduit.venteProduitId!=null && perform.action=="GET"&&permission?.action?.includes("U")&&venteProduit?.statut==0 )?
          <Button variant="warning" onClick={() => performAction(venteProduit,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveVenteProduit(venteProduit)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result==""&&venteProduit?.statut==0)?(
            <Button variant="warning"  onClick={() => saveVenteProduit(venteProduit)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteVenteProduit(venteProduit)}>
            Supprimer
          </Button>
          ):""
        }
        {
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        }
        </Modal.Footer>
      </Modal>
    
    </div>

{/************************************table list*******************************/}
       {renderListOfVenteProduit()}           
         </div>
      {(rechercher?.typeIndividu!=null)&&(
    <RechercherIndividu typeIndividu={rechercher.typeIndividu} key={rechercher.key}  returnIndividu={returnIndividu}/>)}
     </div>
     </div>
  </header>
</div>
  );
};

export default VenteProduits;