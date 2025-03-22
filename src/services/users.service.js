import http from "./security/api";
 
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

  get(id) {
    return http.get(`/security/users/${id}`);
  }


createAsync = async (data) => {
    try {
      let response= await  http.post("/security/users", data);
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

  create(data) {
    return http.post("/security/users", data);
  }

  update(id, data) {
    return http.put(`/security/users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/security/users/${id}`);
  }

  deleteAll() {
    return http.delete(`/security/users`);
  }

 
}

export default new UsersDataService();