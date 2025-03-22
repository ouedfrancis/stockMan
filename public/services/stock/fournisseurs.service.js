import http from "../security/api";
 
class FournisseursDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/fournisseurs");
      return await response;
    } catch (err) {
        // Handle Error Here
       
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/fournisseurs/actif");
      return await response;
    } catch (err) {
              
        return err.response;
    }
}
getAsync = async (id) => {
    try {
      let response= await  http.get(`/fournisseurs/${id}`);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/fournisseurs"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/fournisseurs", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/fournisseurs/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

  
}

export default new FournisseursDataService();