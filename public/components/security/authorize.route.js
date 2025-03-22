import React, { Component } from "react";
import { Navigate  } from "react-router-dom";
import {  Route, Link } from "react-router-dom";
import AccesRefuse from "../../components/security/accesRefuse.component";
export default function AuthorizeRoute({ component: C, isAuthorized, ...rest }) {
 const initialPerformState = 
     {
        "action": "Erreur",
        "result": "KO-DENIED",
        "msg": "Accès refusé, vous n'êtes pas autorisé à accèder à cette page.",
        "title": "Erreur"
       
    };
  return (
    <Route
      {...rest}
      render={
      	props =>
        isAuthorized
          ? <C {...props} {...isAuthorized} />
          :
            /*<AccesRefuse perform={initialPerformState}/>*/
            <Navigate  to={"/"}/>  
    }
    />
  );
}