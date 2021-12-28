import axios from 'axios';
import store from '../../stores/index';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL!;

const RegistActivity = (type: "enter" | "exit" | "pass", guest_id: string, place_id: string) => {
    const token = store.getState().auth.token;
    const payload = {
        guest_id: guest_id,
        place_id: place_id
    };
    axios.post(API_BASE_URL + `/v1/activity/${type}`, payload, { headers: { Authorization: "Bearer " + token } }).then(res => {
        console.log(res);
        if (res.data.status === "success") {
            return "success";
        } else {
            return "error";
        };
    });
};

export default RegistActivity;