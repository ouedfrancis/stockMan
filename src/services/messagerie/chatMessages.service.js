import http from "../security/api";
 
class ChatMessagesDataService {

findAsync = async (query) => {
    try {
     // console.log("ChatMessagesDataService findAsync",query)
      let response= await  http.get("/chatMessages"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}

createAsync = async (data) => {
    try {
      let response= await  http.post("/chatMessages", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/chatMessages/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}


 
}

export default new ChatMessagesDataService();