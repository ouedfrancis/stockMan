import React, { Component } from "react";

import * as rssParser from 'react-native-rss-parser';

import Styles from '../styles.module.css';



import globalObject from '../global.js'
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
    };
  }

  componentDidMount() {
    
  }

render() {
    return (
  <div className="container">

    <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
      }}>
    {globalObject?.entreprise?.homePageImg!=null ?<img className="icone30 rounded mx-auto d-block" 
                            //src={previewImages} 
                            src={globalObject?.entreprise?.homePageImg}
                            style={{
                               
                                aspectRatio: 1,
                                maxWidth: '600px',
                                maxHeight: '600px',
                                
                            }}
                            alt="" />:
                            <img className="icone30 rounded mx-auto d-block" 
                            //src={previewImages} 
                            src="/img/globalesSolutions.png"
                            style={{
                                minWidth: '200px',
                                aspectRatio: 1,
                                maxWidth: '600px',
                                maxHeight: '400px',
                                
                            }}
                            alt="" />

                            /**<div style={{
                            
                              verticalAlign: 'middle',
                              fontWeight:'bold',
                              fontSize:'38px',
                              textAlign:'center',
                              color:`var(--menu-a-hover-background-color)`,
                              maxWidth: '600px',
                              maxHeight: '400px',
                                
                            }}><br/><br/>
                                  ***************************************
                            <br/> Bienvenue dans <br/>votre espace personnel  <br/>
                                  ***************************************</div>**/ }
      </div>

 
       
  </div>
    );
  }
}