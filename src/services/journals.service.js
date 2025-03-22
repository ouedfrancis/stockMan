import http from "./security/api";
import axios from 'axios'; 
class JournalsDataService {

findAsync = async (query) => {
    try {
      let response= await  http.get("/journals"+query);
      return await response;
    } catch (err) {
        
        return err.response;
    }
}


createAsync = async (data) => {
    try {
      let response= await  http.post("/journals", data);
      return await response;
    } catch (err) {
       
        return err.response;
    }
}

updateAsync = async (id, data) => {
    try {
      let response= await  http.put(`/journals/${id}`, data);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}
getIpInfoAsync = async (ip) => {
    try {

      let response= await  axios.get(`http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as`);
      return await response;
    } catch (err) {
        
        return err.response;
        
    }
}


}

export default new JournalsDataService();