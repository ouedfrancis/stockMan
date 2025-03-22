import React, {useState, useEffect } from "react";
import PharmaciesDataService from "../../../services/stock/pharmacies.service";
import EntrepotsDataService from "../../../services/stock/entrepots.service";
import PersonnelDataService from "../../../services/personnels.service";
import Utils from "../../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import Styles from '../../../styles.module.css';
import Select from 'react-select';
import globalObject from '../../../global.js'
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

 /* eslint-disable */
const Pharmacies = () => {

/*Create pharmacie code*/
const initialPharmacieState = 
    { 
       
        "pharmacieId": "",
        "libelle": "",
        "entrepotId":"",
        "entrepot":{},
        "gestionnaire": {},  
        "gestionnaireId": "",
        "employes": "",
        "codePharmacie": "",     
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
const [pharmacie, setPharmacie] = useState(initialPharmacieState);
const [pharmacies, setPharmacies] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialPharmacieState);
const [show, setShow] = useState(false);
const [entrepots, setEntrepots] = useState([]);
const [personnels, setPersonnels] = useState([]);
useEffect(() => {
   retrieveEntrepots();
    retrievePharmacies(actifPharmacie);
    retrievePersonnels();
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshPharmacie()

}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Pharmacie", perf.msg);                         
handleCloseAndReload()
}

const handleActifpharmacieChange = (event) => {
  //let act=event.target.checked;
  actifPharmacie=event.target.checked;
  retrievePharmacies(actifPharmacie);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handlePharmacieChange = event => {
  const { name, value } = event.target;
  setPharmacie({ ...pharmacie, [name]: value });
};

  const refreshList = () => {
    retrievePharmacies();
  };

const refreshPharmacie = () => {
    setPharmacie(initialPharmacieState);
     setErrors(initialPharmacieState);
     setPerform(initialPerformState);
     retrievePharmacies(actifPharmacie);
  };

const getPersonnels = (employes) => {

   let values=[]
   if(employes!=null&& employes!="")
   {
      let list=employes.split(";")
       for (var i = 0; i <  list.length; i++) {  
            //console.log("employes ID===>>",list[i].trim())
            let val=Utils.trouverObjetDansListObject(personnels,"key",list[i].trim())
            if(val!=undefined&&val!=null)
            values.push(val)
      }    
   }
   
   return values;
  };



 
  
async function retrievePersonnels (){
    let resp=null
    let q="personnel=true"


    resp= await PersonnelDataService.getByPersonnelsLiteAsync(q);
  
    if(resp!=null && resp.status=="200" )          
        {
          setPersonnels(resp.data);   
          //console.log("setPersonnels====>",resp.data)      
        }else 
         setPersonnels([])


}
async function retrieveEntrepots (){
 
    let resp=null;
    let query="?"
    
      query+="actif=true"
      resp= await EntrepotsDataService.findAsync(query); 
          
   
    if(resp!=null && resp.status=="200" )          
        {
          setEntrepots(resp.data);
          /*if(resp.data[0]!=null)
          {
            retrieveEntrepotProduits(resp.data[0].entrepotId);
            getEntrepotEmplacements(resp.data[0]?.emplacement)
          }*/
          //console.log("setEntrepots====>",resp.data)

        }else
     setEntrepots([])

    //setShowEntrepotProduitPatientsLoading(false)
}
//const reload=()=>window.location.reload();
/******************************************/
async function savePharmacie (pharmacie)  {
 const obj = {...pharmacie};
  obj.userId=globalObject?.user?.id

  //console.log("savePharmacie=========>",obj)
  //    console.log("personnels=========>",personnels)
   var perf=perform;
     if(isValid(obj))
     {       
          let response="";
         
          if(obj.pharmacieId!=null && obj.pharmacieId!="")
            response= await PharmaciesDataService.updateAsync(obj.pharmacieId,obj);
          else
            response= await PharmaciesDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //obj=person.data;
              setPharmacie(response.data);             
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
    let response=await PharmaciesDataService.updateAsync(obj.pharmacieId,obj);
    if(response!=null && response.status=="200")
      {
          setPharmacie(response.data);             
           
          retrievePharmacies(actifPharmacie);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };



async function retrievePharmacies (act){

  if ($.fn.dataTable.isDataTable('#tListOfpharmacie')) {
        $('#tListOfpharmacie').DataTable().destroy();
       
    }
    let resp=null;
    
      resp= await PharmaciesDataService.getAllAsync();  
       
    if(resp!=null && resp.status=="200" )          
        {
          setPharmacies(resp.data);
           //console.log("setPharmacies=========>",resp.data)
          
        }else 
         setPharmacies([])

setTimeout(()=>{ 
    //$('#tListOfpharmacie').DataTable().destroy();                       
    $('#tListOfpharmacie').DataTable(

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
 
    let err=initialPharmacieState;
    let valid=true;
        //console.log(obj); 
    if( obj.libelle==null || obj.libelle.length<2) 
       {
         err.libelle="Libellé du pharmacie incorrecte";
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
  
      if( obj.codePharmacie==null || obj.codePharmacie.length<2) 
       {
         err.codePharmacie="Code pharmacie requis";
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


const performAction = (pharmacie,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshPharmacie();
    let obj={...pharmacie}
    obj.tva=globalObject?.clinique?.config.tauxTVAEntreprise
    obj.deviseMonetaire=globalObject?.clinique?.config?.deviseMonetaire
    setPharmacie(obj)
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);

  }else
  {
    perf=perform;
    handleClose();
    setPharmacie(pharmacie);      
    setErrors(initialPharmacieState);
    handleShow();
    perf.action=action;
    setPerform(perf);
    }


if(action=="POST"||action=="PUT")
 {

  if(personnels.length==0)
    retrievePersonnels();

 } 
   
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}


const renderListOfPharmacie=() =>{
return (
<div className="table-responsive">         
      <table id="tListOfpharmacie" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
              <th>Date de Modif</th>
                <th>Code</th>
                <th>Pharmacie</th>
                <th>Contact</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Actif</th>
                               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {pharmacies &&
            pharmacies.map((pharmacie, index) => (
                <tr key={index}> 
                 <td>{pharmacie.dateModif}</td> 
                  <td>{pharmacie.codePharmacie}</td>       
                  <td>{pharmacie.libelle}</td> 
                    <td>{pharmacie?.contact}</td>           
                   <td>{pharmacie?.tel}</td>
                    <td>{pharmacie?.email}</td>                    
                  <td>{pharmacie.actif==true?"Oui":"Non"}</td> 
                 
                  
                  <td>
                      <img src="/img/read.png" title="Voir details"  alt="Voir details" className="icone-action"
                      onClick={() => performAction(pharmacie, "GET")}/> 
                      <img src="/img/write.png" title="Modifier"  alt="Modifier" className="icone-action"
                      onClick={() => performAction(pharmacie,"PUT")}/>
                       {(pharmacie.actif==true)?(
                        <img src="/img/on.png" title="Déactiver"  alt="cliquer pour déactiver" className="icone-action-25"
                       onClick={() => handleStatus(pharmacie)}/>
                        ):(
                        <img src="/img/off.png" title="Activer"  alt="cliquer pour activer" className="icone-action-25"
                       onClick={() => handleStatus(pharmacie)}/>
                        )
                    }
                   </td>              
                </tr>

          ))}          
          </tbody>          
        </table>     
        </div>
  )}
const renderShowPharmacie =()=> {
return (
   <div className="row">
                <div className="col-md">       
                 
                   
                   <table className={Styles.styledTable}>
                <tbody>
                    <tr><th className="table-active">Code</th><td>{pharmacie.codePharmacie}</td></tr>
                    <tr><th className="table-active">Libelle</th><td>{pharmacie.libelle}</td></tr>
                    <tr><th className="table-active">Entrepot</th><td>{pharmacie?.entrepot?.libelle} </td></tr>
                    <tr><th className="table-active">Gestionnaire</th><td>{pharmacie?.gestionnaire?.personne?.nom} {pharmacie?.gestionnaire?.personne?.prenoms}</td></tr>
                   <tr><th className="table-active">Employés</th><td>{Utils.getAttributeValues(getPersonnels(pharmacie?.employes),"value")?.join("; ")}</td></tr>

                    
                    <tr><th className="table-active">Contact</th><td>{pharmacie.contact}</td></tr>
                    <tr><th className="table-active">Téléphone</th><td>{pharmacie.tel}</td></tr>
                    <tr><th className="table-active">Email</th><td>{pharmacie.email}</td></tr>
                    <tr><th className="table-active">Adresse</th><td>{pharmacie.adresse}</td></tr>
                    <tr><th className="table-active">TVA</th><td>{pharmacie.tva}%</td></tr>
                    <tr><th className="table-active">Devise monetaire</th><td>{pharmacie.deviseMonetaire}</td></tr>
                     <tr><th className="table-active">Remarque</th><td>{pharmacie.remarque}</td></tr>
                    <tr><th className="table-active">Actif</th><td>{pharmacie.actif==true? "Oui":"Non"}</td></tr>  
                    <tr><th className="table-active">User</th><td>{pharmacie.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{pharmacie.dateModif}</td></tr>                              
                                 
                </tbody>
              </table>
                                 
                                                                                    
                           
                </div>
              </div>
  )}

const renderFormPharmacie=() =>{
return (
   <div className="row">
                <div className="col-md">                               
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="codePharmacie"
                        required
                        value={pharmacie.codePharmacie}
                        onChange={handlePharmacieChange}
                        name="codePharmacie"
                        placeholder="Code Pharmacie"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.codePharmacie.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.codePharmacie}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="libelle"
                        required
                        value={pharmacie.libelle}
                        onChange={handlePharmacieChange}
                        name="libelle"
                        placeholder="Nom de la pharmacie"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.libelle.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.libelle}</div>
                    </div>
                   



                  <div className="form-group " >     
                    <Select
                       defaultValue={pharmacie.entrepotId!=null&&pharmacie.entrepotId!=""? pharmacie.entrepot:""}
                       getOptionLabel={e => e.libelle}
                        getOptionValue={e => e.entrepotId}
                       isClearable={true}
                       onChange={(newValue) => { 
                              let obj={ ...pharmacie}                                             
                              if(newValue!=null)                           
                               {
                                obj.entrepotId=newValue.entrepotId
                                obj.entrepot=newValue;                                 
                               } 
                                else
                             {      
                                    obj.entrepotId=initialPharmacieState.entrepotId 
                                    obj.entrepot=initialPharmacieState.entrepot
                                }   
                              setPharmacie(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={entrepots}
                        placeholder={`Entrepot`}
                        className={`form-control-sm px-0 ${errors?.entrepot?.entrepotId!=null && errors?.entrepot?.entrepotId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.entrepot?.entrepotId}</div>
                    </div>
               
                    <div className="form-group" >     
                    <Select
                        
                       defaultValue={pharmacie.gestionnaire!=null&&pharmacie.gestionnaire.personnelId!=null?pharmacie.gestionnaire:""}
                       getOptionLabel={e => e.value!=null?e.value:Utils.trouverObjetDansListObject(personnels,"key",pharmacie.gestionnaire.personnelId)?.value}
                        getOptionValue={e => e.key}
                       isClearable={true}
                       onChange={(newValue) => { 
                            let obj={ ...pharmacie}                                             
                              if(newValue!=null)                           
                               {
                                obj.gestionnaireId=newValue.key
                                obj.gestionnaire={}
                                obj.gestionnaire.personnelId=newValue.key;                                 
                               } 
                                else
                             {
                                    obj.gestionnaireId=initialPharmacieState.gestionnaireId 
                                    obj.gestionnaire=initialPharmacieState.gestionnaire
                                }   
                              setPharmacie(obj);
                              
                              }
                          }
                        noOptionsMessage={() => 'Aucune correspondance'}
                        options={personnels}
                        placeholder={`Gestionnaire`}
                        className={`form-control-sm px-0 ${errors?.gestionnaire.gestionnaireId!=null && errors?.gestionnaire.gestionnaireId.length>0 ? 'is-invalid' : ''}`}                        />                       
                      <div className="invalid-feedback">{errors?.gestionnaire?.gestionnaireId}</div>
                    </div>
                    <div className="form-group" >     
                  <Select
                       closeMenuOnSelect={false}
                        isMulti
                        defaultValue={pharmacie.employes!=null &&pharmacie.employes!=""?getPersonnels(pharmacie.employes):""}
                        getOptionLabel={e => e.value}
                        getOptionValue={e => e.value}
                        onChange={(newValue) => { 
                            let obj={ ...pharmacie} 
                                    let values=""
                                     for (var i = 0; i < newValue.length; i++) {  
                                      values+=newValue[i].key+"; "
                                     }                            
                                   
                                     //console.log("employes=====>", values)
                                 setPharmacie({ ...pharmacie, "employes": values });
                            
                          }}
                      
                        options={personnels}
                        placeholder={`Employés`}
                        name="employes"
                        noOptionsMessage={() => 'Aucune correspondance'}
                        formatCreateLabel={(value) => `Ajouter "${value}"`}
                      className={`form-control-sm px-0 ${errors?.employes!=null && errors?.employes.length>0 ? 'is-invalid' : ''}`}                       
                       menuPortalTarget={document.body}
                        menuPosition={'fixed'} 
                        styles={{
                          ///.....
                          menuPortal: provided => ({ ...provided, zIndex: 9999 }),
                          menu: provided => ({ ...provided, zIndex: 9999 })
                          ///.....
                        }}
                      /> 
                      <div className="invalid-feedback">{errors?.employes}</div>
                    </div>
                   <div className="form-group">             
                      <input
                        type="text"                       
                        id="contact"
                        required
                        value={pharmacie.contact}
                        onChange={handlePharmacieChange}
                        name="contact"
                        placeholder="Contact pharmacie"
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
                        value={pharmacie.tel}
                        onChange={handlePharmacieChange}
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
                        value={pharmacie.email}
                        onChange={handlePharmacieChange}
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
                        value={pharmacie.adresse}
                        onChange={handlePharmacieChange}
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
                        value={pharmacie.tva}
                        onChange={handlePharmacieChange}
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
                        value={pharmacie.deviseMonetaire}
                        onChange={handlePharmacieChange}
                        name="deviseMonetaire"
                        placeholder="Dévise monetaire"
                        maxLength="10"
                        style={{width: "75px"}}
                        className={`form-control form-control-sm d-inline-block ${errors.deviseMonetaire.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.deviseMonetaire}</div>
                    </div>
                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handlePharmacieChange} value={pharmacie.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
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
                        value={pharmacie.remarque}
                        onChange={handlePharmacieChange}
                        name="remarque"
                        maxLength="250"
                        placeholder="Remarque"
                      />
                    </div>
                    
                      
               
                
              </div>
  )}

return (
<div className="container">        
{/************************************Modal for add pharmacie*******************************/}

<div className="submit-form">
    
    <div className="text-right">    
       <div className="custom-control custom-checkbox custom-control-inline">
        <input type="checkbox" className="custom-control-input" id="afficherTousPharmacie" defaultChecked={actifPharmacie}  
        onChange={handleActifpharmacieChange}/>
        <label className="custom-control-label" htmlFor="afficherTousPharmacie">Afficher Tous</label>
    
       <img src="/img/refresh1.png" title="Rafraichir"  alt="Rafraichir" className="iconeRefresh"
                      onClick={() => retrievePharmacies()}/>
      <img src="/img/save.png" title="Nouveau type d'pharmacie"  alt="Nouveau type d'pharmacie" className="iconeButtonCarre"
                      onClick={() => performAction(pharmacie,"POST")}/>  
      </div>
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header >
          <Modal.Title>
          {perform.action=="POST"?("Nouvelle pharmacie"): 
          (perform.action=="GET")?("Détail sur la pharmacie "):
          (perform.action=="PUT")?("Modifier la pharmacie " ):
          (perform.action=="DELETE")?("Supprimer la pharmacie" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
             { ( (perform.action=="POST" || perform.action=="PUT"))? (
           renderFormPharmacie()

           ):(perform.action=="GET" || perform.action=="DELETE")?(

             renderShowPharmacie()

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(pharmacie.pharmacieId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(pharmacie,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => savePharmacie(pharmacie)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => savePharmacie(pharmacie)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deletePharmacie(pharmacie)}>
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
    {renderListOfPharmacie()}
      </div>
  );
};
let actifPharmacie=true;
export default Pharmacies;