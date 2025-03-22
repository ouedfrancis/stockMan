import React, {useState, useEffect } from "react";
import CategorieProduitsDataService from "../../../services/stock/categorieProduits.service";
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
const CategorieProduits = () => {

/*Create categorieProduit code*/
const initialCategorieProduitState = 
    { 
       
        "categorieProduitId": "",
        "libelle": "",
        "codeCategorieProduit": "",         
        "categorieProduitParentId": "",
        "remarque": "",
        "actif": true,
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [categorieProduit, setCategorieProduit] = useState(initialCategorieProduitState);
const [categorieProduits, setCategorieProduits] = useState([]);
const [categorieProduitParents, setCategorieProduitParents] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialCategorieProduitState);
const [show, setShow] = useState(false);

useEffect(() => {
    retrieveCategorieProduits(actifCategorieProduit);
    //setCategorieProduit(categorieProduit); 
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshCategorieProduit()

}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"CategorieProduit", perf.msg);                         
handleCloseAndReload()
}

const handleActifcategorieProduitChange = (event) => {
  //let act=event.target.checked;
  actifCategorieProduit=event.target.checked;
  retrieveCategorieProduits(actifCategorieProduit);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleCategorieProduitChange = event => {
  const { name, value } = event.target;
  setCategorieProduit({ ...categorieProduit, [name]: value });
};

  const refreshList = () => {
    retrieveCategorieProduits();
  };

const refreshCategorieProduit = () => {
    setCategorieProduit(initialCategorieProduitState);
     setErrors(initialCategorieProduitState);
     setPerform(initialPerformState);
     retrieveCategorieProduits();
  };



//const reload=()=>window.location.reload();
/******************************************/
async function saveCategorieProduit (categorieProduit)  {
 const obj = {...categorieProduit};
  obj.userId=globalObject?.user?.id

  console.log("saveCategorieProduit=========>",obj)

   var perf=perform;
     if(isValid(obj))
     {       
          let response="";
         
          if(obj.categorieProduitId!=null && obj.categorieProduitId!="")
            response= await CategorieProduitsDataService.updateAsync(obj.categorieProduitId,obj);
          else
            response= await CategorieProduitsDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setCategorieProduit(response.data);             
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
    let response=await CategorieProduitsDataService.updateAsync(obj.categorieProduitId,obj);
    if(response!=null && response.status=="200")
      {


          setCategorieProduit(response.data);             
           
          retrieveCategorieProduits(actifCategorieProduit);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrieveCategorieProduits (act){

  if ($.fn.dataTable.isDataTable('#tListOfcategorieProduit')) {
        $('#tListOfcategorieProduit').DataTable().destroy();
       
    }
    let resp=null;
    
      resp= await CategorieProduitsDataService.getAllAsync();  
       
    if(resp!=null && resp.status=="200" )          
        {
          
          let ListCatProduitWithLibelleParent=getcaterogieProduitWithlibelleParent(resp.data)
          ListCatProduitWithLibelleParent=Utils.trierListeParChamp(ListCatProduitWithLibelleParent,"libelleParent",true)
          setCategorieProduits(ListCatProduitWithLibelleParent);
          
        }else 
         setCategorieProduits([])

setTimeout(()=>{ 
    //$('#tListOfcategorieProduit').DataTable().destroy();                       
    $('#tListOfcategorieProduit').DataTable(

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
 
    let err=initialCategorieProduitState;
    let valid=true;
        console.log(obj); 
    if( obj.libelle==null || obj.libelle.length<2) 
       {
         err.libelle="Libellé du categorieProduit incorrecte";
         valid=false;
     } 
  
  
      if( obj.codeCategorieProduit==null || obj.codeCategorieProduit.length<2) 
       {
         err.codeCategorieProduit="Code categorieProduit requis";
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


const performAction = (categorieProduit,action) => {
  let perf=null;
  if(action=="POST")
  {
    //refreshCategorieProduit();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);

  }else
  {
    perf=perform;
    handleClose();
    setCategorieProduit(categorieProduit);      
    setErrors(initialCategorieProduitState);
    handleShow();
    perf.action=action;
    setPerform(perf);
    }
    if(action=="PUT")
    {
      let parents=[]
      parents=Utils.supprimerObjetSelonContenuDuChamp(categorieProduits,"libelleParent","/"+categorieProduit.libelle)
      if(parents.length>0)
      setCategorieProduitParents(parents)
      else
         setCategorieProduitParents([])
    }

    
  };


function getcaterogieProduitWithlibelleParent  (catProduits) {

let list=[]
  for( const catP of catProduits)
      {
        let obj={...catP}
        let libelleParent=obj.libelle
        let parentId=obj.categorieProduitParentId
        while(parentId!=null &&parentId!="")
        {
          let catProduitParent=Utils.filterArrayByFieldNameAndValueAndOneObject(catProduits,"categorieProduitId",parentId)
          if(catProduitParent!=null)
          {
           
            libelleParent=catProduitParent.libelle+"/"+libelleParent
            parentId=catProduitParent.categorieProduitParentId
          }else
           parentId=null
        }
        
        obj.libelleParent=libelleParent

        list.push(obj)

      }
      return list
}
function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}


const renderListOfCategorieProduit=() =>{
return (
<div className="table-responsive">         
      <table id="tListOfcategorieProduit" className="table table-striped table-bordered display compact" >
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
           {categorieProduits &&
            categorieProduits.map((categorieProduit, index) => (
                <tr key={index}> 
                <td>{categorieProduit.dateModif}</td> 
                  <td>{categorieProduit.libelleParent.replace(categorieProduit.libelle,"").replace(/\/(\s+)?$/, '')}</td>
                  <td>{categorieProduit.codeCategorieProduit}</td>       
                  <td>{categorieProduit.libelle}</td>                                                         
                  <td>{categorieProduit.actif==true?"Oui":"Non"}</td> 
            
                  <td>
                    <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(categorieProduit, "GET")}>
                                          <FontAwesomeIcon icon={['fa', 'fa-eye']} /> 
                                         </Button>
                                         <Button variant="warning" className="btn-sm"  title="Modifier le role" onClick={() => performAction(categorieProduit, "PUT")}>
                                          <FontAwesomeIcon icon={['fa', 'fa-edit']} /> 
                                         </Button>
                                        {(categorieProduit.actif==true)?(
                                             <Button variant="light" className="btn-sm"  title="Déactiver"  onClick={() => handleStatus(categorieProduit)}>
                                             <FontAwesomeIcon icon={['fa', 'fa-toggle-on']} /> 
                                            </Button>
                                            
                                            ):(
                                              <Button variant="light" className="btn-sm"  title="Activer"  onClick={() => handleStatus(categorieProduit)}>
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
const renderShowCategorieProduit =()=> {
return (
   <div className="row">
                <div className="col-md">       
                 
                   
                   <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="table-active">Code</th><td>{categorieProduit.codeCategorieProduit}</td></tr>
                    <tr><th className="table-active">Libelle</th><td>{categorieProduit.libelle}</td></tr>
                    <tr><th className="table-active">Catégorie parent</th><td>{categorieProduit.libelleParent?.replace(categorieProduit.libelle,"").replace(/\/(\s+)?$/, '')}</td></tr>
                    <tr><th className="table-active">Remarque</th><td>{categorieProduit.remarque}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{categorieProduit.actif==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">User</th><td>{categorieProduit.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{categorieProduit.dateModif}</td></tr>                              
                                 
                </tbody>
              </table>
                                 
                                                                                    
                           
                </div>
              </div>
  )}

const renderFormCategorieProduit=() =>{
return (
   <div className="row">
                <div className="col-md">                               
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="codeCategorieProduit"
                        required
                        value={categorieProduit.codeCategorieProduit}
                        onChange={handleCategorieProduitChange}
                        name="codeCategorieProduit"
                        placeholder="Code CategorieProduit"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.codeCategorieProduit.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.codeCategorieProduit}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="libelle"
                        required
                        value={categorieProduit.libelle}
                        onChange={handleCategorieProduitChange}
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
                        
                       defaultValue={categorieProduit!=null&&categorieProduit.categorieProduitParentId!=null&&categorieProduit.categorieProduitParentId!=""?categorieProduit:""}
                       getOptionLabel={e => e.libelleParent}
                        getOptionValue={e => e.categorieProduitParentId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...categorieProduit}                                             
                              if(newValue!=null)                           
                               {
                                obj.categorieProduitParentId=newValue.categorieProduitId
                               } 
                                else
                             {
                                    obj.categorieProduitParentId=initialCategorieProduitState.categorieProduitParentId 
                                }   
                              setCategorieProduit(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={categorieProduits}
                        placeholder={`Catégorie parent`}
                        className={`form-control-sm px-0 ${errors?.categorieProduitParentId!=null && errors?.categorieProduitParentId.length>0 ? 'is-invalid' : ''}`}/>
                        ):(
                      <Select                  
                       defaultValue={categorieProduit!=null&&categorieProduit.categorieProduitId!=null&&categorieProduit.categorieProduitId!=""?categorieProduit:""}
                       getOptionLabel={e => e.libelleParent.replace(categorieProduit.libelle,"")?.replace(/\/(\s+)?$/, '')}
                        getOptionValue={e => e.categorieProduitParentId}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...categorieProduit}                                             
                              if(newValue!=null)                           
                               {
                                obj.categorieProduitParentId=newValue.categorieProduitId
                               } 
                                else
                             {
                                    obj.categorieProduitParentId=initialCategorieProduitState.categorieProduitParentId 
                                }   
                              setCategorieProduit(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={categorieProduitParents}
                        placeholder={`Catégorie parent`}
                        className={`form-control-sm px-0 ${errors?.categorieProduitParentId!=null && errors?.categorieProduitParentId.length>0 ? 'is-invalid' : ''}`}/>


                        )}                       
                      <div className="invalid-feedback">{errors?.categorieProduitParentId}</div>
                    </div>
                   
                

                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleCategorieProduitChange} value={categorieProduit.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
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
                        value={categorieProduit.remarque}
                        onChange={handleCategorieProduitChange}
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
        <h3 className={Styles.HeaderL1} > Catégories</h3>
<div className="container-body">        
{/************************************Modal for add categorieProduit*******************************/}

<div className="submit-form">
    
    <div className="text-right">    
       <Button  variant="info" className="btn-sm" 
                         title="Rafraichir" onClick={() => retrieveCategorieProduits()}>
                        <i className="fa fa-refresh"></i>
              </Button>
                        
              <Button  variant="outline-success" className="btn-sm" 
                   title="Ajouter une catégorie" onClick={() => performAction(categorieProduit, "POST")}>
                     <FontAwesomeIcon icon={['fas', 'fa-sitemap']} />
              </Button> 
      
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouvelle categorie de produit"): 
          (perform.action=="GET")?("Détail sur la categorie du produit "):
          (perform.action=="PUT")?("Modifier la categoriedu produit " ):
          (perform.action=="DELETE")?("Supprimer la categorie du produit" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormCategorieProduit()

           ):(perform.action=="GET" || perform.action=="DELETE")?(

             renderShowCategorieProduit()

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(categorieProduit.categorieProduitId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(categorieProduit,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveCategorieProduit(categorieProduit)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveCategorieProduit(categorieProduit)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteCategorieProduit(categorieProduit)}>
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
    {renderListOfCategorieProduit()}
      </div>
    </header>
    </div>
  );
};
let actifCategorieProduit=true;
export default CategorieProduits;