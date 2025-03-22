import http from "./security/api";
 
class ModeDePaiementsDataService {


getByIdAsync = async (id) => {
    try {
      let response= await  http.get(`/modeDePaiements/${id}`);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/modeDePaiements", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/modeDePaiements/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

 findAsync = async (query) => {
    try {
      let response= await  http.get("/modeDePaiements"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}



}

export default new ModeDePaiementsDataService();