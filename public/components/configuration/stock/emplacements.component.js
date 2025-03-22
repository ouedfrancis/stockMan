import React, {useState, useEffect } from "react";
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
const Emplacements = () => {

/*Create emplacement code*/
const initialEmplacementState = 
    { 
       
        "emplacementId": "",
        "libelle": "",
        "codeEmplacement": "",         
        "emplacementParentId": "",
         "emplacementDeRebut": false,
        "remarque": "",
        "actif": true,
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [emplacement, setEmplacement] = useState(initialEmplacementState);
const [emplacements, setEmplacements] = useState([]);
const [emplacementParents, setEmplacementParents] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialEmplacementState);
const [show, setShow] = useState(false);

useEffect(() => {
    retrieveEmplacements(actifEmplacement);
    //setEmplacement(emplacement); 
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshEmplacement()

}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Emplacement", perf.msg);                         
handleCloseAndReload()
}

const handleActifemplacementChange = (event) => {
  //let act=event.target.checked;
  actifEmplacement=event.target.checked;
  retrieveEmplacements(actifEmplacement);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleEmplacementChange = event => {
  const { name, value } = event.target;
  setEmplacement({ ...emplacement, [name]: value });
};

  const refreshList = () => {
    retrieveEmplacements();
  };

const refreshEmplacement = () => {
    setEmplacement(initialEmplacementState);
     setErrors(initialEmplacementState);
     setPerform(initialPerformState);
     retrieveEmplacements();
  };



//const reload=()=>window.location.reload();
/******************************************/
async function saveEmplacement (emplacement)  {
 const obj = {...emplacement};
  obj.userId=globalObject?.user?.id

  console.log("saveEmplacement=========>",obj)

   var perf=perform;
     if(isValid(obj))
     {       
          let response="";
         
          if(obj.emplacementId!=null && obj.emplacementId!="")
            response= await EmplacementsDataService.updateAsync(obj.emplacementId,obj);
          else
            response= await EmplacementsDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setEmplacement(response.data);             
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
    let response=await EmplacementsDataService.updateAsync(obj.emplacementId,obj);
    if(response!=null && response.status=="200")
      {


          setEmplacement(response.data);             
           
          retrieveEmplacements(actifEmplacement);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrieveEmplacements (act){

  if ($.fn.dataTable.isDataTable('#tListOfemplacement')) {
        $('#tListOfemplacement').DataTable().destroy();
       
    }
    let resp=null;
    
      resp= await EmplacementsDataService.getAllAsync();  
       
    if(resp!=null && resp.status=="200" )          
        {
          
          let ListEmplacementWithLibelleChemin=getemplacementWithlibelleChemin(resp.data)
          ListEmplacementWithLibelleChemin=Utils.trierListeParChamp(ListEmplacementWithLibelleChemin,"libelleChemin",true)
          setEmplacements(ListEmplacementWithLibelleChemin);
          
        }else 
         setEmplacements([])

setTimeout(()=>{ 
    //$('#tListOfemplacement').DataTable().destroy();                       
    $('#tListOfemplacement').DataTable(

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
             { "width": "20%", "targets": 1 }
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
 
    let err=initialEmplacementState;
    let valid=true;
       
    if( obj.libelle==null || obj.libelle.length<2) 
       {
         err.libelle="Libellé du emplacement incorrecte";
         valid=false;
     } 
  
  
      if( obj.codeEmplacement==null || obj.codeEmplacement.length<2) 
       {
         err.codeEmplacement="Code emplacement requis";
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


const performAction = (emplacement,action) => {
  let perf=null;
  if(action=="POST")
  {
    //refreshEmplacement();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);

  }else
  {
    perf=perform;
    handleClose();
    setEmplacement(emplacement);      
    setErrors(initialEmplacementState);
    handleShow();
    perf.action=action;
    setPerform(perf);
    }
    if(action=="PUT")
    {
      let parents=[]
      parents=Utils.supprimerObjetSelonContenuDuChamp(emplacements,"libelleChemin","/"+emplacement.libelle)
      if(parents.length>0)
      setEmplacementParents(parents)
      else
         setEmplacementParents([])
    }

    
  };


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
          let emplParent=Utils.filterArrayByFieldNameAndValueAndOneObject(empls,"emplacementId",parentId)
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
function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}


const renderListOfEmplacement=() =>{
return (
<div className="table-responsive">         
      <table id="tListOfemplacement" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
               <th>Date de Modif</th>
                 <th>Catégorie parent</th>
                <th>Code</th>
                <th>Libellé</th>
                <th>Actif</th>             
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {emplacements &&
            emplacements.map((emplacement, index) => (
                <tr key={index}> 
                <td>{emplacement.dateModif}</td> 
                  <td>{emplacement.libelleChemin?.replace(emplacement.libelle,"").replace(/\/(\s+)?$/, '')}</td>
                  <td>{emplacement.codeEmplacement}</td>       
                  <td>{emplacement.libelle}</td>                                                         
                  <td>{emplacement.actif==true?"Oui":"Non"}</td> 
            
                  <td>
                    <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(emplacement, "GET")}>
                       <FontAwesomeIcon icon={['fa', 'fa-eye']} /> 
                      </Button>
                      <Button variant="warning" className="btn-sm"  title="Modifier le role" onClick={() => performAction(emplacement, "PUT")}>
                       <FontAwesomeIcon icon={['fa', 'fa-edit']} /> 
                      </Button>
                     {(emplacement.actif==true)?(
                          <Button variant="light" className="btn-sm"  title="Déactiver"  onClick={() => handleStatus(emplacement)}>
                          <FontAwesomeIcon icon={['fa', 'fa-toggle-on']} /> 
                         </Button>
                         
                         ):(
                           <Button variant="light" className="btn-sm"  title="Activer"  onClick={() => handleStatus(emplacement)}>
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
const renderShowEmplacement =()=> {
return (
   <div className="row">
                <div className="col-md">       
                 
                   
                   <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="table-active">Code</th><td>{emplacement.codeEmplacement}</td></tr>
                    <tr><th className="table-active">Libelle</th><td>{emplacement.libelle}</td></tr>
                    <tr><th className="table-active">Catégorie parent</th><td>{emplacement.libelleChemin.replace(emplacement.libelle,"").replace(/\/(\s+)?$/, '')}</td></tr>
                    <tr><th className="table-active">Remarque</th><td>{emplacement.remarque}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{emplacement.actif==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">User</th><td>{emplacement.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{emplacement.dateModif}</td></tr>                              
                                 
                </tbody>
              </table>
                                 
                                                                                    
                           
                </div>
              </div>
  )}

const renderFormEmplacement=() =>{
return (
   <div className="row">
                <div className="col-md">                               
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="codeEmplacement"
                        required
                        value={emplacement.codeEmplacement}
                        onChange={handleEmplacementChange}
                        name="codeEmplacement"
                        placeholder="Code Emplacement"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.codeEmplacement.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.codeEmplacement}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="libelle"
                        required
                        value={emplacement.libelle}
                        onChange={handleEmplacementChange}
                        name="libelle"
                        placeholder="Libellé"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.libelle.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.libelle}</div>
                    </div>
                   
                    <div className="form-group" > 
                    {(perform.action=="POST")?(    
                    <Select
                        
                       defaultValue={emplacement!=null&&emplacement.emplacementParentId!=null&&emplacement.emplacementParentId!=""?emplacement:""}
                       getOptionLabel={e => e.libelleChemin}
                        getOptionValue={e => e.emplacementParentId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...emplacement}                                             
                              if(newValue!=null)                           
                               {
                                obj.emplacementParentId=newValue.emplacementId
                               } 
                                else
                             {
                                    obj.emplacementParentId=initialEmplacementState.emplacementParentId 
                                }   
                              setEmplacement(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={emplacements}
                        placeholder={`Catégorie parent`}
                        className={`form-control-sm px-0 ${errors?.emplacementParentId!=null && errors?.emplacementParentId.length>0 ? 'is-invalid' : ''}`}/>
                        ):(
                      <Select                  
                       defaultValue={emplacement!=null&&emplacement.emplacementId!=null&&emplacement.emplacementId!=""?emplacement:""}
                       getOptionLabel={e => e.libelleChemin.replace(emplacement.libelle,"")?.replace(/\/(\s+)?$/, '')}
                        getOptionValue={e => e.emplacementParentId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...emplacement}                                             
                              if(newValue!=null)                           
                               {
                                obj.emplacementParentId=newValue.emplacementId
                               } 
                                else
                             {
                                    obj.emplacementParentId=initialEmplacementState.emplacementParentId 
                                }   
                              setEmplacement(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={emplacementParents}
                        placeholder={`Catégorie parent`}
                        className={`form-control-sm px-0 ${errors?.emplacementParentId!=null && errors?.emplacementParentId.length>0 ? 'is-invalid' : ''}`}/>


                        )}                       
                      <div className="invalid-feedback">{errors?.emplacementParentId}</div>
                    </div>
                     <div className="form-group">     
                    <select id="emplacementDeRebut" name="emplacementDeRebut" onChange={handleEmplacementChange} value={emplacement.emplacementDeRebut}  
                    className={`form-select form-select-sm ${errors.emplacementDeRebut.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Emplacement de rebut</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.emplacementDeRebut}</div>
                    </div>
                

                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleEmplacementChange} value={emplacement.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
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
                        value={emplacement.remarque}
                        onChange={handleEmplacementChange}
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
        <h3 className={Styles.HeaderL1} >Emplacements</h3>
        

<div className="container-body">      
{/************************************Modal for add emplacement*******************************/}

<div className="submit-form">
    
    <div className="text-right">    
      <Button  variant="info" className="btn-sm" 
        title="Rafraichir" onClick={() => retrieveEmplacements()}>
          <i className="fa fa-refresh"></i>
      </Button>
      <Button  variant="success" className="btn-sm" 
           title="Ajouter un emplacement" onClick={() => performAction(emplacement, "POST")}>
            <FontAwesomeIcon icon={['fa', 'fa-location-pin']} />
       </Button>
       
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouveau emplacement"): 
          (perform.action=="GET")?("Détail sur l'emplacement"):
          (perform.action=="PUT")?("Modifier l'emplacement" ):
          (perform.action=="DELETE")?("Supprimer l'emplacement'" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormEmplacement()

           ):(perform.action=="GET" || perform.action=="DELETE")?(

             renderShowEmplacement()

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(emplacement.emplacementId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(emplacement,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveEmplacement(emplacement)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveEmplacement(emplacement)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteEmplacement(emplacement)}>
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
    {renderListOfEmplacement()}
    </div>
    </header>
      </div>
  );
};
let actifEmplacement=true;
export default Emplacements;