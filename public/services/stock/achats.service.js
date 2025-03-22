import http from "../security/api";
 
class AchatsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/achats");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/achats/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/achats", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/achats/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/achats"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 
}

export default new AchatsDataService();