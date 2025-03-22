import React, {useState, useEffect, useCallback } from "react";
import AchatProduitsDataService from "../../services/stock/achatProduits.service";
import EntrepotProduitsDataService from "../../services/stock/entrepotProduits.service";
import ModelesDataService from "../../services/modeles.service";
import ProduitsDataService from "../../services/stock/produits.service";
import Styles from '../../styles.module.css';
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import DatePicker , { registerLocale } from "react-datepicker";
import Multiselect from 'multiselect-react-dropdown';
import globalObject from '../../global.js'
import $ from 'jquery'; 
import PdfRender from "../../components/pdf/PdfRender.component";
import ReactDOMServer from 'react-dom/server';
// import the library


// import your icons
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

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
const AchatProduits = (props) => {



const initialLotState = 
    { 
                
        "numeroLot": "",
        "qteReceptionne": "", 
        "dateReception": "",
        "emplacementId":"",
        "dateExpiration":"",
               
    }
/*Create achatProduit code*/
const initialAchatProduitState = 
    { 
       
        "achatProduitId": "",
        "achat":{},
        "achatId": "",
        "numeroCommande": "", 
        "qte": "",
        'prixAchatUnitaire':"",
        "uniteAchat":"",
        "tva":"",
        "ratioUniteAchatUniteDeMesure":"",
        "entrepotProduitId": "", 
        "entrepotProduit": {},     
        "produitId":"",
        "entrepotId": "",
        "fournisseurId": "",
        "dateReceptionSouhaite": "",
        "dateReception":"",
        "remarque": "",
        "actif": true,
    };

    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
  
const [achatProduit, setAchatProduit] = useState(initialAchatProduitState);
const [achatProduits, setAchatProduits] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialAchatProduitState);
const [show, setShow] = useState(false);
const [achat, setAchat] = useState({});
const [loading, setLoading] = useState(false);
const [showLoading, setShowLoading] = useState(false);
const [guid, setGuid] = useState(Utils.uuidv4());
const [entrepotProduit, setEntrepotProduit] = useState(initialAchatProduitState);
const [entrepotProduits, setEntrepotProduits] = useState([]);
const [uniteDeMesures, setUniteDeMesures] = useState([]);
const [errorsLot, setErrorsLot] = useState(initialLotState);
const [lot, setLot] = useState(initialLotState);

const [produitEmplacements, setProduitEmplacements] = useState([]);
const [isPrintPrescription, setIsPrintPrescription] = useState(false);
const [entrepotEmplacements, setEntrepotEmplacements] = useState([]);
const [htmlTemplate , setHtmlTemplate ] = useState(Utils?.initialHtml);
 const permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/COMMANDE_PRODUIT");

useEffect(() => {
  if(props.achat!=null&&props.entrepots!=null&&props?.entrepotEmplacements!=null)
   {
    retrieveAchatProduits(actifAchatProduit);
    setAchat(props?.achat)
     console.log("props?.achat",props?.achat)
    setEntrepotEmplacements(props?.entrepotEmplacements)
   // setEmplacements(props?.produits)
    //console.log("setEmplacements",props?.produits)
    retrieveModeles()
   

   } 
   
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
  setIsPrintPrescription(false)
}
const handleCloseAndReload = () => {
setShow(false);
refreshAchatProduit()
retrieveAchatProduits(actifAchatProduit);
setIsPrintPrescription(false)
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Commande de produit", perf.msg); 
/* if(perf.action=="PUT_IN_LOT"||perf.action=="PUT_OUT_LOT"&&props?.updateAchat)
    {
      
    }else                        
      handleCloseAndReload()*/
  props?.updateAchat(achat)
}

const handleActifachatProduitChange = (event) => {
  //let act=event.target.checked;
  actifAchatProduit=event.target.checked;
  retrieveAchatProduits(actifAchatProduit);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleAchatProduitChange = event => {
  const { name, value } = event.target;
  setAchatProduit({ ...achatProduit, [name]: value });
};
const handleLotChange = event => {
  const { name, value } = event.target;
  setLot({ ...lot, [name]: value });
};

  const refreshList = () => {
    retrieveAchatProduits();
  };

const refreshAchatProduit = () => {
    setAchatProduit(initialAchatProduitState);
     setErrors(initialAchatProduitState);
     setLot(initialLotState);
     setErrorsLot(initialLotState);
     setPerform(initialPerformState);
     
  };




async function retrieveEntrepotProduits (){

  
    let resp=null;
    let query="?"
    
      query+="actif=true&lite=true"
       query=query+"&entrepotId="+achat?.entrepotId
      resp= await EntrepotProduitsDataService.findAsync(query); 
       
    if(resp!=null && resp.status=="200" )          
        {
          
           
          setEntrepotProduits(resp.data);
          console.log("EntrepotProduitsDataService=========>",resp.data)
          
        }else 
         setEntrepotProduits([])
}


async function retrieveModeles (){
    let  query=`?typeModeles=Unite&actif=true`;   
    

    let resp= await ModelesDataService.findAsync(query); 
          
    if(resp!=null && resp.status=="200" )          
        {
                            
          let unites=[]
        
          for(const elt of resp.data)
          {
            let obj={}
            obj.value=elt.nomModele
            obj.label=elt.nomModele
            obj.modeleId=elt.modeleId
             unites.push(obj)
          }
           setUniteDeMesures(unites)
        }else 
        {         
           setUniteDeMesures([])        
        }
}

async function saveAchatProduit (achatProduit)  {
  setLoading(true)
 const obj = {...achatProduit};
  obj.userId=globalObject?.user?.id

  console.log("saveAchatProduit=========>",obj)

   var perf=perform;
     if(isValid(obj))
     {       
           if(perform.action=="POST") 
           {
           
            obj.achatId=achat?.achatId
            obj.achat=achat
            obj.numeroCommande=achat.numeroCommande
            obj.fournisseurId=achat?.fournisseur?.fournisseurId
            obj.entrepotId=achat?.entrepot?.entrepotId
           }  

           if(achatProduit.dateReception!=null&&achatProduit.dateReception!="") 
           {
             obj.dateReception=Utils.dateTimeToString(new Date(obj.dateReception))

           } 
           if(achatProduit.dateReceptionSouhaite!=null&&achatProduit.dateReceptionSouhaite!="") 
           {
             obj.dateReceptionSouhaite=Utils.dateToString(new Date(obj.dateReceptionSouhaite))
             
           }      
           console.log("saveAchatProduit=========>",obj)
          let response="";
          if(obj.achatProduitId!=null && obj.achatProduitId!="")
            response= await AchatProduitsDataService.updateAsync(obj.achatProduitId,obj);
          else
            response= await AchatProduitsDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setAchatProduit(response.data);             
              perf.result="success";
              if(perf.action=="POST")
                perf.msg="Enregistrement effectué avec succès" 
              else
                perf.msg="Mise à jour effectuée avec succès" 
              showNotif(perf);    
              
                                          
            }  
           else
           {
            
              perf.result="error";
              perf.msg= response.data.message;
             
               showNotif(perf);
               
              
           }
             
        }            
     setLoading(false)
     
  };


async function receptionProduit (achatProduit,lot)  {
  setLoading(true)
 const obj = {...lot};
  obj.userId=globalObject?.user?.id

  console.log("saveAchatProduit=========>",obj)

   var perf=perform;
     if(isValidReception(obj))
     {       
           
           if(obj.dateReception!=null&&obj.dateReception!="") 
           {
             obj.dateReception=Utils.dateToString(new Date(obj.dateReception))

           } 
            if(obj.dateExpiration!=null&&obj.dateExpiration!="") 
           {
             obj.dateExpiration=Utils.dateToString(new Date(obj.dateExpiration))

           }      
           console.log("saveAchatProduit=========>",obj)
            console.log("saveAchatProduit=====achatProduit====>",achatProduit)
          let response=null;
          let query="?qteReceptionne="+obj.qteReceptionne;
          if(obj.numeroLot!=null&&obj.numeroLot!="")
            query=query+"&numeroLot="+obj.numeroLot;
          if(obj.dateReception!=null&&obj.dateReception!="")
            query=query+"&dateReception="+obj.dateReception;
          if(obj.dateExpiration!=null&&obj.dateExpiration!="")
            query=query+"&dateExpiration="+obj.dateExpiration;
          if(achatProduit.achatProduitId!=null && achatProduit.achatProduitId!="")
            response= await AchatProduitsDataService.receptionAsync(achatProduit.achatProduitId,achatProduit,query);
          

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setAchatProduit(response.data);             
              perf.result="success";
              
              perf.msg="Réception de produit effectuée avec succès" 
              setShow(false);
              showNotif(perf);    
              
                                          
            }  
           else
           {
            
              perf.result="error";
              perf.msg= response.data.message;
             
               showNotif(perf);
               
              
           }
             
        }            
     setLoading(false)
     
  }
  async function handleStatus(obj) {
    obj.userId=globalObject?.user?.id
  if(obj.actif==true)
  {
      obj.actif=false;
   }else 
       obj.actif=true;
  
      let perf=perform;
    let response=await AchatProduitsDataService.updateAsync(obj.achatProduitId,obj);
    if(response!=null && response.status=="200")
      {
          setAchatProduit(response.data);             
           
          retrieveAchatProduits(actifAchatProduit);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };

function getProduitEmplacements  (emplacementParent) {

    let list=[]
  if(emplacementParent!=null&&emplacementParent.emplacementId!=null&&emplacementParent.emplacementId!="")
    {
   //   console.log("getEntrepotEmplacements====>",emplacementParent) 
    list=Utils.filterArrayByFieldNameAndContent(entrepotEmplacements,"lienChemin",emplacementParent.emplacementId)
    if(emplacementParent!=null&& emplacementParent.emplacementId!=null)
      list.push(emplacementParent)
  }
  return list;
}

function getMontantTotal(list)
{
  let totalHT=0
  let totalTTC=0
  for(const elt of list)
    {
      totalHT+=elt.prixAchatUnitaire*elt.qte
      totalTTC+=elt.prixAchatUnitaire*elt.qte+elt.prixAchatUnitaire*elt.qte*elt.tva/100
          }
  return {"totalHT":totalHT,"totalTTC":totalTTC}
}


async function retrieveAchatProduits (act){

  if ($.fn.dataTable.isDataTable('#tListOfachatProduit')) {
        $('#tListOfachatProduit').DataTable().destroy();
       
    }
    let resp=null;
     let query="?"
      //query+="actif=true"
      if(props?.achat!=null)
      {
        query+="&achatId="+props?.achat?.achatId
      }
      resp= await await AchatProduitsDataService.findAsync(query);  
       
    if(resp!=null && resp.status=="200" )          
        {
          setAchatProduits(resp.data);
           console.log("setAchatProduits=========>",resp.data)
          
        }else 
         setAchatProduits([])

setTimeout(()=>{ 
    //$('#tListOfachatProduit').DataTable().destroy();                       
    $('#tListOfachatProduit').DataTable(

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
             { "width": "40%", "targets": 1 }
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
      //init Datatable  


function isValidReception  (obj) {
 
    let err=initialLotState;
    let valid=true;
    
     if( obj.qteReceptionne==null || obj.qteReceptionne.length==0|| !Utils.isPositiveFloat(obj.qteReceptionne)||Number(obj.qteReceptionne)==0) 
       {
         err.errorMsg+="<br/>-"
         err.errorMsg+=err.qteReceptionne="Valeur de la quantité incorrecte";
         valid=false;
      } 
      if(valid&& Number(achatProduit.qte)<(Number(achatProduit.qteReceptionne)+Number(obj.qteReceptionne)))
      {
        err.errorMsg+="<br/>-"
         err.errorMsg+=err.qteReceptionne="Le total des quantités recptionnées est supérieur à celui commandé";
         valid=false;
      }
      
     if(valid==false)
        {
            err.errorMsg="Une ou plusieurs erreurs ont été constatées dans le formulaire:"+err.errorMsg;
        }
  setErrorsLot(err);
    return valid;

  };

function isValid  (obj) {
 
    let err=initialAchatProduitState;
    let valid=true;
        console.log(obj); 
     err.errorMsg=""
         if( obj.entrepotProduitId==null || obj.entrepotProduitId.length==0) 
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.entrepotProduitId="Le produit est incorrecte";
         valid=false;
     } 
     if( obj.qte==null || obj.qte.length==0|| !Utils.isPositiveFloat(obj.qte)||Number(obj.qte)<0) 
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.qte="La quantité du produit est incorrecte";
         valid=false;
     } 
    if( obj.prixAchatUnitaire==null || obj.prixAchatUnitaire.length==0|| !Utils.isPositiveFloat(obj.prixAchatUnitaire)||Number(obj.prixAchatUnitaire)<0) 
       {
         err.errorMsg+="<br/>-"
        err.errorMsg+=err.prixAchatUnitaire="Le prix achat unitaire est incorrecte";
         valid=false;
     } 
     if(obj.tva!=null &&  (isNaN(obj.tva) || obj.tva<0||obj.tva>100)) 
         {
         err.errorMsg+=err.tva="Valeur de la TVA incorrecte";
         valid=false;
     }
      
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.errorMsg+="<br/>-"
       err.errorMsg+=err.actif="indiquer le statut actif oui ou non ";
          valid=false;
     }
 
     if(valid==false)
        {
            err.errorMsg="Une ou plusieurs erreurs ont été constatées dans le formulaire:"+err.errorMsg;
        }
  setErrors(err);
    return valid;

  };


const performAction = (achatProduit,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshAchatProduit();
   
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
   

  }else
    {

      perf=perform;
      handleClose();
      if(action=="PUT_IN_LOT")
        {
          setLot(initialLotState)
           setErrorsLot(initialLotState);
           if(achatProduit?.entrepotProduit?.entrepotId!=null&&achatProduit?.entrepotProduit?.entrepotId!="")   
           setProduitEmplacements(getProduitEmplacements(achatProduit?.entrepotProduit?.entrepot))
         else
          setProduitEmplacements(getProduitEmplacements(achat?.entrepot))
        }

      setAchatProduit(achatProduit); 
        
     
      setErrors(initialAchatProduitState);
      handleShow();
      perf.action=action;
      setPerform(perf);
      }
if(action=="POST"||action=="PUT")
 {

   if(entrepotProduits.length==0)
      retrieveEntrepotProduits()
 } 



    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}

const renderShowAchat =()=> {
return (
   <div className="row" >
    <p>&nbsp;</p> 
                <div className="col-md">       
                
                <table className={Styles.styledTable}>
                <thead>
            <tr>
              <th className="fw-bolder" colSpan="4"><b>N° {achat?.numeroCommande}</b></th>          
            </tr>
          </thead>
                <tbody>
                    <tr><th className="fw-bolder" colSpan="1"><b>Entrepot</b></th><td colSpan="3">{achat?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder" colSpan="1"><b>Fournisseur</b></th><td colSpan="3">{achat?.fournisseur?.libelle}</td></tr>   
                    <tr><th className="fw-bolder" colSpan="1"><b>N° commande</b></th><td colSpan="3">{achat?.numeroCommande}</td></tr>
                    <tr><th className="fw-bolder" colSpan="1"><b>N° externe</b></th><td colSpan="3">{achat?.numeroExterne}</td></tr>
                    <tr><th className="fw-bolder" colSpan="1">Statut de la commande</th><td>{(achat.statut==-1)?"Annulé":(achat.statut==0)?"En creation":(achat.statut==1)?"Approuvée":(achat.statut==2)?"Clôturé":""}
</td></tr>
                </tbody>
              </table>
                    <p>&nbsp;</p>             
                                                                                    
                           
                </div>
              </div>
  )}
const renderListOfAchatProduit=() =>{
return (
<div className="table-responsive">         
      <table id="tListOfachatProduit" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>
               <th>Produit</th>
                <th>Qté commandée</th>
                <th>Qté receptionnée</th>
             
                 <th>Date réception</th>
                  {/*<th>Date reception</th>
                  <th>Produit</th>
                  <th>Emplacement</th>
                <th>Actif</th>*/}
                               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody >
           {achatProduits &&
            achatProduits.map((achatProduit, index) => (
                <tr key={index} style={{"fontSize":"10"}}> 
                 <td>{achatProduit.dateModif}</td> 
                  <td>{achatProduit?.entrepotProduit?.produit?.libelle}</td>       
                  <td>{achatProduit.qte}</td> 
                  <td>{achatProduit.qteReceptionne}</td>    
                   <td>{achatProduit?.dateReceptionSouhaite}</td>        
                {/*  <td>{achatProduit?.dateReception}</td>
                  <td>{Utils.trouverObjetDansListObject(produits,"produitId",achatProduit.produitId)?.libelle}</td>                    
                   <td>{Utils.trouverObjetDansListObject(emplacements,"emplacementId",achatProduit.emplacementId)?.libelle}</td>   
                  <td>{achatProduit.actif==true?"Oui":"Non"}</td> 
                 
                  */}  
                  <td>
                   {/*   <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => performAction(achatProduit, "GET")}/> 
                      <img src="/img/write.png" title="Modifier"  alt="Modifier" className="icone-action"
                      onClick={() => performAction(achatProduit,"PUT")}/>
                       {(achatProduit.actif==true)?(
                        <img src="/img/on.png" title="Déactiver"  alt="cliquer pour déactiver" className="icone-action-25"
                       onClick={() => handleStatus(achatProduit)}/>
                        ):(
                        <img src="/img/off.png" title="Activer"  alt="cliquer pour activer" className="icone-action-25"
                       onClick={() => handleStatus(achatProduit)}/>
                        )
                    }
                      <img src="/img/produitReception.png" title="Réception de produit"  alt="Réception de produit" className="icone-action"
                      onClick={() => performAction(achatProduit,"PUT_IN_LOT")}/>
                      */} 
                  <div className="btn-group">             
                  
                       <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(achatProduit, "GET")}><i className="fa fa-eye"></i> </Button>
                    {permission?.action?.includes("U")&& achat?.statut==0&&<Button variant="warning" className="btn-sm"  title="Modifier la commande de produit" onClick={() => performAction(achatProduit, "PUT")}>
                     <i class="fa fa-edit fa-sm"></i> </Button>}
                     {permission?.action?.includes("U")&&achatProduit.qteReceptionne<achatProduit.qte&& achat?.statut==1&&<Button variant="primary" className="btn-sm"  title="Réception de produit" onClick={() => performAction(achatProduit, "PUT_IN_LOT")}>
                     <FontAwesomeIcon icon={['fas', 'fa-dolly']} /> </Button>}
                   </div>     
                   
                   

                   </td>             
                </tr>

          ))}          
          </tbody>          
        </table>     
        </div>
  )}
const renderShowAchatProduit =()=> {
return (
   <div className="row">

        <div className="col-md"> 
                <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="fw-bolder">Entrepot</th><td>{achat?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Produit</th><td>{achatProduit?.entrepotProduit?.produit?.libelle}</td></tr>
                   {/* <tr><th className="fw-bolder">Entrepot</th><td>{Utils.trouverObjetDansListObject(entrepotEmplacements,"emplacementId",achatProduit?.entrepotProduit?.emplacement?.emplacementId)}</td></tr>
                    */}<tr><th className="fw-bolder">N° commande</th><td>{achatProduit?.achat?.numeroCommande}</td></tr>
                    <tr><th className="fw-bolder">Qté commandée</th><td>{achatProduit.qte}</td></tr>
                    <tr><th className="fw-bolder">Qté receptionnée</th><td>{achatProduit.qteReceptionne}</td></tr>
                    <tr><th className="fw-bolder">Unité d'achat </th><td>{achatProduit.uniteAchat}</td></tr>
                    {achatProduit.ratioUniteAchatUniteDeMesure!=null && achatProduit.ratioUniteAchatUniteDeMesure!=0&&<tr><th className="fw-bolder">Ratio unité achat/stock</th><td>1 {achatProduit.uniteAchat} représente {achatProduit.ratioUniteAchatUniteDeMesure} {achatProduit?.entrepotProduit?.uniteDeMesure} en stock</td></tr>}
                   <tr><th className="fw-bolder">Prix d'achat unitaire </th><td>{achatProduit.prixAchatUnitaire}</td></tr>
                    <tr><th className="fw-bolder">TVA </th><td>{achatProduit.tva}%</td></tr>
                   <tr><th className="fw-bolder">Date de réception souhaitée</th><td>{achatProduit.dateReceptionSouhaite}</td></tr>
                    <tr><th className="fw-bolder">Date de réception effective</th><td>{achatProduit.dateReception}</td></tr>        
                    {/*<tr><th className="fw-bolder">Actif</th><td>{achatProduit.actif==true? "Oui":"Non"}</td></tr>*/}
                      <tr><th className="fw-bolder">Remarque</th><td>{achatProduit.remarque}</td></tr> 
                    <tr><th className="fw-bolder">Date de Modif</th><td>{achatProduit.dateModif}</td></tr> 
                   {permission?.action?.includes("CRUD")&& <tr><th className="fw-bolder">User</th><td>{achatProduit.userId}</td></tr>}

                                                               
                </tbody>
              </table>
                </div>
          </div>

  )}
const renderFormAchatProduitReception=() =>{

return (

   <div className="row">
        <div className="col-md"> 
                  <div className="form-group">             
                     <table className={Styles.styledTable}>
                         <tbody>

                    <tr><th className="fw-bolder">Entrepot</th><td>{achat?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder">N° commande</th><td>{achat.numeroCommande}</td></tr>
                    <tr><th className="fw-bolder">Produit</th><td>{achatProduit?.entrepotProduit?.produit?.libelle}</td></tr> 
                    <tr><th className="fw-bolder">Qté commandée</th><td>{achatProduit.qte}</td></tr>
                    <tr><th className="fw-bolder">Qté déjà receptionée</th><td>{achatProduit.qteReceptionne}</td></tr>                                                             
                </tbody>
              </table>                 
          </div>
           <p>&nbsp;</p>    
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="qteReceptionne"
                        required
                        value={lot.qteReceptionne}
                        onChange={handleLotChange}
                        name="qteReceptionne"
                        placeholder="Qté réceptionnée"
                        maxLength="7"
                        className={`form-control form-control-sm ${errorsLot?.qteReceptionne!=null&&errorsLot?.qteReceptionne.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errorsLot?.qteReceptionne}</div>
                    </div>

                    <div className="form-group">

                      <DatePicker
                         name="dateReception"
                        selected={lot.dateReception!=null&&lot.dateReception!=""?new Date(lot.dateReception):""}
                       locale="fr"
                        /*showTimeSelect
                        timeIntervals={5}
                        timeFormat="HH:mm"*/
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Date de réception"
                        maxDate={new Date()} 
                        onChange={date => {
                        setLot({ ...lot, "dateReception": date });            
                        }}
                        className={`form-control form-control-sm ${errorsLot.dateReception!=null && errorsLot.dateReception.length>0 ? 'is-invalid' : ''}`} 
                        
                      /> 
                         <div className="invalid-feedback">{errorsLot.dateReception}</div>
                     </div>
                       <div className="form-group">             
                      <input
                        type="text"                       
                        id="numeroLot"
                        required
                        value={lot.numeroLot}
                        onChange={handleLotChange}
                        name="numeroLot"
                        placeholder="N° du lot"
                        maxLength="50"
                        className={`form-control form-control-sm ${errorsLot?.numeroLot!=null&&errorsLot?.numeroLot.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errorsLot?.numeroLot}</div>
                    </div>
                     <div className="form-group">

                      <DatePicker
                         name="dateExpiration"
                        selected={lot.dateExpiration!=null&&lot.dateExpiration!=""?new Date(lot.dateExpiration):""}
                       locale="fr"
                        /*showTimeSelect
                        timeIntervals={5}
                        timeFormat="HH:mm"*/
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Date d'expiration"
                        //minDate={new Date()} 
                        onChange={date => {
                        setLot({ ...lot, "dateExpiration": date });            
                        }}
                        className={`form-control form-control-sm ${errorsLot.dateExpiration!=null && errorsLot.dateExpiration.length>0 ? 'is-invalid' : ''}`} 
                        
                      /> 
                         <div className="invalid-feedback">{errorsLot.dateExpiration}</div>
                     </div> 
                    <div className="form-group " >     
                    <Select
                       defaultValue={achatProduit!=null&&achatProduit.emplacementId!=null?achatProduit:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.emplacementId}
                       isClearable={true}
                       onChange={(newValue) => { 
                                let obj={ ...achatProduit}
                                 if(newValue!=null)                           
                               {
                                obj.emplacementId=newValue?.emplacementId
                                } 
                                else
                               {
                                    obj.emplacementId=initialAchatProduitState.emplacementId 
                                } 

                               setAchatProduit(obj);

                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={produitEmplacements}
                        placeholder={`Emplacement de destination`}
                        className={`form-control-sm px-0 ${errorsLot?.emplacementId!=null && errorsLot?.emplacementId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errorsLot?.emplacementId}</div>                  
                </div>
               </div>


              </div>
  )}



const renderFormAchatProduit=() =>{

return (

   <div className="row">
        <div className="col-md"> 
                  <div className="form-group border">             
                      <table className={Styles.styledTable}>
                         <tbody>
                    <tr><th className="fw-bolder">Entrepot</th><td>{achat?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Fournisseur</th><td>{achat?.fournisseur?.libelle}</td></tr>
                    </tbody>
                  </table>
                    </div>
                    <div className="form-group" >     
                    <Select
                       defaultValue={achatProduit.entrepotProduitId!=null&&achatProduit.entrepotProduitId!=""?
                      achatProduit.entrepotProduit:""}
                       getOptionLabel={e => e?.produit?.libelle}
                        getOptionValue={e => e?.entrepotProduitId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...achatProduit}                                             
                              if(newValue!=null)                           
                               {
                                console.log("entrepotProduit===>",newValue)
                                obj.entrepotProduitId=newValue.entrepotProduitId
                                 obj.entrepotProduit=newValue
                                 obj.uniteAchat=newValue?.uniteAchat
                                 obj.ratioUniteAchatUniteDeMesure=newValue?.ratioUniteAchatUniteDeMesure
                                 obj.tva=achat?.fournisseur?.tva
                                 if(newValue?.prixAchat!=undefined&&newValue?.prixAchat!=null)
                                  obj.prixAchatUnitaire=newValue?.prixAchat
                                  else
                                  if(newValue?.produit!=null &&newValue?.produit?.approvisionnement!=null&&newValue?.produit?.approvisionnement?.fournisseur!=null&&
                                    newValue?.produit?.approvisionnement?.fournisseur?.fournisseurId==achat?.fournisseurId)
                                    obj.prixAchatUnitaire=newValue?.produit?.approvisionnement?.prixAchat

                               } 
                                else
                             {
                                    obj.entrepotProduitId=initialAchatProduitState.entrepotProduitId 
                                    obj.entrepotProduit=initialAchatProduitState.entrepotProduit
                                    obj.uniteAchat=""
                                   obj.ratioUniteAchatUniteDeMesure=""
                                   obj.tva=0

                                } 

                              setAchatProduit(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={entrepotProduits}
                        placeholder={`Produit`}
                        className={`form-control-sm px-0 ${errors?.entrepotProduitId!=null && errors?.entrepotProduitId.length>0 ? 'is-invalid' : ''}`} />                       
                      <div className="invalid-feedback">{errors?.entrepotProduitId}</div>
            </div>
            <div className="danger">{errors?.entrepotProduitId}</div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="qte"
                        required
                        value={achatProduit.qte}
                        onChange={handleAchatProduitChange}
                        name="qte"
                        placeholder="Qté"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.qte.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.qte}</div>
                    </div>
                  
                    {achatProduit?.entrepotProduitId!=null&&achatProduit?.entrepotProduitId!=""&&
                     <div className="form-group custom-control-inline form-inline" >  
                    Unité d'achat:<CreatableSelect
                        isClearable
                        
                        value={achatProduit.uniteAchat!=null&&achatProduit.uniteAchat!=""? {"value":achatProduit.uniteAchat, "label":achatProduit.uniteAchat}:""}                   
                       onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null&&obj.value!="")
                             {
                                 if(obj.modeleId==null)
                                 {
                                 Utils.addModele("Unite",obj.value,"")
                                 obj.modeleId=Utils.uuidv4()
                                 uniteDeMesures.push(obj)
                                  }

                             if(obj.value==achatProduit?.entrepotProduit?.uniteDeMesure)
                             {
                              let elt={...achatProduit}
                              elt.ratioUniteAchatUniteDeMesure=1
                              elt.uniteAchat=obj.value
                              setAchatProduit(elt)
                             }else
                            setAchatProduit({ ...achatProduit, "uniteAchat": obj.value });
                            }
                          }}
                       
                        options={uniteDeMesures}
                         placeholder={`Unité d'achat`}
                        name="uniteAchat"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                        className={`form-control-sm form-control-sm d-inline-block ${errors?.uniteAchat!=null && errors?.uniteAchat.length>0 ? 'is-invalid' : ''}`}  
                         menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.uniteAchat}</div>
                    </div>}
                   {/*<div className="form-group">             
                      <input
                        type="text"                       
                        id="uniteAchat"
                        required
                        value={achatProduit.uniteAchat}
                        onChange={handleAchatProduitChange}
                        name="uniteAchat"
                        placeholder="Unité Achat"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.uniteAchat.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.uniteAchat}</div>
                    </div>*/}
                    
                 
                  {achatProduit?.uniteAchat!=null&&achatProduit?.uniteAchat!=""&&achatProduit?.uniteAchat!=achatProduit?.entrepotProduit?.uniteAchat&&achatProduit?.uniteAchat!=achatProduit?.entrepotProduit?.uniteDeMesure&&
                    <div className="form-group custom-control-inline form-inline">             
                      1 {achatProduit?.uniteAchat} représente <input
                        type="text"                       
                        id="ratioUniteAchatUniteDeMesure"
                        required
                        value={achatProduit.ratioUniteAchatUniteDeMesure}
                        onChange={handleAchatProduitChange}
                        name="ratioUniteAchatUniteDeMesure"
                        placeholder="Ratio unité achat/stock"
                        maxLength="10"
                         style={{width: "80px"}}
                        className={`form-control form-control-sm d-inline-block ${errors.ratioUniteAchatUniteDeMesure.length>0 ? 'is-invalid' : ''}`}
                      />{achatProduit?.entrepotProduit?.uniteDeMesure} en stock
                       <div className="invalid-feedback">{errors.ratioUniteAchatUniteDeMesure}</div>
                    </div>} 
                    {/*achatProduit?.uniteAchat!=null&&achatProduit?.uniteAchat!=""&&achatProduit?.uniteAchat!=achatProduit?.entrepotProduit?.uniteAchat&&
                    (<span className="text-success align-center">égale à/contient {achatProduit.ratioUniteAchatUniteDeMesure!=null && achatProduit.ratioUniteAchatUniteDeMesure!=0?achatProduit?.ratioUniteAchatUniteDeMesure:" ? de"} {achatProduit?.entrepotProduit?.uniteDeMesure} en stock</span>)*/}

                      <div className="form-group custom-control-inline form-inline">             
                      <input
                        type="text"                       
                        id="prixAchatUnitaire"
                        required
                        value={achatProduit.prixAchatUnitaire}
                        onChange={handleAchatProduitChange}
                        name="prixAchatUnitaire"
                        placeholder="Prix d'achat unitaire"
                        maxLength="10"
                        className={`form-control form-control-sm d-inline-block ${errors.prixAchatUnitaire.length>0 ? 'is-invalid' : ''}`}
                      />{achat?.deviseMonetaire}
                       <div className="invalid-feedback">{errors.prixAchatUnitaire}</div>
                    </div>
                     <div className="form-group custom-control-inline form-inline">             
                      TVA:<input
                        type="text"                       
                        id="tva"
                        required
                        value={achatProduit.tva}
                        onChange={handleAchatProduitChange}
                        name="tva"
                        placeholder="TVA"
                        maxLength="3"
                        style={{width: "50px"}}
                        className={`form-control form-control-sm d-inline-block ${errors.tva.length>0 ? 'is-invalid' : ''}`}
                      />%
                       <div className="invalid-feedback">{errors.tva}</div>
                    </div>
                     <div className="form-group">

                      <DatePicker
                         name="dateReceptionSouhaite"
                        selected={achatProduit.dateReceptionSouhaite!=null&&achatProduit.dateReceptionSouhaite!=""?new Date(achatProduit.dateReceptionSouhaite):""}
                       locale="fr"
                        /*showTimeSelect
                        timeIntervals={5}
                        timeFormat="HH:mm"*/
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Date de réception souhaité"
                        minDate={new Date()} 
                        onChange={date => {
                        setAchatProduit({ ...achatProduit, "dateReceptionSouhaite": date });            
                        }}
                        className={`form-control form-control-sm ${errors.dateReceptionSouhaite!=null && errors.dateReceptionSouhaite.length>0 ? 'is-invalid' : ''}`} 
                        
                      /> 
                         <div className="invalid-feedback">{errors.dateReceptionSouhaite}</div>
                     </div>                    
                    <div className="form-group">             
                      <textarea
                        type="text"
                        className="form-control"
                        id="remarque"
                        required
                        value={achat.remarque}
                        onChange={handleAchatProduitChange}
                        name="remarque"
                        maxLength="250"
                        placeholder="Remarque"
                      />
                    </div>
                   
            </div>

    {(errors?.errorMsg!=null&& errors?.errorMsg.length>0&&<div className="alert alert-danger" role="alert"> <p  dangerouslySetInnerHTML={{__html: errors?.errorMsg}}></p></div>)}

              </div>
  )}

const loadingInfo =()=> {
return (
<div className="container">        

      <Modal  centered show={showLoading}  animation={true} dialogClassName='modal-loading' >
        <Modal.Body>
           <img src="/img/loading.gif" title="Chargement"  alt="Chargement en cours" className="profile-img-card"/>
           Traitement en cours...veillez patienter
        </Modal.Body>
        
      </Modal>
</div>)
}


/**************************************************print**************************************************************/

const renderPrintCommandeInfo=(num,caissier) =>{
  
  
return (
 <div style={Utils.styles.fontSize}>                                
    <span style={Utils.styles.bold} >N°:</span>  {achat?.numeroCommande}<br/>
      <span style={Utils.styles.bold} >N° externe:</span>  {achat?.numeroExterne}<br/>
     <span style={Utils.styles.bold} >Date:</span>{achat?.dateEnvoiCommande!=null&&achat?.dateEnvoiCommande!=""?achat?.dateEnvoiCommande?.slice(0, 10):achat.dateModif?.slice(0, 10)}<br/>
    
</div>
  )}

const renderPrintAchatProduit=() =>{
  //console.log("selectedFiles",selectedFiles)
  let total=getMontantTotal(achatProduits)
return (
  <div className="row">
           
                  <table style={Utils.styles.table} >
                  <thead style={Utils.styles.tableHeader}>
                      <tr style={Utils.styles.bold} style={{ "fontSize": "10px"}}>                      
                        <th style={{ "max-width":"5%"}}></th>
                        <th style={Utils.styles.bold}>Produit</th>
                        <th style={Utils.styles.bold} style={{ "max-width":"7%"}}>Qté </th>
                        <th style={Utils.styles.bold} style={{ "max-width":"10%"}}>Unité </th>
                        <th style={Utils.styles.bold} style={{ "max-width":"7%"}}>PU HT</th>  
                         <th style={Utils.styles.bold} style={{ "max-width":"7%"}}>TVA(%)</th>
                         <th style={Utils.styles.bold} style={{ "max-width":"12%"}}>Montant HT</th>                          
                       <th style={Utils.styles.bold} style={{ "max-width":"12%"}}>Montant TTC</th>              
                      </tr>
                  </thead>                                    
                      <tbody>     
                        {achatProduits.map((item, index) => (
                      <tr key={index} style={{border: "1px solid","fontSize": "9px"}}>                        
                       <td style={{"border": "1px", "fontSize": "10px"}} style={{ "max-width":"5%"}}>{index+1}</td> 
                       <td style={{"border": "1px"}}>{item?.entrepotProduit?.produit?.libelle}</td> 
                       <td style={{"border": "1px",  "max-width":"7%"}}>{item?.qte}</td> 
                       <td style={{"border": "1px",  "max-width":"10%"}}>{item?.entrepotProduit?.uniteAchat}</td> 
                        <td style={{"border": "1px",  "max-width":"7%"}}>{item.prixAchatUnitaire}</td> 
                       <td style={{"border": "1px",  "max-width":"7%"}}>{item?.tva}</td>
                       <td style={{"border": "1px",  "max-width":"12%"}}>{item?.prixAchatUnitaire*item?.qte}</td> 
                       <td style={{"border": "1px",  "max-width":"12%"}}>{item?.prixAchatUnitaire*item?.qte +(item?.prixAchatUnitaire*item?.qte*item?.tva/100)}</td>         
                      </tr>))}
                      <tr   style={Utils.styles.tableColSpan}>
                        
                       <td colSpan="5" style={{"border": "1px"}}> </td> 
                        <td style={Utils.styles.bold} style={{"fontSize": "10px","max-width":"7%"}}>Total</td>  
                         <td  style={Utils.styles.bold} style={{"fontSize": "10px","max-width":"12%"}}><b> {total?.totalHT} {achat?.deviseMonetaire}</b></td> 
                         <td  style={Utils.styles.bold} style={{ "fontSize": "10px","max-width":"12%"}}><b>{total?.totalTTC} {achat?.deviseMonetaire}</b></td>  
                        </tr> 
                        

                   </tbody>
                      
                
              </table>
               &nbsp; &nbsp;&nbsp;
            
        </div>
  )}
const renderPrintFournisseur=() =>{
return (
 <div style={Utils.styles.fontSize}>                                
     <span style={Utils.styles.bold} > {achat?.fournisseur?.libelle} </span> <br/>
     {achat?.fournisseur?.contact}<br/>
     {achat?.fournisseur?.adresse}<br/>
     Tél.:{achat?.fournisseur?.tel}<br/>
     Email:{achat?.fournisseur?.email}<br/>
     
</div>
  )}
const renderPdf=() =>{
      htmlTemplate.header.headerImg=globalObject?.entreprise?.config?.configEditique?.headerImg
  htmlTemplate.header.headerLeft=globalObject?.entreprise?.config?.configEditique?.headerLeft
  htmlTemplate.header.headerCenter=globalObject?.entreprise?.config?.configEditique?.headerCenter
  htmlTemplate.header.headerRight=globalObject?.entreprise?.config?.configEditique?.headerRight
  htmlTemplate.footer.footerImg=globalObject?.entreprise?.config?.configEditique?.footerImg
  htmlTemplate.footer.footerLeft=globalObject?.entreprise?.config?.configEditique?.footerLeft
  htmlTemplate.footer.footerCenter=globalObject?.entreprise?.config?.configEditique?.footerCenter
  htmlTemplate.footer.footerRight=globalObject?.entreprise?.config?.configEditique?.footerRight
  //console.log("htmlTemplate.body.header.left1==========>",htmlContent.header.left1)
    let title=""
    if(achat?.statut==0)
     title="Devis"
   else
    title="Bon de commande"
    htmlTemplate.body.header.left2=ReactDOMServer.renderToStaticMarkup(renderPrintCommandeInfo())
    htmlTemplate.body.title=title
   htmlTemplate.body.header.rigth2= ReactDOMServer.renderToStaticMarkup(renderPrintFournisseur())
  htmlTemplate.body.content=ReactDOMServer.renderToStaticMarkup(renderPrintAchatProduit())
  
  let fileName=(title+achat?.fournisseur?.libelle+Utils.currentDateTime().replaceAll(":",'_')).replaceAll(" ",'_')

return (
  
   <PdfRender renderAs="PdfViewer" save={true} fileName={fileName} keywords='Bon de commande, Fournisseur' key={Utils.uuidv4()} htmlTemplate={htmlTemplate} 
    format={globalObject?.entreprise?.config?.configEditique?.commandeProduitFormat} orientation={globalObject?.entreprise?.config?.configEditique?.commandeProduitOrientation}
    maxSizeMB={globalObject?.entreprise?.config?.configEditique?.imgMaxSizeMB}  />

 
)}


/**********************************************************************************************************************/


return (

<div className="container" > 
  
      

        {renderShowAchat()}
    
{loadingInfo()}
<div className="submit-form">
    
    <div className="text-right">    
          
        <Button  variant="info" className="btn-sm" 
                      title="Rafraichir" onClick={() => retrieveAchatProduits()}>
                <i className="fa fa-refresh"></i>
          </Button>
        {permission?.action?.includes("C")&&achat?.statut!=null && achat?.statut!=-1&&achatProduits?.length>0&&
      <Button  variant="info" className="btn-sm" 
        title="Imprimer" onClick={() => {setShow(true); setIsPrintPrescription(true)}}>
        <i className="fa fa-print"></i>
     </Button>}

        {permission?.action?.includes("C")&&achat?.statut!=null && achat?.statut==0&&(<Button  variant="success" className="btn-sm" 
                      title="Commander un produit" onClick={() => performAction(achatProduit, "POST")}>
              
                  <FontAwesomeIcon icon={['fas', 'cart-arrow-down']} />
          </Button>)}  
      
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName={`${isPrintPrescription?'modal-60vw':(perform.result.length>0 ? 'modal-30vw' : 'modal-30vw')}`} >
       <Modal.Header >
          <Modal.Title>
          {(isPrintPrescription==true)?("Imprimer le bon de commande" ): 
          perform.action=="POST"?("Commander un produit"): 
          (perform.action=="GET")?("Détail sur le produit "):
          (perform.action=="PUT")?("Modifier le produit " ):
          (perform.action=="DELETE")?("Supprimer le produit" ):
          (perform.action=="PUT_IN_LOT")?("Réception de produit" ):
         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { (isPrintPrescription==true)?(

             renderPdf()

              ):( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormAchatProduit()

           ):(perform.action=="GET" || perform.action=="DELETE")?(
             renderShowAchatProduit()
              ):
           (perform.action=="PUT_IN_LOT")?(
             renderFormAchatProduitReception()
              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(achatProduit.achatProduitId!=null && achatProduit?.achat?.statut==0&& perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(achatProduit,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
            <Button className="btn  btn-block"  disabled={loading} variant="success" 
                   onClick={() => saveAchatProduit(achatProduit)}>
                   {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Enregistrer</span>
            
          </Button>

        
          ):(perform.action=="PUT" && perform.result==""&& achatProduit?.achat?.statut==0)?(

          <Button className="btn  btn-block"  disabled={loading} variant="warning" 
                   onClick={() => saveAchatProduit(achatProduit)}>
                   {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span> Mettre à Jour</span>
            
          </Button>
           ):((perform.action=="PUT_IN_LOT") && perform.result=="")?(

          <Button className="btn  btn-block"  disabled={loading} variant="success" 
                   onClick={() => receptionProduit(achatProduit,lot)}>
                   {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Valider</span>
            
          </Button>
           )
           :(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteAchatProduit(achatProduit)}>
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
    {renderListOfAchatProduit()}

</div>
  );
};
let actifAchatProduit=true;
export default AchatProduits;