import React, {useState, useEffect, useCallback } from "react";
import AchatsDataService from "../../services/stock/achats.service";
import EntrepotsDataService from "../../services/stock/entrepots.service";
import FournisseursDataService from "../../services/stock/fournisseurs.service";
import PersonnelDataService from "../../services/personnels.service";
import EmplacementsDataService from "../../services/stock/emplacements.service";
import AchatProduits from "../../components/gestionStock/achatProduits.component";
import FournisssDataService from "../../services/stock/fournisseurs.service";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import Styles from '../../styles.module.css';
import Select from 'react-select';
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
import { TextField } from '@mui/material';

/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 /* eslint-disable */
const Achats = () => {


const initialAchatProduitState = 
    { 
       
        "achatProduitId": "",
        "fournisseurId": "",
        "entrepotId": "",
        "fournisseurId": "", 
        "numeroAchatProduit": {},
        "qte": "", 
        "dateReception": "", 
               
    }
/*Create achat code*/
const initialAchatState = 
    { 
       
        "achatId": "",
        "fournisseur": {},
        "fournisseurId": "", 
        "entrepot": {},  
        "entrepotId": "", 
        "numeroCommande":"",    
        //"qte": "",  
        "deviseMonetaire": "",
        "numeroExterne": "",
        /*"qteOpt": "",
        "priorite": "",
        "reapprovisionnementAuto":false,
        "emplacement": {},
        "emplacementId": "",*/
        "remarque": "",
        "actif": true,
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [achat, setAchat] = useState(initialAchatState);
const [achats, setAchats] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialAchatState);
const [showAchat, setShowAchat] = useState(false);
const [entrepots, setEntrepots] = useState([]);
const [entrepot, setEntrepot] = useState(null);
const [personnels, setPersonnels] = useState([]);
const [fournisseurs, setFournisseurs] = useState([]);
const [emplacements, setEmplacements] = useState([]);

const [entrepotEmplacements, setEntrepotEmplacements] = useState([]);

const [achatProduit, setAchatProduit] = useState(initialAchatProduitState);
const [errorAchatProduit, setErrorAchatProduit] = useState(initialAchatProduitState);
const [achatProduits, setAchatProduits] = useState([]);
const [guid, setGuid] = useState(Utils.uuidv4());
const [actifAchat, setActifAchat] = useState(true);

 const permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/COMMANDE");
 const permissionAchatProduit=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","STOCK/COMMANDE_PRODUIT");

useEffect(() => {
    retrieveEntrepots();
    retrieveAchats();
    //retrievePersonnels();
    //setAchat(achat); 
    retrieveEmplacements()
  }, []);

const handleClose = () => {
  setShowAchat(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShowAchat(false);
refreshAchat()
retrieveAchats(entrepot?.entrepotId);
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Achat", perf.msg);                         
handleCloseAndReload()
}

const handleActifachatChange = (event) => {
  //let act=event.target.checked;
  setActifAchat(!actifAchat);
  retrieveAchats(entrepot?.entrepotId);
}

const handleShowAchat = () => setShowAchat(true);

//const today=new Date();
const handleAchatChange = event => {
  const { name, value } = event.target;
  setAchat({ ...achat, [name]: value });
};

  const refreshList = () => {
    retrieveAchats(entrepot?.entrepotId);
  };

const refreshAchat = () => {
    setAchat(initialAchatState);
     setErrors(initialAchatState);
     setPerform(initialPerformState);
     
  };


async function handleToUpdateAchat  (obj) 
{
  if(obj.achatId!=null)
  {
    retrieveAchats()
    
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
            retrieveAchats(resp.data[0].entrepotId);
            getEntrepotEmplacements(resp.data[0]?.emplacement)
          }*/

        }else
     setEntrepots([])

    //setShowAchatPatientsLoading(false)
}
async function retrieveFournisseurs (){

  
    let resp=null;
    let query="?"
    
      query+="actif=true"
      resp= await FournisseursDataService.findAsync(query); 
          
   
    if(resp!=null && resp.status=="200" )          
        {
          setFournisseurs(resp.data);
          console.log('retrieveFournisseurs',resp.data)
        }else
     setFournisseurs([])

    //setShowAchatPatientsLoading(false)
}

function getEntrepotEmplacements  (emplacementParent) {

  if(emplacementParent!=null&&emplacementParent.emplacementId!=null&&emplacementParent.emplacementId!="")
    {
        console.log("getEntrepotEmplacements====>",emplacementParent) 

      let list=[]
    list=Utils.filterArrayByFieldNameAndValue(emplacements,"emplacementParentId",emplacementParent.emplacementId)
    if(emplacementParent!=null&& emplacementParent.emplacementId!=null)
      list.push(emplacementParent)

    setEntrepotEmplacements(list);
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





//const reload=()=>window.location.reload();
/******************************************/
async function saveAchat (achat)  {
 const obj = {...achat};
  obj.userId=globalObject?.user?.id

if(perform.action=="POST")
{
obj.entrepot=entrepot
obj.entrepotId=entrepot?.entrepotId
}

  console.log("saveAchat=========>",obj)
  //    console.log("personnels=========>",personnels)
   var perf=perform;
     if(isValid(obj))
     {     

      if(obj.deviseMonetaire==null|| obj.deviseMonetaire=="" )
        {
               obj.deviseMonetaire=0;
          }
      
          let response=null;
         
          if(obj.achatId!=null && obj.achatId!="")
            response= await AchatsDataService.updateAsync(obj.achatId,obj);
          else
            response= await AchatsDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              //setAchat(response.data);             
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


  async function handleStatus(obj,statut) {
    obj.userId=globalObject?.user?.id
    if(statut==null)
    {
      if(obj.actif==true)
      {
        obj.actif=false;
      }else 
         obj.actif=true;
     }else 
     {
      obj.statut=statut
     }
  
      let perf=perform;
    let response=await AchatsDataService.updateAsync(obj.achatId,obj);
    if(response!=null && response.status=="200")
      {
          setAchat(response.data);             
           
          retrieveAchats(entrepot?.entrepotId); 
           showNotif(perf);                              
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrieveAchats (entrepotId){


if ($.fn.dataTable.isDataTable('#tListOfAchat')) {
        $('#tListOfAchat').DataTable().destroy();
       
    }
    let resp=null;
    
      let query="?"
    if(entrepotId!=null && entrepotId!="")
      query+="entrepotId="+entrepotId
      resp= await AchatsDataService.findAsync(query);  
    
       
    if(resp!=null && resp.status=="200" )          
        {
          setAchats(resp.data);
         if(perform.action=="GET_PRODUIT"&&achat.achatId!=null)
         {
          let entrepotP=Utils.trouverObjetDansListObject(resp.data,"achatId",achat.achatId)
          setAchat({...entrepotP})
          setGuid(Utils.uuidv4())
          console.log("setAchat",entrepotP)
         }
          
        }else 
         setAchats([])

setTimeout(()=>{ 
    //$('#tListOfAchat').DataTable().destroy();                       
    $('#tListOfAchat').DataTable(

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
 
    let err=initialAchatState;
    let valid=true;
        console.log(obj); 

    if( obj.entrepot==null || obj.entrepot.entrepotId==null || obj.entrepot.entrepotId.length<2) 
       {
         err.entrepotId="Entrepot incorrecte";
         valid=false;
     }
      if( obj.deviseMonetaire==null || obj.deviseMonetaire.length==0) 
       {
         err.deviseMonetaire="Devise monetaire incorrecte";
         valid=false;
     }
    if( obj.fournisseur==null || obj.fournisseur.fournisseurId==null || obj.fournisseur.fournisseurId.length<2) 
       {
         err.fournisseurId="Sélectionner un fournisseur";
         valid=false;
     } 

   /* if(obj.deviseMonetaire!=null&& obj.deviseMonetaire!="" &&!Utils.isPositiveFloat(obj.deviseMonetaire))
       {
         err.deviseMonetaire="TVA incorrecte ";
          valid=false;
     }*/
  
   
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.actif="indiquer le statut actif oui ou non ";
          valid=false;
     }
 
 
     console.log(err);
  setErrors(err);
    return valid;

  };


const performAction = (achat,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshAchat();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
    
  }else
  {
    perf=perform;
    handleClose();
    setAchat(achat);      
    setErrors(initialAchatState);
    //setEntrepot(achat?.entrepot)
    if(action!="GET_PRODUIT")
      {
        handleShowAchat();    
      }else
        setGuid(Utils.uuidv4())  
    perf.action=action;
    setPerform(perf);
    }
if(action=="POST"||action=="PUT")
 {
   if(fournisseurs.length==0)
    retrieveFournisseurs();
 /*  if(personnels.length==0)
    retrievePersonnels();
 if(emplacements.length==0)
    retrieveEmplacements();*/
    

}
 if(action!="POST")
  getEntrepotEmplacements(achat?.entrepot?.emplacement) 
                                      
    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShowAchat(false);
  setShowAchat(true);
}




$(document).ready( function () {

$('#tListOfAchat').on('click', 'tr', function () {
  var table = $('#tListOfAchat').DataTable();
   var data = table.row( this ).data();
   // below some operations with the data
   // How can I set the row color as red?
  $(this).addClass('highlight').siblings().removeClass('highlight');
});

$('#tListOfAchat').on('draw.dt', function () {
  $(this).find('.highlight').removeClass('highlight');
});

} );
const renderListOfAchat=() =>{
return (

      <div className="table-responsive">         
      <table id="tListOfAchat"  className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>
              {entrepot==null &&<th >Entrepot</th>}
                <th>Fournisseur</th>
                 <th>N° Commande</th>
                 <th>Statut</th>
                <th style={{"display": perform.action=="GET_PRODUIT"?"none":""}}>Actif</th>
                               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {achats &&
            achats.map((achat, index) => (
                <tr key={index}> 
                 <td>{achat.dateModif}</td> 
                {entrepot==null&& <td>{achat?.entrepot?.libelle}</td>}
                  <td>{achat?.fournisseur?.libelle}</td>
                    <td>{achat?.numeroCommande}</td>       
                <td><h6>{(achat.statut==-1)?<div className="badge rounded-pill bg-secondary">Annulée</div>:(achat.statut==0)?<div className="badge rounded-pill bg-primary">En creation</div>:
                (achat.statut==1)?<div className="badge rounded-pill bg-success">Approuvée</div>:(achat.statut==2)?<div className="badge rounded-pill bg-dark">Clôturé</div>:""}</h6></td> 
                  <td style={{"display": perform.action=="GET_PRODUIT"?"none":""}}>{achat.actif==true?"Oui":"Non"}</td> 
                 
                  
                  <td>
                   
                      <div className="btn-group">
                      <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(achat, "GET")}><i class="fa fa-eye"></i> </Button>
                     {permission?.action?.includes("U")&&achat?.statut<1&&<Button  variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(achat, "PUT")}><i class="fa fa-edit fa-sm"></i></Button>}  
                 
                    
                     {permission?.action?.includes("U")&&
                     <Button variant="secondary" className=" btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fa fa-indent"></i>
                     </Button>}
                    <ul className="dropdown-menu">
               
                        <li><a class="dropdown-item disabled" aria-disabled="true">Changer le statut</a></li>

                     {(achat.statut==0)&&(<li><a className="dropdown-item" href="#" onClick={() => handleStatus(achat,-1)}>Annuler</a></li>)}
                      {(achat.statut==0)&&(<li><a className="dropdown-item" href="#" onClick={() => handleStatus(achat,1)}>Approuver</a></li>)}

                       {(achat.statut==-1)&&(<li><a className="dropdown-item" href="#" onClick={() => handleStatus(achat,0)}>En création</a></li>)}
                      {(achat.statut==1)&&(<li><a className="dropdown-item" href="#" onClick={() => handleStatus(achat,2)}>Clôturer</a></li>)}
                      {/*(achat.statut==2)&&(<li><a className="dropdown-item" href="#" onClick={() => handleStatus(achat,1)}>Approuver</a></li>)*/}
                    </ul>
                     {permissionAchatProduit!=null&&
                      <Button variant="primary" className="btn-sm" 
                             title="Détail de la commande" onClick={() => performAction(achat, "GET_PRODUIT")}>
                      <i class="fa fa-bars"></i>
                     </Button>}
                  </div>
                   </td>              
                </tr>

          ))}          
          </tbody>          
        </table> 

</div>
  )}
const renderShowAchat =()=> {
return (
   <div className="row">
                <div className="col-md">       
                 
                   
                   <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="table-active">Entrepot</th><td>{achat?.entrepot?.libelle}</td></tr>
                    <tr><th className="table-active">Fournisseur</th><td>{achat?.fournisseur?.libelle}</td></tr>
                    <tr><th className="table-active">N° commande</th><td>{achat.numeroCommande}</td></tr>
                    <tr><th className="table-active">N° externe</th><td>{achat.numeroExterne}</td></tr>
                     <tr><th className="table-active">Statut</th><td>{(achat.statut==-1)?<div className="badge rounded-pill bg-secondary">Annulée</div>:(achat.statut==0)?<div className="badge rounded-pill bg-primary">En creation</div>:(achat.statut==1)?<div className="badge rounded-pill bg-success">Approuvée</div>:(achat.statut==2)?<div className="badge rounded-pill bg-secondary">Clôturé</div>:""}
</td></tr>
                    <tr><th className="table-active">Devise monetaire</th><td>{achat.deviseMonetaire}</td></tr>                    
                    <tr><th className="table-active">Remarque</th><td>{achat.remarque}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{achat.actif==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">User</th><td>{achat.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{achat.dateModif}</td></tr>                              
                                 
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
                               retrieveAchats(newValue?.entrepotId);
                               getEntrepotEmplacements(newValue?.emplacement)
                               setPerform(initialPerformState);

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
                    <tr><th className="table-active">Gestionnaire</th><td>{entrepot?.gestionnaires!=null &&Utils.getAttributeValues(entrepot?.gestionnaires, "value")?.join(", ")}</td></tr>
                  </tbody>
              </table>
                         
                </div>)}
      </div>

)}

const renderFormAchat=() =>{
return (
   <div className="row">
         <div className="col-md">   
         
                <div className="form-group">             
            <table className={Styles.styledTable}>
               <tbody>
                    <tr><th className="table-active">Entrepot</th><td>{entrepot?.libelle}</td></tr>
                    <tr><th className="table-active">Emplacement de l'entrepot</th><td>{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepot?.emplacementId)?.libelleChemin}</td></tr>                                                     
                </tbody>
              </table>
                    </div>

                    
      
        {perform.action=="POST"&&( 
                  <div className="form-group" >     
                    <Select
                        
                       defaultValue={achat.fournisseur!=null&&achat.fournisseur.fournisseurId!=null?achat.fournisseur:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.fournisseurId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...achat}                                             
                              if(newValue!=null)                           
                               {
                                obj.fournisseurId=newValue.fournisseurId
                                obj.fournisseur=newValue; 
                                obj.deviseMonetaire=newValue.deviseMonetaire                                
                               } 
                                else
                             {
                                    obj.fournisseurId=initialAchatState.fournisseurId 
                                    obj.fournisseur=initialAchatState.fournisseur
                                    obj.deviseMonetaire="" 
                                }   
                              setAchat(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={fournisseurs}
                        placeholder={`Fournisseur`}
                        className={`form-control-sm px-0 ${errors?.fournisseurId!=null && errors?.fournisseurId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.fournisseurId}</div>
                    </div>)}
                 
                   
                    <div className="form-group ">             
                      <input
                      type="text"                     
                        id="numeroExterne"
                        required
                        value={achat.numeroExterne}
                        onChange={handleAchatChange}
                        name="numeroExterne"
                        placeholder=' N° externe'
                        maxLength="7"
                        className={`form-control form-control-sm  ${errors.numeroExterne.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.numeroExterne}</div>
                    </div>
                     <div className="form-group ">             
                      <input
                      type="text"                     
                        id="deviseMonetaire"
                        required
                        value={achat.deviseMonetaire}
                        onChange={handleAchatChange}
                        name="deviseMonetaire"
                        placeholder='Devise Monetaire'
                        maxLength="7"
                        style={{width: "150px"}}
                        className={`form-control form-control-sm  ${errors.deviseMonetaire.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.deviseMonetaire}</div>
                    </div>                   
                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleAchatChange} value={achat.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
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
                        value={achat.remarque}
                        onChange={handleAchatChange}
                        name="remarque"
                        maxLength="250"
                        placeholder="Remarque"
                      />
                    </div>
                </div> 

  </div>
  )}

return (
<div className="container">    
<header className="jumbotron">
        <h3 className={Styles.HeaderL1} >Commandes</h3>
        

<div className="container-body">    
{/************************************Modal for add achat*******************************/}

{renderFormEntrepot()}
<p>&nbsp;</p>
 <div className="row">
        <div className={`${perform.action=="GET_PRODUIT"? 'col-md-5' : 'col-md'}`}>  
<div className="submit-form">
    
    <div className="text-right">    
       <div className="custom-control custom-checkbox custom-control-inline">
      
       {/*actifAchat? <Button  variant="light" className="btn-sm" 
                  title="Afficher tous" onClick={() => setActifAchat(!actifAchat)}>
                <i class="fa fa-toggle-off"></i>
        </Button>:
         <Button  variant="light" className="btn-sm" 
                 title="Ne pas afficher les supprimés" onClick={() => setActifAchat(!actifAchat)}>
                <i class="fa fa-toggle-on"></i>
        </Button>*/}
        <Button  variant="info" className="btn-sm" 
                      title="Rafraichir" onClick={() => retrieveAchats()}>
                <i class="fa fa-refresh"></i>
          </Button>
      
      {permission?.action?.includes("C")&&entrepot!=null&& <Button  variant="success" className="btn-sm" 
                      title="Passer une commande" onClick={() => performAction(achat, "POST")}>
                 <FontAwesomeIcon icon={['fas', 'cart-arrow-down']} />
          </Button>  
 } 
      </div>
    </div>
      <Modal  centered show={showAchat} onHide={()=>handleClose} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouvelle commande"): 
          (perform.action=="GET")?("Détail sur la commande"):
          (perform.action=="PUT")?("Modifier la commande" ):
          (perform.action=="DELETE")?("Supprimer la commande" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormAchat()

           ):(perform.action=="GET" || perform.action=="DELETE")?(

             renderShowAchat()

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(permission?.action?.includes("U")&&achat.achatId!=null &&perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(achat,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveAchat(achat)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveAchat(achat)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteAchat(achat)}>
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
      
           {renderListOfAchat()}
         </div>

        {perform.action=="GET_PRODUIT"&&(
        <div className="col-md-7">  
        <section className="accordion">
              <input type="radio" name="collapse" id="inOut" defaultChecked/>
              <h2 className="handle">
                <label htmlFor="inOut">Commande de produit</label>
              </h2>
              <div className="content">
            {achat!=null&&  <AchatProduits key={guid}  achat={achat} entrepots={entrepots} entrepotEmplacements={entrepotEmplacements} updateAchat={handleToUpdateAchat}/>} 
          
              </div>
      </section>     

              </div>   )}


     </div>
     </div>
     </header>
</div>
  );
};
export default Achats;