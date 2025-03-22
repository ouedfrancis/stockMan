import React, {useRef, useState, useEffect } from "react";
import ModelesDataService from "../../services/modeles.service";
import Utils from "../../utils/utils";
import UseAutosizeTextArea from "../../utils/useAutosizeTextArea";
import { Button,  Modal } from 'react-bootstrap';


import globalObject from '../../global.js'
import $ from 'jquery'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



import { Editor } from "@tinymce/tinymce-react";



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
const Modeles = () => {

/*Create modele code*/
const initialModeleState = 
    { 
       
         "modeleId": "",
        "nomModele": "",
        "description": "",
        "typeModele": "",
        "typeChamps":"", // Boolean,String,Number,Select, MultiSelect": "",
         "libelleRegroupement": "",        
        "actif": true,
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [modele, setModele] = useState(initialModeleState);
const [modeles, setModeles] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialModeleState);
const [show, setShow] = useState(false);
//const [actif, setActif] = useState(true);
 const textAreaRef = useRef(null);
//const [content, setContent] = useState("");
UseAutosizeTextArea(textAreaRef.current, modele.description);

const  permissionCerticicat=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","CONFIGURATION/HOSPITALISATION/LIT")

useEffect(() => {
    retrieveModeles(actifModele);
    //setModele(modele); 
     
  }, []);



 

  const handleEditorChange = (content, editor) => {
    /*console.log("Content was updated:", content);
    setContent(content);*/
    setModele({ ...modele, "description": content });
  };



const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshModele()
retrieveModeles(actifModele);
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Modèle", perf.msg);                         
handleCloseAndReload()
}

const handleActifmodeleChange = (event) => {
  //let act=event.target.checked;
  actifModele=event.target.checked;
  retrieveModeles(actifModele);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleModeleChange = event => {
  const { name, value } = event.target;
  setModele({ ...modele, [name]: value });
};
const handleModeleTypeChampsChange = event => {
  const { name, value } = event.target;
  let description=""
  if(value=="Boolean")
    description="Oui;Non"
  setModele({ ...modele, [name]: value,"description":description });

};


  const refreshList = () => {
    retrieveModeles();
  };

const refreshModele = () => {
    setModele(initialModeleState);
     setErrors(initialModeleState);
     setPerform(initialPerformState);
  };


//const reload=()=>window.location.reload();
/******************************************/
async function saveModele (modele)  {
 const obj = {...modele};
  obj.userId=globalObject?.user?.id

   var perf=perform;
     if(isValid(obj))
     {       
          let response="";
          if(obj.typeModele!=null &&obj.typeModele!="Certificat"&& obj.typeModele!="ResultatLaboratoire"&&obj.typeModele!="Lettre"&&obj.typeModele!="ConstantePhysiologique")
             delete obj.description

           if(obj.typeModele!=null &&obj.typeModele!="ConstantePhysiologique")
           {
             delete obj.typeChamps
            
           }
         if(obj.typeModele!=null &&obj.typeModele!="ConstantePhysiologique"&&obj.typeModele!="Certificat")
           {
              delete obj.libelleRegroupement
            
           }

          if(obj.modeleId!=null && obj.modeleId!="")
            response= await ModelesDataService.updateAsync(obj.modeleId,obj);
          else
            response= await ModelesDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //vac=person.data;
              setModele(response.data);             
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
    let response=null
    if(perform.action=="DELETE")
     {
      response=await ModelesDataService.deleteAsync(obj.modeleId);
     } 
    else
    response=await ModelesDataService.updateAsync(obj.modeleId,obj);
    if(response!=null && response.status=="200")
      {
              
          perf.result="success";
          if(perform.action=="DELETE")
          {
            perf.msg="Suppression effectuée avec succès" 
            showNotif(perf); 
          } 
           else
           retrieveModeles(actifModele);                             
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrieveModeles (act){

  if ($.fn.dataTable.isDataTable('#tListOfmodele')) {
        $('#tListOfmodele').DataTable().destroy();
       
    }
    let resp=null;
    let query="?"
    if(act==false)
    {
      query+="actif="+true 
       
    }
    console.log("query===>",query)
    resp= await ModelesDataService.findAsync(query);
    if(resp!=null && resp.status=="200" )          
        {
          setModeles(resp.data);
          
        }else 
         setModeles([])

setTimeout(()=>{ 
    //$('#tListOfmodele').DataTable().destroy();                       
    $('#tListOfmodele').DataTable(

      {
        
        "autoWidth": false,
       
        "scrollX":false,
        "scrollCollapse": true,
        "order": [[ 3, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 3 ],
                "visible": false,
                "searchable": false
            },
             { "width": "20%", "targets": 0 }
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



function isValid  (vac) {
 
    let err=initialModeleState;
    let valid=true;
        console.log(vac); 
    if( vac.nomModele==null || vac.nomModele.length<1) 
       {
         err.nomModele="Nom incorrecte";
         valid=false;
     } 
  
  
      if( vac.typeModele==null || vac.typeModele.length<2) 
       {
         err.typeModele="Type de modele requis";
         valid=false;
     } 
      
     if(vac.actif==null || vac.actif.length<2) 
         {
          err.actif="indiquer le statut actif oui ou non ";
          valid=false;
     }
 
     console.log(err);
  setErrors(err);
    return valid;

  };


const performAction = (modele,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshModele();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
  }else
  {
    perf=perform;
    handleClose();
    setModele(modele);      
    setErrors(initialModeleState);
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

function getTypeChampLibelle  (val) {
  let libelle=""
  switch (val) {
  case 'Boolean':
   libelle="Oui/Non"
  break;
  case 'String':
   libelle="Texte (Alphanumérique)"
  break;
  case 'Number':
   libelle="Nombre"
  break;
  case 'Select':
   libelle="Liste de choix"
  break;
  case 'MultiSelect':
   libelle="Liste de choix multiple"
  break;
case 'Date':
   libelle="Date"
  break;
 
  default:
     libelle=""
 }
 return libelle
}


return (
<div className="container">        
{/************************************Modal for add modele*******************************/}

<div className="submit-form">
<div className="text-right"> 
 <input type="checkbox" className="custom-control-input" id="afficherTousVille" defaultChecked={actifModele}  
        onChange={handleActifmodeleChange}/>
        <label className="custom-control-label" htmlFor="afficherTousVille">Afficher Tous</label>

       <Button  variant="info" className="btn-sm" 
                         title="Rafraichir" onClick={() => retrieveModeles()}>
                        <i className="fa fa-refresh"></i>
              </Button>
                        
              <Button  variant="success" className="btn-sm" 
                   title="Ajouter un pays" onClick={() => performAction(modele, "POST")}>
                     <FontAwesomeIcon icon={['fas', 'fa-plus']} />
              </Button>     
       
</div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-40vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouveau modèle"): 
          (perform.action=="GET")?("Détail sur le modèle "):
          (perform.action=="PUT")?("Modifier le modèle " ):
          (perform.action=="DELETE")?("Supprimer le modèle" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
            <div className="row">
                <div className="col-md">                               
                    <div className="form-group">     
                    <select id="typeModele" name="typeModele" 
                    onChange={handleModeleChange}
                     value={modele.typeModele}  className={`form-select form-select-sm ${errors.typeModele.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Type de modèle</option>
                      <option value="Profession">Type de profession</option>
                       <option value="Entreprise">Entreprise</option>
                      <option value="Marque">Produit - Marque</option>                      
                      <option value="Modele">Produit - Modèle</option>                      

                       <option value="Unite">Produit - Unité</option> 
                      <option value="Motif">Motif</option>
                      
                      {(globalObject?.clinique?.licence.modules?.includes("CERTIFICAT")!=null &&
                      <option value="Certificat">Modèle de certificat</option>)}
                       {(globalObject?.clinique?.licence.modules?.includes("CERTIFICAT")!=null &&
                       <option value="Lettre">Lettre type</option>)}
                        <option value="Conditionnement">Conditionnement</option>
                        <option value="Fabricant">Fabricant</option>
                        <option value="Tag">Tags</option>
                        
                                                               
                      </select>
                      <div className="invalid-feedback">{errors.typeModele}</div>
                    </div>
                   
                  {(modele.typeModele!=null && (modele.typeModele=="ConstantePhysiologique"))&&(
                    
                       <div className="form-group">             
                      <input
                        type="text"                       
                        id="libelleRegroupement"
                        required
                        value={modele.libelleRegroupement}
                        onChange={handleModeleChange}
                        name="libelleRegroupement"
                        placeholder="Libellé régroupement"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.libelleRegroupement.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.libelleRegroupement}</div>
                    </div>
                   )}
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="nomModele"
                        required
                        value={modele.nomModele}
                        onChange={handleModeleChange}
                        name="nomModele"
                        placeholder="Libellé du modèle"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.nomModele.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.nomModele}</div>
                    </div>
                     {(modele.typeModele!=null && (modele.typeModele=="Certificat"))&&(
                    
                       <div className="form-group">             
                      <input
                        type="text"                       
                        id="libelleRegroupement"
                        required
                        value={modele.libelleRegroupement}
                        onChange={handleModeleChange}
                        name="libelleRegroupement"
                        placeholder="Titre du document"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.libelleRegroupement.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.libelleRegroupement}</div>
                    </div>
                   )}
                     {(modele.typeModele!=null && (modele.typeModele=="ConstantePhysiologique"))&&(    
                    <div className="form-group">     
                        <select id="typeChamps" name="typeChamps" 
                        onChange={handleModeleTypeChampsChange}
                         value={modele.typeChamps}  className={`form-select form-select-sm ${errors.typeChamps.length>0 ? 'is-invalid' : ''}`}>
                          <option disabled={true} value="">Type de valeurs possibles</option>
                          <option value="Boolean">Oui/Non</option>
                          <option value="String">Texte (Alphanumérique)</option>
                          <option value="Number">Nombre</option>
                          <option value="Select">Liste de choix</option>
                          <option value="MultiSelect">Liste à choix multiple</option>
                          <option value="Date">Date</option>
                           </select>
                      <div className="invalid-feedback">{errors.typeChamps}</div>
                    </div>                
                      )}
                  {(modele.typeChamps!=null && (modele.typeChamps=="Select"||modele.typeChamps=="MultiSelect"))&&(                  
                   <div className="form-group">
                    <span className="text-danger">Indiquer la liste des valeurs possibles en les séparant par des ";" ou des retours à la ligne</span>             
                      <textarea
                        type="text"                       
                        id="description"
                        required
                        value={modele.description}
                        onChange={handleModeleChange}
                        name="description"
                        placeholder="Valeurs possibles"
                        maxLength="250"
                        ref={textAreaRef}
                        rows={5}
                        className={`form-control form-control-sm ${errors.description.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.description}</div>
                    </div>
                    
                      )}
                  {(modele.typeModele!=null && (modele.typeModele=="Certificat"|| modele.typeModele=="Lettre"))&&(
                     <div className="form-group">
                    <span>Description</span>
                     <span className="text-danger"><br/>[[DATE_DU_JOUR]] [[DATE_DEBUT]][[DATE_FIN]]</span>
                     <span className="text-danger"><br/>[[PRATICIEN]] [[PRATICIEN_SPECIALITE]] </span>
                     <span className="text-danger"><br/>[[PATIENT_CIVILITE]] [[PATIENT]]  [[PATIENT_DATE_NAISSANCE]] [[PATIENT_AGE]]</span>
                     <span className="text-danger"><br/>[[PATIENT_SEXE]] [[PATIENT_VILLE_NAISSANCE]]</span>

                     <Editor
                      apiKey="votre_api_key_tinymce" // Remplacez par une clé API valide ou laissez vide pour le mode gratuit
                      value={modele.description}
                      tinymceScriptSrc="/js/tinymce/tinymce.min.js" // Remplacez par le chemin vers tinymce.min.js
                      init={Utils.initEditor}
                      onEditorChange={handleEditorChange}
                    />
                     </div>
                     )}
                  {modele.typeModele!=null && ( modele.typeModele=="ResultatLaboratoire")&&(

                     <div className="form-group">
                    <span>Description</span>
                    <Editor
                      apiKey="votre_api_key_tinymce" // Remplacez par une clé API valide ou laissez vide pour le mode gratuit
                      value={modele.description}
                      tinymceScriptSrc="/js/tinymce/tinymce.min.js" // Remplacez par le chemin vers tinymce.min.js
                      init={Utils.initEditor}
                      onEditorChange={handleEditorChange}
                    />                     
                     </div>
                      )}
                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleModeleChange} value={modele.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
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
                    <tr><th className="table-active">Type de modèle</th><td>[{modele.typeModele}]</td></tr>
                    {(modele.typeModele!=null&&modele.typeModele=="ConstantePhysiologique"&&<tr><th className="table-active">Libellé du régroupement</th><td>{modele.libelleRegroupement}</td></tr>)}

                    <tr><th className="table-active">Libellé du modèle</th><td>{modele.nomModele}</td></tr>
                  {(modele.typeModele!=null&&modele.typeModele=="Certificat"&&<tr><th className="table-active">Titre du document</th><td>{modele.libelleRegroupement}</td></tr>)}

                    {(modele.typeChamps!=null&&<tr><th className="table-active">Type de valeur possible</th><td>{getTypeChampLibelle(modele.typeChamps)}</td></tr>)}

                    {(modele.typeChamps!=null&&(modele.typeChamps=="Select"||modele.typeChamps=="MultiSelect")&&<tr><th className="table-active">Liste de valeurs possibles</th><td><div style={{ "overflow": "auto", "maxHeight": "400px",  "maxWidth": "400px"}} dangerouslySetInnerHTML={{__html: Utils.replaceAllCustom(modele.description,"\n","<br/>")}}/></td></tr>)}
                     {(modele.typeChamps==null&&modele.description!=null&&modele.description!=""&&<tr><th className="table-active">Description</th><td><div dangerouslySetInnerHTML={Utils.createMarkup(modele.description)}/></td></tr>)}

                    <tr><th className="table-active">Actif</th><td>{modele.actif==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">Modifier par</th><td>{modele.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{modele.dateModif}</td></tr>                              
                                 
                </tbody>
              </table>
                                 
                                                                                    
                           
                </div>
              </div>

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(modele.modeleId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(modele,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveModele(modele)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveModele(modele)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => handleStatus(modele)}>
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
      <table id="tListOfmodele" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Type de modèle</th>
                <th>Libellé</th>
                
                <th>Actif</th>
                <th>Date de Modif</th>               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {modeles &&
            modeles.map((modele, index) => (
                <tr key={index}>      
                  <td>[{modele.typeModele}]</td>  
                  <td>{modele.libelleRegroupement!=null&&(modele.libelleRegroupement+ " - ")} {modele.nomModele}</td>            
                                              
                  <td>{modele.actif==true?"Oui":"Non"}</td> 
                  <td>{modele.dateModif}</td> 
                  
                  <td>
 <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(modele, "GET")}>
                        <FontAwesomeIcon icon={['fa', 'fa-eye']} /> 
                       </Button>
                       <Button variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(modele, "PUT")}>
                        <FontAwesomeIcon icon={['fa', 'fa-edit']} /> 
                       </Button>
                      {(modele.actif==true)?(
                           <Button variant="light" className="btn-sm"  title="Déactiver"  onClick={() => handleStatus(modele)}>
                           <FontAwesomeIcon icon={['fa', 'fa-toggle-on']} /> 
                          </Button>
                          
                          ):(
                            <Button variant="light" className="btn-sm"  title="Activer"  onClick={() => handleStatus(modele)}>
                           <FontAwesomeIcon icon={['fa', 'fa-toggle-off']} /> 
                          </Button>
                            )
                      }                      
                        <Button variant="danger" className="btn-sm"  title="Supprimer"  onClick={() => performAction(modele,"DELETE")}>
                           <FontAwesomeIcon icon={['fa', 'fa-trash-alt']} /> 
                        </Button>
                   
                   </td>              
                </tr>

          ))}          
          </tbody>          
        </table>     
        </div>
      </div>
  );
};
let actifModele=true;
export default Modeles;