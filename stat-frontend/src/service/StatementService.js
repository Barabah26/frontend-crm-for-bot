import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:9000/api/statements';

export const listStatement = () => {
    const token = localStorage.getItem('accessToken');
    return axios.get(REST_API_BASE_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
