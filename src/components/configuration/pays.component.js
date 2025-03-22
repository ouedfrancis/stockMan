import React, {useState, useEffect } from "react";
import PaysDataService from "../../services/pays.service";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import globalObject from '../../global.js'
import $ from 'jquery'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import UploadFile from "../../components/uploadFile.component";
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
const Pays = () => {

/*Create pays code*/
const initialPaysState = 
    { 
       
        "paysId": null,
        "codeIsoAlpha2": "",
        "codeIsoAlpha3": "",
        "nomPays": "",
        "monaie": "",
        "symbolMonaie": "",
        "indicatifPays": "",
        "actif": true
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",
       
    };
const [pays, setPays] = useState(initialPaysState);
const [payss, setPayss] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialPaysState);
const [show, setShow] = useState(false);
//const [actif, setActif] = useState(true);

const [showLoading, setShowLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false)
const [upload, setUpload] = useState(null);

useEffect(() => {
    retrievePayss(actifPays);
    //setPays(pays); 
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshPays()
retrievePayss(actifPays);
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Pays", perf.msg);                         
handleCloseAndReload()
}
const handleActifpaysChange = (event) => {
  //let act=event.target.checked;
  actifPays=event.target.checked;
  retrievePayss(actifPays);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handlePaysChange = event => {
  const { name, value } = event.target;
  setPays({ ...pays, [name]: value });
};

  const refreshList = () => {
    retrievePayss();
  };

const refreshPays = () => {
    setPays(initialPaysState);
     setErrors(initialPaysState);
     setPerform(initialPerformState);
  };


//const reload=()=>window.location.reload();
/******************************************/
async function savePays (pays)  {
 const country = {...pays};
   country.userId=globalObject?.user?.id
   var perf=perform;
     if(isValid(country))
     {       
          let pay="";
          
          if(country.paysId!=null && country.paysId!="")
            pay= await PaysDataService.updateAsync(country.paysId,country);
          else
            pay= await PaysDataService.createAsync(country);

          if(pay!=null && (pay.status=="200" || pay.status=="201"))
            {
              //country=person.data;
              setPays(pay.data);             
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
              perf.msg= pay.data.message;
             
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
    let pay=await PaysDataService.updateAsync(obj.paysId,obj);
    if(pay!=null && pay.status=="200")
      {
          setPays(pay.data);             
         
          retrievePayss(actifPays);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg=pay.data.message;
               showNotif(perf);

        }
    
  };



async function retrievePayss (act){

  if ($.fn.dataTable.isDataTable('#tListOfpays')) {
        $('#tListOfpays').DataTable().destroy();
       
    }
    let resp=null;
    if(act==true)
    {
      resp= await PaysDataService.getAllAsync();  
       
    }else
    {
      resp= await PaysDataService.getActifAsync(); 
          
    }
    if(resp!=null && resp.status=="200" )          
        {
          setPayss(resp.data);
          
        } 

setTimeout(()=>{ 
    //$('#tListOfpays').DataTable().destroy();                       
    $('#tListOfpays').DataTable(

      {
        /*"scrollY":"600px",
        "scrollX":false,
        "scrollCollapse": true,*/
        "autoWidth": false,

        "order": [[ 5, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 5 ],
                "visible": false,
                "searchable": false
            },
             { "width": "120", "targets": 1 },
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



function isValid  (country) {
 
    let err=initialPaysState;
    let valid=true;
         
    if( country.codeIsoAlpha2==null || country.codeIsoAlpha2.length<2) 
       {
         err.codeIsoAlpha2="Code Iso Alpha2 incorrecte";
         valid=false;
     } 
  
  
      if( country.nomPays==null || country.nomPays.length<2) 
       {
         err.nomPays="Le nom pays est incorrecte";
         valid=false;
     } 
      if( country.symbolMonaie==null || country.symbolMonaie.length==0) 
       {
         err.symbolMonaie="Le symbole monétaire n'est pas renseigné";
         valid=false;
     } 

     
     if(country.actif==null || country.actif.length<2) 
         {
          err.actif="Indiquer le statut actif oui ou non ";
          valid=false;
     }
 

  setErrors(err);
    return valid;

  };


const performAction = (pays,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshPays();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
  }else
  {
    perf=perform;
    handleClose();
    setPays(pays);      
    setErrors(initialPaysState);
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

/*************************************upload functionalities****************/
const handleCloseLoadingModal = (close) => {
    if(close!=null && close==true)
  setShowUploadModal(false);
else
     setShowUploadModal(true);
  
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

async function importFile (obj)  {
 
         let response="";
        // console.log(JSON.stringify(obj));
          response= await PaysDataService.bulkAsync(obj,"");
         let perf=perform;
          if(response!=null && (response.status=="201"))
            {
                        
              perf.result="success";
             
                perf.msg="Import effectué avec succès" 
              
              showNotif(perf);    
              
                                        
            }  
           else
           {
             
              perf.result="error";
              if(response!=null && response.status!=null)
              perf.msg= response.data.message;
              else
                 perf.msg="ERREUR inattendue s'est produite"
             
               showNotif(perf);
               
              
           }            
        
  };

async function returnData (data){
setShowLoading(true)
   await importFile(data);
  setShowLoading(false)
  
   handleCloseLoadingModal(true)

}

const loading =()=> {
return (
<div className="container">        

      <Modal  centered show={showLoading} onHide={handleCloseLoadingModal} animation={true} dialogClassName='modal-loading' >
        <Modal.Body>
           <img src="/img/loading.gif" title="Chargement"  alt="Chargement en cours" className="profile-img-card"/>
           Chargement de la liste en cours...
        </Modal.Body>
        
      </Modal>
</div>)
}


return (
<div className="container">  
{loading()}      
{(upload?.type!=null)&&(
       <UploadFile type={upload.type} key={upload.key}  returnData={returnData}/>)}      
{/************************************Modal for add pays*******************************/}

<div className="submit-form">
    
    <div className="text-right">  
 <input type="checkbox" className="custom-control-input" id="afficherTousVille" defaultChecked={actifPays}  
        onChange={handleActifpaysChange}/>
        <label className="custom-control-label" htmlFor="afficherTousVille">Afficher Tous</label>
      
      <img src="/img/csvUpload.png" title="uploader un fichier"  alt="uploader un fichier" className="iconeButtonRectangle"
                      onClick={() => uploadFile(".csv")}/>
       <Button  variant="info" className="btn-sm" 
                         title="Rafraichir" onClick={() => retrievePayss()}>
                        <i className="fa fa-refresh"></i>
              </Button>
                        
              <Button  variant="success" className="btn-sm" 
                   title="Ajouter un pays" onClick={() => performAction(pays, "POST")}>
                     <FontAwesomeIcon icon={['fas', 'fa-plus']} />
              </Button>       

      
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouveau pays"): 
          (perform.action=="GET")?("Détail sur le pays "):
          (perform.action=="PUT")?("Modifier le pays " ):
          (perform.action=="DELETE")?("Supprimer le pays" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {((perform.action=="POST" || perform.action=="PUT"))? (
            <div className="row">
                <div className="col-md">                               
                   
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="codeIsoAlpha2"
                        required
                        value={pays.codeIsoAlpha2}
                        onChange={handlePaysChange}
                        name="codeIsoAlpha2"
                        placeholder="Code Pays (ex: FR, BF)"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.codeIsoAlpha2.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.codeIsoAlpha2}</div>
                    </div>
                   
                     <div className="form-group">             
                      <input
                        type="text"                       
                        id="nomPays"
                        required
                        value={pays.nomPays}
                        onChange={handlePaysChange}
                        name="nomPays"
                        placeholder="Le nom du pays"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.nomPays.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.nomPays}</div>
                    </div>
                   
                     <div className="form-group">             
                      <input
                        type="text"                       
                        id="monaie"
                        required
                        value={pays.monaie}
                        onChange={handlePaysChange}
                        name="monaie"
                        placeholder="Monaie"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.monaie.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.monaie}</div>
                    </div>
                     <div className="form-group">             
                      <input
                        type="text"                       
                        id="symbolMonaie"
                        required
                        value={pays.symbolMonaie}
                        onChange={handlePaysChange}
                        name="symbolMonaie"
                        placeholder="Symbole Monétaire"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.symbolMonaie.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.symbolMonaie}</div>
                    </div>
                    
                   
                 
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="indicatifPays"
                        required
                        value={pays.indicatifPays}
                        onChange={handlePaysChange}
                        name="indicatifPays"
                        placeholder="Indicatif du Pays"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.indicatifPays.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.indicatifPays}</div>
                    </div>
                  
                   
                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handlePaysChange} value={pays.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.actif}</div>
                    </div>
                                          
                </div>
                
              </div>):(perform.action=="GET" || perform.action=="DELETE")?(

              <div className="row">
                <div className="col-md">   
                <table className='table table-bordered table-sm'>
                <tbody>
                    
                    <tr><th className="table-active">Code pays</th><td>{pays.codeIsoAlpha2}</td></tr>
                     <tr><th className="table-active">Nom du pays</th><td>{pays.nomPays}</td></tr>
                    <tr><th className="table-active">Nom de la Monaie</th><td>{pays.monaie}</td></tr> 
                    <tr><th className="table-active">Code Monaie</th><td>{pays.symbolMonaie}</td></tr>
                    <tr><th className="table-active">Indicatif du Pays</th><td>{pays.indicatifPays}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{pays.actif==true? "Oui":"Non"}</td></tr>
                    <tr><th className="table-active">User</th><td>{pays.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{pays.dateModif}</td></tr>
                              
                </tbody>
              </table>    
                          
                
               
                </div>
              </div>

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(pays.paysId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(pays,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => savePays(pays)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => savePays(pays)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deletePays(pays)}>
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
    <div className="table-responsive">         
      <table id="tListOfpays" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              
                <th>Code</th>
                <th>Nom</th>
                <th>Monaie</th>
              
                <th>Indicatif</th>
                <th>Actif</th>
                <th>Date de Modif</th>
                
               <th>Actions</th>
              
            </tr>
          </thead>
          <tbody>
           {payss &&
            payss.map((pays, index) => (
                <tr key={index}>      
                  <td>{pays.codeIsoAlpha2}</td>            
                  <td>{pays.nomPays}</td>              
                  <td>{pays.monaie} ({pays.symbolMonaie})</td>
                
                  <td>{pays.indicatifPays}</td> 
                  
                  <td>{pays.actif==true?"Oui":"Non"}</td> 
                  <td>{pays.dateModif}</td> 
                  
                  <td>
<Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(pays, "GET")}>
                       <FontAwesomeIcon icon={['fa', 'fa-eye']} /> 
                      </Button>
                      <Button variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(pays, "PUT")}>
                       <FontAwesomeIcon icon={['fa', 'fa-edit']} /> 
                      </Button>
                     {(pays.actif==true)?(
                          <Button variant="light" className="btn-sm"  title="Déactiver"  onClick={() => handleStatus(pays)}>
                          <FontAwesomeIcon icon={['fa', 'fa-toggle-on']} /> 
                         </Button>
                         
                         ):(
                           <Button variant="light" className="btn-sm"  title="Activer"  onClick={() => handleStatus(pays)}>
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
      </div>
  );
};
let actifPays=true;
export default Pays;