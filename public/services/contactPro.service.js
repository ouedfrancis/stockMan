import http from "./security/api";

class ContactProsDataService {
  getAll() {
    return http.get("/contactPros");
  }

  get(id) {
    return http.get(`/contactPros/${id}`);
  }

getAsync = async (id) => {
  try {
      let response= await  http.get(`/contactPros/${id}`);
      return await response;
  } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------contactPros");
        console.error(err);
        return err.response;
    }
}

getAllAsync = async () => {
    try {
      let response= await  http.get("/contactPros");
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------contactPros");
        console.error(err);
        return err.response;
    }
}
getAllActifAsync = async (actif) => {
    try {
      let response= await  http.get("/contactPros?actif="+actif);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------contactPros");
        console.error(err);
        return err.response;
    }
}
createAsync = async (data) => {
    try {
      let response= await  http.post("/contactPros", data);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------contactPros");
        console.error(err);
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/contactPros/${id}`, data);
      return await response;
    } catch (err) {
        // Handle Error Here
        console.log("-----------LOG ERROR-----------contactPros");
        console.error(err);
        return err.response;
        
    }
}

  create(data) {
    return http.post("/contactPros", data);
  }

  update(id, data) {
    return http.put(`/contactPros/${id}`, data);
  }
}

export default new ContactProsDataService();