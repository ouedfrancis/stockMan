import React, {useState, useEffect, useCallback } from "react";
import LotsDataService from "../../services/stock/lots.service";
import EmplacementsDataService from "../../services/stock/emplacements.service";
import FournisseursDataService from "../../services/stock/fournisseurs.service";
import Styles from '../../styles.module.css';
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import DatePicker , { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Multiselect from 'multiselect-react-dropdown';
import globalObject from '../../global.js'
import $ from 'jquery'; 



/********Date management******
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@mui/pickers';*/
import 'date-fns';
import fr from "date-fns/locale/fr"; // the locale you want

import { TextField } from '@mui/material';

/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
registerLocale("fr", fr); // register it with the name you want
 /* eslint-disable */
const Lots = (props) => {

/*Create lot code*/
const initialLotState = 
    { 
       
        "lotId": "",
        "qte": "",
        "numeroLot": "", 
        "entrepotProduitId": "",     
        "produitId": "",
        "entrepotId": "",
        "fournisseurId": "",
        "dateExpiration": "",
        "dateReception":"",
        "remarque": "",
        "actif": true,
    };
const initialTransfertProduitState = 
    {      
        "source": {initialLotState},
        "destination": {initialLotState}
    }

    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [lot, setLot] = useState(initialLotState);
const [lots, setLots] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialLotState);
const [show, setShow] = useState(false);
const [emplacements, setEmplacements] = useState([]);
const [emplacementsDest, setEmplacementsDest] = useState([]);
const [entrePotEmplacements, setEntrePotEmplacements] = useState([]);
const [fournisseurs, setFournisseurs] = useState([]);
const [produit, setProduit] = useState(null);
const [loading, setLoading] = useState(false);
const [showLoading, setShowLoading] = useState(false);
const [guid, setGuid] = useState(Utils.uuidv4());
const [qteInOut, setQteInOut] = useState("");
const [entrepots, setEntrepots] = useState([]);
const [TranfertProduit, setTranfertProduit] = useState(initialLotState);
const [lotDest, setLotDest] = useState(initialLotState);//lot destination
const [entrepotProduit, setEntrepotProduit] = useState(initialLotState);
 const permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/GESTION_ENTREPOT/ENTREE_SORTIE");

useEffect(() => {
  if(props.entrepotProduit!=null&&props.entrepots!=null)
   {
    retrieveLots(actifLot);
    setEntrepotProduit(props?.entrepotProduit)
     console.log("props?.entrepotProduit",props?.entrepotProduit)
    setEntrepots(props.entrepots)
    setEmplacements(props?.emplacements)
    console.log("setEmplacements",props?.emplacements)
    if(props.entrepotProduit?.emplacement!=null&&props.entrepotProduit?.emplacement?.emplacementId!=null&&props.entrepotProduit?.emplacement?.emplacementId!="")
     {
      let list=getEntrepotEmplacements(props.entrepotProduit?.emplacement)
      setEntrePotEmplacements(list)
     } 
    else
      if(props.entrepotProduit?.entrepot!=null&&props.entrepotProduit?.entrepot?.emplacement!=null&&props.entrepotProduit?.entrepot?.emplacement?.emplacementId!=null&&props.entrepotProduit?.entrepot?.emplacement?.emplacementId!="")
        {
          let list=getEntrepotEmplacements(props.entrepotProduit?.entrepot?.emplacement)
          setEntrePotEmplacements(list)
        }
      /*else
        setEntrePotEmplacements(props?.emplacements)*/

   } 
   
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshLot()
retrieveLots(actifLot);
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Lot", perf.msg); 
/* if(perf.action=="PUT_IN_LOT"||perf.action=="PUT_OUT_LOT"&&props?.updateEntrepotProduit)
    {
      
    }else                        
      handleCloseAndReload()*/
  props?.updateEntrepotProduit(entrepotProduit)
}

const handleActiflotChange = (event) => {
  //let act=event.target.checked;
  actifLot=event.target.checked;
  retrieveLots(actifLot);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleLotChange = event => {
  const { name, value } = event.target;
  setLot({ ...lot, [name]: value });
};


  const refreshList = () => {
    retrieveLots();
  };

const refreshLot = () => {
    setLot(initialLotState);
     setErrors(initialLotState);
     setPerform(initialPerformState);
     
  };


function getEntrepotEmplacements  (emplacementParent) {

    let list=[]
  if(emplacementParent!=null&&emplacementParent.emplacementId!=null&&emplacementParent.emplacementId!="")
    {
      console.log("getEntrepotEmplacements====>",emplacementParent) 
    list=Utils.filterArrayByFieldNameAndContent(props?.emplacements,"lienChemin",emplacementParent.emplacementId)
    if(emplacementParent!=null&& emplacementParent.emplacementId!=null)
      list.push(emplacementParent)
  }
  return list;
}

async function retrieveFournisseurs (act){

  
    let resp=null;
    let query="?"
    
      query+="actif=true"
      resp= await FournisseursDataService.findAsync(query); 
       
    if(resp!=null && resp.status=="200" )          
        {
          
           
          setFournisseurs(resp.data);

          
        }else 
         setFournisseurs([])
}

//const reload=()=>window.location.reload();
/******************************************/
async function updateTransfertProduit (lot, lotDest)  {
  setLoading(true)
 const obj = {...lot};
  obj.userId=globalObject?.user?.id
  obj.qteInOut=qteInOut
  obj.entrepotProduitId=entrepotProduit.entrepotProduitId
   var perf=perform;
   if(isValidTransfertProduit(obj, lotDest)) 
     {       
          
          let response=null;
          
          let query="";
          
          query="?qte="+obj.qteInOut
          console.log("query",query)
         
          let transfertProduit={}
          transfertProduit.source={...obj}
          transfertProduit.destination={...lotDest}
          console.log("transfertProduit",transfertProduit)
            response= await LotsDataService.transfertProduitAsync(obj.entrepotProduitId,transfertProduit,query);
      
          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setLot(response.data);             
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
async function updateInOut (lot)  {
  setLoading(true)
 const obj = {...lot};
  obj.userId=globalObject?.user?.id
  obj.qteInOut=qteInOut
   var perf=perform;
   if(isValidInOut(obj)) 
     {       
          
          let response=null;
          let action=null
          let query="";
          if(perform.action=="PUT_IN_LOT")
            action="In"
          else
            action="Out"
          query="?action="+action+"&qte="+obj.qteInOut
          console.log("query",query)
          console.log("updateInOut",lot)
          
            response= await LotsDataService.inOutAsync(obj.entrepotProduitId,obj,query);
      
          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setLot(response.data);             
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

async function saveLot (lot)  {
  setLoading(true)
 const obj = {...lot};
  obj.userId=globalObject?.user?.id

  //console.log("saveLot=========>",obj)

   var perf=perform;
     if(isValid(obj))
     {       
           if(perform.action=="POST") 
           {
            obj.produitId=entrepotProduit?.produit?.produitId
            obj.entrepotProduitId=entrepotProduit?.entrepotProduitId
            obj.emplacementId=entrepotProduit?.emplacement?.emplacementId
            obj.entrepotId=entrepotProduit?.entrepot?.entrepotId
           }  

           if(lot.dateReception!=null&&lot.dateReception!="") 
           {
             obj.dateReception=Utils.dateTimeToString(new Date(obj.dateReception))

           } 
           if(lot.dateExpiration!=null&&lot.dateExpiration!="") 
           {
             obj.dateExpiration=Utils.dateToString(new Date(obj.dateExpiration))
             
           }       
          let response="";
          if(obj.lotId!=null && obj.lotId!="")
            response= await LotsDataService.updateAsync(obj.lotId,obj);
          else
            response= await LotsDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setLot(response.data);             
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

  async function handleStatus(obj) {
    obj.userId=globalObject?.user?.id
  if(obj.actif==true)
  {
      obj.actif=false;
   }else 
       obj.actif=true;
  
      let perf=perform;
    let response=await LotsDataService.updateAsync(obj.lotId,obj);
    if(response!=null && response.status=="200")
      {
          setLot(response.data);             
           
          retrieveLots(actifLot);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrieveLots (act){

  if ($.fn.dataTable.isDataTable('#tListOflot')) {
        $('#tListOflot').DataTable().destroy();
       
    }
    let resp=null;
     let query="?"
      //query+="actif=true"
      if(props?.entrepotProduit!=null)
      {
        query+="&entrepotProduitId="+props?.entrepotProduit?.entrepotProduitId
      }
      resp= await await LotsDataService.findAsync(query);  
       
    if(resp!=null && resp.status=="200" )          
        {
          setLots(resp.data);
           console.log("setLots=========>",resp.data)
          
        }else 
         setLots([])

setTimeout(()=>{ 
    //$('#tListOflot').DataTable().destroy();                       
    $('#tListOflot').DataTable(

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
      //init Datatable  


function isValidTransfertProduit  (obj, lotDest) {
 
    let err=initialLotState;
    let valid=true;
    
    if( lotDest.entrepotId==null || lotDest.entrepotId.length<2) 
       {
         err.errorMsg+="<br/>-"
         err.errorMsg+=err.entrepotId="Indiquer l'entrepot de destination";
         valid=false;
      }

     if(valid&& lotDest.entrepotId==obj.entrepotId) 
       {
         err.errorMsg+="<br/>-"
         err.errorMsg+=err.entrepotId="L'entrepot de destination doit être différent de celui d'origine";
         valid=false;
      } 
     if( obj.qteInOut==null || obj.qteInOut.length==0|| !Utils.isPositiveFloat(obj.qteInOut)||Number(obj.qteInOut)==0) 
       {
         err.errorMsg+="<br/>-"
         err.errorMsg+=err.qteInOut="Valeur de la quantité incorrecte";
         valid=false;
      } 
      if(valid&&(perform.action=="PUT_TransfertProduitLot")&& Number(obj.qte)<Number(obj.qteInOut))
      {
        err.errorMsg+="<br/>-"
         err.errorMsg+=err.qteInOut="La quantité indiqué est inférieur à celle du lot en stock ";
         valid=false;
      }
       if(valid&&(perform.action=="PUT_TransfertProduit")&& Number(entrepotProduit.qte)<Number(obj.qteInOut))
      {
        err.errorMsg+="<br/>-"
         err.errorMsg+=err.qteInOut="La quantité indiqué est inférieur à celle en stock ";
         valid=false;
      }
      
     if(valid==false)
        {
            err.errorMsg="Une ou plusieurs erreurs ont été constatées dans le formulaire:"+err.errorMsg;
        }
  setErrors(err);
    return valid;

  };
function isValidInOut  (obj) {
 
    let err=initialLotState;
    let valid=true;
    
     if( obj.qteInOut==null || obj.qteInOut.length==0|| !Utils.isPositiveFloat(obj.qteInOut)||Number(obj.qteInOut)==0) 
       {
         err.errorMsg+="<br/>-"
         err.errorMsg+=err.qteInOut="Valeur de la quantité incorrecte";
         valid=false;
      } 
      if(valid&&(perform.action=="PUT_OUT_LOT")&& Number(obj.qte)<Number(obj.qteInOut))
      {
        err.errorMsg+="<br/>-"
         err.errorMsg+=err.qteInOut="La quantité indiqué est inférieur à celle du lot en stock ";
         valid=false;
      }
       if(valid&&(perform.action=="PUT_OUT")&& Number(entrepotProduit.qte)<Number(obj.qteInOut))
      {
        err.errorMsg+="<br/>-"
         err.errorMsg+=err.qteInOut="La quantité indiqué est inférieur à celle en stock ";
         valid=false;
      }
     if(valid==false)
        {
            err.errorMsg="Une ou plusieurs erreurs ont été constatées dans le formulaire:"+err.errorMsg;
        }
  setErrors(err);
    return valid;

  };

function isValid  (obj) {
 
    let err=initialLotState;
    let valid=true;
        console.log(obj); 
    if( obj.numeroLot==null || obj.numeroLot.length<2) 
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.numeroLot="N° de lot/serie requis";
         valid=false;
     }

     if( obj.qte==null || obj.qte.length==0|| !Utils.isPositiveFloat(obj.qte)) 
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.qte="La quantité du lot incorrecte";
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


const performAction = (lot,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshLot();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
   

  }else
    {

      perf=perform;
      handleClose();
      if(action!="PUT_OUT"&&action!="PUT_TransfertProduit")
        setLot(lot); 
      else
      {
        let elt={...initialLotState}
        elt.entrepotProduitId=entrepotProduit.entrepotProduitId
        elt.produitId=entrepotProduit.produitId
        elt.entrepotId=entrepotProduit.entrepotId
        console.log("elt===========>>>",elt)
        setLot(elt)
      }     
      setQteInOut("")
      setErrors(initialLotState);
      handleShow();
      perf.action=action;
      setPerform(perf);
      }
if(action=="POST"||action=="PUT")
 {

   if(fournisseurs.length==0)
  retrieveFournisseurs()
 } 



    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}

const renderShowEntrepotProduit =()=> {
return (
   <div className="row" >
    <p>&nbsp;</p> 
                <div className="col-md">       
                
                <table className={Styles.styledTable}>
                <thead>
            <tr>
              <th className="fw-bolder" colSpan="4"><b>Produit: {entrepotProduit?.produit?.libelle}</b></th>          
            </tr>
          </thead>
                <tbody>
                    <tr><th className="fw-bolder" colSpan="1"><b>Entrepot</b></th><td colSpan="3">{entrepotProduit?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder" colSpan="1"><b>Emplacement de l'entrepot</b></th><td colSpan="3">{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepotProduit?.entrepot?.emplacementId)?.libelleChemin}</td></tr>
                    <tr><th className="fw-bolder" colSpan="1"><b>Emplacement du produit dans l'entrepot</b></th><td colSpan="3">{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepotProduit.emplacementId)?.libelleChemin}</td></tr>
                    <tr>
                            <th className="fw-bolder"  ><b>Qté disponible</b></th>
                            <td>{
                          Number(entrepotProduit.qte)<Number(entrepotProduit.qteMin)  ?(
                        <span style={{ color:"red"}}>{entrepotProduit.qte}</span>):
                        Number(entrepotProduit.qte)<Number(entrepotProduit.qteOpt)  ?(
                        <span style={{ color:"orange"}}>{entrepotProduit.qte}</span>):
                         <span style={{ color:"green"}}>{entrepotProduit.qte}</span>}


                            </td>
                            <th className="fw-bolder"  className="border solid"><b>Qté Min</b></th><td>{entrepotProduit.qteMin}</td>
                    </tr>
                    <tr className="border">
                      <th className="fw-bolder" ><b>Qté optimale</b></th><td>{entrepotProduit.qteOpt}</td>
                          <th className="fw-bolder" className="border solid"><b>Qté Max</b></th><td>{entrepotProduit.qteMax}</td>
                    </tr>

                  <tr>
                   <th className="fw-bolder"><b>Réapprovisionnement automatique</b></th><td>{entrepotProduit.reapprovisionnementAuto==true? "Oui":"Non"}</td>
                   <th className="fw-bolder" ><b>Stratégie de sortie </b></th><td>{entrepotProduit.priorite}</td>
                  </tr>  
                   
                                                  
                </tbody>
              </table>
                    <p>&nbsp;</p>             
                                                                                    
                           
                </div>
              </div>
  )}
const renderListOfLot=() =>{
return (
<div className="table-responsive">         
      <table id="tListOflot" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>
                <th>N° serie</th>
                <th>qté</th>
                 <th>Date expiration</th>
                  {/*<th>Date reception</th>
                  <th>Fournisseur</th>
                  <th>Emplacement</th>
                <th>Actif</th>*/}
                               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {lots &&
            lots.map((lot, index) => (
                <tr key={index}> 
                 <td>{lot.dateModif}</td> 
                  <td>{lot.numeroLot}</td>       
                  <td>{lot.qte}</td>    
                   <td>{lot?.dateExpiration}</td>        
                {/*  <td>{lot?.dateReception}</td>
                  <td>{Utils.trouverObjetDansListObject(fournisseurs,"fournisseurId",lot.fournisseurId)?.libelle}</td>                    
                   <td>{Utils.trouverObjetDansListObject(emplacements,"emplacementId",lot.emplacementId)?.libelle}</td>   
                  <td>{lot.actif==true?"Oui":"Non"}</td> 
                 
                  */}  
                  <td>
                 {/*      <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => performAction(lot, "GET")}/> 
                      <img src="/img/write.png" title="Modifier"  alt="Modifier" className="icone-action"
                      onClick={() => performAction(lot,"PUT")}/>
                      <img src="/img/productIn.png" title="Entrée de stock"  alt="Entrée de stock" className="icone-action"
                      onClick={() => performAction(lot,"PUT_IN_LOT")}/>
                       <img src="/img/productOut.png" title="Sortie de stock"  alt="Sortie de stock" className="icone-action"
                      onClick={() => performAction(lot,"PUT_OUT_LOT")}/>
                      <img src="/img/productTransfert.png" title="Transfert de stock"  alt="Transfert de stock" className="icone-action"
                      onClick={() => performAction(lot,"PUT_TransfertProduitLot")}/>
                   */}
                    <div className="btn-group">
                      <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(lot, "GET")}><i class="fa fa-eye"></i> </Button>
                     {permission?.action?.includes("C")&&<Button  variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(lot, "PUT")}><i class="fa fa-edit fa-sm"></i></Button> } 
                    {permission?.action?.includes("U")&&(lot.actif? <Button  variant="secondary" className="btn-sm" 
                              title="Activer" onClick={() => handleStatus(lot)}>
                           <i class="fa fa-toggle-off"></i>
                    </Button>:
                     <Button  variant="secondary" className="btn-sm" 
                             title="Déactiver" onClick={() => handleStatus(lot)}>
                            <i class="fa fa-toggle-on"></i>
                    </Button>)}   
                      {permission?.action?.includes("U")&&
                      <Button variant="primary" className="btn-sm" 
                             title="Entrée de stock" onClick={() => performAction(lot, "PUT_IN_LOT")}>
                      <FontAwesomeIcon icon={['fas', 'sign-in-alt']} />
                     </Button>}
                     {permission?.action?.includes("U")&&
                     <Button variant="danger" className="btn-sm" 
                             title="Sortie de stock" onClick={() => performAction(lot, "PUT_OUT_LOT")}>
                      <FontAwesomeIcon icon={['fas', 'sign-out-alt']} />
                     </Button>}
                     </div>
                   </td>             
                </tr>

          ))}          
          </tbody>          
        </table>     
        </div>
  )}
const renderShowLot =()=> {
return (
   <div className="row">

        <div className="col-md"> 
                <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="fw-bolder">Entrepot</th><td>{entrepotProduit?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Produit</th><td>{entrepotProduit?.produit?.libelle}</td></tr>
                    <tr><th className="fw-bolder" colSpan="1"><b>Emplacement du produit dans l'entrepot</b></th><td colSpan="3">{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepotProduit?.entrepot?.emplacementId)?.libelleChemin}</td></tr>
                    <tr><th className="fw-bolder">N°Serie</th><td>{lot.numeroLot}</td></tr>
                    <tr><th className="fw-bolder">Quantité disponible dans le lot</th><td>{lot.qte}</td></tr>
                    <tr><th className="fw-bolder">Fournisseur</th><td>{Utils.trouverObjetDansListObject(fournisseurs,"fournisseurId",lot.fournisseurId)?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Emplacement du lot</th><td>{Utils.trouverObjetDansListObject(emplacements,"emplacementId",lot.emplacementId)?.libelle}</td></tr>
                   <tr><th className="fw-bolder">Date d'expiration</th><td>{lot.dateExpiration}</td></tr>
                    <tr><th className="fw-bolder">Date de réception</th><td>{lot.dateReception}</td></tr>        
                    <tr><th className="fw-bolder">Actif</th><td>{lot.actif==true? "Oui":"Non"}</td></tr> 
                    <tr><th className="fw-bolder">Date de Modif</th><td>{lot.dateModif}</td></tr> 
                   {permission?.action?.includes("CRUD") &&<tr><th className="fw-bolder">User</th><td>{lot.userId}</td></tr>}

                                                               
                </tbody>
              </table>
                </div>
          </div>

  )}
const renderFormLotInOut=() =>{

return (

   <div className="row">
        <div className="col-md"> 
                  <div className="form-group">             
                     <table className={Styles.styledTable}>
                         <tbody>
                    <tr><th className="fw-bolder">Entrepot</th><td>{entrepotProduit?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Produit</th><td>{entrepotProduit?.produit?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Qté en stock</th><td>{entrepotProduit.qte}</td></tr>
                    {perform.action!="PUT_OUT"&&<tr><th className="fw-bolder">N°Serie</th><td>{lot.numeroLot}</td></tr>}
                    {perform.action!="PUT_OUT"&&(<tr><th className="fw-bolder">Qté actuelle du lot</th><td>{lot.qte}</td></tr>)}                                                              
                </tbody>
              </table>                 
          </div>
           <p>&nbsp;</p>Quantité:    
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="qteInOut"
                        required
                        value={qteInOut}
                        onChange={event => {
                          const { name, value } = event.target;
                          setQteInOut(value);
                        }}
                        name="qteInOut"
                        placeholder="Qté"
                        maxLength="7"
                        className={`form-control form-control-sm ${errors?.qteInOut!=null&&errors?.qteInOut.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors?.qteInOut}</div>
                    </div>
               </div>


              </div>
  )}


const renderFormProduitTransfert=() =>{

return (

   <div className="row">
        <div className="col-md"> 
                  <div className="form-group">             
                     <table className={Styles.styledTable}>
                       <thead>
                        <tr>
                          <th className="fw-bolder" colSpan="4"><b>Entrepot source</b></th>          
                        </tr>
                      </thead>
                         <tbody>
                    <tr><th className="fw-bolder">Entrepot</th><td>{entrepotProduit?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Produit</th><td>{entrepotProduit?.produit?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Qté en stock</th><td>{entrepotProduit.qte}</td></tr>
                    {perform.action=="PUT_TransfertProduitLot"&&<tr><th className="fw-bolder">N°Serie</th><td>{lot.numeroLot}</td></tr>}
                    {perform.action=="PUT_TransfertProduitLot"&&(<tr><th className="fw-bolder">Qté actuelle du lot</th><td>{lot.qte}</td></tr>)}                                                              
                </tbody>
              </table>                 
          </div>
        <div className="form-group text-center">
          <img src="/img/arrow-add1.png" title="Transfert"  alt="Transfert" className="iconeRefresh"/>
          </div>
                     
          <div className="form-group" >     
                    <Select
                       defaultValue={lotDest.entrepotId!=null&&lotDest.entrepotId!=""?
                      lotDest.fournisseur:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.entrepotId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...lotDest}                                             
                              if(newValue!=null)                           
                               {
                                
                                obj.entrepotId=newValue.entrepotId
                               let list= getEntrepotEmplacements(newValue?.emplacement)
                               setEmplacementsDest(list)
                               } 
                                else
                             {
                                    obj.entrepotId=initialLotState.entrepotId 

                                }   
                              setLotDest(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={entrepots}
                        placeholder={`Entrepot de destination`}
                        className={`form-control-sm px-0 ${errors?.entrepotId!=null && errors?.entrepotId.length>0 ? 'is-invalid' : ''}`} />                       
                      <div className="invalid-feedback">{errors?.entrepotId}</div>
            </div>
               
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="qteInOut"
                        required
                        value={qteInOut}
                        onChange={event => {
                          const { name, value } = event.target;
                          setQteInOut(value);
                        }}
                        name="qteInOut"
                        placeholder="Quantité"
                        maxLength="7"
                        className={`form-control form-control-sm ${errors?.qteInOut!=null&&errors?.qteInOut.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors?.qteInOut}</div>
                    </div>
               </div>

               <div className="form-group " >     
                    <Select
                       defaultValue={lotDest!=null&&lotDest.emplacementId!=null?lotDest:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.emplacementId}
                       isClearable={true}
                       onChange={(newValue) => { 
                                let obj={ ...lotDest}
                                 if(newValue!=null)                           
                               {
                                obj.emplacementId=newValue?.emplacementId
                                } 
                                else
                               {
                                    obj.emplacementId=initialLotState.emplacementId 
                                } 

                               setLotDest(obj);

                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={entrePotEmplacements}
                        placeholder={`Emplacement de destination`}
                        className={`form-control-sm px-0 ${errors?.emplacementId!=null && errors?.emplacementId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.emplacementId}</div>                  
                </div>

              </div>
  )}



const renderFormLot=() =>{

return (

   <div className="row">
        <div className="col-md"> 
                  <div className="form-group border">             
                      <table className={Styles.styledTable}>
                         <tbody>
                    <tr><th className="fw-bolder">Entrepot</th><td>{entrepotProduit?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Produit</th><td>{entrepotProduit?.produit?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Qté en stock</th><td>{entrepotProduit.qte}</td></tr>
                   {perform.action=="PUT"&&( <tr><th className="fw-bolder">Quantité du lot</th><td>{lot.qte}</td></tr>)}                                                              
                    </tbody>
                  </table>
                    </div>
                  <div className="form-group">             
                      <input
                        type="text"                       
                        id="numeroLot"
                        required
                        value={lot.numeroLot}
                        onChange={handleLotChange}
                        name="numeroLot"
                        placeholder="N° Lot/Serie"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.numeroLot.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.numeroLot}</div>
                    </div>
                    {perform.action=="POST"&&(
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="qte"
                        required
                        value={lot.qte}
                        onChange={handleLotChange}
                        name="qte"
                        placeholder="Qté"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.qte.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.qte}</div>
                    </div>)}
                   
                <div className="form-group" >     
                    <Select
                        
                       defaultValue={lot.fournisseurId!=null&&lot.fournisseurId!=""?
                      lot.fournisseur:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.fournisseurId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...lot}                                             
                              if(newValue!=null)                           
                               {
                                
                                obj.fournisseurId=newValue.fournisseurId
                               
                               } 
                                else
                             {
                                    obj.fournisseurId=initialLotState.fournisseurId 

                                }   
                              setLot(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={fournisseurs}
                        placeholder={`Fournisseur`}
                        className={`form-control-sm px-0 ${errors?.fournisseurId!=null && errors?.fournisseurId.length>0 ? 'is-invalid' : ''}`} />                       
                      <div className="invalid-feedback">{errors?.fournisseurId}</div>
                    </div>

                    <div className="form-group" >     
                    <Select
                        
                       defaultValue={lot.emplacementId!=null&&lot.emplacementId!=""?
                      lot.emplacement:""}
                       getOptionLabel={e => e.libelleChemin}
                        getOptionValue={e => e.emplacementId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...lot}                                             
                              if(newValue!=null)                           
                               {
                                
                                obj.emplacementId=newValue.emplacementId
                               
                               } 
                                else
                             {
                                    obj.emplacementId=initialLotState.emplacementId 

                                }   
                              setLot(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={entrePotEmplacements}
                        placeholder={`Emplacement`}
                        className={`form-control-sm px-0 ${errors?.emplacementId!=null && errors?.emplacementId.length>0 ? 'is-invalid' : ''}`} />                       
                      <div className="invalid-feedback">{errors?.emplacementId}</div>
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
                        minDate={new Date()} 
                        onChange={date => {
                        setLot({ ...lot, "dateExpiration": date });            
                        }}
                        className={`form-control form-control-sm ${errors.dateExpiration!=null && errors.dateExpiration.length>0 ? 'is-invalid' : ''}`} 
                        
                      /> 
                         <div className="invalid-feedback">{errors.dateExpiration}</div>
                     </div>
                       <div className="form-group">
                    
                      <DatePicker
                         name="dateReception"
                        selected={lot.dateReception!=null&&lot.dateReception!=""?new Date(lot.dateReception):""}
                       locale="fr"
                        showTimeSelect
                        timeIntervals={5}
                        timeFormat="HH:mm"
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                        placeholderText="Date de réception"
                        maxDate={new Date()} 
                        onChange={date => {

                        setLot({ ...lot, "dateReception": date }); 
                        // setRdv({ ...lot, "dateReception": date });

                        }}
                        className={`form-control form-control-sm ${errors.dateReception!=null && errors.dateReception.length>0 ? 'is-invalid' : ''}`} 
                        
                      /> 
                     
                       <div className="invalid-feedback">{errors.dateReception}</div>
                    </div>
                    
                    <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleLotChange} value={lot.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.actif}</div>
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


return (

<div className="container" > 
  
      
{/****order border-primary********************************Modal for add lot*******************************/}
   <div className="row ">
      <div className="col-md">  
        {renderShowEntrepotProduit()}
    
{loadingInfo()}
<div className="submit-form">
    
    <div className="text-right">    
       <div className="custom-control custom-checkbox custom-control-inline">
        
    
    {/*   <img src="/img/refresh1.png" title="Rafraichir"  alt="Rafraichir" className="iconeRefresh"
                      onClick={() => retrieveLots()}/>
      <img src="/img/productIn.png" title="Entrée de stock"  alt="Entrée de stock" className="icone-action-25"
                      onClick={() => performAction(lot,"POST")}/>  
       <img src="/img/productOut.png" title={`Sortie de stock selon la stratégie ${entrepotProduit.priorite}`}  alt="Sortie de stock" className="icone-action-25"
                      onClick={() => performAction(lot,"PUT_OUT")}/>
      <img src="/img/productTransfert.png" title={`Transfert selon la stratégie ${entrepotProduit.priorite}`}  alt="Transfert de stock" className="icone-40-40"
                      onClick={() => performAction(entrepotProduit,"PUT_TransfertProduit")}/>    
      */}

        <Button  variant="info" className="btn-sm" 
                      title="Rafraichir" onClick={() => retrieveLots()}>
                <i class="fa fa-refresh"></i>
          </Button>
      {permission?.action?.includes("C")&&
         <Button  variant="success" className="btn-sm" 
                      title="Entrée de stock" onClick={() => performAction(lot, "POST")}>
                <FontAwesomeIcon icon={['fas', 'sign-in-alt']} />
          </Button>}
        {permission?.action?.includes("U")&& 
           <Button  variant="danger" className="btn-sm" 
                      title={`Sortie de stock selon la stratégie ${entrepotProduit.priorite}`} onClick={() => performAction(lot, "PUT_OUT")}>
                 <FontAwesomeIcon icon={['fas', 'sign-out-alt']} />
          </Button>}
          {permission?.action?.includes("U")&&
          <Button  variant="danger" className="btn-sm" 
                      title={`Transfert selon la stratégie ${entrepotProduit.priorite}`} onClick={() => performAction(entrepotProduit, "PUT_TransfertProduit")}>
                <FontAwesomeIcon icon={['fas', 'share-square']} />
          </Button>} 
 

      </div>
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName={`${perform.result.length>0 ? 'modal-30vw' : 'modal-30vw'}`} >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouveau lot"): 
          (perform.action=="GET")?("Détail sur le lot "):
          (perform.action=="PUT")?("Modifier le lot " ):
          (perform.action=="DELETE")?("Supprimer le lot" ):
          (perform.action=="PUT_IN_LOT")?("Entrée de stock" ):
          (perform.action=="PUT_OUT_LOT"||perform.action=="PUT_OUT")?("Sortie de lot" ):
          (perform.action=="PUT_Transfert"||perform.action=="PUT_TransfertProduitLot")?("Transfert de stock" ):
         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormLot()

           ):(perform.action=="GET" || perform.action=="DELETE")?(
             renderShowLot()
              ):
           (perform.action=="PUT_IN_LOT" || perform.action=="PUT_OUT_LOT"|| perform.action=="PUT_OUT")?(
             renderFormLotInOut()
              ):
           (perform.action=="PUT_TransfertProduit"|| perform.action=="PUT_TransfertProduitLot")?(
             renderFormProduitTransfert()
              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(lot.lotId!=null && perform.action=="GET"&&permission?.action?.includes("U"))?
          <Button variant="warning" onClick={() => performAction(lot,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
            <Button className="btn  btn-block"  disabled={loading} variant="success" 
                   onClick={() => saveLot(lot)}>
                   {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Enregistrer</span>
            
          </Button>

        
          ):(perform.action=="PUT" && perform.result=="")?(

          <Button className="btn  btn-block"  disabled={loading} variant="warning" 
                   onClick={() => saveLot(lot)}>
                   {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span> Mettre à Jour</span>
            
          </Button>
           ):((perform.action=="PUT_IN_LOT"||perform.action=="PUT_OUT_LOT"||perform.action=="PUT_OUT") && perform.result=="")?(

          <Button className="btn  btn-block"  disabled={loading} variant="success" 
                   onClick={() => updateInOut(lot)}>
                   {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Valider</span>
            
          </Button>
           ):((perform.action=="PUT_TransfertProduit"|| perform.action=="PUT_TransfertProduitLot") && perform.result=="")?(

          <Button className="btn  btn-block"  disabled={loading} variant="success" 
                   onClick={() => updateTransfertProduit(lot,lotDest)}>
                   {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Valider</span>
            
          </Button>
           )
           :(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteLot(lot)}>
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
    {renderListOfLot()}

    </div>
  </div>
</div>
  );
};
let actifLot=true;
export default Lots;