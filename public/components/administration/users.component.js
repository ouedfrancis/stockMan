import React, {useState, useEffect } from "react";
import UsersDataService from "../../services/security/user.service";
import RolesDataService from "../../services/roles.service";
import PersonnelDataService from "../../services/personnels.service";

import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';

import Styles from '../../styles.module.css';
import $ from 'jquery'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'date-fns';


 /* eslint-disable */
const Users = () => {

/*Create user code*/
const initialUserState = 
   { 
      "id": null,
        "username": "",
        "email": "",
        "password": "",
        "roles": [
            {
                "id": "",
                "name": ""
            }         
        ],
        "actif": true,
        "personneId": "",
        "dateCreation": "",
        "dateModif": ""
    };


    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };
const [user, setUser] = useState(initialUserState);
const [users, setUsers] = useState([]);
const [personnelsLite, setPersonnelsLite] = useState([]);

const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialUserState);
const [roles, setRoles] = useState([]);
const [show, setShow] = useState(false);
//const [actif, setActif] = useState(true);

useEffect(() => {
    retrieveUsers(showAllUsers);
    retrieveRoles()
    retrievePersonnelsLite()
 //   console.log ("Globale object in user", globalObject.clinique)
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}

const handleCloseAndReload = () => {
setShow(false);
refreshUser();
retrieveUsers(showAllUsers);
}

function showNotif(perf)
{
 Utils.createNotification(perf.result,"User", perf.msg);                         
handleCloseAndReload()
}

const handleActifuserChange = (event) => {
  //let act=event.target.checked;
  showAllUsers=event.target.checked;
  retrieveUsers(showAllUsers);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleUserChange = event => {
  const { name, value } = event.target;
  setUser({ ...user, [name]: value });
};

  const refreshList = () => {
    retrieveUsers(showAllUsers);
  };

const refreshUser = () => {
    setUser(initialUserState);
     setErrors(initialUserState);
     setPerform(initialPerformState);
  };


//const reload=()=>window.location.reload();
/******************************************/
async function saveUser (user)  {
 const obj = {...user};

   
   var perf=perform;
     if(isValid(obj))
     {       
          let response="";
         
          if(obj.id!=null && obj.id!="")
            response= await UsersDataService.updateAsync(obj.id,obj, "admin=true");
          else
            response= await UsersDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
            {
              //vac=person.data;
              //setUser(response.data);             
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
              if(response!=null && response.status!=null)
              perf.msg= response.data.message;    
              else 
                  perf.msg="Une erreur inattendue s'est produite. Veillez contacter l'administrateur de l'application.";         
                
              showNotif(perf);                
              
           }            
        } 
  };

 async function handleStatus(obj) {
  if(obj.actif==true)
  {
      obj.actif=false;
   }else 
       obj.actif=true;
      let perf=perform;
    let response=await UsersDataService.updateStatutAsync(obj.id,obj);
    if(response!=null && response.status=="200")
      {
          setUser(response.data);             
              
          retrieveUsers(showAllUsers);                               
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
               showNotif(perf);

        }
    
  };

async function retrieveRoles (){

    let resp= await RolesDataService.getAllAsync(true); 
          
    if(resp!=null && resp.status=="200" )          
        {

          var filtered = resp.data.filter(function(item, index, arr){ 
                 return item.name !="ROLE_SUPER_ADMIN";
           });
          setRoles(filtered);
          //console.log("roles==>",resp.data);
        }else 
        {
          setRoles([]);
        }
}

async function retrievePersonnelsLite (){

    let resp= await PersonnelDataService.getByPersonnelsLiteAsync();           
    if(resp!=null && resp.status=="200" )          
        {     
          setPersonnelsLite(resp.data);
          //console.log("personnels==>",resp.data);
        }else 
        {
          setPersonnelsLite([]);
        }
}



async function retrieveUsers (){

  if ($.fn.dataTable.isDataTable('#tListOfuser')) {
        $('#tListOfuser').DataTable().destroy();
       
    }
    
    let resp=null;
    if(showAllUsers==true)
    {
      resp= await UsersDataService.getAllAsync(null);  
       
    }else
    {
      resp= await UsersDataService.getAllAsync(true); 
          
    }
    if(resp!=null && resp.status=="200" )          
        {
          setUsers(resp.data);
          //console.log("user=======>", users);
          
        } 

setTimeout(()=>{ 
    //$('#tListOfuser').DataTable().destroy();                       
    $('#tListOfuser').DataTable(
 
     {  dom: 'lBfrtip',//"l" to show pagelength, B for button,
        /*buttons: [
            //'copyHtml5',
           
            //'csvHtml5',
            'excelHtml5',
            'pdfHtml5',
            'print',
            'colvis'
        ],*/
        buttons: [
           /* {
                extend:    'copyHtml5',
                text:      '<i className="fa fa-files-o"></i>',
                titleAttr: 'Copy'
            },*/
            {
                extend:    'excelHtml5',
              //  text:      '<i className="fa fa-file-excel-o"></i>',
                titleAttr: 'Excel',
                title: 'Journalisation',
                autoFilter: true,
                sheetName: 'Journalisation',
                exportOptions: {
                    //columns: [ 0, ':visible' ]
                   columns: [1,2,3,4, 5,6,7,8,9]
                }
                
            },
            /*{
                extend:    'csvHtml5',
                text:      '<i className="fa fa-file-text-o"></i>',
                titleAttr: 'CSV'
            },*/
            {
                extend:    'pdfHtml5',
              //  text:      '<i className="fa fa-file-pdf-o"></i>',
                titleAttr: 'PDF',
                 title: 'Journalisation',
                 download: 'open',
                 exportOptions: {
                    //columns: [ 0, ':visible' ]
                    columns: [1,2,3,4, 5,6,7,8,9]
                }
            },
             {
                extend:    'print',
               text: 'Imprimer',
               exportOptions: {
                    //columns: [ 0, ':visible' ]
                     columns: [1,2,3,4, 5,6,7,8,9]
                }
            },
             
          
        ], 
       
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
              { "width": "15%", "targets": 7 },
             

        ],
        /*responsive: true,
        destroy: true,*/
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
 
    let err=initialUserState;
    let valid=true;
  
      
    /*if( obj.email==null || obj.email.length<2 || (obj.email.length>0 && !Utils.validateEmail(obj.email))) 
       {
          err.email="Email incorrecte";
          valid=false;
     }
  */
     

      if( obj.roles==null || obj.roles.length==0) 
       {
         err.roles[0].id="Selectionner au moins un role";
         valid=false;
     } 
    
     /*if(obj.password!="" && Utils.passwordStrength(obj.password)<6 ) 
         {
          err.password="Mot de passe incorrecte :doit être au moins de 10 carractères, il doit contenir au moins un chiffre [0-9] et une majuscules [A-Z]";
          valid=false;
     }*/
     if(obj.actif==null || obj.actif.length<2) 
         {
          err.actif="Indiquer le statut actif oui ou non ";
          valid=false;
     }
 
    
    setErrors(err);
    return valid;

  };


const performAction = (user,action) => {
  let perf=null;
  if(action=="POST")
  {
    refreshUser();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
  }else
  {
    perf=perform;
    handleClose();
    setUser({ ...user, "password": "" });      
    setErrors(initialUserState);
    handleShow();
    perf.action=action;
    setPerform(perf);
    }
// console.log(perf);
/*if(action=="POST" || action=="PUT")
  retrieveRoles();  */
};
  


function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}


const renderFormUser=() =>{
return (

  <div className="row">
                <div className="col-md">    
                                                                                                                      
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="username"
                        required
                        value={user.username}
                        onChange={handleUserChange}
                        name="username"
                        disabled={true}
                        placeholder="Login"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.username.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.username}</div>
                    </div>
                    {
                      (user.roles.length >0 && user.roles[0].name!="ROLE_SUPER_ADMIN")&&(
                     <div className="form-group">             
                      <input
                        type="text"                       
                        id="numPersonnel"
                        required
                        value={personnelsLite!=null && personnelsLite.length>0 ? (personnelsLite.find(elt => elt.key==user.personnelId)?.label):""}
                        name="numPersonnel"
                        disabled={true}
                        placeholder="numPersonnel"
                        maxLength="100"
                        className={`form-control form-control-sm `}
                      />
                       <div className="invalid-feedback">{errors.numPersonnel}</div>
                    </div>)}
                      {
                      (user.roles.length >0 && user.roles[0].name!="ROLE_SUPER_ADMIN")&&(
                     <div className="form-group">             
                      <input
                        type="text"                       
                        id="nomPrenoms"
                        required
                        value={personnelsLite!=null && personnelsLite.length>0 ? (personnelsLite.find(elt => elt.key==user.personnelId)?.value):""}
                      
                        name="nomPrenoms"
                        disabled={true}
                        placeholder="nomPrenoms"
                        maxLength="100"
                        className={`form-control form-control-sm `}
                      />
                       <div className="invalid-feedback">{errors.nomPrenoms}</div>
                    </div>)}
                    <div className="form-group">             
                      <input
                        type="text"                       
                        id="email"
                        required
                        value={user.email}
                        onChange={handleUserChange}
                        name="email"
                        placeholder="Email"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.email.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.email}</div>
                    </div>
                     <div className="form-group">             
                      <input
                        type="text"                       
                        id="password"
                        required
                        value={user.password}
                        onChange={handleUserChange}
                        name="password"
                        placeholder="Mot de passe"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.password.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.password}</div>
                    </div>
                    {
                      (user.roles.length >0 && user.roles[0].name!="ROLE_SUPER_ADMIN")?(
                <div className="form-group"> 
                   <Multiselect
                      options={roles} // Options to display in the dropdown
                      selectedValues={user.roles} // Preselected value to persist in dropdown
                      onSelect= {(selectedList, selectedItem)=> {
                        
                        setUser({ ...user, "roles": selectedList });
                       }} // Function will trigger on select event
                      onRemove={(selectedList, removedItem)=> {
                        
                         setUser({ ...user, "roles": selectedList });
                       }} // Function will trigger on remove event
                      displayValue="name" // Property name to display in the dropdown options
                      //groupBy="categoriePS.nomCategorie"
                      //showCheckbox={true}
                       name="roles"
                       isObject={true}
                       selectionLimit={10}
                      placeholder="Roles" 
                      className={`${errors.roles.length>0 ? 'is-invalid' : ''}`}
                      />                             
                         <div className="text-danger">{errors?.roles[0].id}</div>
                         
                      </div>
                      ):(
                  <div className="form-group">             
                      <input
                        type="text"                       
                        id="roles"
                        required
                        value={user.roles.map((item) => item?.name).join(', ')}
                        onChange={handleUserChange}
                        disabled={true}
                        name="roles"
                        placeholder="Roles"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.roles[0].length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.roles[0].id}</div>
                    </div>
                      )
                    }
                                   
                  
                    {(showAllUsers==true)&&(
                     <div className="form-group">     
                    
                    <select id="actif" name="actif" onChange={handleUserChange} value={user.actif}  className={`form-control form-control-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>                      
                    </select>                        
                      <div className="invalid-feedback">{errors.actif}</div>
                    </div>)}                      
                </div>
                
              </div>
  )}
const renderShowUser=() =>{
return (

 <div className="row">
                <div className="col-md">   
                <div className="table-responsive">      
                <table className='table table-bordered table-sm '>
                <tbody>
                    <tr><th className="table-active">Nom d'utilisateur</th><td>{user.username}</td></tr>
                     <tr><th className="table-active">N°personnel</th><td>{personnelsLite!=null && personnelsLite.length>0 ? (personnelsLite.find(elt => elt.key==user.personnelId)?.label):""}</td></tr>
                      <tr><th className="table-active">Nom et prenoms</th><td>{personnelsLite!=null && personnelsLite.length>0 ? (personnelsLite.find(elt => elt.key==user.personnelId)?.value):""}</td></tr>
                    <tr><th className="table-active">Email</th><td>{user.email}</td></tr>
                     {/*<tr><th className="table-active">Email Pro</th><td>{user?.contactPro?.emailPro}</td></tr>
                      <tr><th className="table-active">Tel. fixe</th><td>{user?.contactPro?.telFixePro}</td></tr>
                       <tr><th className="table-active">Tel. Pro</th><td>{user?.contactPro?.telMobilePro}</td></tr>*/}
                    <tr><th className="table-active">Roles</th><td>{user.roles.map((item) => item?.name).join(', ')}</td></tr> 
                    <tr><th className="table-active">Actif</th><td>{user.actif==true? "Oui":"Non"}</td></tr>   
                      <tr><th colSpan="2" className="table-active">Remarque :</th></tr>
                      <tr><th className="table-active">User</th><td>{user.userId}</td></tr>
                    <tr><th className="table-active">Modifié le</th><td>{user.dateModif}</td></tr>
                    {/* <tr><td colSpan="2">{user.remarque}</td></tr> */}                                 
                                    
                </tbody>
              </table>
                           
              </div>
            </div>
          </div>
  )}

const renderListUser=() =>{
return (
 <div className="table-responsive">         
      <table id="tListOfuser" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
            <th>Date de modif</th> 
             <th>ID</th>
            <th>Date de création</th>         
                <th>Login</th>
                <th>N° de personnel</th>
                <th>Nom & prenoms</th>
                <th>Email</th>      
                 <th>Roles</th>                      
               {(showAllUsers==true)&&(
               <th>Actif</th> )}            
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {users &&
            users.map((item, index) => (
                <tr key={index}>   
                 <td>{item.dateModif}</td>
                  <td>{item.id}</td> 
                 <td>{item.dateCreation.slice(0, -3).replace(" ", " à ")}</td> 
                 <td>{item.username}</td>
                  <td>{personnelsLite!=null && personnelsLite.length>0 ? (personnelsLite.find(elt => elt.key==item.personnelId)?.label):""}</td>
                  <td>{personnelsLite!=null && personnelsLite.length>0 ? (personnelsLite.find(elt => elt.key==item.personnelId)?.value):""}</td>
                  <td>{item.email}</td>
                   <td>{item.roles.map((item) => item?.name.replace("ROLE_","").replace("_"," ")).join(', ')}</td>
                  
                  {(showAllUsers==true)&&(<td>{item.actif==true? "Oui":"Non"}</td>)}                         
                  <td>
                    <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(item, "GET")}>
                                          <FontAwesomeIcon icon={['fa', 'fa-eye']} /> 
                                         </Button>
                                         <Button variant="warning" className="btn-sm"  title="Modifier" onClick={() => performAction(item, "PUT")}>
                                          <FontAwesomeIcon icon={['fa', 'fa-edit']} /> 
                                         </Button>
                                        {(item.actif==true)?(
                                             <Button variant="light" className="btn-sm"  title="Déactiver"  onClick={() => handleStatus(item)}>
                                             <FontAwesomeIcon icon={['fa', 'fa-toggle-on']} /> 
                                            </Button>
                                            
                                            ):(
                                              <Button variant="light" className="btn-sm"  title="Activer"  onClick={() => handleStatus(item)}>
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


return (
<div className="container" > 
  
      
  <header className="jumbotron">
       <h3 className={Styles.HeaderL1} >Gestion des utilisateurs </h3>
       <div className="container-body">
<div className="submit-form">
    
    <div className="text-right">    
       <Button  variant="info" className="btn-sm" 
                         title="Rafraichir" onClick={() => retrieveUsers()}>
                        <i className="fa fa-refresh"></i>
              </Button>
      
    </div>
      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-40vw' >
       <Modal.Header>
          <Modal.Title>
          {perform.action=="POST"?("Nouveau utilisateur"): 
          (perform.action=="GET")?("Détail sur l'utilisateur"):
          (perform.action=="PUT")?("Modifier l'utilisateur" ):
          (perform.action=="DELETE")?("Supprimer l'utilisateur" ):

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
             renderFormUser()):
          (perform.action=="GET" || perform.action=="DELETE")?(
                  renderShowUser()

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(user.id!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(user,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveUser(user)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveUser(user)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteUser(user)}>
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
{renderListUser()}
      </div>
      </header>
</div>
  );
};
let showAllUsers=true;
export default Users;