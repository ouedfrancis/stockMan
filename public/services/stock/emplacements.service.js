import http from "../security/api";
 
class EmplacementsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/emplacements");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/emplacements/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/emplacements", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/emplacements/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/emplacements"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new EmplacementsDataService();