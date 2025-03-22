import React, {useState, useEffect } from "react";
import FournisseursDataService from "../../../services/stock/fournisseurs.service";

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
const Fournisseurs = () => {

/*Create fournisseur code*/
const initialFournisseurState = 
    { 
       
        "fournisseurId": "",
        "libelle": "",
        "codeFournisseur": "",     
        "tel": "",     
        "email": "",  
        "fax": "",
        "contact": "",
        "adresse": "",
        "tva": "",
        "deviseMonetaire": "",
        "remarque": "",
        "actif": true,
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [fournisseur, setFournisseur] = useState(initialFournisseurState);
const [fournisseurs, setFournisseurs] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialFournisseurState);
const [show, setShow] = useState(false);

useEffect(() => {
    retrieveFournisseurs(actifFournisseur);
    //setFournisseur(fournisseur); 
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshFournisseur()

}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Fournisseur", perf.msg);                         
handleCloseAndReload()
}

const handleActiffournisseurChange = (event) => {
  //let act=event.target.checked;
  actifFournisseur=event.target.checked;
  retrieveFournisseurs(actifFournisseur);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleFournisseurChange = event => {
  const { name, value } = event.target;
  setFournisseur({ ...fournisseur, [name]: value });
};

  const refreshList = () => {
    retrieveFournisseurs();
  };

const refreshFournisseur = () => {
    setFournisseur(initialFournisseurState);
     setErrors(initialFournisseurState);
     setPerform(initialPerformState);
     retrieveFournisseurs(actifFournisseur);
  };


//const reload=()=>window.location.reload();
/******************************************/
async function saveFournisseur (fournisseur)  {
 const obj = {...fournisseur};
  obj.userId=globalObject?.user?.id

  console.log("saveFournisseur=========>",obj)
  //    console.log("personnels=========>",personnels)
   var perf=perform;
     if(isValid(obj))
     {       
          let response="";
         
          if(obj.fournisseurId!=null && obj.fournisseurId!="")
            response= await FournisseursDataService.updateAsync(obj.fournisseurId,obj);
          else
            response= await FournisseursDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setFournisseur(response.data);             
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
    let response=await FournisseursDataService.updateAsync(obj.fournisseurId,obj);
    if(response!=null && response.status=="200")
      {
          setFournisseur(response.data);             
           
          retrieveFournisseurs(actifFournisseur);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrieveFournisseurs (act){

  if ($.fn.dataTable.isDataTable('#tListOffournisseur')) {
        $('#tListOffournisseur').DataTable().destroy();
       
    }
    let resp=null;
    
      resp= await FournisseursDataService.getAllAsync();  
       
    if(resp!=null && resp.status=="200" )          
        {
          setFournisseurs(resp.data);
           console.log("setFournisseurs=========>",resp.data)
          
        }else 
         setFournisseurs([])

setTimeout(()=>{ 
    //$('#tListOffournisseur').DataTable().destroy();                       
    $('#tListOffournisseur').DataTable(

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
 
    let err=initialFournisseurState;
    let valid=true;
        console.log(obj); 
    if( obj.libelle==null || obj.libelle.length<2) 
       {
         err.libelle="Libellé du fournisseur incorrecte";
         valid=false;
     } 
  if( obj.deviseMonetaire==null || obj.deviseMonetaire.length==0) 
       {
         err.deviseMonetaire="Devise monetaire incorrecte";
         valid=false;
     }
      if(obj.tva!=null &&  (isNaN(obj.tva) || obj.tva<0||obj.tva>100)) 
         {
         err.tva="Valeur de la TVA incorrecte";
         valid=false;
     }
  
      if( obj.codeFournisseur==null || obj.codeFournisseur.length<2) 
       {
         err.codeFournisseur="Code fournisseur requis";
         valid=false;
     } 

       if( obj.email.length>0 && !Utils.validateEmail(obj.email)) 
       {
         err.email="Email incorrecte";
          valid=false;
     }
      if(obj.tel.length>0 &&!Utils.validateMobileNumber(obj.tel)) 
        {
          err.tel="Téléphone incorrecte";
          valid=false;
        } 
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.actif="Indiquer le statut actif oui ou non ";
          valid=false;
     }
 
     console.log(err);
  setErrors(err);
    return valid;

  };


const performAction = (fournisseur,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshFournisseur();
    let obj={...fournisseur}
    obj.tva=globalObject?.clinique?.config.tauxTVAEntreprise
    obj.deviseMonetaire=globalObject?.clinique?.config?.deviseMonetaire
    setFournisseur(obj)
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);

  }else
  {
    perf=perform;
    handleClose();
    setFournisseur(fournisseur);      
    setErrors(initialFournisseurState);
    handleShow();
    perf.action=action;
    setPerform(perf);
    }

   
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}


const renderListOfFournisseur=() =>{
return (
<div className="table-responsive">         
      <table id="tListOffournisseur" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>
                <th>Code</th>
                <th>Nom fournisseur</th>
                <th>Contact</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Actif</th>
                               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {fournisseurs &&
            fournisseurs.map((fournisseur, index) => (
                <tr key={index}> 
                 <td>{fournisseur.dateModif}</td> 
                  <td>{fournisseur.codeFournisseur}</td>       
                  <td>{fournisseur.libelle}</td> 
                    <td>{fournisseur?.contact}</td>           
                   <td>{fournisseur?.tel}</td>
                    <td>{fournisseur?.email}</td>                    
                  <td>{fournisseur.actif==true?"Oui":"Non"}</td> 
                 
                  
                  <td>
                <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(fournisseur, "GET")}>
                        <FontAwesomeIcon icon={['fa', 'fa-eye']} /> 
                       </Button>
                       <Button variant="warning" className="btn-sm"  title="Modifier le role" onClick={() => performAction(fournisseur, "PUT")}>
                        <FontAwesomeIcon icon={['fa', 'fa-edit']} /> 
                       </Button>
                      {(fournisseur.actif==true)?(
                           <Button variant="light" className="btn-sm"  title="Déactiver"  onClick={() => handleStatus(fournisseur)}>
                           <FontAwesomeIcon icon={['fa', 'fa-toggle-on']} /> 
                          </Button>
                          
                          ):(
                            <Button variant="light" className="btn-sm"  title="Activer"  onClick={() => handleStatus(fournisseur)}>
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
const renderShowFournisseur =()=> {
return (
   <div className="row">
                <div className="col-md">       
                 
                   
                   <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="table-active">Code</th><td>{fournisseur.codeFournisseur}</td></tr>
                    <tr><th className="table-active">Libelle</th><td>{fournisseur.libelle}</td></tr>
                    <tr><th className="table-active">Contact</th><td>{fournisseur.contact}</td></tr>
                    <tr><th className="table-active">Téléphone</th><td>{fournisseur.tel}</td></tr>
                    <tr><th className="table-active">Email</th><td>{fournisseur.email}</td></tr>
                    <tr><th className="table-active">Adresse</th><td>{fournisseur.adresse}</td></tr>
                    <tr><th className="table-active">TVA</th><td>{fournisseur.tva}%</td></tr>
                    <tr><th className="table-active">Devise monetaire</th><td>{fournisseur.deviseMonetaire}</td></tr>
                     <tr><th className="table-active">Remarque</th><td>{fournisseur.remarque}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{fournisseur.actif==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">User</th><td>{fournisseur.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{fournisseur.dateModif}</td></tr>                              
                                 
                </tbody>
              </table>
                                 
                                                                                    
                           
                </div>
              </div>
  )}

const renderFormFournisseur=() =>{
return (
   <div className="row">
                <div className="col-md">                               
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="codeFournisseur"
                        required
                        value={fournisseur.codeFournisseur}
                        onChange={handleFournisseurChange}
                        name="codeFournisseur"
                        placeholder="Code Fournisseur"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.codeFournisseur.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.codeFournisseur}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="libelle"
                        required
                        value={fournisseur.libelle}
                        onChange={handleFournisseurChange}
                        name="libelle"
                        placeholder="Nom fournisseur"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.libelle.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.libelle}</div>
                    </div>
                   
                    
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="contact"
                        required
                        value={fournisseur.contact}
                        onChange={handleFournisseurChange}
                        name="contact"
                        placeholder="Contact fournisseur"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.contact.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.contact}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="tel"
                        required
                        value={fournisseur.tel}
                        onChange={handleFournisseurChange}
                        name="tel"
                        placeholder="Téléphone"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.tel.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.tel}</div>
                    </div>
                      <div className="form-group">             
                      <input
                        type="text"                       
                        id="email"
                        required
                        value={fournisseur.email}
                        onChange={handleFournisseurChange}
                        name="email"
                        placeholder="Email"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.email.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.email}</div>
                    </div>
                   <div className="form-group">             
                      <textarea
                        type="text"                       
                        id="adresse"
                        required
                        value={fournisseur.adresse}
                        onChange={handleFournisseurChange}
                        name="adresse"
                        placeholder="Adresse"
                        maxLength="250"
                        className={`form-control form-control-sm ${errors.adresse.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.adresse}</div>
                    </div>
                     <div className="form-group custom-control-inline form-inline">             
                      TVA: <input
                        type="text"                       
                        id="tva"
                        required
                        value={fournisseur.tva}
                        onChange={handleFournisseurChange}
                        name="tva"
                        placeholder="tva"
                        maxLength="3"
                        style={{width: "50px"}}
                        className={`form-control form-control-sm  d-inline-block ${errors.tva.length>0 ? 'is-invalid' : ''}`}
                      />%
                       <div className="invalid-feedback">{errors.tva}</div>
                    </div>
                     <div className="form-group custom-control-inline form-inline">             
                      Devise: <input
                        type="text"                       
                        id="deviseMonetaire"
                        required
                        value={fournisseur.deviseMonetaire}
                        onChange={handleFournisseurChange}
                        name="deviseMonetaire"
                        placeholder="Dévise monetaire"
                        maxLength="10"
                        style={{width: "75px"}}
                        className={`form-control form-control-sm d-inline-block ${errors.deviseMonetaire.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.deviseMonetaire}</div>
                    </div>
                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleFournisseurChange} value={fournisseur.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
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
                        value={fournisseur.remarque}
                        onChange={handleFournisseurChange}
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
        <h3 className={Styles.HeaderL1} >Fournisseurs</h3>
        

<div className="container-body">         
{/************************************Modal for add fournisseur*******************************/}

<div className="submit-form">
    
    <div className="text-right">    
      <Button  variant="info" className="btn-sm" 
                    title="Rafraichir" onClick={() => retrieveFournisseurs()}>
                      <i className="fa fa-refresh"></i>
                  </Button>
                  <Button  variant="outline-success" className="btn-sm" 
                       title="Ajouter un fournisseur" onClick={() => performAction(fournisseur, "POST")}>
                        <FontAwesomeIcon icon={['fas', 'fa-industry']} />
                   </Button>
       
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouveau fournisseur"): 
          (perform.action=="GET")?("Détail sur le fournisseur "):
          (perform.action=="PUT")?("Modifier le fournisseur " ):
          (perform.action=="DELETE")?("Supprimer le fournisseur" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormFournisseur()

           ):(perform.action=="GET" || perform.action=="DELETE")?(

             renderShowFournisseur()

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(fournisseur.fournisseurId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(fournisseur,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveFournisseur(fournisseur)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveFournisseur(fournisseur)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteFournisseur(fournisseur)}>
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
    {renderListOfFournisseur()}
    </div>
    </header>
      </div>
  );
};
let actifFournisseur=true;
export default Fournisseurs;