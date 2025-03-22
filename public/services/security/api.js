import axios from "axios";
import TokenService from "./token.service";
import AuthService from "./auth.service";
import { useHistory } from "react-router-dom";
import globalObject from '../../global.js'
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL!=""?process.env.REACT_APP_BACKEND_URL+"/stockManagement/api" : window.location.origin+"/stockManagement/api",
  headers: {
    "Content-Type": "application/json",
     "Access-Control-Allow-Origin": "*",
     'Content-Encoding': 'gzip',
  },

});

instance.interceptors.request.use(
  (config) => {
  
    const lastActivityTime=TokenService.getLastActivityTime()
     const currentTime=Math.floor((new Date().getTime())/1000);
     const inactivitymaxTime=globalObject!=null && globalObject.clinique!=null && globalObject.clinique.config.inactivityTime!=null?globalObject.clinique.config.inactivityTime:process.env.REACT_APP_INACTIVITY_TIME
     //TokenService.getInactivityMaxTime()!=null?TokenService.getInactivityMaxTime():process.env.REACT_APP_INACTIVITY_TIME
   
    if(lastActivityTime!=undefined &&!config.url.includes("logout") )
     {
      
      
      if(currentTime-lastActivityTime>inactivitymaxTime )
      {
        console.log("interceptor",config)

          AuthService.logoutSync();
         /*console.log("interceptor",config)
          TokenService.removeUser();
      localStorage.removeItem("currentRole");*/
        return window.location.href = window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/login?accessDenied=true";
       
      }else
        if(!config.url.includes("typeRdv=Consultation&statutRdv=3")&&!config.url.includes("ignoreActivity=true"))
         {
          TokenService.setLastActivityTime(currentTime)
          // console.log("instance.interceptors.request ==>"+ config.url);
        }
     } 

    const token = TokenService.getLocalAccessToken();
    if (token) {
       config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
      //config.headers["x-access-token"] = token; // for Node.js Express back-end
        config.headers["X-uId"] = globalObject?.user?.id!=null?globalObject?.user?.id:config?.data?.userId;
        config.headers["X-uName"] = globalObject?.user?.username!=null?globalObject?.user?.username:config?.data?.username;
        config.headers["X-cRole"] = AuthService.getCurrentRole()!=null?AuthService.getCurrentRole():config?.data?.currentRole;
        if(config.data!=null&&config.data?.patientId!=null)
        {
            //console.log("config===============>>>>>>",config.data?.patientId)
          config.headers["X-pId"]= config.data?.patientId;//contain "patientId"
        }
      
    }else
    if(config.url.includes("signin"))
     {
      config.headers["X-uName"] = config.data?.username;
      //console.log("config",config);
     }else
    if(config.url.includes("logout"))
     {
        config.headers["X-uName"] = config.data?.username;
        config.headers["X-uId"] = config?.data?.userId;
        config.headers["X-cRole"] = config?.data?.currentRole;

      //console.log("config",config);
     } 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



 //let counter = 0;
//const max_time=3;
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig!=undefined && originalConfig.url != "/security/auth/signin"  && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const getRefreshToken= TokenService.getLocalRefreshToken();
          if(getRefreshToken!=undefined || getRefreshToken!=null)
          {
             console.log("token:",getRefreshToken)
            const rs = await instance.post("/security/auth/refreshtoken", {
              refreshToken: getRefreshToken,
            });

            const { accessToken } = rs.data;
            TokenService.updateLocalAccessToken(accessToken);
            originalConfig.headers["Authorization"] = 'Bearer ' + accessToken
             console.log("new token",TokenService.getLocalAccessToken())
            //return axios.request(originalConfig);
            return new Promise((resolve) => {
                  resolve(axios(originalConfig))
              })
          }
          //else
         // return window.location.href = process.env.REACT_APP_FRONTEND_URL+"/login?accessDenied=true";
         // return instance(originalConfig);
         return Promise.reject(err);
        } catch (_error) {

           if (_error.response.status === 403 &&!originalConfig.url.includes("logout") ) {

              //store.dispatch('logout')
               console.log("logout",TokenService.getLocalAccessToken())
             await  AuthService.logoutAsync();
              /*let history = useHistory();
               history.push("/login");*/
               console.log("redirect to login")
               return window.location.href = window.location.origin+process.env.REACT_APP_FRONTEND_URL+"/login?accessDenied=true";
             }

          return Promise.reject(_error);
        }
      }

    }
    /*if (err.response.status === 401 && !originalConfig._retry)
    {
     
       originalConfig.headers["Authorization"] = 'Bearer ' + TokenService.getLocalAccessToken();
        // originalConfig.baseURL = undefined;
      if (counter < max_time) {
            counter++
            return new Promise((resolve) => {
                resolve(axios(originalConfig))
            })
        }
      
    }*/
   

    return Promise.reject(err);
  }
);

export default instance;
