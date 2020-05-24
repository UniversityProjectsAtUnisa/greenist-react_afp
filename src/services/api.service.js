import axios from 'axios';

const config = {
  API_URL: 'https://greenist-backend.herokuapp.com',
};

axios.defaults.baseURL = config.API_URL;

class Api {
  // Generic request method
  static async request(method, path, payload = {}, useAuthentication = false) {
    let data = {};
    let params = {};
    let headers = {};
    const url = path;
    if (useAuthentication) {
      // Sets headers for auth
      // TODO: jwt_token and refresh_token
      const Authorization = await Storage.getItem('Authorization');
      headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${Authorization}`,
      };
    }
    if (method === 'get') {
      params = payload;
    } else {
      data = payload;
    }

    return axios({ url, method, headers, params, data });
  }

  // Get method
  static get(path, payload, useAuthentication = false) {
    return this.request('get', path, payload, useAuthentication);
  }

  // Delete method
  static delete(path, payload, useAuthentication = false) {
    return this.request('delete', path, payload, useAuthentication);
  }

  // Post method
  static post(path, payload, useAuthentication = false) {
    return this.request('post', path, payload, useAuthentication);
  }

  // Put method
  static put(path, payload, useAuthentication = false) {
    return this.request('put', path, payload, useAuthentication);
  }

  // TODO: Handle this
  static setAuthorization = async ({ access_token }) => {
    try {
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
      await Storage.setItem('Authorization', access_token);
    } catch (e) {
      // Alert.alert('Errore!', 'Impossibile memorizzare il token di accesso.');
    }
  };

  // TODO: Handle this
  static resetAuthorization = async () => {
    delete axios.defaults.headers.common.Authorization;
    try {
      await Storage.removeItem('Authorization');
    } catch (e) {
      // Alert.alert('Errore!', 'Impossibile rimuovere il token di accesso.');
    }
  };

  // TODO: Handle this
  static isLogged = async () => {
    try {
      const authorization = await Storage.getItem('Authorization');
      axios.defaults.headers.common.Authorization = `Bearer ${authorization}`;
      return !!authorization;
    } catch (e) {
      // console.log(e);
      // Alert.alert('Errore!', "Impossibile determinare se l'utente è collegato.");
      return false;
    }
  };

  // User related
  static login = async (data) => {
    delete axios.defaults.headers.common.Authorization;
    return this.get('/login', data);
  };

  static register = async (data) => {
    return this.post('/register', data);
  };

  // Achievement related
  static getAchievements = async () => this.get(`/achievements`, {}, true);

  static postAchievement = async (name, achievement) =>
    this.post(`/achievement/${name}`, achievement, true);

  static putAchievement = async (name, achievement) =>
    this.put(`/achievement/${name}`, achievement, true);

  static deleteAchievement = async (name) => this.delete(`/achievement/${name}`, {}, true);

  // Task related
  static getTasks = async () => this.get(`/tasks`, {}, true);

  static postTask = async (task) => this.post(`/task`, task, true);

  static putTask = async (id, task) => this.put(`/task/${id}`, task, true);

  static deleteTask = async (id) => this.delete(`/task/${id}`, {}, true);

  // Category Related
  static getCategories = async () => this.get(`/categories`, {}, true);

  static postCategory = async (name, category) => this.post(`/category/${name}`, category, true);

  static putCategory = async (name, category) => this.put(`/category/${name}`, category, true);

  static deleteCategory = async (name) => this.delete(`/category/${name}`, {}, true);

  // Image Related
  static getImages = async () => this.get(`/images`, {}, true);

  static postImage = async (name) => this.post(`/image/${name}`, {}, true);

  static putImage = async (name) => this.put(`/image/${name}`, {}, true);

  static deleteImage = async (name) => this.delete(`/image/${name}`, {}, true);
}

export default Api;
