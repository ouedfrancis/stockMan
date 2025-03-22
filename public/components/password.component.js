import React, {useState, useEffect } from "react";
import {NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'react-phone-number-input/style.css'

import UserDataService from "../services/security/user.service";


import Utils from "../utils/utils";
import { Button } from 'react-bootstrap';






import 'date-fns';


 /* eslint-disable */
const Password = (props) => {

    const initialPerformState = 
     {
        "action": "",
        "result": "",
        "msg": "",
       
    };

const initialObjectState = {
      
        "id": null,
        "personneId":null,
        "username": "",
        "password": "",
        "contactPro": {},
        "email": "",
        "actif": null,
        "dateCreation": null,
        "dateModif": null,
        "roles": [],
        "remarque": "",
        "createdBy":null,
        "emailValidationKey":"",
        "validationUrl":"",
        "emailValidationKey":""
        
    };


const initialPatientState = {
        "patientId": null,       
        "personne": null,
        "actif": true
    };


const initialQueryState = {

            "numPatient": "",
            "nom": "",
            "prenoms": "",
            "telMobile": "",
            "actif": "",
}

const [user, setUser] = useState(initialObjectState);
const [perform, setPerform] = useState(initialPerformState);
const [errors, setErrors] = useState(initialObjectState);
const [loading, setLoading] = useState(false);
const [showPwd, setShowPwd] = useState(false);

useEffect((props) => {

    /*if(props?.origine!=null && props.origine=="dossierPatient")  
    {
        performAction(props.patient,"GET")
        console.log("props?.origine",props?.origine)
    }else
    {
         performAction(patient,"POST")
         
    }*/
    const query =new URLSearchParams(window.location.search);
    console.log("query==========>",query);
  // new URLSearchParams(this.props.location.search);
  const email = query.get('email')
  const key = query.get('key')
  const action = query.get('action')
  const timestamp = query.get('xTimestamp')
  console.log("query==========>key",key);
  if(email!=null&& key!=null&& timestamp!=null)
  {
    let u={}
    u.email=email
    u.passwordValidationKey=key
    //u.validationUrl=window.location.href.split('?')[0];
    console.log("user============>",u);
    setUser(u)
    performAction(u,"PUT")
    //validateUser(u)
  }else 
     performAction(user,"POST")
    //retrievePayss();
     
  }, []);


const handleShowUsers = () => setShowUsers(true);


const handleUserChange = event => {
  const { name, value } = event.target;
  setUser({ ...user, [name]: value });
};



const refreshUsers = () => {
     
     setUser(initialObjectState.user)
     setErrors(initialObjectState);
     setShowPwd(false)
     setPerform(initialPerformState);
 
     
  };


 function isValidEmailOrNumPatient (obj) {
 
    let err={...initialObjectState};
    let valid=true;
    
    if( obj.email==null|| obj.email==""|| obj.email.length<4) 
       {
           err.errorMsg+="<br/>-"
          err.errorMsg+=err.email="Email ou n° patient incorrecte";
          valid=false;
     }else
     if( obj.email.includes("@") &&!Utils.validateEmail(obj.email)) 
       {
           err.errorMsg+="<br/>-"
          err.errorMsg+=err.email="Email incorrecte";
          valid=false;
      } 

  setErrors(err);
 console.log(err);
    return valid;
    //return false;
  };






async function  askChangePassword  (obj) {
            let resp="";
            let perf={...initialPerformState}
            perf.action=perform.action
             setLoading(true)

            if(isValidEmailOrNumPatient(obj))
            {
                   let query="?action=askChangePassword"
              resp= await UserDataService.changePasswordAsync(query,obj);


            if(resp!=null && (resp.status=="200") )
              { 
                  obj=resp.data; 
                  perf.result="success";
                   perf.msg="Email envoyé"
                          
              }
               else
               {               
                perf.result="error";
                if(resp==null)
                    perf.msg="Erreur lors du traitement de votre demande"; 
                else
                perf.msg=resp?.data?.message;                          
                             
               }
            }
            setPerform(perf)
             setLoading(false)
           
                
}

 function isValidPassword (obj) {
 
    let err={...initialObjectState};
    let valid=true;
    
    
    if( user.password==null || Utils.passwordStrength(user.password)<5)  
       {
         err.errorMsg+="<br/>-"
       err.errorMsg+=err.password="Mot de passe incorrecte.";
         valid=false;
     }

  setErrors(err);
 console.log(err);
 console.log("valid"+valid);
    return valid;
    //return false;
  };

async function  changePassword  (obj) {
            let resp="";
            let perf={...initialPerformState}
            perf.action=perform.action
             setLoading(true)

            if(isValidPassword(obj))
            {
              let query="?action=changePassword"
              console.log("obj",obj);
              resp= await UserDataService.changePasswordAsync(query,obj);
            if(resp!=null && (resp.status=="200") )
              { 
                  obj=resp.data; 
                  perf.result="success";
                   perf.msg="Votre mot de passe a été changé"                          
              }
               else
               {               
                perf.result="error";
                if(resp==null)
                    perf.msg="Erreur lors du traitement de votre demande"; 
                else
                perf.msg=resp?.data?.message;                          
                             
               }
            }
            setPerform(perf)
            setLoading(false)
                           
}




function updatePerform  (perf) {
  setPerform(perf);
  setShowUsers(false);
  setShowUsers(true);
}



const performAction = (obj, action) => {

   
    
    console.log("user",obj)  
 setErrors(initialObjectState);
  if(action=="POST")
    {
      setUser(initialObjectState)
    }
     let perf={...perform};
     perf.action=action;
     setPerform(perf);
  };




 


/*********************************************RENDER*******************************************/



const renderFormAskPassword=()=>{
return (
<div className="card modal-30vw">
{perform.result!="success"?(
   <div className="row">
      <div className="small">
      <span className="text-success align-center"><b> Réinitialiser le mot de passe</b></span><br/> 
         <span className="align-left ">               
         <b>1-Entrez votre adresse e-mail ou votre n° patient.<br/>
2-Ouvrez le lien dans l'e-mail que vous recevez.<br/>
3-Choisissez un nouveau mot de passe.</b>               
         </span>
      </div>
      <div>
         <br/>
         <div className="row">
            <div className="col-md">
             

               <div className="form-group input-group">         
                  <input
                     type="text"
                     className="form-control"
                     id="email"
                     required
                     value={user.email}
                     onChange={handleUserChange}
                     name="email"
                     placeholder="Email ou le n° patient"
                     maxLength="50"
                     className={`form-control form-control-sm ${errors.email.length>0 ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.email}</div>
               </div>               
            </div>
                     
                

            <div>
               <br/>
            </div>
     
         </div>
         
      </div>
        {perform.msg!=null&&perform.msg!=""&&<div className="alert alert-danger" role="alert">
       {perform.msg}
       </div>}
       <Button
                className="btn btn-primary btn-block"
                disabled={loading}
                onClick={() => askChangePassword(user)}
               
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span> Reinitailiser le mot de passe</span>
              </Button>
   
   </div>):(

         <div className="alert alert-info" role="alert">
 <b>E-mail envoyé</b><br/>
Ouvrez le lien dans l'e-mail pour réinitialiser votre mot de passe<br/>
La réception de l'e-mail peut prendre quelques minutes. Vous ne le recevrez que si vous avez entré l'adresse e-mail enregistrée sur votre compte. Si vous ne recevez rien, vérifiez vos courriers indésirables ou consultez le Centre d'aide.
</div>

   )}
</div>

  )
}

const renderFormChangePassword=()=>{
return (
<div className="card modal-30vw">
{perform.result!="success"?(
   <div className="row">
      <div className=" align-center small">
      <span className="text-success align-center"><b> Réinitialiser le mot de passe</b></span><br/> 
         <span className="align-left ">               
<b>Entrez un nouveau mot de passe.</b>               
         </span>
      </div>
      <div>
         <br/>
         <div className="row">
            <div className="col-md">
             

              <div className="form-group input-group">         
                  <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  value={user.password}
                  onChange={handleUserChange}
                  name="password"
                  placeholder="Nouveau mot de passe"
                  maxLength="50"
                  className={`form-control form-control-sm ${errors.password.length>0 ? 'is-invalid' : ''}`}
                  />
                  <div className="input-group-prepend">
                     <span className="input-group-text">
                        <FontAwesomeIcon className="cursor-pointer" onClick={()=>
                        setShowPwd(!showPwd)} icon={`fa-solid ${showPwd ? 'fa-eye' : 'fa-eye-slash'}`} />
                     </span>
                  </div>
                  <div className="invalid-feedback">{errors.password}</div>
                 <h6 className="text-warning small ">  <small>Le mot de passe doit comporter au moins 8 caractères dont une lettre majuscule ou un chiffre. </small></h6>
               </div>               
            </div>
                     
                

            <div>
               <br/>
            </div>
     
         </div>
         
      </div>
       {perform.msg!=null&&perform.msg!=""&&<div className="alert alert-danger" role="alert">
       {perform.msg}
       </div>}
       <Button
                className="btn btn-primary btn-block"
                disabled={loading}
                onClick={() => changePassword(user)}
               
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span> Changer le mot de passe</span>
              </Button>
   
   </div>):(

<div className="alert alert-info" role="alert">
 <b>Votre mot de passe à été changé</b><br/>
Vous pouvez dès maintenant   vous connecter
    avec votre nouveau mot de passe.<br/>
    <NavLink to={"/login"} exact="true">
        <b> Se connecter</b>
    </NavLink>
</div>

   )}

   
</div>

  )
}


return (

<div className="container" style={{"paddingRight":"15%"}}> 
     {perform?.action=="POST" &&renderFormAskPassword()}
      {perform?.action=="PUT"&&renderFormChangePassword()}
       <br/>
    <div className="card modal-30vw text-center">
        <span className="align-center"> Retour <br/> 
        <NavLink to={"/login"} exact="true">
        <b>Se connecter</b>
        </NavLink>
        </span>   
    </div>
     
</div>


  );
};
let actifUsers=true;
export default Password;