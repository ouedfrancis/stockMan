import React, {useState, useEffect } from "react";


import { Button,  Modal } from 'react-bootstrap';
 
import {QRCodeSVG} from 'qrcode.react';
import {QRCodeCanvas} from 'qrcode.react';
import Barcode from 'react-barcode';

import { TextField } from '@mui/material';


 /* eslint-disable */
const CodeManager = (props) => {



const [showCodeModal, setShowCodeModal] = useState(false);

useEffect(() => {
   setShowCodeModal(true);
    
  }, []);

const handleCloseCodeModal = (close) => {
    if(close!=null && close==true)
  setShowCodeModal(false);
else
     setShowCodeModal(true);
  
}


const renderShowCode=() =>{
return (

<div className="col-md">       
        {(props.code!="qr")?(
              <QRCodeCanvas value="https://reactjs.org/" />
              ):
              (
                <Barcode value="barcode-example" />
              )}                        
                               
        </div>
    )}

return (
<div className="container">        
{/************************************Modal for add individu*******************************/}


   
      <Modal  centered show={showCodeModal} onHide={handleCloseCodeModal} animation={false} dialogClassName= 'modal-loading' contentClassName='modal-color'>
        <Modal.Header closeButton>
         <Modal.Title>
          {props.perform.title} 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
        <div className="form-group"> 
            {renderShowCode ()}
        </div>
        </Modal.Body>
        <Modal.Footer>      
                           
          <Button variant="secondary" onClick={() =>handleCloseCodeModal(true)}>
            Fermer
          </Button>
        
        </Modal.Footer>
      </Modal>
    
    </div>
  );
};

export default CodeManager;