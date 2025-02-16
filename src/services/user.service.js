/**
 * use for retrieving data from server to access protected info.
 */

import axios from "axios";

const API_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:8080") + "/api/";

const planJourney = (departure, destination, start_date, end_date, num_people) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!token) {
        console.error('No token found in localStorage');
        throw new Error('User not authenticated');
    }

    return axios.post(API_URL + 'plan-journey', {
        departure, destination, start_date, end_date, num_people
    },
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const deletePlan = async (tripId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!token) {
        console.log('No token found in localStorage');
        throw new Error('User not authenticated');
    }

    return axios.delete(API_URL + `del-plan/${tripId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const deleteReview = async (reviewId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!token) {
        console.log('No token found in localStorage');
        throw new Error('User not authenticated');
    }

    return axios.delete(API_URL + `del-review/${reviewId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const submitReview = (rating, review) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!token) {
        console.log('No token found in localStorage');
        throw new Error('User not authenticated');
    }

    return axios.post(API_URL + '/make-review', {
        rating, review
    },
    {
        headers:{
            Authorization: `Bearer ${token}`,
        },
    });
};

const UserService = {
    planJourney,
    deletePlan,
    submitReview,
    deleteReview,
}

export default UserService;