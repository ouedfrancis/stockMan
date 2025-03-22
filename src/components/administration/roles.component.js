import React, {useState, useEffect } from "react";
import RolesDataService from "../../services/roles.service";
import PermissionsDataService from "../../services/security/permissions.service";
import Utils from "../../utils/utils";
import { Button,  Modal } from 'react-bootstrap';
import Styles from '../../styles.module.css';
import globalObject from '../../global.js'
//Bootstrap and jQuery libraries
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
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
const Roles = () => {

/*Create role code*/
const initialRoleState = 
    { 
       
         "roleId": "",
        "name": "",
        "remarque": "",
        "actif":""
       
    };

    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",      
    };


    const initialPermissionState = 
     {
        "permissionId": "",
        "roleId": "",
        "module": "",
        "ressource":"",
        "action":"", 
         "actionsPossibles":"",     
    };
    
const [role, setRole] = useState(initialRoleState);
const [roles, setRoles] = useState([]);
const [permissions, setPermissions] = useState([]);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialRoleState);
const [show, setShow] = useState(false);
//const [actif, setActif] = useState(true);

useEffect(() => {
    retrieveRoles(actifRole);
    initPermissions(); 
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}
const handleCloseAndReload = () => {
setShow(false);
refreshRole()
retrieveRoles();
}
function showNotif(perf)
{
  console.log("saveRole-perf",perf)
 Utils.createNotification(perf.result,"Role", perf.msg);                         
handleCloseAndReload()
}
const handleActifroleChange = (event) => {
  //let act=event.target.checked;
  actifRole=event.target.checked;
  retrieveRoles(actifRole);
}

const handleShow = () => setShow(true);

//const today=new Date();
const handleRoleChange = event => {
  const { name, value } = event.target;
  setRole({ ...role, [name]: value });
};

  const refreshList = () => {
    retrieveRoles();
  };

const refreshRole = () => {
    setRole(initialRoleState);
     setErrors(initialRoleState);
     setPerform(initialPerformState);
     initPermissions()
  };

function initPermissions(listOfpermission) {
  let list =[]
  for (var i = 0; i < Utils.ressources.length; i++) {
    let obj={initialPermissionState}
    let elt =[]
    elt=Utils.ressources[i].split("#")
    obj.module=elt[0]
  if( globalObject?.modules.licenceModules!=null&&globalObject?.modules.licenceModules.includes(obj.module))
    {
        if(elt.length>1)
        obj.ressource=elt[1]
        obj.action=""
        obj.actionsPossibles=elt[2]
        obj.userId=globalObject?.user?.id
        list.push(obj)
     }
  
  }

  if(listOfpermission!=null&& listOfpermission.length>0)
   {
    let listFinal =[]
      for(let elt of list)
      {
        
        let obj=Utils.trouverObjetDansListObject(listOfpermission,"ressource",elt.ressource)
          if(obj!=null)
            {
              obj.actionsPossibles=elt.actionsPossibles
              listFinal.push(obj)
            }
          else
            listFinal.push(elt)
        
      }
       setPermissions(listFinal)

    }else 
  setPermissions(list)
  // body...
}
//const reload=()=>window.location.reload();
/******************************************/

async function  savePermissions  (roleId,listOfpermission) {
         let perf={...initialPerformState}
            perf.action=perform.action
            console.log("savePermissions-listOfpermission",listOfpermission)
            let listFinal =[]
          for(let elt of listOfpermission)
          {
            if(elt.action!="")
              listFinal.push(elt)
          }
          console.log("savePermissions-listFinal",listFinal)
          let resp=null;
          if(roleId!=null&&roleId!=""&&listFinal!=null )
            resp= await RolesDataService.createOrUpdatePermissionsAsync(roleId,listFinal);
             
          if(resp!=null && resp.status=="200")
          {
            console.log("savePermissions",resp.data)
            return await  resp.data 
          }else
          {

              perf.result="error";
            if(resp!=null&&resp.status!=200)
              perf.msg=resp.data.message;
            else
              perf.msg="Le role est inconnu ou la liste des persmissions est vide"
              showNotif(perf);    
                return null           
           }
    }
async function saveRole (role)  {


 const obj = {...role};
   obj.userId=globalObject?.user?.id
   var perf=perform;
     if(isValid(obj))
     {        obj.name="ROLE_"+obj.name.toUpperCase().replace(" ","_")
          let response="";
         
          if(obj.roleId!=null && obj.roleId!="")
            response= await RolesDataService.updateAsync(obj.roleId,obj);
          else
            response= await RolesDataService.createAsync(obj);

          if(response!=null && (response.status=="200" || response.status=="201"))
             {
              //obj=person.data;

              setRole(response.data);
              console.log("saveRole",response.data)
               console.log("saveRole-permissions",permissions)
            let resp=null
            resp=await savePermissions(response?.data?.roleId,permissions);

             if(resp!=null )
             {
                console.log("saveRole-resp",resp)              
              perf.result="success";
              if(perf.action=="POST")
                perf.msg="Enregistrement effectué avec succès" 
              else
                perf.msg="Mise à jour effectuée avec succès" 
                showNotif(perf);   
                //console.log("saveRole-perf",perf)
              }  
          


                                           
            }  
           else
           {
            
              perf.result="KO";
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
    let response=await RolesDataService.updateAsync(obj.roleId,obj);
    if(response!=null && response.status=="200")
      {
          setRole(response.data);             
           
                                       
      } 
        else
        {
           
              perf.result="error";
              perf.msg= response.data.message;
              showNotif(perf);

        }
    
  };


async function deleteRole(obj) {
  if(obj.roleId!=null && obj.roleId!="")
  {
      obj.actif=false;
      let perf=perform;
    let response=await RolesDataService.updateAsync(obj.roleId,obj);
    if(response!=null && response.status=="200")
      {
          setRole(response.data);             
          perf.result="success";
          perf.msg="Suppression effectué avec succès"  
          updatePerform(perf);    
          retrieveRoles(actifRole);                               
      } 
        else
        {
           
              perf.result="KO";
              perf.msg= response.data.message;
               updatePerform(perf);

        }
    }
  };

async function retrievePermissions (roleId){

    let resp=null;
   if(roleId!=null&& roleId!="")
   {
     let query="?roleId="+roleId
      resp= await PermissionsDataService.findAsync(query); 
   }
   
    if(resp!=null && resp.status=="200" )          
        {
          setPermissions(resp.data);
          return await resp.data
        }else
        {
          setPermissions([])
          return []
        }

}

async function retrieveRoles (){

  if ($.fn.dataTable.isDataTable('#tListOfrole')) {
        $('#tListOfrole').DataTable().destroy();
       
    }
    let resp=null;
   
      resp= await RolesDataService.getAllAsync();  
       
  
    if(resp!=null && resp.status=="200" )          
        {
          setRoles(resp.data);
          
        }else
        setRoles([]) 

setTimeout(()=>{ 
    //$('#tListOfrole').DataTable().destroy();                       
    $('#tListOfrole').DataTable(

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
 
    let err=initialRoleState;
    let valid=true;
        console.log(obj); 
    if( obj.name==null || obj.name.length<2) 
       {
         err.name="Nom incorrecte";
         valid=false;
     } 
  
  
  setErrors(err);
    return valid;

  };


async function performAction (role,action)  {
  let perf=null;
  if(action=="POST")
  {
    refreshRole();
    perf=initialPerformState;
     perf.action=action;   
    updatePerform(perf);
  }else
  {
    let list=await retrievePermissions(role?.roleId)
    perf=perform;
    handleClose();
    setRole(role);      
    setErrors(initialRoleState);
    handleShow();
    perf.action=action;
    setPerform(perf);
   
    initPermissions(list)
    }

    
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}
const renderFormRole=() =>{
  //console.log("selectedFiles",selectedFiles)
return (
 <div className="row">
  <div className="form-group">             
                      <input
                        type="text"                       
                        id="name"
                        required
                        value={role.name}
                        onChange={handleRoleChange}
                        name="name"
                        placeholder="Role"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.name.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.name}</div>
                    </div>
                   
                    
                     <div className="form-group">     
                    <select id="actif" name="actif" onChange={handleRoleChange} value={role.actif}  className={`form-select form-select-sm ${errors.actif.length>0 ? 'is-invalid' : ''}`}>
                      <option disabled={true} value="">Actif</option>
                      <option value={true}>Oui</option>
                      <option value={false}>Non</option>
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.actif}</div>
                    </div>
                    <div className="form-group">             
                      <textarea
                        type="text"                       
                        id="remarque"
                        required
                        value={role.remarque}
                        onChange={handleRoleChange}
                        name="remarque"
                        placeholder="Remarque"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.remarque.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.remarque}</div>
                    </div>
                    &nbsp; &nbsp;
  <div className={Styles.tableContainer}> 
              {permissions!=null && permissions.length>0 &&( 
                  <table className={Styles.styledTable} >
                  <thead>
                      <tr>                      
                        <th>Module/Fonction</th>
                    
                        <th>Niveau</th>
                      </tr>
                  </thead>
                 
  
                      {
                          permissions.map((item, index) => (
                        <tbody key={index+"groupe"}>     
                       {(index==0||permissions[index-1]?.module!=item?.module)&&( 
                        <tr key={index+"Groupe"} style={{border: "2px solid"}}  >
                         <td colSpan="2"  ><b>{item?.module} </b></td>   
                        </tr> 
                        )}
                       
                      <tr key={index} style={{border: "1px solid"}}> 
                       <td>{Utils.replaceAllCustom(item?.ressource,"_"," ")} </td>
                       <td>
                          <div className="form-group">                         
                    <select id="action" name="action" onChange={(event) => {
                                    item.action = event.target.value;
                                    
                                    setPermissions([...permissions]);
                                  }}
                     value={item?.action}  className={`form-select form-select-sm ${errors.remarque.length>0 ? 'is-invalid' : ''}`}>
                      {item?.actionsPossibles?.split("|")?.map((action, i) => (
                        <option key={i} value={action?.split("-")?.[0]}>{action?.split("-")?.[1]}</option>
                        ))}
                      
                   </select>        
                 
                      <div className="invalid-feedback">{errors.remarque}</div>
                    </div> 
                         </td>
                                                                 
                      </tr>
                   </tbody>
                      ))}
                
              </table>)} 
               &nbsp; &nbsp;&nbsp;
             </div>
      </div>
  )}

const renderPermissions=() =>{
  //console.log("selectedFiles",selectedFiles)
return (
  <div className={Styles.tableContainer}> 
              {permissions!=null && permissions.length>0 &&( 
                  <table className={Styles.styledTable} >
                  <thead>
                      <tr>  
                                    
                        <th>Module/Fonction</th>
                    
                        <th>Niveau</th>
                      </tr>
                  </thead>
                 
  
                      {
                          permissions.map((item, index) => (
                        <tbody key={index+"groupe"}>     
                       {(index==0||permissions[index-1]?.module!=item?.module)&&( 
                        <tr key={index+"Groupe"} style={{border: "2px solid"}}  >
                        
                         <td colSpan="2"  ><b>{item?.module} </b></td>   
                        </tr> 
                        )}

                      <tr key={index} style={{border: "1px solid"}}> 
                     
                       <td>{item?.ressource} </td>
                      <td>{item?.action==""?"Aucune permission":
                      item?.action=="R"?"Lire":item?.action=="CR"?"Lire/Créer":
                      item?.action=="RD"?"Lire/Modifier":item?.action=="CRU"?"Lire/Créer/Modifier"
                      :item?.action=="CRUD"?"Lire/Créer/Modifier/Supprimer":""
                    } </td>  
                         
                         
                                                                 
                      </tr>
                   </tbody>
                      ))}
                
              </table>)} 
               &nbsp; &nbsp;&nbsp;
             </div>
  )}


return (
<div className="container" > 
  
      
  <header className="jumbotron">
       <h3 className={Styles.HeaderL1} >Gestion des rôles </h3>
       <div className="container-body">
<div className="submit-form">
    <div className="text-right">   


        <Button  variant="info" className="btn-sm" 
                   title="Rafraichir" onClick={() => retrieveRoles()}>
                  <i className="fa fa-refresh"></i>
        </Button>
                  
        <Button  variant="success" className="btn-sm" 
             title="Ajouter un role" onClick={() => performAction(role, "POST")}>
               <FontAwesomeIcon icon={['fas', 'fa-user-lock']} />
        </Button> 

       
  </div>


      <Modal  centered show={show} onHide={()=>handleClose} animation={false} dialogClassName='modal-50vw' >
       <Modal.Header closeButton>
          <Modal.Title>
          {perform.action=="POST"?("Nouveau role"): 
          (perform.action=="GET")?("Détail sur le role "):
          (perform.action=="PUT")?("Modifier le role " ):
          (perform.action=="DELETE")?("Supprimer le role" ):

         ""} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {(perform.result!=null&&perform.result.length>0)? (
            <div className="alert alert-secondary mt-2" role="alert"> 
          
              <h4>{perform.msg}</h4>
              {(perform.result=="success")&&(perform.action=="POST")? ( 
              <button className="btn btn-success" onClick={() => performAction(role,"POST")}>
              {renderFormRole()}
              </button>
              ):""}
            </div>
          ) : ((perform.result!=null&&perform.result.length==0) && (perform.action=="POST" || perform.action=="PUT"))? (
            <div className="row">
                {renderFormRole()}
                
              </div>):(perform.action=="GET" || perform.action=="DELETE")?(

              <div className="row">
                <div className="col-md">       
                  <div>
                   
                    <div className="form-group"> 
                    <label htmlFor="title">Role : {role.name}</label> 
                    {renderPermissions()}  
                    </div>
                                 
                                                                                    
                  </div>         
                </div>
              </div>

              ):""}
        </Modal.Body>
        <Modal.Footer>
          {(role.roleId!=null && perform.action=="GET")?
          <Button variant="warning" onClick={() => performAction(role,"PUT")}>
            Modifier
          </Button>:(perform.action=="POST" && perform.result=="")?(
          <Button variant="success"  onClick={() => saveRole(role)}>
              Enregister
            </Button>
          ):(perform.action=="PUT" && perform.result=="")?(
            <Button variant="warning"  onClick={() => saveRole(role)}>
            Mettre à Jour
          </Button>):(perform.action=="DELETE" && perform.result=="")?(
             <Button variant="danger" onClick={() => deleteRole(role)}>
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
      <table id="tListOfrole" className="table table-striped table-bordered display compact" >
          <thead>
            <tr>
               <th>DateMoif</th>
                <th>Nom</th>
                <th>Actif</th>                               
               <th>Actions</th>             
            </tr>
          </thead>
          <tbody>
           {roles &&
            roles.map((item, index) => (
                <tr key={index}>   
                 <th>{item.dateModif}</th>   
                  <td>{item.name=item.name.replace("ROLE_","").replace("_"," ")}</td>            
                  <td>{item.actif==true?"Oui":"Non"}</td>     
                  <td>
                    <Button variant="info" className="btn-sm"  title="Voir le détail" onClick={() => performAction(item, "GET")}>
                      <FontAwesomeIcon icon={['fa', 'fa-eye']} /> 
                     </Button>
                     <Button variant="warning" className="btn-sm"  title="Modifier le role" onClick={() => performAction(item, "PUT")}>
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
      </div>
      
    </header> 
</div>
  );
};
let actifRole=true;
export default Roles;