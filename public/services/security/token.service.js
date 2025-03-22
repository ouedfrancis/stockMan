

import globalObject from '../../global.js'
class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accessToken;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  setUser(user) {
    //console.log("SET USER", user);
    localStorage.setItem("user", JSON.stringify(user));

  }

  removeUser() {
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivityTime");
     localStorage.removeItem("currentRole");
     //globalObject={} 
  }

  setLastActivityTime(lastActivityTime) {
    return localStorage.setItem('lastActivityTime',lastActivityTime);
  }
  getLastActivityTime() {
    return localStorage.getItem('lastActivityTime');
  }


 /* setInactivityMaxTime(InactivityMaxTime) {
    return localStorage.setItem('inactivityMaxTime',InactivityMaxTime);
  }
  getInactivityMaxTime() {
    return localStorage.getItem('inactivityMaxTime');
  }*/
}

export default new TokenService();
