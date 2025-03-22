import React, {useState, useEffect, useCallback } from "react";
import DocumentsDataService from "../services/documents.service";
import PersonnelsDataService from "../services/personnels.service";
import Utils from "../utils/utils";
import FileService from "../services/file.service";
import LoadFiles from "../components/loadFiles.component";
import { Button,  Modal } from 'react-bootstrap';

import globalObject from '../global.js'
import $ from 'jquery'; 
import 'date-fns';
import { TextField } from '@mui/material';

/**********autocomplete**********/
import Autocomplete from '@mui/lab/Autocomplete';

 /* eslint-disable */
const Documents = (props) => {

/*Create document code*/
const initialDocumentState = 
    { 

       "documentId": null,
        "documentCategory": "",
        "documentCreatedFor": null,
        "documentCreatedBy": null,
        "documentDescription": "",
        "documentCreationDate": "",
        "documentScan": [],
        "remarque": "",
        "actif": true,
        "dateCreation": null,
        "dateModif":null,
        "userId": null

    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };

  const initialSelectedFile = 
    { 

       "id": "",
       "data": "",
       "name":""
    };
const [doc, setDoc] = useState(initialDocumentState);
const [documents, setDocs] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialDocumentState);
const [showDocumentModal, setShowDocumentModal] = useState(false);
const [selectedFiles, setSelectedFiles] = useState([]);
const [showLoading, setShowLoading] = useState(false);
const [personnel, setPersonnel] = useState(null);
//const [actif, setActif] = useState(true);

const  permission=Utils.trouverObjetDansListObject(globalObject?.permissions,"ressource","DOSSIER_PATIENT/DOCUMENT");

useEffect(() => {
   
    if(props.patient!=null && props.patient.personne!=null)
    {
       input.documentCreatedFor=props.patient.personne.personneId ; 
       input.documentCreatedBy=globalObject.user.personnelId; ; 
       input.documentCreatedForInfo=props.patient.personne.nom +" "+props.patient.personne.prenoms ; 
    }
    retrieveDocuments();
    
     
  }, []);

const handleCloseDocumentModal = () => {
  setShowDocumentModal(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReloadDocument = () => {
setShowDocumentModal(false);
setErrors(initialDocumentState);
retrieveDocuments();
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"Document", perf.msg);                         
handleCloseAndReloadDocument()
}
const handleActifdocumentChange = (event) => {
  //let act=event.target.checked;
  showAllDocuments=event.target.checked;
  retrieveDocuments();
}



//const today=new Date();
const handleDocumentChange = event => {
  const { name, value } = event.target;
  setDoc({ ...doc, [name]: value });
};


async function retrievePersonnels (id){
    let  query=`actif=true&personne=true`;   
    

    let resp= await PersonnelsDataService.findPersonnelByIdAsync(id); 
          
    if(resp!=null && resp.status=="200" )          
        {
          
          setPersonnel(resp.data)
          console.log("retrievePersonnels",resp.data)
        
        }else 
        {         
           setPersonnel(null)
                 
        }
}

const handleLoadFiles  = useCallback((label, returnedFiles) =>{
console.log("returnedFiles",returnedFiles);
setSelectedFiles(returnedFiles)

},[selectedFiles]);
async function retrieveDocuments (){

  if ($.fn.dataTable.isDataTable('#tListOfdocument')) {
        $('#tListOfdocument').DataTable().destroy();
       
    }
    
      
      let resp=null;
      let query="?";
     
     if(input.documentCreatedFor!=null)
     {

         query+=`documentCreatedFor=${input.documentCreatedFor}`;

       /*if(input.documentCreatedBy!=null)
         query+=`&documentCreatedBy=${input.documentCreatedBy}`;*/

        if(showAllDocuments==false)
        {
          query=query+`&actif=true`;         
        }
       
        resp= await DocumentsDataService.findAsync(query);  
        if(resp!=null && resp.status=="200" )          
            {
              setDocs(resp.data);
              
            }else 
             setDocs([])
     }else 
           setDocs([]) 
   

setTimeout(()=>{ 
    //$('#tListOfdocument').DataTable().destroy();                       
    $('#tListOfdocument').DataTable(

      {
        
        "autoWidth": false,
       
        "scrollX":false,
        "scrollCollapse": false,
        "order": [[ 0, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            },
             { "width": "200", "targets": 2 }
        ],
        "pageLength": "5",
        "dom": "rfltip",
       responsive: true,
        destroy: true,
         "language": {
            "lengthMenu": "Afficher _MENU_ /page",
            "zeroRecords": "Il n'existe aucun enregistrement ",
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

async function saveDocument (doc)  {
 const obj = {...doc};
   //setDoc(obj);
   obj.documentCreatedFor=input.documentCreatedFor;
   //obj.professionnelDeSanteId=input.documentCreatedForInfo;
   obj.documentCreatedBy=input.documentCreatedBy;
    obj.userId=globalObject?.user?.id
   var perf=perform;
     if(isValid(obj))
     {       
        let existFiles=[]
        if(selectedFiles.length>0)
        {  let newFiles=[]
            
            
            for( const file of selectedFiles)
            {
              if(file.id==null || file.id=="")
              {
                newFiles.push(file.data)
              }else 
              existFiles.push(file.id)
            }

            if(obj.documentScan.length>0 && existFiles.length>0 )
                {
                  let removedFiles = obj.documentScan.filter(x => !existFiles.includes(x));
                  if(removedFiles.length>0)
                  {
                    let query=""
                    let response=null;
                     for(const fileId of removedFiles)
                        query=query+"&fileId="+fileId
                      setShowLoading(true);
                      response= await FileService.deleteMultileFilesAsync(query);   
                      setShowLoading(false);  
                      if(response==null || response.status!="200")
                       {
              
                         perf.result="error"; 
                         if(response!=null)
                         perf.msg= response.data.message;
                       else
                         perf.msg="ERREUR inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction";
                          showNotif(perf);

                       }
                  }
                }

            if(perf.result!="error" )
            {
                          
                if (newFiles.length>0)
                {
                  setShowLoading(true);
                    let listFileinfo= await FileService.createMulipleFilesAsync(newFiles, obj.documentCategory,`Personne concernée :${obj.documentCreatedFor} \n  Nom et prenoms: ${obj.documentCreatedForInfo} \n libellé du document: ${obj.documentDescription}`);     
                  setShowLoading(false);
                  if(listFileinfo!=null && listFileinfo.status=="201")
                   {
                    for( const file of listFileinfo.data)
                      existFiles.push(file.fileId);                  
                   }else
                    {                
                     perf.result="error"; 
                     if(listFileinfo!=null && listFileinfo.status!="201")
                     perf.msg="ERREUR "+listFileinfo.status + " : "+ listFileinfo.data.message;
                    else
                      perf.msg="ERREUR inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction";
                      showNotif(perf);

                   }
                 }

            }
          }
          if(perf.result!="error" )
          {           
            obj.documentScan= existFiles;
            let response="";
            if(obj.documentId!=null && obj.documentId!="")
              response= await DocumentsDataService.updateAsync(obj.documentId,obj);
            else
              response= await DocumentsDataService.createAsync(obj);

            if(response!=null && (response.status=="200" || response.status=="201"))
              {
                //vac=person.data;
                setDoc(response.data);             
                perf.result="success";
                if(perf.action=="POST")
                  perf.msg="Enregistrement effectué avec succès" 
                else
                  perf.msg="Mise à jour effectuée avec succès" 
                 showNotif(perf);  

                
                 //props.handleToUpdatePatient();                            
              }  
             else
             {    

                perf.result="error";
                if(response!=null && response.status!=null)
                perf.msg= response.data.message;    
                else 
                    perf.msg="Une erreur inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction.";         
                  
                showNotif(perf);      
             }                      
          }
      } 
  };

async function deleteDocument(obj) {
    obj.userId=globalObject?.user?.id
  if(obj.documentId!=null && obj.documentId!="")
  {
      obj.actif=false;
      let perf=perform;
    let response=await DocumentsDataService.updateAsync(obj.documentId,obj);
    if(response!=null && response.status=="200")
      {
          //setDoc(response.data);             
          perf.result="success";
          perf.msg="Suppression effectué avec succès"  
                                        
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
              
        }
        showNotif(perf);    
      
        //props.handleToUpdatePatient();
    }
  };




function isValid  (obj) {
 
    let err=initialDocumentState;
    let valid=true;
      console.log("document",obj); 
      
    if( obj.documentCategory==null || obj.documentCategory.length<2) 
       {
         err.documentCategory="Choisir le type de document";
         valid=false;
     } 
   if( obj.documentDescription==null || obj.documentDescription.length<2) 
       {
         err.documentDescription="Saisir le libellé du document";
         valid=false;
     } 
  
     if(showAllDocuments==true)
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.actif="indiquer le statut actif oui ou non ";
          valid=false;
     }

     if( selectedFiles.length==0) 
       {
         err.remarque="Au moins un fichier est nécessaire";
         valid=false;
     }
 
    // console.log(err);
    setErrors(err);

    return valid;

  };


async function getListofFiles (query ){
    let response=null; 
      
    response= await FileService.getFilesAsync(query);
     if(response!=null && response.status=="200" ) 
     {    
        if(response.data!=null && response.data!="")
          {

                   let files=[]
                     for( const file of response.data)
                     {
                      //console.log(file)
                      let item={}
                      item.id=file.fileId
                      item.data=`data:${file.fileType};base64,${file.fileData}`
                      //new File([`${file.fileData}`],`${file.fileName}`, {type:`${file.fileType}`}); 
                      //;
                      item.name=file.fileName
                      //
                      //
                      
                      files.push(item)
                     }
                     setSelectedFiles(files)
          }       
          else
                {
                  let perf=initialPerformState
                       perf.result="error";
                    if(response!=null && response.status!=null)
                    perf.msg= response.data.message;    
                    else 
                        perf.msg="Une erreur inattendue s'est produite. Veillez contacter l'administrateur de l'appliaction.";           
                    showNotif(perf);
                }
         
      }
    }

const performAction = async(obj,action) => {
  let perf=null;
  if(action=="POST")
  {
    setDoc(initialDocumentState);
setSelectedFiles([]);
    perf=initialPerformState;
    perf.action=action;   
    //updatePerform(perf);
  }else
  {
     if(action=="GET")
        retrievePersonnels(obj.documentCreatedBy)

     if(obj.documentScan.length>0)
      {

        let listOfFileId=[]
        for(const file of selectedFiles)
        {
           listOfFileId.push(file.id)
        }
        //console.log("listOfFileId", listOfFileId)
        //console.log("document.documentScan", document.documentScan)
       if(obj.documentScan.length!=listOfFileId.length || obj.documentScan.sort().toString()!=listOfFileId.sort().toString())
       {
        setShowLoading(true);
          let query=""
          
         for(const fileId of obj.documentScan)
           {
            query=query+"&fileId="+fileId
           }   

           
            await getListofFiles(query)
          setShowLoading(false);
        }
              
       }else 
       setSelectedFiles([]); 
      // 
    perf=perform;
    perf.action=action;
    handleCloseDocumentModal();
    setDoc(obj);        
    /*handleShowDocumentModal();
    
    updatePerform(perf);*/
    }
    setErrors(initialDocumentState);
    updatePerform(perf);
    
    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShowDocumentModal(false);
  setShowDocumentModal(true);
}

const handleCloseLoading = () => {
  setShowLoading(true);
}

const loading =()=> {
return (
<div className="container">        

      <Modal  centered show={showLoading} onHide={handleCloseLoading} animation={true} dialogClassName='modal-loading' >
        <Modal.Body>
           <img src="/img/loading.gif" title="Chargement"  alt="Chargement en cours" className="profile-img-card"/>
           Traitement en cours...veillez patienter
        </Modal.Body>
        
      </Modal>
</div>)
}
const renderFormDocument=() =>{
  //console.log("selectedFiles",selectedFiles)
return (

  <div className="row">
 
                <div className="col-md">                               
                                
                      
                     <div className="form-group"> 
                         <select id="documentCategory" name="documentCategory" onChange={handleDocumentChange} value={doc.documentCategory}  className={`form-control form-control-sm ${errors.documentCategory.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Catégorie de document</option>
                      <option value="Document administratif">Document administratif</option>
                      <option value="Document médical">Document médical</option>
                      
                   </select> 
                         <div className="invalid-feedback">{errors?.documentCategory}</div>                     
                    </div> 

                  
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="documentDescription"
                        required
                        value={doc.documentDescription}
                        onChange={handleDocumentChange}
                        name="documentDescription"
                        placeholder="Libellé du document"
                        maxLength="250"
                        className={`form-control form-control-sm ${errors.documentDescription.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.documentDescription}</div>
                    </div>
                   
                    <div className="form-group">             
                      <textarea
                        type="text"                       
                        id="remarque"
                        required
                        value={doc.remarque}
                        onChange={handleDocumentChange}
                        name="remarque"
                        placeholder="Remarque"
                        maxLength="250"
                        className={`form-control form-control-sm`}
                      />
                       
                       
                    </div>
                    <div className="form-group" >  
                    
                     <label> Fichiers</label> 
                     <div className="text-danger">{errors.remarque}</div>
                        {<LoadFiles showImage={true} label={"selectedFiles"} multiFile={true} action={perform.action} selectedFiles={selectedFiles} handleLoadFiles={handleLoadFiles}/>}                     
                    </div>
                    {(showAllDocuments==true)&&(
                     <div className="form-group">                        
                    <select id="actif" name="actif" onChange={handleDocumentChange} value={doc.actif}  className={`form-control form-control-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>                      
                   </select>        
                      <div className="invalid-feedback">{errors.actif}</div>
                    </div>)}                      
                </div>               
              </div>
  )}
const renderShowDocument=() =>{
  console.log("selectedFiles",selectedFiles)
return (

 <div className="row">
                <div className="col-md">  

                  <div>
                     <table className='table table-bordered table-sm' >
                <tbody>
                    <tr><th className="table-active">Catégorie</th><td>{doc.documentCategory}</td></tr>
                    <tr><th className="table-active">Libellé</th><td>{doc.documentDescription}</td></tr>
                     {(showAllDocuments==true)&&(
                      <tr><th className="table-active">Actif</th><td>{doc.actif==true? "Oui":"Non"}</td></tr>
                      )} 
                    <tr><th colSpan="2" className="table-active">Remarque :</th></tr>
                    <tr><td colSpan="2">{doc.remarque}</td></tr> 
                    <tr><th className="table-active">Crée par</th><td>{(personnel!=null&&personnel?.personne!=null) ?(personnel?.titreAcademique +" "+personnel?.personne?.nom+" "+personnel?.personne.prenoms):""}</td></tr> 
                     <tr><th className="table-active">Modifié le</th><td>{doc.dateModif}</td></tr>
                   {(permission?.action?.includes("CRUD") )&&( 
                    <tr><th className="table-active">User ID</th><td>{doc.userId}</td></tr>)}  
                                 
                </tbody>
              </table>
                   
                     
                    {selectedFiles.length>0 &&(           
                       <div className="form-group for" >  
                     <label> Documents</label> 
                        {<LoadFiles showImage={true} label={"selectedFiles"} multiFile={true} action={perform.action} selectedFiles={selectedFiles} handleLoadFiles={handleLoadFiles}/>}
                    </div>   
                    )}                                                           
                  </div>         
                </div>
              </div>
  )}

const renderListDocument=() =>{
return (
 <div className="table-responsive">         
      <table id="tListOfdocument" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
             <th>Date de Modif</th>  
            <th>Date </th> 
                <th>Catégorie</th>
                <th>Libellé</th>                           
               {(showAllDocuments==true)&&(
               <th>Actif</th> )}            
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {documents &&
            documents.map((obj, index) => (
                <tr key={index}>   
                <td>{obj.dateModif}</td> 
                <td>{obj.documentCreationDate}</td>
                  <td>{obj.documentCategory}</td>  
                  <td>{obj.documentDescription}</td>            
                    {(showAllDocuments==true)&&(<td>{obj.actif==true? "Oui":"Non"}</td>)}   
                  <td>
                     <Button variant="info" className="btn-sm"  title="Voir le détail"  onClick={() => performAction(obj, "GET",false)}>
                     <i className="fa fa-eye"></i>
                     </Button>
                     {((obj?.documentCreatedBy==globalObject?.personnel?.personnelId)||permission?.action?.includes("U"))&&( 
                      <Button  variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(obj,"PUT",false)}>
                        <i className="fa fa-edit fa-sm"></i>
                        </Button>)}
                       {((obj?.documentCreatedBy==globalObject?.personnel?.personnelId)||permission?.action?.includes("CRUD"))&&(  
                       <Button  variant="danger" className="btn-sm"  title="Supprimer" onClick={() => performAction(obj,"DELETE")}>
                        <i className="fa fa-trash fa-sm"></i>
                        </Button>)}
                   </td>              
                </tr>

          ))}          
          </tbody>          
        </table>     
        </div>

)}


return (
<div className="container">        
{/************************************Modal for add document*******************************/}
{loading()}
<div className="submit-form">
     <br/>
    <div className="text-right">    
       <div className="custom-control custom-checkbox custom-control-inline">
        <input type="checkbox" className="custom-control-input" id="afficherTousDocument" defaultChecked={showAllDocuments}  
        onChange={handleActifdocumentChange}/>
        <label className="custom-control-label" htmlFor="afficherTousDocument">Afficher Tous</label>
         
     <Button  variant="info" className="btn-sm" 
        title="Rafraichir" onClick={() => retrieveDocuments()}>
        <i className="fa fa-refresh"></i>
     </Button>
      {(permission?.action.includes("C")) && 
       (
     <Button  variant="success" className="btn-sm"  title="Nouveau document" onClick={() => performAction(doc, "POST")}>
         <i className="fa fa-file fa-sm"></i>
     </Button>
          )} 
 </div>
    </div>
      <Modal  centered show={showDocumentModal} onHide={()=>handleCloseDocumentModal} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header>
          <Modal.Title>
          {perform.action=="POST"?("Nouveau document"): 
          (perform.action=="GET")?("Détail sur le document "):
          (perform.action=="PUT")?("Modifier le document " ):
          (perform.action=="DELETE")?("Supprimer le document" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { ( (perform.action=="POST" || perform.action=="PUT"))? (
            renderFormDocument()
            ):(perform.action=="GET" || perform.action=="DELETE")?(
              renderShowDocument()
              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(doc.documentId!=null && perform.action=="GET")?(
             ((doc?.documentCreatedBy==globalObject?.personnel?.personnelId)||permission?.action?.includes("U") )&&( 
          <Button variant="warning" onClick={() => performAction(doc,"PUT")}>
            Modifier
          </Button>)):(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveDocument(doc)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveDocument(doc)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteDocument(doc)}>
            Supprimer
          </Button>
          ):""
        }
        {
          <Button variant="secondary" onClick={handleCloseDocumentModal}>
            Fermer
          </Button>
        }
        </Modal.Footer>
      </Modal>
    
    </div>

{/************************************table list*******************************/}
   {renderListDocument()}
 
  </div>
  );
};
let showAllDocuments=false;
let input={
  "documentCreatedFor":null,
  "documentCreatedBy":null,
  "documentCreatedForInfo":null
};
export default Documents;