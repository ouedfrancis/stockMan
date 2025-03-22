import React, {useState, useEffect, useCallback } from "react";
import MouvementStocksDataService from "../../services/stock/mouvementStocks.service";

import Styles from '../../styles.module.css';
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';

import globalObject from '../../global.js'
import $ from 'jquery'; 
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';


/********Date management******
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@mui/pickers';*/
import 'date-fns';
import { TextField } from '@mui/material';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 /* eslint-disable */
const MouvementStocks = (props) => {

/*Create lot code*/
const initialMouvementStockState = 
    { 
       
        "mouvementStockId": "",
        "qte": "",
        "numeroMouvementStock": "", 
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
        "source": {initialMouvementStockState},
        "destination": {initialMouvementStockState}
    }

    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [mouvementStock, setMouvementStock] = useState(initialMouvementStockState);
const [mouvementStocks, setMouvementStocks] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialMouvementStockState);
const [show, setShow] = useState(false);

const [loading, setLoading] = useState(false);
const [showLoading, setShowLoading] = useState(false);
const [guid, setGuid] = useState(Utils.uuidv4());

 const permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/GESTION_ENTREPOT/ENTREE_SORTIE");

useEffect(() => {
  if(props.entrepotProduit!=null)
   {
    retrieveMouvementStocks(actifMouvementStock);
    

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
refreshMouvementStock()
retrieveMouvementStocks(actifMouvementStock);
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"MouvementStock", perf.msg); 
/* if(perf.action=="PUT_IN_LOT"||perf.action=="PUT_OUT_LOT"&&props?.updateEntrepotProduit)
    {
      
    }else                        
      handleCloseAndReload()*/
  props?.updateEntrepotProduit(entrepotProduit)
}

const handleActifmouvementStockChange = (event) => {
  //let act=event.target.checked;
  actifMouvementStock=event.target.checked;
  retrieveMouvementStocks(actifMouvementStock);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleMouvementStockChange = event => {
  const { name, value } = event.target;
  setMouvementStock({ ...mouvementStock, [name]: value });
};


  const refreshList = () => {
    retrieveMouvementStocks();
  };

const refreshMouvementStock = () => {
    setMouvementStock(initialMouvementStockState);
     setErrors(initialMouvementStockState);
     setPerform(initialPerformState);
     
  };







async function retrieveMouvementStocks (act){

  if ($.fn.dataTable.isDataTable('#tListOfMouvementStock')) {
        $('#tListOfMouvementStock').DataTable().destroy();
       
    }
    let resp=null;
     let query="?"
      //query+="actif=true"
      if(props?.entrepotProduit!=null)
      {
        query+="&entrepotProduitSourceId="+props?.entrepotProduit?.entrepotProduitId
      }
      resp= await await MouvementStocksDataService.findAsync(query);  
       
    if(resp!=null && resp.status=="200" )          
        {
          setMouvementStocks(resp.data);
           console.log("setMouvementStocks=========>",resp.data)
          
        }else 
         setMouvementStocks([])

setTimeout(()=>{ 
    //$('#tListOfMouvementStock').DataTable().destroy();                       
    $('#tListOfMouvementStock').DataTable(

      {
        
        "autoWidth": false,
       
        "scrollX":false,
        "scrollCollapse": true,
        "order": [[ 0, "desc" ]],
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
const renderListOfMouvementStock=() =>{
return (
<div className="col-md"
      style={{ background: "var(--main-container-jumbotron-background-color)", fontFamily: "Trebuchet Ms",overflow: "auto", height:'400px' }}
> 



<VerticalTimeline layout='1-column-left' >
{mouvementStocks.map((mov) => (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            //date={mov.dateCreation}
            iconStyle={{ background: "var(--vertical-menu-background-color)", color: "#fff" }}
          // contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}  
          contentArrowStyle={{ borderRight: '15px solid  var(--vertical-menu-background-color)' }}
           iconStyle={{background: 'var(--vertical-menu-background-color)', color: '#fff',width:'24px',height:'24px',
            marginLeft: "8px", marginTop: "10px" }}
          icon={<FontAwesomeIcon icon={['fas', 'fa-undo']} />}
          >
          <span className="vertical-timeline-element-date" style={{ fontSize: ".775rem"}}>
              <b>{mov.dateCreation?.slice(0,16)}:</b> {mov.user}
            <span>
              <br/> {mov.type}-{mov.action}
              <i><br/>{mov.entrepotSource}{mov.emplacementSource!=null?("-"+mov.emplacementSource):""}{mov.action=="Transfert"?("=>"+mov.entrepotDestination+(mov.emplacementDestination!=null?("-"+mov.emplacementDestination):"")):""}
              </i><br/><b>Qté:</b>{mov.qte}
             </span>
            </span>
          
          </VerticalTimelineElement>))}
  {/*<VerticalTimelineElement
    className="vertical-timeline-element--work"
   
    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
    date="2011 - present"
    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
    icon={<FontAwesomeIcon icon={['fas', 'fa-undo']} />}
  >
    <h4 className="vertical-timeline-element-title">Creative Director</h4>
    <h5 className="vertical-timeline-element-subtitle">Miami, FL</h5>
    <p>
      Creative Direction, User Experience, Visual Design, Project Management, Team Leading
    </p>
  </VerticalTimelineElement>*/}


</VerticalTimeline>        
      {/*<table id="tListOfMouvementStock" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
                <th>Source</th>
                <th>Emplacement</th>
                <th>Produit</th>                
                <th>qté</th>
                <th>Destination</th>
               
                               
                     
            </tr>
          </thead>
          <tbody>
           {mouvementStocks &&
            mouvementStocks.map((mov, index) => (
                <tr key={index}> 
                 <td>{mov.dateCreation}</td> 
                 <td>{mov.type}</td>
                 <td>{mov.entrepotSource}</td> 
                 <td>{mov.emplacementSource}</td>  
                 <td>{mov.produit}</td> 
                 <td>{mov.qte}</td>    
                 <td>{mov?.entrepotDestination}</td>                    
                </tr>

          ))}          
          </tbody>          
        </table> */}    
        </div>
  )}
const renderShowMouvementStock =()=> {
return (
   <div className="row">

        <div className="col-md"> 
                <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="fw-bolder">Entrepot</th><td>{entrepotProduit?.entrepot?.libelle}</td></tr>
                    <tr><th className="fw-bolder">Produit</th><td>{entrepotProduit?.produit?.libelle}</td></tr>
                    <tr><th className="fw-bolder" colSpan="1"><b>Emplacement du produit dans l'entrepot</b></th><td colSpan="3">{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepotProduit?.entrepot?.emplacementId)?.libelleChemin}</td></tr>
                    <tr><th className="fw-bolder">N°Serie</th><td>{lot.numeroMouvementStock}</td></tr>
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
    
{loadingInfo()}


    {renderListOfMouvementStock()}

    </div>
  </div>
</div>
  );
};
let actifMouvementStock=true;
export default MouvementStocks;