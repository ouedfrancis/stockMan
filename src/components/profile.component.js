import React, {useState, useEffect } from "react";

import Utils from "../utils/utils";
import { Button,  Modal } from 'react-bootstrap';

import AuthService from "../services/security/auth.service";
import globalObject from '../global.js'
import UsersDataService from "../services/security/user.service";
import Styles from '../styles.module.css';
//Bootstrap and jQuery libraries
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
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
const Profile = () => {

/*Create user code*/
const initialUserState = 
   { 
      "id": null,
        "username": "",
        "email": "",
        "password": "",
        "password2": "",
        "previousPassword": "",      
        "roles": [],
        "actif": false,
        "personnelId": "",
        "dateCreation": "",
        "dateModif": "",
        "userId":""
    };


const initialPerformState = 
{
        "action":"",
        "result":"",
        "msg":"",     

    };
const [user, setUser] = useState(initialUserState);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialUserState);
const [show, setShow] = useState(false);
//const [actif, setActif] = useState(true);


useEffect(() => {
    retrieveUser();
   
   let perf=perform;
    perf.action="GET";
    setPerform(perf); 
     
  }, []);

const handleClose = () => {
  setShow(false);
  let perf=perform;
  perf.result="";  
  setPerform(perf);
}



const handleShow = () => setShow(true);

//const today=new Date();
const handleUserChange = event => {
  const { name, value } = event.target;
  setUser({ ...user, [name]: value });
};






const refreshUser = () => {
     setErrors(initialUserState);
     setPerform(initialPerformState);
  };


//const reload=()=>window.location.reload();
/******************************************/
async function saveUser (user)  {
 const elt = {...user};
   var perf=perform;
     if(isValid(elt))
     {    
      
          let response="";  
          console.log("elt====>",elt)   
          elt.roles=[]  ;  
          if(elt.id!=null && elt.id!="")
            response= await UsersDataService.updateAsync(elt.id,elt);

          if(response!=null && (response.status=="200"|| response.status=="201") )
            {
              //elt=person.data;
              //setUser(response.data); 

              perf.result="OK";
              perf.msg="Mise à jour effectuée avec succès" 
              updatePerform(perf);    
                             
            }  
           else
           {            
             perf.result="KO";
              perf.msg= response.data.message;            
               updatePerform(perf);              
           }            
        }   
  };




async function retrieveUser (){  
    console.log("globalObject in profile",globalObject)
   //let u=AuthService.getCurrentUser()
    if(globalObject.user!=null)
    {
      let elt=initialUserState
      elt.id=globalObject.user.id
      elt.username=globalObject.user.username
      elt.roles=globalObject.user.roles;
      elt.personnelId=globalObject.user.personnelId
      elt.email=globalObject.user.email
       setUser({...elt})
    }
   

  };

function isValid  (elt) {
 
    let err=initialUserState;
    let valid=true;
        
    if( elt.username==null || elt.username.length<2) 
       {
         err.username="Login incorrecte";
         valid=false;
     } 
     /* if( elt.email==null || elt.email.length<2) 
       {
         err.email="L'email est requis";
         valid=false;
     } */
     if( elt.previousPassword==null || elt.previousPassword.length<2) 
       {
         err.previousPassword="Mots de passe incorrecte";
         valid=false;
     } 

     if( elt.password==null || elt.password.length<2 || Utils.passwordStrength(elt.password) <8) 
       {
         err.password="Le nouveau mot de passe ne resspecte pas les criètes requis";
         valid=false;
     }
       if( elt.password2==null || elt.password2!= elt.password) 
       {
         err.password2="Le mot de passe ne correspond pas à celui saisie plus haut.";
         valid=false;
     }
      
  if( valid==true &&elt.previousPassword== elt.password) 
       {
         err.password2="Le nouveau mot de passe doit être différent de l'actuel.";
         valid=false;
     }
   console.log("err",err);
  setErrors(err);
    return valid;

  };


const performAction = (user,action) => {
  let perf=null;
 
    perf=initialPerformState;
    handleClose();   
    setErrors(initialUserState);
    perf.action=action;
    setPerform(perf);  
  };

function updatePerform  (perf) {
  setPerform(perf);
  setShow(false);
  setShow(true);
}

const renderShowUser=()=>{
  return (
    <div className="container">
     <Modal.Header >
          <Modal.Title>
          {
          (perform.action=="GET")&&("Profile de l'utilisateur " )
          } </Modal.Title>
  </Modal.Header>
 <div className="col-md">       
                 
              
              <table className='table table-bordered table-sm'>
                <tbody>
                    <tr><th className="table-active">Login </th><td>{user.username}</td></tr>
                    <tr><th className="table-active">Email</th><td>{user.email}</td></tr>
                     <tr><th className="table-active">Mot de passe</th><td>**********</td></tr>
                    <tr><th colSpan="2" className="table-active">Roles :</th></tr>
                    <tr><td colSpan="2">{user.roles &&
            user.roles.map((role, index) => <li key={index}>{Utils.replaceAllCustom(role.name,"ROLE_"," ")}</li>)}</td></tr>                 
                </tbody>
              </table>
              
         
    </div>
     <div className="modal-footer"> 
                  {(user.id!=null)&& (
                      <Button variant="warning"  className="pull-right" onClick={() => performAction(user,"PUT")}>
                        Modifier
                      </Button>)} 
                       
             </div> 
</div>
    )
}

const renderFormUser=()=>{
  return (
<div>
  <Modal.Header >
          <Modal.Title>
          {
          (perform.action=="PUT")&&("Modifier le profile " )
          } </Modal.Title>
  </Modal.Header>
 <div className="col-md" >

                                                
                   <div className="form-group">  
                  
                      <input
                        type="text"                       
                        id="username"
                        required
                        value={user.username}
                      
                        name="username"
                        placeholder="Login"
                        maxLength="100"
                        disabled={true}
                        className={`form-control form-control-sm ${errors.username.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.username}</div>
                    </div>
                 <div className="form-group"> 
                     
      
                      <input
                        type="text"                       
                        id="email"
                        disabled={true}
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
                        id="previousPassword"
                        required
                         type="password"
                        value={user.previousPassword}
                        onChange={handleUserChange}
                        name="previousPassword"
                        placeholder="Mot de passe actuel"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.previousPassword.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.previousPassword}</div>
                    </div>
                    <div className="form-group"> 
                      <input
                        type="text"                       
                        id="password"
                         type="password"
                        required
                        value={user.password1}
                        onChange={handleUserChange}
                        name="password"
                        placeholder="Nouveau mot de passe"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.password.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.password}</div>
                    </div>
                    <div className="form-group"> 
                              
                      <input
                        type="text"                       
                        id="password2"
                         type="password"
                        required
                        value={user.password2}
                        onChange={handleUserChange}
                        name="password2"
                        placeholder="Repeter le nouveau mot de passe"
                        maxLength="100"
                        className={`form-control form-control-sm ${errors.password2.length>0 ? 'is-invalid' : ''}`}
                      />
                       <div className="invalid-feedback">{errors.password2}</div>
                    </div>
                   
               <div className="alert alert-danger" role="alert"> Le nouveau mot de passe doit comporter au moins 8 carractères, 1 chiffre, une lettre majuscule et au moins un carractère spécial (!,$@*+-).  </div>
              
                </div>
                 
           <div className="modal-footer"> 
                  <span>  </span>
                 <Button variant="warning"  onClick={() => saveUser(user)} >
                   Mettre à Jour
                 </Button> <span>  </span>
                  <Button variant="secondary" onClick={() => performAction(user,"GET")}>
                          Fermer
                 </Button> 
                       
             </div>  
             
</div>
    )}
return (
   

    <div className="container card modal-25vw">


    <h3 className={Styles.HeaderL1} > {/*AuthService.getCurrentRole()*/} Profile</h3>
    
    {((perform.action=="POST" || perform.action=="PUT"))? (
           
renderFormUser()

):( perform.action=="GET")&&( 
renderShowUser()
              )}

 

      {
          (perform.result.length>0)&&(
      <Modal  centered show={show} onHide={handleClose} animation={false} dialogClassName='modal-25vw' >
       <Modal.Header >
          <Modal.Title>
          {
          (perform.action=="PUT")&&("Modifier infos clinique " )
          } </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {(perform.result.length>0)&& (
            <div className="alert alert-secondary mt-2" role="alert">           
              <h4>{perform.msg}</h4>                      
            </div>)}
        </Modal.Body>
        <Modal.Footer>    
        {(perform.result=="KO")? (   
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        )
        :(<Button variant="secondary"  onClick={() => performAction(user,"GET")}>
             Fermer
          </Button>)}
        
        </Modal.Footer>
      </Modal>)}
  
  </div>
  )
};

export default Profile;