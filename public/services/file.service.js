import http from "./security/api";

class FileService {



uploadAsync = async (file, fileCategory,remarque,externalId,userId) => {
    try {
        
	   let formData = new FormData();
	  console.log("--------------FILE NAME--------------");
	  formData.append("file", file);
	  formData.append("fileCategory", fileCategory);
	   formData.append("externalId", externalId);
	  formData.append("remarque", remarque);
	   formData.append("userId", userId);
	  //console.log(formData);
	  //var data = { content: formData };
	  const config = {
	        headers: {
	            'Content-Type': 'multipart/form-data'
	        }
	    }
	    let response=await http.post("/files/upload", formData, config);
	    //return await response.data;
	    return response;
    } catch (err) {
        // Handle Error Here
        console.error(err);
       return err.response;
    }
};

updateAsync = async (id,file, fileCategory,remarque,externalId,userId) => {
    try {
        
	   let formData = new FormData();
	  console.log("--------------FILE NAME--------------");
	  formData.append("file", file);
	  formData.append("fileCategory", fileCategory);
	     formData.append("externalId", externalId);
	  formData.append("remarque", remarque);
	   formData.append("userId", userId);
	  //console.log(formData);
	  //var data = { content: formData };
	  const config = {
	        headers: {
	            'Content-Type': 'multipart/form-data'
	        }
	    }
	    let response=await http.put(`/files/${id}`, formData, config);
	    //return await response.data;
	    return response;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err.response;
    }
};

createMulipleFilesAsync = async (files, fileCategory,remarque,externalId,userId) => {
    try {
        	   let formData = new FormData();
        for (const file of files)
  		{
  			formData.append("files", file);
  		}
	
	  formData.append("fileCategory", fileCategory);
	  formData.append("remarque", remarque);
	    formData.append("externalId", externalId);
	      formData.append("userId", userId);
	 // console.log(formData);
	  //var data = { content: formData };
	  const config = {
	        headers: {
	            'Content-Type': 'multipart/form-data'
	        }
	    }
	    let response=await http.post("/files/uploadMultipleFiles", formData, config);
	    //return await response.data;
	    return response;
    } catch (err) {
        // Handle Error Here
        console.error(err);
       return err.response;
    }
};


deleteFileAsync = async (id) => {
    try {
      let response= await  http.delete(`/files/${id}`);
      return await response;
    } catch (err) {
     
        return err.response;
        
    }
}


deleteMultileFilesAsync = async (qureyFilesIDs) => {
    try {
      let response= await  http.delete(`/files?${qureyFilesIDs}`);
      return await response;
    } catch (err) {
     
        return err.response;
        
    }
}

getFileInfo(id) {
    return http.get(`/files/${id}`);
  }

getFiles(filesId) {
	console.log("query",filesId);
    return http.get(`/files?${filesId}`);
  }




getFilesAsync = async (query) => {
    try {
    	console.log("query",query);
      let response= await  http.get(`/files?${query}`);
      return await response;
    } catch (err) {
     
        return err.response;
        
    }
}

getFilesByIdAsync = async (filesId) => {
    try {
    	
      let response= await  http.get(`/files/${filesId}`);
      return await response;
    } catch (err) {
     
        return err.response;
        
    }
}




}
export default new FileService();