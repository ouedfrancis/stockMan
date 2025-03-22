import http from "./api";
 
class UsersDataService {
  getAll() {
    return http.get("/security/users");
  }
getAllAsync = async (data) => {
    try {
      let response= await  http.get("/security/users");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
getActif() {
    return http.get("/security/users/actif");
  }
  get(id) {
    return http.get(`/security/users/${id}`);
  }
getActifAsync = async (data) => {
    try {
      let response= await  http.get("/security/users/actif");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
countPersonnelsAsync = async () => {
    try {
      let response= await  http.get("/security/users/countPersonnels");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

countUserAsync = async (query) => {
    try {
      let response= await  http.get("/security/users/count"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/security/users", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
createRegisterAsync = async (data) => {
    try {
      let response= await  http.post("/security/users/register", data);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

updateRegisterAsync = async (query,data ) => {
    try {
      let response= await  http.put(`/security/users/register`+query, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
changePasswordAsync = async (query,data ) => {
    try {
      let response= await  http.put(`/security/users/password`+query, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}


updateAsync = async (id, data, query) => {
    try {
      console.log("updateAsync query",query)
      let response= await  http.put(`/security/users/${id}`+"?"+query, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}


updateStatutAsync = async (id, data) => {
  let query=`/security/users/statut/${id}`;
    try {
      let response= await  http.put(query, data);
      return await response;
    } catch (err) {
     
        return err.response;
        
    }
}

   findAsync = async (query) => {
    try {
      let response= await  http.get("/security/users"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}
}

export default new UsersDataService();