import http from "./security/api";
 
class ModelesDataService {
  getAll() {
    return http.get("/modeles");
  }
getAllAsync = async (data) => {
    try {
      let response= await  http.get("/modeles");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/modeles/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
getByIdAsync = async (id) => {
    try {
      let response= await  http.get(`/modeles/${id}`);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/modeles", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/modeles/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

 findAsync = async (query) => {
    try {
      let response= await  http.get("/modeles"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
 deleteAsync = async (id) => {
    try {
      let response= await  http.delete(`/modeles/${id}`);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}


}

export default new ModelesDataService();