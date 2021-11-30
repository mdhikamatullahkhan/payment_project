import axios from 'axios'

const MESSAGE_BASE_REST_API_URL = "http://localhost:8093/api/v1/message"

class MessageService{
    getAllMessages(){
        return axios.get(MESSAGE_BASE_REST_API_URL);
    }

    getMessageById(msg){
        return axios.get(MESSAGE_BASE_REST_API_URL + '/'+msg);
    }

}

export default new MessageService();