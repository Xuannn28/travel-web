/**
 * use Axios for HTTP requests and Local Storage for user info & JWT token authorisation.
 * 
 * important functions: login(), logout(), register(), getCurrentUser()
 */

import axios from "axios";

const API_authURL = 'http://localhost:8080/api/auth/';

/**
 * create a new account with user email and password
 * @param {} email 
 * @param {*} password 
 * @returns 
 */
const register = (email, password) => {
    return axios.post(API_authURL + 'sign-up', {
        email, password,
    });
};

/**
 * if login is successful (res has user data), it stores the user's info in the local storage.
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
const login = (email, password) => {
    return axios

    .post(API_authURL + 'login', {
        email, password,
    })

    .then((response) => {
        if (response.data.email) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    });
};

/**
 * remove stored user data from local storage, then send a req to log use out from backend
 * @returns 
 */
const logout = () => {
    localStorage.removeItem('user');
    alert('log out successfully.')
    return axios.post(API_authURL + 'log-out')
    
    .then((response) => {
        return response.data;
    });
};

/**
 * retrieve user data stored in local storage (if available)
 * @returns 
 */
const getCurrentUser = () => {
    try{
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;  // return pased object or null if not found

    } catch (err) {
        console.log("Error parsing user data from localStorage:", err);
        return null;
    }
};


const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
}

export default AuthService;