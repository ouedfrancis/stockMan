import http from "./security/api";
 
class TachesDataService {

findAsync = async (query) => {
    try {
      let response= await  http.get("/taches"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}


createAsync = async (data) => {
    try {
      let response= await  http.post("/taches", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/taches/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

}

export default new TachesDataService();