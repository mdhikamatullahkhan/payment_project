import axios from 'axios'

const BANK_BASE_REST_API_URL = "http://localhost:8093/api/v1/bank"

class BankService{
    getAllBanks(){
        return axios.get(BANK_BASE_REST_API_URL);
    }

    getAllBanksByBic(bic){
        return axios.get(BANK_BASE_REST_API_URL + '/'+bic);
    }

}

export default new BankService();