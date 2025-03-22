import http from "../security/api";
 
class CompteCourantMouvementsDataService {

getAllAsync = async (data) => {
    try {
      let response= await  http.get("/compteCourantMouvements");
      return await response;
    } catch (err) {
      
        console.error(err);
        return err.response;
    }
}

getActifAsync = async (data) => {
    try {
      let response= await  http.get("/compteCourantMouvements/actif");
      return await response;
    } catch (err) {
      
        console.error(err);
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/compteCourantMouvements", data);
      return await response;
    } catch (err) {
      
        console.error(err);
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/compteCourantMouvements/${id}`, data);
      return await response;
    } catch (err) {
        // Handle Error Here
        //console.log("-----------LOG ERROR-----------compteCourantMouvements");
        console.error(err);
        return err.response;
        
    }
}

findAsync = async (query) => {
    try {
      let response= await  http.get("/compteCourantMouvements"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

}

export default new CompteCourantMouvementsDataService();