import axios from 'axios'

const SENDER_BASE_REST_API_URL = "http://localhost:8093/api/v1/sender"

class SenderService{
    getAllSenderInfo(){
        return axios.get(SENDER_BASE_REST_API_URL);
    }

    getSenderById(senderId){
        console.log("sender id="+senderId)
        if(senderId)
            return axios.get(SENDER_BASE_REST_API_URL + '/'+senderId);
        else
            window.alert("Please enter valid sender Id");
    }

    updateSenderDetails(senderId, sender){
        
            return axios.put(SENDER_BASE_REST_API_URL+'/'+senderId, sender);
        
    }

}

export default new SenderService();