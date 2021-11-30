import React from 'react'
import { useParams } from 'react-router';
import { useState } from 'react';
import TransactionService from '../services/TransactionService';
import SenderService from '../services/SenderService';
import MessageService from '../services/MessageService';
import BankService from '../services/BankService';
import { useEffect } from 'react/cjs/react.development';

export default function Receipt() {

    const {transaction_Id}= useParams();
    const [trans, setTrans] = useState([]);

    useEffect( ()=>{
        getTransactionById()
    }, []);

    useEffect(()=>{
        if(trans.sender_id!=undefined)
            getSenderDetails();
    },[trans])

    const getTransactionById=()=>{
        TransactionService.getAllTransactionById(transaction_Id)
        .then(response=>{
            setTrans(response.data);
            
        }).catch(error=>{
            window.alert("Error in generating receipt");
        })        
    }

    const [sender, setsender] = useState([])

    const getSenderDetails=()=>{
        console.log(trans);
        SenderService.getSenderById(trans.sender_id)
        .then(response=>{
            setsender(response.data);
        }).catch(error=>{
            window.alert("Error in gathering senders data");
        })
        getBankName();
    }

    const [bank, setbank] = useState("")

    const getBankName=()=>{
        BankService.getAllBanksByBic(trans.bic)
        .then(response=>{
            setbank(response.data);
        }).catch(error=>{
            window.alert("Error in getting Bank details");
        })
        getMessage();
    }

    const [message, setmessage] = useState([])

    const getMessage=()=>{
        MessageService.getMessageById(trans.message_real)
        .then(response=>{
            setmessage(response.data);
        }).catch(error=>{
            window.alert("Error in getting Message details");
        })
    }




    return (
        <div>
            <h1 className="head-receipt">DBS PAYMENT PORTAL</h1>
            <div className="dart-overlay2">
                <div className="box">
                    <h3 className="head2-receipt">Transfer Receipt</h3>
                    <table className="table table-borderless">
                        <tbody>
                            <tr>
                                <td>Transaction ID</td>
                                <td>{trans.transaction_Id}</td>
                            </tr>
                            <tr>
                                <td>Date of Transaction</td>
                                <td>{trans.trans_date}</td>
                            </tr>
                            <tr>
                                <td>Sender ID</td>
                                <td>{sender.sender_id}</td>
                            </tr>
                            <tr>
                                <td>Sender Name</td>
                                <td>{sender.name}</td>
                            </tr>
                            <tr>
                                <td>Receiver ID</td>
                                <td>{trans.receiver_Id}</td>
                            </tr>
                            <tr>
                                <td>Receiver Name</td>
                                <td>{trans.receiver_name}</td>
                            </tr>
                            <tr>
                                <td>Receiver Bank Code</td>
                                <td>{trans.bic}</td>
                            </tr>
                            <tr>
                                <td>Transaction Type</td>
                                <td>{trans.transfer_type}</td>
                            </tr>
                            <tr>
                                <td>Receiver Bank Name</td>
                                <td>{bank.bank_name}</td>
                            </tr>
                            <tr>
                                <td>Sender's Message Code</td>
                                <td>{trans.message_real}</td>
                            </tr>
                            <tr>
                                <td>Sender's Message</td>
                                <td>{message.description}</td>
                            </tr>
                            <tr>
                                <td>Amount Transferred</td>
                                <td>{trans.amount}</td>
                            </tr>
                            <tr>
                                <td>Transfer Fee</td>
                                <td>{trans.transfer}</td>
                            </tr>
                            <tr>
                                <td>Updated Clear Balance</td>
                                <td>{trans.clear_balance}</td>
                            </tr>
                    
                        </tbody>
                    </table>
                    <div className="Footer">
                        <div>----------------------------------------------------------------------------------------</div>
                        <div className="error" style={{textAlign:"center"}}>The transaction is done under DBS payments. This receipt is system generated.</div>
                    </div>
                </div> 
            </div>
        </div>
    )
}