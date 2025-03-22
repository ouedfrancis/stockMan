import http from "./api";
 
class PermissionsDataService {

/*getAllAsync = async (data) => {
    try {
      let response= await  http.get("/security/permissions");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/security/permissions/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/security/permissions", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/security/permissions/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}*/

findAsync = async (query) => {
    try {
      let response= await  http.get("/security/permissions"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new PermissionsDataService();