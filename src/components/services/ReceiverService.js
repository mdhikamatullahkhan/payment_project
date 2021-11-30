import axios from 'axios'

const MESSAGE_BASE_REST_API_URL = "http://localhost:8093/api/v1/receiver"

class ReceiverService{
    isReceiverExists(name){
        return axios.get(MESSAGE_BASE_REST_API_URL+'/'+name);
    }

    getAllBanksByBic(bic){
        return axios.get(MESSAGE_BASE_REST_API_URL + '/'+bic);  
    }

}

export default new ReceiverService();