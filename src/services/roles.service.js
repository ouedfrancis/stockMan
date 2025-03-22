import http from "./security/api";
 
class RolesDataService {
  getAll() {
    return http.get("/security/roles");
  }
getAllAsync = async (data) => {
    try {
      let response= await  http.get("/security/roles");
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

  get(id) {
    return http.get(`/security/roles/${id}`);
  }


createAsync = async (data) => {
    try {
      let response= await  http.post("/security/roles", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/security/roles/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
createOrUpdatePermissionsAsync = async (id, data) => {
    try {
      let response= await  http.put(`/security/roles/${id}/permissions`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
findAsync = async (query) => {
    try {
      let response= await  http.get("/security/roles"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

/*  create(data) {
    return http.post("/security/roles", data);
  }

  update(id, data) {
    return http.put(`/security/roles/${id}`, data);
  }

  delete(id) {
    return http.delete(`/security/roles/${id}`);
  }

  deleteAll() {
    return http.delete(`/security/roles`);
  }
*/
 
}

export default new RolesDataService();