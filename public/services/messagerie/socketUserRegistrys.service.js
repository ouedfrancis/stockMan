import http from "../security/api";
 
class SocketUserRegistrysDataService {
 
/*createAsync = async (data) => {
    try {
      let response= await  http.post("/socketUserRegistrys", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/socketUserRegistrys/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}*/

 findAsync = async (query) => {
    try {
      let response= await  http.get("/socketUserRegistrys"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 /*deleteAsync = async (id) => {
    try {
      let response= await  http.delete(`/socketUserRegistrys/${id}`);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}*/


}

export default new SocketUserRegistrysDataService();