import React, {useState, useEffect, useCallback } from "react";
import EntrepotProduitsDataService from "../../services/stock/entrepotProduits.service";
import ModelesDataService from "../../services/modeles.service";
import EntrepotsDataService from "../../services/stock/entrepots.service";
import ProduitsDataService from "../../services/stock/produits.service";
import PersonnelDataService from "../../services/personnels.service";
import EmplacementsDataService from "../../services/stock/emplacements.service";
import Lots from "../../components/gestionStock/lots.component";
import MouvementStocks from "../../components/gestionStock/mouvementStocks.component";
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
const EntrepotProduits = () => {


const initialLotState = 
    { 
       
        "lotId": "",
        "produitId": "",
        "entrepotId": "",
        "fournisseurId": "", 
        "numeroLot": {},
        "qte": "", 
        "dateReception": "", 
               
    }
/*Create entrepotProduit code*/
const initialEntrepotProduitState = 
    { 
       
        "entrepotProduitId": "",
        "produit": {},
        "produitId": "", 
        "entrepot": {},  
        "entrepotId": "",     
        "qte": "",  
        "qteMin": "",
        "qteMax": "",
        "qteOpt": "",
        "uniteAchat":"",
        "prixAchat":"",
        "prixVente":"",
        "ratioUniteAchatUniteDeMesure":"",
        "uniteDeMesure":"",
        "priorite": "",
        "reapprovisionnementAuto":false,
        "accepteDemandeSortieProduit":false,
        "modaliteFacturationActe":0,
        "emplacement": {},
        "emplacementId": "",
        "remarque": "",
        "actif": true,
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [entrepotProduit, setEntrepotProduit] = useState(initialEntrepotProduitState);
const [entrepotProduits, setEntrepotProduits] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialEntrepotProduitState);
const [showEntrepotProduit, setShowEntrepotProduit] = useState(false);
const [entrepots, setEntrepots] = useState([]);
const [entrepot, setEntrepot] = useState(null);
const [personnels, setPersonnels] = useState([]);
const [produits, setProduits] = useState([]);
const [emplacements, setEmplacements] = useState([]);
const [uniteDeMesures, setUniteDeMesures] = useState([]);
const [entrePotEmplacements, setEntrePotEmplacements] = useState([]);

const [lot, setLot] = useState(initialLotState);
const [errorLot, setErrorLot] = useState(initialLotState);
const [lots, setLots] = useState([]);
const [guid, setGuid] = useState(Utils.uuidv4());
const [actifEntrepotProduit, setActifEntrepotProduit] = useState(true);

 const permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/GESTION_ENTREPOT");
 const permissionInOut=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/GESTION_ENTREPOT/ENTREE_SORTIE");

useEffect(() => {
    retrieveEntrepots();
    retrieveEntrepotProduits();
   retrieveModeles()
    //setEntrepotProduit(entrepotProduit); 
     retrieveEmplacements()
  }, []);

const handleClose = () => {
  setShowEntrepotProduit(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShowEntrepotProduit(false);
refreshEntrepotProduit()
retrieveEntrepotProduits(entrepot?.entrepotId);
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"EntrepotProduit", perf.msg);                         
handleCloseAndReload()
}

const handleActifentrepotProduitChange = (event) => {
  //let act=event.target.checked;
  actifEntrepotProduit=event.target.checked;
  retrieveEntrepotProduits(entrepot?.entrepotId);
}

const handleShowEntrepotProduit = () => setShowEntrepotProduit(true);

//const today=new Date();
const handleEntrepotProduitChange = event => {
  const { name, value } = event.target;
  setEntrepotProduit({ ...entrepotProduit, [name]: value });
};

  const refreshList = () => {
    retrieveEntrepotProduits(entrepot?.entrepotId);
  };

const refreshEntrepotProduit = () => {
    setEntrepotProduit(initialEntrepotProduitState);
     setErrors(initialEntrepotProduitState);
     setPerform(initialPerformState);
     
  };


async function handleToUpdateEntrepotProduit  (obj) 
{
  if(obj.entrepotProduitId!=null)
  {
    retrieveEntrepotProduits()
    
  }
}
async function retrieveEntrepots (){
 
    let resp=null;
    let query="?"
    
      query+="actif=true"
      if(globalObject?.personnel?.personnelId!=null)
      {
        query+="&gestionnaireId="+globalObject?.personnel?.personnelId
      }
      resp= await EntrepotsDataService.findAsync(query); 
          
   
    if(resp!=null && resp.status=="200" )          
        {
          setEntrepots(resp.data);
          /*if(resp.data[0]!=null)
          {
            retrieveEntrepotProduits(resp.data[0].entrepotId);
            getEntrepotEmplacements(resp.data[0]?.emplacement)
          }*/

        }else
     setEntrepots([])

    //setShowEntrepotProduitPatientsLoading(false)
}
async function retrieveProduits (){

  
    let resp=null;
    let query="?"
    
      query+="actif=true"
      resp= await ProduitsDataService.findAsync(query); 
          
   
    if(resp!=null && resp.status=="200" )          
        {
          setProduits(resp.data);
          console.log('retrieveProduits',resp.data)
        }else
     setProduits([])

    //setShowEntrepotProduitPatientsLoading(false)
}
async function retrievePersonnels (){
    let resp=null
    let q="personnel=true"


    resp= await PersonnelDataService.getByPersonnelsLiteAsync(q);
  
    if(resp!=null && resp.status=="200" )          
        {
          setPersonnels(resp.data);   
          console.log("setPersonnels====>",resp.data)      
        }else 
         setPersonnels([])


}
function getEntrepotEmplacements  (emplacementParent) {

  if(emplacementParent!=null&&emplacementParent.emplacementId!=null&&emplacementParent.emplacementId!="")
    {
        console.log("getEntrepotEmplacements====>",emplacementParent) 

      let list=[]
    list=Utils.filterArrayByFieldNameAndValue(emplacements,"emplacementParentId",emplacementParent.emplacementId)
    if(emplacementParent!=null&& emplacementParent.emplacementId!=null)
      list.push(emplacementParent)

    setEntrePotEmplacements(list);
  }
}

async function retrieveEmplacements (act){

  
    let resp=null;
    let query="?"
    
      query+="actif=true"
      resp= await EmplacementsDataService.findAsync(query); 
       
    if(resp!=null && resp.status=="200" )          
        {
          
           let ListEmplacementWithLibelleChemin=getemplacementWithlibelleChemin(resp.data)
          ListEmplacementWithLibelleChemin=Utils.trierListeParChamp(ListEmplacementWithLibelleChemin,"libelleChemin",true)
          setEmplacements(ListEmplacementWithLibelleChemin);

          console.log("ListEmplacementWithLibelleChemin==>",ListEmplacementWithLibelleChemin)
        }else 
         setEmplacements([])
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

function getemplacementWithlibelleChemin  (empls) {

let list=[]
  for( const catP of empls)
      {
        let obj={...catP}
        let libelleChemin=obj.libelle
        let lienChemin=obj.emplacementId
        let parentId=obj.emplacementParentId
        while(parentId!=null &&parentId!="")
        {
          let emplParent=Utils.trouverObjetDansListObject(empls,"emplacementId",parentId)
          if(emplParent!=null)
          {
           
            libelleChemin=emplParent.libelle+"/"+libelleChemin
            lienChemin=emplParent.emplacementId+"/"+lienChemin
            parentId=emplParent.emplacementParentId
          }else
           parentId=null
        }
        
        obj.libelleChemin=libelleChemin
        obj.lienChemin=lienChemin

        list.push(obj)

      }
      return list
}


function isValidLot  (obj) {
   let err={...initialLotState};
   setErrors({...initialActeState})
    let valid=true;
   if( obj.numeroLot==null || obj.numeroLot==null ||obj.numeroLot=="") 
       {
         err.professionnelDeSanteSpecialiteId="Indiquer le numero de serie";
         valid=false;
     } 


    if( obj.qte==null ||!utils.isPositiveFloat( obj.qte.length)) 
       {
         err.qte="qte incorrecte";
         valid=false;
     } 

    if(valid==true)
      { 
           let list=lots.map(elt => ({...elt}));
           list.push(obj)
           setLots(list)
            let elt={...obj}
            elt.qte="";
           elt.numeroLot=""
            setLot(elt)
        }
    setErrorsLot(err);
    return valid;
}
function setToDeleteLot  (index) {

   let list=lots.map(elt => ({...elt}));
   if(list[index].fournisseurId!=null && list[index].fournisseurId!="")
    list[index].delete=true  
  else
   list.splice(index, 1);
   setLots(list)
        
}




//const reload=()=>window.location.reload();
/******************************************/
async function saveEntrepotProduit (entrepotProduit)  {
 const obj = {...entrepotProduit};
  obj.userId=globalObject?.user?.id

if(perform.action=="POST")
{
obj.entrepot=entrepot
obj.entrepotId=entrepot?.entrepotId
}
if(obj.emplacementId==null||obj.emplacementId=="")
    {
      obj.emplacement=null
      obj.emplacementId=null
    }

  if(obj?.uniteAchat==obj?.uniteDeMesure)
    obj.ratioUniteAchatUniteDeMesure=1

  console.log("saveEntrepotProduit=========>",obj)
  //    console.log("personnels=========>",personnels)
   var perf=perform;
     if(isValid(obj))
     {     

      if(obj.qteMin==null|| obj.qteMin=="" )
        {
               obj.qteMin=0;
          }
        if(obj.qteOpt==null|| obj.qteOpt=="" )
             {
               obj.qteOpt=0;
           }
       if(obj.qteMax==null|| obj.qteMax=="" )
          {
               obj.qteMax=0;
           }
            if(obj.qte==null|| obj.qte=="" )
          {
               obj.qte=0;
           }


          let response=null;
         
          if(obj.entrepotProduitId!=null && obj.entrepotProduitId!="")
            response= await EntrepotProduitsDataService.updateAsync(obj.entrepotProduitId,obj);
          else
            response= await EntrepotProduitsDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              //setEntrepotProduit(response.data);             
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
  };


  async function handleStatus(obj) {
    obj.userId=globalObject?.user?.id
  if(obj.actif==true)
  {
      obj.actif=false;
   }else 
       obj.actif=true;
  
      let perf=perform;
    let response=await EntrepotProduitsDataService.updateAsync(obj.entrepotProduitId,obj);
    if(response!=null && response.status=="200")
      {
          setEntrepotProduit(response.data);             
           
          retrieveEntrepotProduits(entrepot?.entrepotId);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrieveEntrepotProduits (entrepotId){


if ($.fn.dataTable.isDataTable('#tListOfEntrepotProduit')) {
        $('#tListOfEntrepotProduit').DataTable().destroy();
       
    }
    let resp=null;
    
      let query="?"
    if(entrepotId!=null && entrepotId!="")
      query+="entrepotId="+entrepotId
      resp= await EntrepotProduitsDataService.findAsync(query);  
    
       
    if(resp!=null && resp.status=="200" )          
        {
          setEntrepotProduits(resp.data);
         if(perform.action=="GET_IN_OUT"&&entrepotProduit.entrepotProduitId!=null)
         {
          let entrepotP=Utils.trouverObjetDansListObject(resp.data,"entrepotProduitId",entrepotProduit.entrepotProduitId)
          setEntrepotProduit({...entrepotP})
          setGuid(Utils.uuidv4())
          console.log("setEntrepotProduit",entrepotP)
         }
          
        }else 
         setEntrepotProduits([])

setTimeout(()=>{ 
    //$('#tListOfEntrepotProduit').DataTable().destroy();                       
    $('#tListOfEntrepotProduit').DataTable(

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



function isValid  (obj) {
 
    let err=initialEntrepotProduitState;
    let valid=true;
        console.log(obj); 

    if( obj.entrepot==null || obj.entrepot.entrepotId==null || obj.entrepot.entrepotId.length<2) 
       {
         err.entrepotId="Entrepot incorrecte";
         valid=false;
     }
    if( obj.produit==null || obj.produit.produitId==null || obj.produit.produitId.length<2) 
       {
         err.produitId="Sélectionner un produit";
         valid=false;
     } 

  if(obj.qteMin!=null&& obj.qteMin!="" &&!Utils.isPositiveFloat(obj.qteMin))
       {
         err.qteMin="Quantité Min incorrecte ";
          valid=false;
     }
  if(obj.qteOpt!=null&& obj.qteOpt!="" &&!Utils.isPositiveFloat(obj.qteOpt))
       {
         err.qteOpt="Quantité Max incorrecte ";
          valid=false;
     }
    if(obj.qteMax!=null&& obj.qteMax!="" &&!Utils.isPositiveFloat(obj.qteMax))
       {
         err.qteMax="Quantité optimale incorrecte ";
          valid=false;
     }

    if(valid==true&& Number(obj.qteMin)>Number(obj.qteMax)) 
       {
         
          err.qteMin="Qté min doit être inférieur à la qté max ";
          err.qteMax="Qté min doit être inférieur à la qté max ";
          valid=false;
       
      }
        if(valid==true&&Number(obj.qteMin)>Number(obj.qteOpt))
         {
          err.qteMin="Qté min doit être inférieur à la qté optimale ";
          err.qteOpt="Qté min doit être inférieur à la qté optimale ";
          valid=false;
        }
      
     
        if(valid==true&&Number(obj.qteMax)< Number(obj.qteOpt))
         {
          err.qteMax="Qté max doit être supérieure à la qté optimale";
          err.qteOpt="Qté max doit être supérieure à la qté optimale";
          valid=false;
        
      }
      if(obj.priorite==null || obj.priorite.length<2) 
         {
          err.priorite="indiquer la stratégie de sortie du produit";
          valid=false;
     }
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.actif="indiquer le statut actif oui ou non ";
          valid=false;
     }
 
 if(valid==true&&obj.reapprovisionnementAuto==true&&(obj.qteMin==""||obj.qteOpt==""||obj.qteMax=="")) 
     {
          err.qteMax="Complété les qté Min, Optimale et Max ";
          valid=false;
     }
     console.log(err);
  setErrors(err);
    return valid;

  };


const performAction = (entrepotProduit,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshEntrepotProduit();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
    
  }else
  {
    perf=perform;
    handleClose();
    setEntrepotProduit(entrepotProduit);      
    setErrors(initialEntrepotProduitState);
    //setEntrepot(entrepotProduit?.entrepot)
    if(action=="GET_IN_OUT"||action=="GET_HISTO")
      {
        setGuid(Utils.uuidv4())     
      }else
        handleShowEntrepotProduit(); 
    perf.action=action;
    setPerform(perf);
    }
if(action=="POST"||action=="PUT")
 {
   if(produits.length==0)
    retrieveProduits();
  if(personnels.length==0)
    retrievePersonnels();
  if(emplacements.length==0)
    retrieveEmplacements();
    

}
 if(action=="PUT"||action=="GET_IN_OUT")
  getEntrepotEmplacements(entrepotProduit?.entrepot?.emplacement) 
                                      
    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShowEntrepotProduit(false);
  setShowEntrepotProduit(true);
}




$(document).ready( function () {

$('#tListOfEntrepotProduit').on('click', 'tr', function () {
  var table = $('#tListOfEntrepotProduit').DataTable();
   var data = table.row( this ).data();
   // below some operations with the data
   // How can I set the row color as red?
  $(this).addClass('highlight').siblings().removeClass('highlight');
});

$('#tListOfEntrepotProduit').on('draw.dt', function () {
  $(this).find('.highlight').removeClass('highlight');
});

} );
const renderListOfEntrepotProduit=() =>{
return (

      <div className="table-responsive">         
      <table id="tListOfEntrepotProduit"  className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>
              {entrepot==null &&<th >Entrepot</th>}
                <th>Produit</th>             
                <th style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>Qté réél</th>
                <th style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>Qté réservé</th>
                <th style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>Qté disponible</th>
                <th style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>Qté Min</th>
                <th style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>Qté optimale</th>
                <th style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>Qté Max</th>
                <th style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>Emplacement</th>
                {/*<th style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>Actif</th>*/}
                               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {entrepotProduits &&
            entrepotProduits.map((entrepotProduit, index) => (
                <tr key={index}> 
                 <td>{entrepotProduit.dateModif}</td> 
                 {entrepot==null&& <td>{entrepotProduit?.entrepot?.libelle}</td>}
                 <td>{entrepotProduit?.produit?.libelle}</td>
                  <td style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>{entrepotProduit?.qte}</td>
                  <td style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>{entrepotProduit?.qteReserve}</td>       
                  <td style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>{
                    Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)<Number(entrepotProduit.qteMin)  ?(
                    <span class="badge rounded-pill bg-danger">{Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)}</span>):
                    Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)<Number(entrepotProduit.qteOpt)  ?(
                    <span class="badge rounded-pill bg-warning text-dark">{Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)}</span>):
                     <span class="badge rounded-pill bg-success">{Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)}</span>
                    }
                   </td>            
                    <td style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>{entrepotProduit.qteMin}</td>
                    <td style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>{entrepotProduit.qteOpt}</td>
                   <td style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>{entrepotProduit.qteMax}</td>            
                    <td style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepotProduit.emplacementId)?.libelleChemin}</td>                    
                  {/*<td style={{"display": perform.action=="GET_IN_OUT"?"none":""}}>{entrepotProduit.actif==true?"Oui":"Non"}</td> */}
                 
                  
                  <td>
                    <div className="btn-group">
                      <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(entrepotProduit, "GET")}><i className="fa fa-eye"></i> </Button>
                     {permission?.action?.includes("U")&&
                     <Button  variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(entrepotProduit, "PUT")}>
                     <i className="fa fa-edit fa-sm"></i>
                     </Button>
                     }  
                    {permission?.action?.includes("U")&&(entrepotProduit.actif==false ? <Button  variant="secondary" className="btn-sm" 
                              title="Activer" onClick={() => handleStatus(entrepotProduit)}>
                           <i className="fa fa-toggle-off"></i>
                    </Button>:
                     <Button  variant="secondary" className="btn-sm" 
                             title="Déactiver" onClick={() => handleStatus(entrepotProduit)}>
                            <i className="fa fa-toggle-on"></i>
                    </Button>)}   
                      {permissionInOut!=null&&
                      <Button variant="primary" className="btn-sm" 
                             title="Entrée/sortie de stock" onClick={() => performAction(entrepotProduit, "GET_IN_OUT")}>
                     <FontAwesomeIcon icon={['fas', 'exchange-alt']} />
                     </Button>}
                     {permissionInOut!=null&&
                      <Button variant="secondary" className="btn-sm" 
                             title="Historique des mouvements de stock" onClick={() => performAction(entrepotProduit, "GET_HISTO")}>
                     <FontAwesomeIcon icon={['fas', 'fa-undo']} />
                     </Button>}
                     </div>

                   {/*   <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => performAction(entrepotProduit, "GET")}/> 
                      <img src="/img/write.png" title="Modifier"  alt="Modifier" className="icone-action"
                      onClick={() => performAction(entrepotProduit,"PUT")}/>
                       {(entrepotProduit.actif==true)?(
                        <img src="/img/on.png" title="Déactiver"  alt="cliquer pour déactiver" className="icone-action-25"
                       onClick={() => handleStatus(entrepotProduit)}/>
                        ):(
                        <img src="/img/off.png" title="Activer"  alt="cliquer pour activer" className="icone-action-25"
                       onClick={() => handleStatus(entrepotProduit)}/>
                        )
                    }
                       <img src="/img/productInOut.png" title="Entrée/sortie de stock"  alt="Entrée sortie" className="icone-action"
                      onClick={() => performAction(entrepotProduit,"GET_IN_OUT")}/>*/}
                   </td>              
                </tr>

          ))}          
          </tbody>          
        </table> 

</div>
  )}
const renderShowEntrepotProduit =()=> {
return (
   <div className="row">
                <div className="col-md">       
                 
                   
                   <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="table-active">Entrepot</th><td>{entrepotProduit?.entrepot?.libelle}</td></tr>
                    <tr><th className="table-active">Produit</th><td>{entrepotProduit?.produit?.libelle}</td></tr>
                    <tr><th className="table-active">Catégorie de produit</th><td>{entrepotProduit?.produit?.categorieProduit?.libelle}</td></tr>
                    <tr><th className="table-active">Qté disponible</th><td>
                    {
                    Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)<Number(entrepotProduit.qteMin)  ?(
                    <span class="badge rounded-pill bg-danger">{Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)}</span>):
                    Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)<Number(entrepotProduit.qteOpt)  ?(
                    <span class="badge rounded-pill bg-warning text-dark">{Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)}</span>):
                     <span class="badge rounded-pill bg-success">{Number(entrepotProduit.qte)-Number(entrepotProduit.qteReserve)}</span>
                    }
                    </td></tr>
                    <tr><th className="table-active">Qté Min</th><td>{entrepotProduit.qteMin}</td></tr>
                    <tr><th className="table-active">Qté optimale</th><td>{entrepotProduit.qteOpt}</td></tr>
                    <tr><th className="table-active">Qté Max</th><td>{entrepotProduit.qteMax}</td></tr>
                    <tr><th className="table-active">Unité de mesure</th><td>{entrepotProduit.uniteDeMesure}</td></tr>
                    <tr><th className="table-active">Unité d'achat</th><td>{entrepotProduit.uniteAchat}</td></tr>
                    {entrepotProduit?.ratioUniteAchatUniteDeMesure!=null &&entrepotProduit?.ratioUniteAchatUniteDeMesure!=0&&<tr><th className="table-active">Ratio unité d'achat/unité de mesure</th><td>1 {entrepotProduit?.uniteAchat} acheté équivaut à {entrepotProduit?.ratioUniteAchatUniteDeMesure} {entrepotProduit?.uniteDeMesure} en stock</td></tr>}
                    <tr><th className="table-active">Emplacement</th><td>{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepotProduit.emplacementId)?.libelleChemin}</td></tr>
                    <tr><th className="table-active">Prix à l'achat conseillé</th><td>{entrepotProduit.prixAchat} {globalObject?.entreprise.config?.deviseMonetaire}</td></tr>
                    <tr><th className="table-active">Prix à la vente conseillé</th><td>{entrepotProduit.prixVente} {globalObject?.entreprise.config?.deviseMonetaire}</td></tr>
                   <tr><th className="table-active">Réapprovisionnement</th><td>{entrepotProduit.reapprovisionnementAuto==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">Stratégie de sortie </th><td>{entrepotProduit.priorite}</td></tr>
                     <tr><th className="table-active">Demande de sortie de produit</th><td>{entrepotProduit?.accepteDemandeSortieProduit==true? "Accepte les demandes":"N'accepte pas les demandes"}</td></tr>
                    {(entrepotProduit?.accepteDemandeSortieProduit=="true"||entrepotProduit?.accepteDemandeSortieProduit==true)&&<tr><th className="table-active">Modalité de facturation pour les actes</th>
                    <td>{entrepotProduit?.modaliteFacturationActe==0? "Facturer quelque soit l'acte":entrepotProduit?.modaliteFacturationActe==-1? "Non facturé quelque soit l'acte":entrepotProduit?.modaliteFacturationActe==1?"Facturé selon la politique de facturation de l'acte":"Inconnu"}</td></tr>}

                    <tr><th className="table-active">Remarque</th><td>{entrepotProduit.remarque}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{entrepotProduit.actif==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">User</th><td>{entrepotProduit.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{entrepotProduit.dateModif}</td></tr>                              
                                 
                </tbody>
              </table>
                                 
                                                                                    
                           
                </div>
              </div>
  )}



const renderFormEntrepot=() =>{
return (
 <div className="row">
                <div className="col-md-4">   
                  <div className="form-group " >     
                    <Select
                       defaultValue={entrepot!=null&&entrepot.entrepotId!=null?entrepot:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.entrepotId}
                       isClearable={true}
                       onChange={(newValue) => { 
                               setEntrepot(newValue);
                               retrieveEntrepotProduits(newValue?.entrepotId);
                               getEntrepotEmplacements(newValue?.emplacement)
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={entrepots}
                        placeholder={`Entrepot`}
                        className={`form-control-sm px-0 ${errors?.entrepot.entrepotId!=null && errors?.entrepot.entrepotId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.entrepot?.entrepotId}</div>
                    </div>
                </div>
                {entrepot!=null&&(
                 <div className="col-md-3">       
                 
                   
                   <table className={Styles.styledTable}>
                     <thead>
            <tr>
              <th className="table-active" colSpan="4"></th>          
            </tr>
          </thead>
                <tbody>
                    <tr><th className="table-active">Code entrepot</th><td>{entrepot?.codeEntrepot}</td></tr>
                    <tr><th className="table-active">Libelle</th><td>{entrepot?.libelle}</td></tr>
                    <tr><th className="table-active">Gestionnaires</th><td>{entrepot?.gestionnaires!=null &&Utils.getAttributeValues(entrepot?.gestionnaires, "value")?.join(", ")} </td></tr>
                    <tr><th className="table-active">Emplacement</th><td>{entrepot?.emplacementId!=null&&Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepot?.emplacementId)?.libelleChemin}</td></tr>
                           
                                 
                </tbody>
              </table>
                         
                </div>)}
      </div>

)}

const renderFormEntrepotProduit=() =>{
return (
   <div className="row">
         <div className="col-md">   
         {perform.action=="PUT"&&(
                <div className="form-group">             
            <table className={Styles.styledTable}>
                <thead>
                <tr>
                 <th className="fw-bolder" colSpan="4"><b>Produit référencé dans le stock</b></th>          
               </tr>
          </thead>
                <tbody>
                    <tr><th className="table-active">Entrepot</th><td>{entrepotProduit?.entrepot?.libelle}</td></tr>
                    <tr><th className="table-active">Emplacement de l'entrepot</th><td>{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepotProduit?.entrepot?.emplacementId)?.libelleChemin}</td></tr>
                    <tr><th className="table-active">Produit</th><td>{entrepotProduit?.produit?.libelle}</td></tr>
                                                     
                </tbody>
              </table>
                    </div>

                    )}
        {perform.action=="POST"&&(                        
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="entrepot"
                        required
                        value={entrepot?.libelle}                        
                        name="entrepot"
                        placeholder="Entrepot"
                        maxLength="100"
                        disabled ={true}
                        className={`form-control form-control-sm ${errors.entrepotId.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.entrepotId}</div>
                    </div>)}
        {perform.action=="POST"&&( 
                  <div className="form-group" >     
                    <Select
                        
                       defaultValue={entrepotProduit.produit!=null&&entrepotProduit.produit.produitId!=null?entrepotProduit.produit:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.produitId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...entrepotProduit}                                             
                              if(newValue!=null)                           
                               {
                                obj.produitId=newValue.produitId
                                obj.produit=newValue;                                 
                               } 
                                else
                             {
                                    obj.produitId=initialEntrepotProduitState.produitId 
                                    obj.produit=initialEntrepotProduitState.produit
                                }   
                              setEntrepotProduit(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={produits}
                        placeholder={`Produit`}
                        className={`form-control-sm px-0 ${errors?.produitId!=null && errors?.produitId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.produitId}</div>
                    </div>)}
                  <div className="form-group custom-control-inline form-inline">     

                     Qté Min <input
                      type="text"                     
                        id="qteMin"
                        required
                        value={entrepotProduit.qteMin}
                        onChange={handleEntrepotProduitChange}
                        name="qteMin"
                        placeholder='Qte Minimale'
                        maxLength="7"
                        className={`form-control form-control-sm d-inline-block ${errors.qteMin.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.qteMin}</div>
                    </div>
                    <div className="form-group custom-control-inline form-inline">             
                      Qté optimale <input
                      type="text"                     
                        id="qteOpt"
                        required
                        value={entrepotProduit.qteOpt}
                        onChange={handleEntrepotProduitChange}
                        name="qteOpt"
                        placeholder='Qte optimale/de sécurité'
                        maxLength="7"
                        className={`form-control form-control-sm d-inline-block ${errors.qteOpt.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.qteOpt}</div>
                    </div> 
                    <div className="form-group custom-control-inline form-inline">             
                      Qté Max <input
                      type="text"                     
                        id="qteMax"
                        required
                        value={entrepotProduit.qteMax}
                        onChange={handleEntrepotProduitChange}
                        name="qteMax"
                        placeholder='Qte Maximale'
                        maxLength="7"
                        className={`form-control form-control-sm d-inline-block ${errors.qteMax.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.qteMax}</div>
                    </div>
                    <div className="form-group custom-control-inline form-inline" >  
                   Unité d'achat <CreatableSelect
                        isClearable
                        
                        value={entrepotProduit.uniteAchat!=null&&entrepotProduit.uniteAchat!=""? {"value":entrepotProduit.uniteAchat, "label":entrepotProduit.uniteAchat}:""}                   
                       onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null&&obj.value!="")
                             {
                                 if(obj.modeleId==null)
                                 {
                                 Utils.addModele("Unite",obj.value,"")
                                 obj.modeleId=Utils.uuidv4()
                                 uniteDeMesures.push(obj)
                                  }
                           
                            setEntrepotProduit({ ...entrepotProduit, "uniteAchat": obj.value });
                            }
                          }}
                      
                        options={uniteDeMesures}
                         placeholder={`Unité d'achat`}
                        name="uniteAchat"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                        className={`form-control-sm d-inline-block px-0 ${errors?.uniteAchat!=null && errors?.uniteAchat.length>0 ? 'is-invalid' : ''}`}  
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
                    </div>
                      <div className="form-group custom-control-inline form-inline" >  
                    Unité de mesure <CreatableSelect
                        isClearable
                        
                        value={entrepotProduit.uniteDeMesure!=null&&entrepotProduit.uniteDeMesure!=""? {"value":entrepotProduit.uniteDeMesure, "label":entrepotProduit.uniteDeMesure}:""}                   
                       onChange={(obj: any, actionMeta: any) => {
                             if(obj!=null&&obj.value!="")
                             {
                                 if(obj.modeleId==null)
                                 {
                                 Utils.addModele("Unite",obj.value,"")
                                 obj.modeleId=Utils.uuidv4()
                                 uniteDeMesures.push(obj)
                                  }
                           
                            setEntrepotProduit({ ...entrepotProduit, "uniteDeMesure": obj.value });
                            }
                          }}
                      
                        options={uniteDeMesures}
                         placeholder={`Unité de mesure`}
                        name="uniteDeMesure"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                        className={`form-control-sm d-inline-block px-0 ${errors?.uniteDeMesure!=null && errors?.uniteDeMesure.length>0 ? 'is-invalid' : ''}`}  
                         menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.uniteDeMesure}</div>
                    </div>
                    
               
                   
                  
                  {entrepotProduit?.uniteAchat!=entrepotProduit?.uniteDeMesure&&
                  <div className="form-group custom-control-inline form-inline">  <div class="alert alert-info p-0" role="alert">           
                     Ratio unité d'achat sur l'unité de mesure 
                     <br/>1 <b>{entrepotProduit?.uniteAchat}</b> égale à/contient <input
                        type="text"                       
                        id="ratioUniteAchatUniteDeMesure"
                        required
                        value={entrepotProduit.ratioUniteAchatUniteDeMesure!=0?entrepotProduit.ratioUniteAchatUniteDeMesure:""}
                        onChange={handleEntrepotProduitChange}
                        name="ratioUniteAchatUniteDeMesure"
                        placeholder="combien de?"
                        maxLength="6"
                        className={`form-control form-control-sm d-inline-block ${errors.ratioUniteAchatUniteDeMesure.length>0 ? 'is-invalid' : ''}`}
                      /> <b>{entrepotProduit?.uniteDeMesure}</b>

                       <div className="invalid-feedback">{errors.ratioUniteAchatUniteDeMesure}</div>
                         </div>

                    </div>} 
                    <div className="form-group custom-control-inline form-inline">             
                      Prix à l'achat <input
                      type="text"                     
                        id="prixAchat"
                        required
                        value={entrepotProduit.prixAchat}
                        onChange={handleEntrepotProduitChange}
                        name="prixAchat"
                        placeholder="Prix à l'achat"
                        maxLength="7"
                        className={`form-control form-control-sm d-inline-block ${errors.prixAchat.length>0 ? 'is-invalid' : ''}`}
                      />{globalObject?.entreprise.config?.deviseMonetaire}
                       <div className="invalid-feedback">{errors.prixAchat}</div>
                    </div>
                  <div className="form-group custom-control-inline form-inline">             
                      Prix à la vente <input
                      type="text"                     
                        id="prixVente"
                        required
                        value={entrepotProduit.prixVente}
                        onChange={handleEntrepotProduitChange}
                        name="prixVente"
                        placeholder='Prix à la vente'
                        maxLength="7"
                        className={`form-control form-control-sm d-inline-block ${errors.prixVente.length>0 ? 'is-invalid' : ''}`}
                      />{globalObject?.entreprise.config?.deviseMonetaire}
                       <div className="invalid-feedback">{errors.prixVente}</div>
                    </div> 
                   <div className="form-group custom-control-inline form-inline" >     
                   Emplacement <Select
                        
                       defaultValue={entrepotProduit.emplacement!=null&&entrepotProduit.emplacement.emplacementId!=null?entrepotProduit.emplacement:""}
                       getOptionLabel={e => Utils.trouverObjetDansListObject(emplacements,"emplacementId",e.emplacementId)?.libelleChemin}
                        getOptionValue={e => e.emplacementId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...entrepotProduit}                                             
                              if(newValue!=null)                           
                               {
                                obj.emplacementId=newValue.emplacementId
                                obj.emplacement=newValue;                                 
                               } 
                                else
                             {      
                                    obj.emplacementId=initialEntrepotProduitState.emplacementId 
                                    obj.emplacement=initialEntrepotProduitState.emplacement
                                }   
                              setEntrepotProduit(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={entrePotEmplacements}
                        placeholder={`Emplacement`}
                        className={`form-control-sm px-0 d-inline-block ${errors?.emplacementId!=null && errors?.emplacementId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.emplacementId}</div>
                    </div>
                   <div className="form-group">  
                     <select id="priorite" name="priorite" onChange={handleEntrepotProduitChange} value={entrepotProduit.priorite}  className={`form-select form-select-sm ${errors.priorite.length>0 ? 'is-invalid' : ''}`}>
                      <option  value="">Stratégie de sortie</option>
                      <option value="FIFO">FIFO</option>
                      <option value="LIFO">LIFO</option> 
                      <option value="DLC">DLC(Date limite de consomation)</option>                    
                   </select>
                     <div className="invalid-feedback">{errors.priorite}</div>
                    </div>
                    <div className="custom-control custom-checkbox custom-control-inline form-inline ">
                      <input type="checkbox" 
                      className="custom-control-input d-inline-block"
                       id="reapprovisionnementAuto"  
                       defaultChecked={entrepotProduit.reapprovisionnementAuto}  
                      onClick={(event) => {
                                      let obj={ ...entrepotProduit}
                                      let value= event.target.checked;
                                      obj.reapprovisionnementAuto=value;                                                              
                                      setEntrepotProduit(obj)                                      
                                     }}
                        />
                      <label className="custom-control-label d-inline-block" htmlFor="reapprovisionnementAuto">Réapprovisionnement auto</label>
                    </div> 

                     <div className="form-group">     
                    <select id="accepteDemandeSortieProduit" name="accepteDemandeSortieProduit" onChange={handleEntrepotProduitChange} 
                    value={entrepotProduit.accepteDemandeSortieProduit}  
                    className={`form-select form-select-sm ${errors.accepteDemandeSortieProduit.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Demande de sortie de produit</option>
                      <option value={true}>Accepte les demandes</option>
                      <option value={false}>N'accepte pas les demandes</option>
                      
                   </select>
                      <div className="invalid-feedback">{errors.accepteDemandeSortieProduit}</div>
                    </div>
                    {(entrepotProduit?.accepteDemandeSortieProduit=="true"||entrepotProduit?.accepteDemandeSortieProduit==true)&&(
                   <div className="form-group"> <div className="alert alert-info" role="alert">    
                    <select id="modaliteFacturationActe" name="modaliteFacturationActe" onChange={handleEntrepotProduitChange} value={entrepotProduit.modaliteFacturationActe}  
                    className={`form-select form-select-sm ${errors.modaliteFacturationActe.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Facturation au niveau de l'acte  ?</option>
                      <option value={-1}>Ne jamais facturer</option>
                      <option value={0}>Facturer systématiquement</option>
                       <option value={1}>Facturé selon politique de l'acte</option>
                   </select>

                      <div className="invalid-feedback">{errors.modaliteFacturationActe}</div>
                      NB:La stratégie de facturation défini sur le produit est prioritaire sur celle définie au niveau de l'acte </div>
                    </div>)}
                      



                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleEntrepotProduitChange} value={entrepotProduit.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.actif}</div>
                    </div>
                    
                     <div className="form-group">             
                      <textarea
                        type="text"
                        className="form-control"
                        id="remarque"
                        required
                        value={entrepotProduit.remarque}
                        onChange={handleEntrepotProduitChange}
                        name="remarque"
                        maxLength="250"
                        placeholder="Remarque"
                      />
                    </div>
                </div> 

  </div>
  )}

return (
<div className="container" > 
  
      
  <header className="jumbotron">
       <h3 className={Styles.HeaderL1} >Stocks de produits</h3>
       

<div className="container-body">     
{/************************************Modal for add entrepotProduit*******************************/}

{renderFormEntrepot()}
<p>&nbsp;</p>
 <div className="row">
        <div className={`${(perform.action=="GET_IN_OUT")? 'col-md-7' :(perform.action=="GET_HISTO"? 'col-md-8': 'col-md')}`}>  
<div className="submit-form">
    
    <div className="text-right">    
       <div className="custom-control custom-checkbox custom-control-inline">
      {/*  <input type="checkbox" className="custom-control-input" id="afficherTousEntrepotProduit" defaultChecked={actifEntrepotProduit}  
        onChange={handleActifentrepotProduitChange}/>
        <label className="custom-control-label" htmlFor="afficherTousEntrepotProduit">Afficher Tous</label>
    
       <img src="/img/refresh1.png" title="Rafraichir"  alt="Rafraichir" className="iconeRefresh"
                      onClick={() => retrieveEntrepotProduits()}/>
      {entrepot!=null&&<img src="/img/save.png" title="Ajouter un produit dans l'entrepot"  alt="jouter un produit dans l'entrepot" className="iconeButtonCarre"
                      onClick={() => performAction(entrepotProduit,"POST")}/> } 
      </div>
  */}

      {/*actifEntrepotProduit==false? <Button  variant="light" className="btn-sm" 
                  title="Afficher tous" onClick={() => setActifAchat(!actifEntrepotProduit)}>
                <i className="fa fa-toggle-off"></i>
        </Button>:
         <Button  variant="light" className="btn-sm" 
                 title="Ne pas afficher les déactivés" onClick={() => setActifAchat(!actifEntrepotProduit)}>
                <i className="fa fa-toggle-on"></i>
        </Button>*/}
        <Button  variant="info" className="btn-sm" 
                      title="Rafraichir" onClick={() => retrieveEntrepotProduits()}>
                <i className="fa fa-refresh"></i>
          </Button>
      
     {permission?.action?.includes("C") && entrepot!=null&& <Button  variant="success" className="btn-sm" 
                      title="Référencer un produit dans l'entrepot" onClick={() => performAction(entrepotProduit, "POST")}>
                <FontAwesomeIcon icon={['fas', 'box']} />
          </Button>  
        } 
        </div>
    </div>
      <Modal  centered show={showEntrepotProduit} onHide={()=>handleClose} animation={false} dialogClassName='modal-40vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Référencer un produit"): 
          (perform.action=="GET")?("Détail sur le produit"):
          (perform.action=="PUT")?("Modifier le produit" ):
          (perform.action=="DELETE")?("Supprimer le produit" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormEntrepotProduit()

           ):(perform.action=="GET" || perform.action=="DELETE")?(

             renderShowEntrepotProduit()

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(entrepotProduit.entrepotProduitId!=null && perform.action=="GET"&&permission?.action?.includes("U") )?
          <Button variant="warning" onClick={() => performAction(entrepotProduit,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveEntrepotProduit(entrepotProduit)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveEntrepotProduit(entrepotProduit)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteEntrepotProduit(entrepotProduit)}>
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
      
           {renderListOfEntrepotProduit()}
         </div>

  {perform.action=="GET_IN_OUT"&&(
    <div className="col-md-5">  
        <section className="accordion">
              <input type="radio" name="collapse" id="inOut" defaultChecked/>
              <h2 className="handle">
                <label htmlFor="inOut">Entrée/Sortie de stock</label>
              </h2>
              <div className="content">
              <Lots key={guid}  entrepotProduit={entrepotProduit} entrepots={entrepots} emplacements={emplacements} updateEntrepotProduit={handleToUpdateEntrepotProduit}/> 
          </div>
          </section>     
       </div>   )}
    {perform.action=="GET_HISTO"&&(
    <div className="col-md-4">  
        <section className="accordion">
              <input type="radio" name="collapse" id="histo" defaultChecked/>
              <h2 className="handle">
                <label htmlFor="histo">Historique des mouvements</label>
              </h2>
              <div className="content">
              <MouvementStocks key={guid}  entrepotProduit={entrepotProduit}  /> 
          </div>
          </section>     
       </div>   )}


     </div>
     </div>
     </header>
</div>
  );
};

export default EntrepotProduits;