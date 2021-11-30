import React, { useState, useEffect} from 'react'
import TransactionService from '../services/TransactionService';
import { Link } from 'react-router-dom';

export default function Dashboard() {

    const [transaction, settransaction] = useState([])
    useEffect(()=>{
        getAllTransactions()
    },[]);

    const getAllTransactions=()=>{
        TransactionService.getAllTransaction()
        .then( response=>{
            settransaction(response.data);
        }).catch(error=>{
            window.alert(error);
        })
    }
    return (
        <div>
            <h1 className="dash-head">Transaction History</h1>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Sender ID</th>
                        <th>Receiver ID</th>
                        <th>Type of Transaction</th>
                        <th>Message</th>
                        <th>Amount Transfer</th>
                        <th>View receipts</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transaction.map(
                            (trans, index) => (
                                <tr key={trans.transaction_Id}>
                                    <td>{trans.transaction_Id}</td>
                                    <td>{trans.trans_date}</td>
                                    <td>{trans.sender_id}</td>
                                    <td>{trans.receiver_Id}</td>
                                    <td>{trans.transfer_type}</td>
                                    <td>{trans.message_real}</td>
                                    <td>{trans.amount+trans.transfer}</td>
                                    <td>
                                       <Link
                                            className="btn btn-info"
                                            to={`receipt/${trans.transaction_Id}`}
                                            target="_blank">
                                                View Receipt
                                            </Link>
                                    </td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
