import React, { Component } from "react";
import Form from "react-validation/build/form";
import { Link,NavLink } from "react-router-dom";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button"; 

import AuthService from "../services/security/auth.service";
//import Captcha from "demos-react-captcha";
import Utils from "../utils/utils";
import $ from 'jquery'; 
import globalObject from '../global.js'
const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Une valeur est réquise!
      </div>
    );
  }
};



export default class Login extends Component {
  constructor(props) {
    super(props);
  console.log("clinique", globalObject?.clinique)
    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",
      logo:this.props.logo,
      loginFail:0,
     // loginFail:localStorage.getItem("loginFail")!=null && Number.isNaN(localStorage.getItem("loginFail"))==false &&Number(localStorage.getItem("loginFail"))>=0?Number(localStorage.getItem("loginFail")):0,
      captchaValue:false,
      permissionRegister:Utils.trouverObjetDansListObject(globalObject?.permissions,"module","PORTAIL_PATIENT"),
    };

    
/* this.state = {
         logo: globalObject.logo
        };

    console.log("globalObject in login",this.props.logo)*/
    
    /*if(globalObject.clinique!=undefined)
     globalObject.clinique={};*/
   if(globalObject.user!=undefined)
     globalObject.user={};
    let query =window.location.search
    if(query.includes('accessDenied'))
    {
      this.state = {
         message: "Votre session a expiré, Veillez vous reconnecter."
        };
    }
    /*this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleCaptcha=this.handleCaptcha.bind(this)
    this.onRefresh=this.onRefresh.bind(this)
    this.isOkCaptcha=this.isOkCaptcha.bind(this)
    this.setError=this.setError.bind(this)*/
}

componentWillMount() {
    
      this.setState({
        loginFail:localStorage.getItem("loginFail")!=null && Number.isNaN(localStorage.getItem("loginFail"))==false &&Number(localStorage.getItem("loginFail"))>=0?Number(localStorage.getItem("loginFail")):0,
      });
   
  }


  onChangeUsername=(e)=> {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword=(e)=> {
    this.setState({
      password: e.target.value
    });
  }


  handleLogin=(e)=> {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();


    if (this.isOkCaptcha() && this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        (response) => {

         localStorage.setItem("loginFail",JSON.stringify(0))
         /* this.props.history.push("/home");
         window.location.reload();*/
        window.location.href = window.location.origin+process.env.REACT_APP_FRONTEND_URL;
          
        },
        error => {
          let resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

            if(error.response!=null && error.response.status === 401)
              resMessage="Login et/ou mot de passe incorrecte"
           this.setError(resMessage)
          
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

isOkCaptcha=()=> {
  if(this.state.loginFail==0 || this.state.loginFail<=10|| this.state.captchaValue==true)
    {

       return true;
      }else
     {
      console.log("IS KOOOOO");
      this.setError("Code incorrecte")
        return false
      }

  }

setError =(msg)=>{
        this.setState({
         captchaValue: "",
         loading: false,
         message:msg,
         loginFail: this.state.loginFail + 1
        });
      localStorage.setItem("loginFail", JSON.stringify(this.state.loginFail))
      //get refresh button  it attribute data-testid='captcha-refresh' and simulate the click to refresh 
      $("[data-testid=captcha-refresh]").click();
}
handleCaptcha=(value)=> {
   // console.log(value);
    this.setState({
         captchaValue: value
        });
  }

onRefresh=()=> {
    return false;
  }
  render() {
  const {logo,username,loginFail,message,loading,captchaValue } = this.state;
//console.log("loginFail",loginFail)
//console.log("message",message)
    return (
      <div className="row" >      
        <div className="card card-container">
        {this.props.logo==null &&(  <img
            src="/img/globalesSolutions.png"
            alt="profile-img"
            className="logo"
          />)}
           {this.props.logo!=null &&(
            <div className="profile-img side-img">
                        
                    <img className="logo" 
                            //src={previewImages} 
                            src={this.props.logo}
                            alt="Logo" 
                            />    
                  
                             </div>
            )}
                 
          <Form
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="username">Login</label>
              <Input
                type="text"
                className="form-control"
                name="username"
                value={this.state.username}
                onChange={this.onChangeUsername}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.onChangePassword}
                validations={[required]}
              />
            </div>
            {/*this.state.loginFail>10 &&(
            <div className="form-group">
            <Captcha ref={Utils.uuidv4()} onChange={this.handleCaptcha}  onRefresh={this.onRefresh} placeholder="Entrer le code"  length={6}/>
            </div>)*/}
            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div> 

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
                </div>
              </div>
            )}

            <div className="text-center">
              <NavLink to={"/user/password"} exact="true">
              <b>Mot de passe oublié?</b>
              </NavLink>
            </div>
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
       <div>
        <br/>
        </div>
        { globalObject?.clinique?.licence.modules?.includes("PORTAIL_PATIENT")&& globalObject?.clinique.config?.modulePortailPatient&&(
        <div className="card card-container text-center">
        <span className="align-center">  Vous n'avez pas encore de compte?<br/> 
        <NavLink to={"/register"} exact="true">
        <b>S'inscrire</b>
        </NavLink>
        </span>

      
        </div>)}
       
      </div>
    );
  }
}
