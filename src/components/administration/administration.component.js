
import React, { Component } from "react";



import Entreprise from "./entreprise.component";
import Journals from "../../components/administration/journals.component";
import Users from "../../components/administration/users.component";
import Roles from "../../components/administration/roles.component";
import Styles from '../../styles.module.css';


export function AddLibrary(urlOfTheLibrary) {
const script = document.createElement('script');
script.src = urlOfTheLibrary;
script.async = true;
document.body.appendChild(script);
}


 // eslint-disable-next-line no-restricted-globals 
export default class Administration extends Component {


  constructor(props) {
    super(props);
    this.state = {
      content: "", 
    };
 


  }

  componentDidMount() {    
/*    UserService.getModeratorBoard().then(
      response => {
        this.setState({
          content: response.data,

        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );*/


  }



  render() { 
  
    return (    

      <div className="container-fluid">

                <div className="jumbotron">
          <div className="row" >
            
        <div className="col-md">
          <h3 className={Styles.HeaderL1} > {/*AuthService.getCurrentRole()*/} Administration</h3>
           
       <div id="vtab1">
            <ul className="resp-tabs-list vt1">
                <li>Entreprise</li>
                <li>Gestion des utilisateurs</li>
                 <li>Gestion des rôles</li>
                <li>Journalisation</li>
            </ul>
            <div className="resp-tabs-container vt1">
                <div>
                   <h3 className={Styles.HeaderL2} >Entreprise</h3>
                    
                    <Entreprise/>
                </div>
                <div>
                   <h3 className={Styles.HeaderL2} >Gestion des utilisateurs </h3>
                    <Users/>
                </div>
                <div>
                   <h3 className={Styles.HeaderL2} >Gestion des utilisateurs </h3>
                    <Roles/>
                </div>
                <div>
                     <h3 className={Styles.HeaderL2} >Journalisation</h3>
                    <Journals/>
                </div>
            </div>
        </div>
     {/*   <div className="tab-vertical">
            <ul className="nav nav-tabs" id="myTab3" role="tablist">
                <li className="nav-item"> <a className="nav-link" id="entreprise-vertical-tab" data-toggle="tab" href="#entreprise-vertical" role="tab" aria-controls="entreprise" aria-selected="false">Entreprise</a> </li>
                <li className="nav-item"> <a className="nav-link active" id="user-vertical-tab" data-toggle="tab" href="#user-vertical" role="tab" aria-controls="user" aria-selected="false">Gestion des Users</a> </li>
                <li className="nav-item"> <a className="nav-link" id="journal-vertical-tab" data-toggle="tab" href="#journal-vertical" role="tab" aria-controls="journal" aria-selected="false">Journalisation</a> </li>
   
                </ul>
            <div className="tab-content" id="myTabContent3">
                
                <div className="tab-pane fade" id="entreprise-vertical" role="tabpanel" aria-labelledby="entreprise-vertical-tab">
                    <h3 className={Styles.HeaderL2} >Entreprise </h3>
                    
                    <Entreprise/>
                </div>
                <div className="tab-pane fade show active" id="user-vertical" role="tabpanel" aria-labelledby="user-vertical-tab">
                    <h3 className={Styles.HeaderL2} >Gestion des utilisateurs </h3>
                    <Users/>
                </div>
                <div className="tab-pane fade" id="journal-vertical" role="tabpanel" aria-labelledby="journal-vertical-tab">
                    <h3 className={Styles.HeaderL2} >Journalisation</h3>
                    <Journals/>
                </div>
                
                
            </div>
        </div>*/}
   </div>
   {AddLibrary("/js/easyResponsiveTabs.js")}
 </div></div>
      </div>
    );
  }
}
