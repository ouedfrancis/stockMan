import http from "../security/api";
 
class MessagesDataService {

findAsync = async (query) => {
    try {
     // console.log("MessagesDataService findAsync",query)
      let response= await  http.get("/messages"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/messages", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/messages/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
updateDestinataireAsync = async (messageId,data) => {
    try {
      let response= await  http.put(`/messages/${messageId}/destinataires/${data.id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}

 
}

export default new MessagesDataService();