import api from "./api";
import TokenService from "./token.service";
import globalObject from '../../global.js'
class AuthService {
  login(username, password) {
    return api
      .post("/security/auth/signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          // console.log("AuthService=====>", response.data);
          TokenService.setUser(response.data);
          TokenService.setLastActivityTime(Math.floor((new Date().getTime())/1000))

        }

        return response.data;
      });
  }

  logoutLocal() {
    
    TokenService.removeUser();
    /*localStorage.removeItem("currentRole");
    globalObject={}*/     
    
  }


logoutAsync = async () => {
   let user=TokenService.getUser();
   if(user!=null && user.id!=null)
   {
    try {

       let data={}
       data.userId=user?.id;
       data.refreshToken=user?.refreshToken; 
        data.currentRole=globalObject?.currentRole
       console.log("TokenService.getUser====>",user)
      let response= await  api.post("/security/auth/logout", data);
     if(response!=null && response.status=="200")
        {
       console.log("logoutAsync====>",response)
         await  TokenService.removeUser();
        await localStorage.removeItem("currentRole");
        /*globalObject={}*/    

        }
      return response 
    } catch (err) {
        TokenService.removeUser();
        return err.response;
    }
  }
}


logout() {
    let user=TokenService.getUser();
      if(user!=null && user.id!=null)
   {
    let data={}
    data.userId=user?.id;
    data.refreshToken=user?.refreshToken;
     data.currentRole=globalObject?.currentRole 
    console.log("logout====>",data)
     return api
      .post("/security/auth/logout", data)

    }else
    return null;

   /* return api
      .post("/security/auth/logout", req)
      .then(response => {
        TokenService.removeUser();
        localStorage.removeItem("currentRole");
        console.log("response.data====>",response.data)
        let redirect=window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/login";
          if(queryParam!=null)
            redirect=redirect+"?"+queryParam
          window.location.href = redirect
        return response.data;
      },
      error => {
        if(error?.response!=null)
        { 
        });*/
  }

logoutSync() {
    let user=TokenService.getUser();
      if(user!=null && user.id!=null)
   {
    let data={}
    data.userId=user?.id;
    data.username=globalObject?.user?.username
    data.refreshToken=user?.refreshToken;  
    data.currentRole=globalObject?.currentRole //AuthService.getCurrentRole()
   
    console.log("logoutSync==logout====>",data)
    TokenService.removeUser();
        localStorage.removeItem("currentRole");
     return api
      .post("/security/auth/logout", data).then(response => {
        /*TokenService.removeUser();
        localStorage.removeItem("currentRole");*/
        console.log("logoutSync===response.data====>",response.data)
        /*let redirect=window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/login";
          if(queryParam!=null)
            redirect=redirect+"?"+queryParam
          window.location.href = redirect*/
        return response.data;
      },
      error => {
        if(error?.response!=null)
        { 
          console.log("logoutSync===error====>",error)

        }
      }
        );

    }else
    return null;

   /* return api
      .post("/security/auth/logout", req)
      .then(response => {
        TokenService.removeUser();
        localStorage.removeItem("currentRole");
        console.log("response.data====>",response.data)
        let redirect=window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/login";
          if(queryParam!=null)
            redirect=redirect+"?"+queryParam
          window.location.href = redirect
        return response.data;
      },
      error => {
        if(error?.response!=null)
        { 
        });*/
  }
  register(username, email, password) {
    return api.post("/security/auth/signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return TokenService.getUser();
  }
   setCurrentRole(currentRole) {
    globalObject.currentRole=currentRole;
    //console.log("globalObject currentRole",globalObject)
    return localStorage.setItem('currentRole',currentRole);
  }
  getCurrentRole() {
    return localStorage.getItem('currentRole');
  }

  setData(key,value) {
   
    //console.log("globalObject currentRole",globalObject)
    return localStorage.setItem(key,JSON.stringify(value));
  }

  getData(key) {
    return JSON.parse(localStorage.getItem(key));
  }

 
}

export default new AuthService();
