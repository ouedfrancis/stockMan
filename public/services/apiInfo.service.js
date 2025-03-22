import http from "./security/api";
 
class ApiInfoService {
  getApiInfo() {
    return http.get("/apiInfo");
  }
  
getApiInfoAsync = async () => {
    try {
      let response= null
      response=await http.get("/apiInfo");
     
      return await response;
    } catch (err) {
        
        return err.response;
    }
}


}

export default new ApiInfoService();