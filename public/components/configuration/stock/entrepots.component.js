import React, {useState, useEffect } from "react";
import EntrepotsDataService from "../../../services/stock/entrepots.service";
import PersonnelDataService from "../../../services/personnels.service";
import EmplacementsDataService from "../../../services/stock/emplacements.service";
import Utils from "../../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import Styles from '../../../styles.module.css';
import Select from 'react-select';
import globalObject from '../../../global.js'
import $ from 'jquery'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


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

 /* eslint-disable */
const Entrepots = () => {

/*Create entrepot code*/
const initialEntrepotState = 
    { 
       
        "entrepotId": "",
        "libelle": "",
        "codeEntrepot": "", 
        "unite": {},  
        "uniteId": "",     
        "gestionnaire": {},
        "gestionnaires": [],  
        "gestionnaireId": "",
        "entrepot": "",
        "emplacement": {},
        "emplacementId": "",
        "remarque": "",
        "accepteDemandeSortieProduit": false,
        "validationAutoDemande": false,
        "actif": true,
        
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [entrepot, setEntrepot] = useState(initialEntrepotState);
const [entrepots, setEntrepots] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialEntrepotState);
const [show, setShow] = useState(false);
const [unites, setUnites] = useState([]);
const [personnels, setPersonnels] = useState([]);
const [emplacements, setEmplacements] = useState([]);
const NB_GESTIONNAIRE_MAX=5
useEffect(() => {
    retrieveEntrepots(actifEntrepot);
    retrieveEmplacements()
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshEntrepot()

}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Entrepot", perf.msg);                         
handleCloseAndReload()
}

const handleActifentrepotChange = (event) => {
  //let act=event.target.checked;
  actifEntrepot=event.target.checked;
  retrieveEntrepots(actifEntrepot);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleEntrepotChange = event => {
  const { name, value } = event.target;
  setEntrepot({ ...entrepot, [name]: value });
};

  const refreshList = () => {
    retrieveEntrepots();
  };

const refreshEntrepot = () => {
    setEntrepot(initialEntrepotState);
     setErrors(initialEntrepotState);
     setPerform(initialPerformState);
     retrieveEntrepots(actifEntrepot);
  };



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
async function saveEntrepot (entrepot)  {
 const obj = {...entrepot};
  obj.userId=globalObject?.user?.id

if(obj.gestionnaires!=null&&obj.gestionnaires.length>0)
  { //
    obj.gestionnaireIds=""
    for(let item of obj.gestionnaires )
      {
        obj.gestionnaireIds+=item.key+","
      }
      obj.gestionnaireIds=obj.gestionnaireIds.slice(0,-1)
  }
  
  //    console.log("personnels=========>",personnels)
  if(obj.uniteId==null||obj.uniteId=="")
   {
    obj.unite=null
    obj.uniteId=null
   } 
  
/*  if(obj.gestionnaireId==null||obj.gestionnaireId=="")
    {
      obj.gestionnaire=null
      obj.gestionnaireId=null
    }*/
if(obj.emplacementId==null||obj.emplacementId=="")
    {
      obj.emplacement=null
      obj.emplacementId=null
    }

console.log("saveEntrepot=========>",obj)
   var perf=perform;
     if(isValid(obj))
     {       
          let response="";
         
          if(obj.entrepotId!=null && obj.entrepotId!="")
            response= await EntrepotsDataService.updateAsync(obj.entrepotId,obj);
          else
            response= await EntrepotsDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setEntrepot(response.data);             
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
    let response=await EntrepotsDataService.updateAsync(obj.entrepotId,obj);
    if(response!=null && response.status=="200")
      {
          setEntrepot(response.data);             
           
          retrieveEntrepots(actifEntrepot);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrieveEntrepots (act){

  if ($.fn.dataTable.isDataTable('#tListOfentrepot')) {
        $('#tListOfentrepot').DataTable().destroy();
       
    }
    let resp=null;
    
      resp= await EntrepotsDataService.getAllAsync();  
       
    if(resp!=null && resp.status=="200" )          
        {
          setEntrepots(resp.data);
          console.log("setEntrepots=========>",resp.data)
          
        }else 
         setEntrepots([])

setTimeout(()=>{ 
    //$('#tListOfentrepot').DataTable().destroy();                       
    $('#tListOfentrepot').DataTable(

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
 
    let err=initialEntrepotState;
    let valid=true;
        console.log(obj); 
    if( obj.libelle==null || obj.libelle.length<2) 
       {
         err.libelle="Libellé du entrepot incorrecte";
         valid=false;
     } 
  
  
      if( obj.codeEntrepot==null || obj.codeEntrepot.length<2) 
       {
         err.codeEntrepot="Code entrepot requis";
         valid=false;
     } 
      
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.actif="indiquer le statut actif oui ou non ";
          valid=false;
     }
 
     console.log(err);
  setErrors(err);
    return valid;

  };


const performAction = (entrepot,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshEntrepot();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);

  }else
  {
    perf=perform;
    handleClose();
    setEntrepot(entrepot);      
    setErrors(initialEntrepotState);
    handleShow();
    perf.action=action;
    setPerform(perf);
    }
if(action=="POST"||action=="PUT")
 {
   
  if(personnels.length==0)
    retrievePersonnels();
  if(emplacements.length==0)
    retrieveEmplacements();
 } 

    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}


const renderListOfEntrepot=() =>{
return (
<div className="table-responsive">         
      <table id="tListOfentrepot" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>
                <th>Code</th>
                <th>Libellé</th>
                 <th>Gestionnaire</th>
                  <th>Emplacement</th>
                <th>Actif</th>
                               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {entrepots &&
            entrepots.map((entrepot, index) => (
                <tr key={index}> 
                 <td>{entrepot.dateModif}</td> 
                  <td>{entrepot.codeEntrepot}</td>       
                  <td>{entrepot.libelle}</td>            
                  <td>{Utils.getAttributeValues(entrepot.gestionnaires,"value")?.join(", ")}</td>
                   <td>{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepot.emplacementId)?.libelleChemin}</td>                    
                  <td>{entrepot.actif==true?"Oui":"Non"}</td> 
                 
                  
                  <td>
<Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(entrepot, "GET")}>
                       <FontAwesomeIcon icon={['fa', 'fa-eye']} /> 
                      </Button>
                      <Button variant="warning" className="btn-sm"  title="Modifier le role" onClick={() => performAction(entrepot, "PUT")}>
                       <FontAwesomeIcon icon={['fa', 'fa-edit']} /> 
                      </Button>
                     {(entrepot.actif==true)?(
                          <Button variant="light" className="btn-sm"  title="Déactiver"  onClick={() => handleStatus(entrepot)}>
                          <FontAwesomeIcon icon={['fa', 'fa-toggle-on']} /> 
                         </Button>
                         
                         ):(
                           <Button variant="light" className="btn-sm"  title="Activer"  onClick={() => handleStatus(entrepot)}>
                          <FontAwesomeIcon icon={['fa', 'fa-toggle-off']} /> 
                         </Button>
                           )
                     }                          
                      
                   </td>              
                </tr>

          ))}          
          </tbody>          
        </table>     
        </div>
  )}
const renderShowEntrepot =()=> {
return (
   <div className="row">
                <div className="col-md">       
                 
                   
                   <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="table-active">Code</th><td>{entrepot.codeEntrepot}</td></tr>
                    <tr><th className="table-active">Libelle</th><td>{entrepot.libelle}</td></tr>
                    <tr><th className="table-active">Gestionnaire</th><td>{Utils.getAttributeValues(entrepot.gestionnaires,"value")?.join(", ")}</td></tr>
                    <tr><th className="table-active">Emplacement</th><td>{Utils.trouverObjetDansListObject(emplacements,"emplacementId",entrepot.emplacementId)?.libelleChemin}</td></tr>
                   <tr><th className="table-active">Service</th><td>{entrepot?.unite?.libelle}</td></tr>
                   <tr><th className="table-active">Sortie de produit</th><td>{entrepot.accepteDemandeSortieProduit==true? "Accepte les demandes":"N'accepte pas les demandes"}</td></tr>
                    {(entrepot.accepteDemandeSortieProduit=="true"||entrepot.accepteDemandeSortieProduit==true)&&<tr><th className="table-active">Validation automatique des demandes</th><td>{entrepot.validationAutoDemande==true? "Oui":"Non"}</td></tr>}
                    <tr><th className="table-active">Remarque</th><td>{entrepot.remarque}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{entrepot.actif==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">User</th><td>{entrepot.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{entrepot.dateModif}</td></tr>                              
                                 
                </tbody>
              </table>
                                 
                                                                                    
                           
                </div>
              </div>
  )}

const renderFormEntrepot=() =>{
return (
   <div className="row">
                <div className="col-md">                               
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="codeEntrepot"
                        required
                        value={entrepot.codeEntrepot}
                        onChange={handleEntrepotChange}
                        name="codeEntrepot"
                        placeholder="Code Entrepot"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.codeEntrepot.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.codeEntrepot}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="libelle"
                        required
                        value={entrepot.libelle}
                        onChange={handleEntrepotChange}
                        name="libelle"
                        placeholder="Libellé"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.libelle.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.libelle}</div>
                    </div>
                   
                    
                    <div className="form-group" >
                        
                    <Select
                        

                        defaultValue={entrepot?.gestionnaires==undefined?[]:entrepot?.gestionnaires}
                      isMulti
                      // only allow user to choose up to NB_GESTIONNAIRE_MAX options
                      isOptionDisabled={() => entrepot.gestionnaires!=null&&entrepot.gestionnaires.length >= NB_GESTIONNAIRE_MAX}
                      className="basic-multi-select"
                      classNamePrefix="select"
                     onChange={(e) => {
                      setEntrepot({...entrepot,"gestionnaires":e})
                      console.log("gestionnaires",e)
                           }
                       }
                     


                       getOptionLabel={e => e.value}
                        getOptionValue={e => e.key}
                       isClearable={true}
                       
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={personnels}
                        placeholder={`Gestionnaire`}
                        className={`form-control-sm px-0 ${errors?.gestionnaire.gestionnaireId!=null && errors?.gestionnaire.gestionnaireId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.gestionnaire?.gestionnaireId}</div>
                    </div>
                   
                   
                   <div className="form-group" >     
                    <Select
                        
                       defaultValue={entrepot.emplacement!=null&&entrepot.emplacement.emplacementId!=null?entrepot.emplacement:""}
                       getOptionLabel={e => Utils.trouverObjetDansListObject(emplacements,"emplacementId",e.emplacementId)?.libelleChemin}
                        getOptionValue={e => e.emplacementId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...entrepot}                                             
                              if(newValue!=null)                           
                               {
                                obj.emplacementId=newValue.emplacementId
                                 obj.emplacement={}
                                obj.emplacement=newValue;                                 
                               } 
                                else
                             {
                                    obj.emplacementId=initialEntrepotState.emplacementId 
                                    obj.emplacement=initialEntrepotState.emplacement
                                }   
                              setEntrepot(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={emplacements}
                        placeholder={`Emplacement`}
                        className={`form-control-sm px-0 ${errors?.gestionnaire.gestionnaireId!=null && errors?.gestionnaire.gestionnaireId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.gestionnaire?.gestionnaireId}</div>
                    </div>
                    <div className="form-group" >     
                    <Select
                        
                       defaultValue={entrepot.unite!=null&&entrepot.unite.uniteId!=null?entrepot.unite:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.uniteId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...entrepot}                                             
                              if(newValue!=null)                           
                               {
                                obj.uniteId=newValue.uniteId
                                obj.unite=newValue;                                 
                               } 
                                else
                             {
                                    obj.uniteId=initialEntrepotState.uniteId 
                                    obj.unite=initialEntrepotState.unite
                                }   
                              setEntrepot(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={unites}
                        placeholder={`Unité`}
                        className={`form-control-sm px-0 ${errors?.unite.uniteId!=null && errors?.unite.uniteId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.unite?.uniteId}</div>
                    </div>
                     
                     <div className="form-group">     
                    <select id="accepteDemandeSortieProduit" name="accepteDemandeSortieProduit" onChange={handleEntrepotChange} value={entrepot.accepteDemandeSortieProduit}  
                    className={`form-select form-select-sm ${errors.accepteDemandeSortieProduit.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Sortie de produit</option>
                      <option value={true}>Accepte les demandes</option>
                      <option value={false}>N'accepte pas les demandes</option>
                      
                   </select>
                      <div className="invalid-feedback">{errors.accepteDemandeSortieProduit}</div>
                    </div>
                    {(entrepot?.accepteDemandeSortieProduit=="true"||entrepot?.accepteDemandeSortieProduit==true)&&(
                   <div className="form-group">     
                    <select id="validationAutoDemande" name="validationAutoDemande" onChange={handleEntrepotChange} value={entrepot.validationAutoDemande}  
                    className={`form-select form-select-sm ${errors.validationAutoDemande.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Validation automatique des demandes</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>
                      <div className="invalid-feedback">{errors.validationAutoDemande}</div>
                    </div>)}


                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleEntrepotChange} value={entrepot.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.actif}</div>
                    </div>
                    </div>
                     <div className="form-group">             
                      <textarea
                        type="text"
                        className="form-control"
                        id="remarque"
                        required
                        value={entrepot.remarque}
                        onChange={handleEntrepotChange}
                        name="remarque"
                        maxLength="250"
                        placeholder="Remarque"
                      />
                    </div>
                    
                      
               
                
              </div>
  )}

return (
  <div className="container">
   <header className="jumbotron">
        <h3 className={Styles.HeaderL1} >Entrepots</h3>
        

<div className="container-body">           
{/************************************Modal for add entrepot*******************************/}

<div className="submit-form">
    
    <div className="text-right">  
        <Button  variant="info" className="btn-sm" 
              title="Rafraichir" onClick={() => retrieveEntrepots()}>
                <i className="fa fa-refresh"></i>
            </Button>
            <Button  variant="outline-success" className="btn-sm" 
                 title="Ajouter un entrepot" onClick={() => performAction(entrepot, "POST")}>
                  <FontAwesomeIcon icon={['fa', 'fa-warehouse']} />
             </Button>  
       
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouveau entrepot"): 
          (perform.action=="GET")?("Détail sur l'ntrepot "):
          (perform.action=="PUT")?("Modifier l'entrepot " ):
          (perform.action=="DELETE")?("Supprimer l'entrepot" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormEntrepot()

           ):(perform.action=="GET" || perform.action=="DELETE")?(

             renderShowEntrepot()

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(entrepot.entrepotId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(entrepot,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveEntrepot(entrepot)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveEntrepot(entrepot)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteEntrepot(entrepot)}>
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
    {renderListOfEntrepot()}
    </div>
   </header>
  </div>
  );
};
let actifEntrepot=true;
export default Entrepots;