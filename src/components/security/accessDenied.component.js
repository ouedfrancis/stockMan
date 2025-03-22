import React, {useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Styles from '../../styles.module.css';
import { Button,  Modal } from 'react-bootstrap';
//import SinglePagePDFViewer from "./pdf/single-page";

//import { sampleBase64pdf } from "./sampleBase64pdf";
/* This is required only if the project file is located 
inside the app. Otherwise you can use the external link of the pdf file*/
//import samplePDF from "/data/help/GlobalSantePlus_Aide.pdf";



 /* eslint-disable */
const AccesRefuse = () => {

useEffect(() => {
 
  }, []);

function returnToHome()
{
    window.location.href = window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/";
}


return (


        
               
        <div className="row" >
            <div className="col-md">  
                 <div className="card card-container">
                   
                                                          
                     <div className="col-md text-center"> 
                        <img src="/img/403.png" alt="profile-img" className="icone60"/>
                        <br/><h4 style={{"color":"red"}}>Accès réfusé</h4>
                        <br/><Button variant="info" onClick={()=>returnToHome()} >
                            <b>{"<< "}Retour à l'accueil</b>
                        </Button>
                        </div>
                  
                    
                </div>
            </div>
        </div>           
     
  );
};

export default AccesRefuse;