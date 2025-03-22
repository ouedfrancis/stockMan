
import React, {useState, useEffect, useContext } from "react";
import VillesDataService from "../../services/villes.service";
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
const Villes = () => {

/*Create ville code*/
const initialVilleState = 
    { 
       "villeId": "",
        "codeVille": "",
        "nomVille": "",
        "province": "",
        "region": "",
        "pays": {
            "paysId": "",
            "codeIsoAlpha2": "",
            "codeIsoAlpha3": "",
            "nomPays": "",
            "monaie": "",
            "symbolMonaie": "",
            "indicatifPays": "",
            "actif": "",
        },
        "actif": true,
    };

const initialPaysState = 
    { 
       
            "paysId": "",
            "codeIsoAlpha2": "",
            "codeIsoAlpha3": "",
            "nomPays": "",
            "monaie": "",
            "symbolMonaie": "",
            "indicatifPays": "",
            "actif": "",
       
    };

    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
//const clinique = useContext(CliniqueContext);
const [ville, setVille] = useState(initialVilleState);
const [villes, setVilles] = useState([]);
const [pays, setPays] = useState(initialPaysState);
const [payss, setPayss] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialVilleState);
const [show, setShow] = useState(false);
const [showLoading, setShowLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false)
//const [actif, setActif] = useState(true);
const [upload, setUpload] = useState(null);
useEffect(() => {
    retrieveVilles(actifVille);
    //setVille(ville); 
    retrievePayss();
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}

const handleCloseLoadingModal = (close) => {
    if(close!=null && close==true)
  setShowUploadModal(false);
else
     setShowUploadModal(true);
  
}

const handleCloseAndReload = () => {
setShow(false);
refreshVille()
retrieveVilles(actifVille);
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Ville", perf.msg);                         
handleCloseAndReload()
}
/*const handleCloseAndReload = () => {
 handleClose();
  //reload();
 // if(perform.action!="GET")
  //retrieveVilles(actifVille);
}*/

const handleActifvilleChange = (event) => {
  //let act=event.target.checked;
  actifVille=event.target.checked;
  retrieveVilles(actifVille);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleVilleChange = event => {
  const { name, value } = event.target;
  setVille({ ...ville, [name]: value });
};


const handlePaysChange = event => {
  const { name, value } = event.target;
  setPays({ ...pays, [name]: value });
};
  const refreshList = () => {
    retrieveVilles();
  };

const refreshVille = () => {
    setVille(initialVilleState);
     setErrors(initialVilleState);
     setPays(initialPaysState);
     setPerform(initialPerformState);
  };


//const reload=()=>window.location.reload();
/******************************************/
async function saveVille (ville)  {
 const obj = {...ville};
 obj.userId=globalObject?.user?.id
 obj.pays={...pays};

 
   var perf=perform;
     if(isValid(obj))
     {       
          let response="";
         
          if(obj.villeId!=null && obj.villeId!="")
            response= await VillesDataService.updateAsync(obj.villeId,obj);
          else
            response= await VillesDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //vac=person.data;
                        
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
    let response=await VillesDataService.updateAsync(obj.villeId,obj);
    if(response!=null && response.status=="200")
      {
          setVille(response.data);             
         
          retrieveVilles(actifVille);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };


async function retrievePayss (){
  
    let resp=await PaysDataService.getActifAsync(); 
    if(resp!=null && resp.status=="200" )          
        {
          setPayss(resp.data);
          
        }
}
async function retrieveVilles (act){

  if ($.fn.dataTable.isDataTable('#tListOfville')) {
        $('#tListOfville').DataTable().destroy();
       
    }
    let resp=null;
    if(act==true)
    {
      resp= await VillesDataService.getAllAsync();  
       
    }else
    {
      resp= await VillesDataService.getActifAsync(); 
          
    }
    if(resp!=null && resp.status=="200" )          
        {
          setVilles(resp.data);
          
        } 

setTimeout(()=>{ 
    //$('#tListOfville').DataTable().destroy();                       
    $('#tListOfville').DataTable(

      {
        
        "autoWidth": false,
        "order": [[ 6, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 6 ],
                "visible": false,
                "searchable": false
            },
            { "width": "120", "targets": 1 },
             { "width": "120", "targets": 4 }
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
 
    let err=initialVilleState;
    let valid=true;       
    if( obj.nomVille==null || obj.nomVille.length<2) 
       {
         err.nomVille="Nom de la ville incorrecte";
         valid=false;
     } 
  
  
     if( obj.pays.paysId==null || obj.pays.paysId.length<2) 
       {
         err.pays.paysId="Indiquer le pays";
         valid=false;
     }
      
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.actif="indiquer le statut actif oui ou non ";
          valid=false;
     }
 
     
  setErrors(err);
    return valid;

  };


const performAction = (ville,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshVille();
    retrievePayss()
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
  }else
  {
    perf=perform;
    handleClose();
    setVille(ville);
    setPays(ville.pays);      
    setErrors(initialVilleState);
    handleShow();
    perf.action=action;
    setPerform(perf);
    }

    if(action!="GET")
       retrievePayss();
    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
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
          response= await VillesDataService.bulkAsync(obj,"");
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
   
{/************************************Modal for add ville******************************
 */}
<div className="submit-form">
    
    <div className="text-right"> 
    <input type="checkbox" className="custom-control-input" id="afficherTousVille" defaultChecked={actifVille}  
        onChange={handleActifvilleChange}/>
        <label className="custom-control-label" htmlFor="afficherTousVille">Afficher Tous</label>
      
      <img src="/img/csvUpload.png" title="uploader un fichier"  alt="uploader un fichier" className="iconeButtonRectangle"
                      onClick={() => uploadFile(".csv")}/>
       <Button  variant="info" className="btn-sm" 
                         title="Rafraichir" onClick={() => retrieveVilles()}>
                        <i className="fa fa-refresh"></i>
              </Button>
                        
              <Button  variant="success" className="btn-sm" 
                   title="Ajouter une ville" onClick={() => performAction(ville, "POST")}>
                     <FontAwesomeIcon icon={['fas', 'fa-plus']} />
              </Button> 
              
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouvelle ville"): 
          (perform.action=="GET")?("Détail sur la ville "):
          (perform.action=="PUT")?("Modifier la ville " ):
          (perform.action=="DELETE")?("Supprimer la ville" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {(perform.result.length>0)? (
            <div className="row" >
              <div className="col-md-2"> 
              {(perform.result!="success")?(
              <img src="/img/del.png" title="Erreur"  alt="Erreur" className="icone-40-40 mx-auto d-block"/>
              ):
              (
              <img src="/img/ok.png" title="success"  alt="Ok" className="icone-40-40 mx-auto d-block"/>)}
              </div>
              <div className="col-md-10">   
              <h6 className=" mx-auto d-block">{perform.msg}</h6>
             </div>
            </div>
          ) : ((perform.result.length==0) && (perform.action=="POST" || perform.action=="PUT"))? (
            <div className="row">
                <div className="col-md">                               
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="codeVille"
                        required
                        value={ville.codeVille}
                        onChange={handleVilleChange}
                        name="codeVille"
                        placeholder="Code ville"
                        maxLength="10"
                        className={`form-control form-control-sm ${errors.codeVille.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.codeVille}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="nomVille"
                        required
                        value={ville.nomVille}
                        onChange={handleVilleChange}
                        name="nomVille"
                        placeholder="Nom de la ville"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.nomVille.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.nomVille}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="province"
                        required
                        value={ville.province}
                        onChange={handleVilleChange}
                        name="province"
                        placeholder="Province"
                        maxLength="50"
                        className={`form-control form-control-sm ${errors.province.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.province}</div>
                    </div>
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="region"
                        required
                        value={ville.region}
                        onChange={handleVilleChange}
                        name="region"
                        placeholder="Region"
                        maxLength="20"
                        className={`form-control form-control-sm ${errors.region.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.region}</div>
                    </div>
                    
                  
                   <div className="form-group">     
                     <select id="paysId" name="paysId" onChange={handlePaysChange} value={pays.paysId}  className={`form-select form-select-sm ${errors?.pays.paysId.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Pays</option>
                      {payss &&
                      payss.map((p, index) => (
                      <option key={index} value={p.paysId}>{p.nomPays}</option>
                      ))}               
                     </select>        
                      <div className="invalid-feedback">{errors?.pays.paysId}</div>
                    </div>               
                  
                <div className="form-group">     
                     <select id="actif" name="actif" onChange={handleVilleChange} value={ville.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
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
                    <tr><th className="table-active">Code ville</th><td> {ville.codeVille}</td></tr>
                    <tr><th className="table-active">Nom</th><td>{ville.nomVille}</td></tr>
                    <tr><th className="table-active">Province</th><td>{ville.province}</td></tr> 
                    <tr><th className="table-active">Region</th><td>{ville.region}</td></tr>
                    <tr><th className="table-active">Pays</th><td>{ville?.pays.nomPays}</td></tr> 
                     <tr><th className="table-active">Actif</th><td>{ville.actif==true? "Oui":"Non"}</td></tr>
                     <tr><th className="table-active">User</th><td>{ville.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{ville.dateModif}</td></tr>                              
                                   
                </tbody>
              </table>    
                           
                </div>
              </div>

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(ville.villeId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(ville,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveVille(ville)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveVille(ville)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteVille(ville)}>
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
     {loading()}
{/************************************table list*******************************/}
    <div className="table-responsive">         
      <table id="tListOfville" className="table table-striped table-bordered display compact" >
          <thead>
            <tr> 
                <th>code</th>            
                <th>Nom</th> 
                <th>Province</th> 
                <th>Region</th> 
                <th>Pays</th>          
                <th>Actif</th>
                <th>Date de Modif</th>               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {villes &&
            villes.map((ville, index) => (
                <tr key={index}>      
                 <td>{ville.codeVille}</td>
                  <td>{ville.nomVille}</td>  
                  <td>{ville.province}</td>  
                  <td>{ville.region}</td> 
                   <td>{ville?.pays.nomPays}</td>                                               
                  <td>{ville.actif==true?"Oui":"Non"}</td> 
                  <td>{ville.dateModif}</td>                   
                  <td>
<Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(ville, "GET")}>
                       <FontAwesomeIcon icon={['fa', 'fa-eye']} /> 
                      </Button>
                      <Button variant="warning" className="btn-sm"  title="Modifier le role" onClick={() => performAction(ville, "PUT")}>
                       <FontAwesomeIcon icon={['fa', 'fa-edit']} /> 
                      </Button>
                     {(ville.actif==true)?(
                          <Button variant="light" className="btn-sm"  title="Déactiver"  onClick={() => handleStatus(ville)}>
                          <FontAwesomeIcon icon={['fa', 'fa-toggle-on']} /> 
                         </Button>
                         
                         ):(
                           <Button variant="light" className="btn-sm"  title="Activer"  onClick={() => handleStatus(ville)}>
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


         {(upload?.type!=null)&&(
       <UploadFile type={upload.type} key={upload.key}  returnData={returnData}/>)}
      </div>


  );
};
let actifVille=true;
export default Villes;