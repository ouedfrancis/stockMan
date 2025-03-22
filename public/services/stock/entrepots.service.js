import http from "../security/api";
 
class EntrepotsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/entrepots");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/entrepots/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/entrepots", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/entrepots/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/entrepots"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new EntrepotsDataService();