import React, { Fragment, useEffect, useState } from 'react'
import SenderService from '../services/SenderService';
import BankService from '../services/BankService';
import DatePicker from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import MessageService from '../services/MessageService';
import ReceiverService from '../services/ReceiverService';
import TransactionService from '../services/TransactionService';
import { useHistory } from 'react-router-dom';
export default function Transfer() {

//---------------Sender Auto pop-up-------------------

    const [sender_id, setSender_id] = useState("");    
    const [sender,setSender]= useState([]);
    const [error_id, setError_id]=useState("")

    const onSenderId=async (e)=>{
        
        const sender_id=e.target.value;
        if(sender_id!==""){
            setSender_id(sender_id);
            await SenderService.getSenderById(sender_id)
            .then((response)=>{
                setSender(response.data);
                setAmount("");
                setTransfer_fee("");
                setUpdated_clear("");
                setError_id("");      
                }
            ).catch((error)=>{
                Object.keys(sender).forEach(function(index) {
                    sender[index] = " ";
                    });
                    if(sender_id==="")
                        setError_id("Please enter Account ID");
                    else
                        setError_id("Account ID not Found. Please enter valid ID");
                    setAmount("");
                    setTransfer_fee("");
                    setUpdated_clear("");
            });
        }
        else{
            window.alert("Enter valid Sender ID");
            setSender_id("");
        }
    }

    //---------------- Bank Details Auto pop-up------------

    const [bic, setBic] = useState("");    
    const [bank,setBank]= useState([]);
    const [error_bank, setError_bank]=useState("");
   
    const onBIC=async (e)=>{
        
        const bic=e.target.value;
        
        setBic(bic);
        await BankService.getAllBanksByBic(bic)
        .then((response)=>{
            setBank(response.data);
            setError_bank("");
            }
        ).catch((error)=>{
            Object.keys(bank).forEach(function(index) {
                bank[index] = " ";
                });
            if(bic==="")
                setError_bank("Please enter BIC");
            else
                setError_bank("BIC not found. Please enter valid BIC");
        });
    }

    //------------------- AMOUNT----------------------------

    const [amount, setAmount] = useState("");    
    const [transfer_fee,setTransfer_fee]= useState("");
    const [updated_clear,setUpdated_clear]=useState(sender.clear_balance);
    const [error_amount, setError_amount]=useState("");

    const onAmount=async (e)=>{
        
        const amount=e.target.value;
        if(amount>0){
            
            setAmount(amount);
            setTransfer_fee(amount*0.25);
            if(sender.overdraft==="yes"){
                setUpdated_clear(sender.clear_balance-amount-amount*0.25);
                setError_amount("");
            }
            else{
                if(sender.clear_balance >= (amount*1.25)){
                    setUpdated_clear(sender.clear_balance-amount*1.25);
                    setError_amount("");
                    
                }
                else{    
                    setUpdated_clear("");
                    setError_amount("Insufficient Balance. Transfer cann't be initated");
                }
            }
        }
        else{
            setAmount("");
            setTransfer_fee("");
            setUpdated_clear("");
            window.alert("Amount cannot be negative or zero");
        }
    }
    
   

     //-----------------------------MESSAGE INFO-----------------------------------------

     const [message, setMessage] = useState([]);
     
     useEffect(()=>{
        getAllMessages()
     },[]);

     const getAllMessages=()=>{
         MessageService.getAllMessages()
         .then(response=>{
             setMessage(response.data);
         }).catch(error=>{
             console.log(error);
         })
     }

     const [message_real, setMessage_real] = useState("CHQB");


     //----------------------------SANCTION LIST----------------------------------

     const [receiver_name, setReceiver_Name] = useState("");
     const [error_receiver, seterror_Receiver] = useState("");
     const [receiver_Id, setreceiver_Id] = useState("");
     const onReceiverId = async (e)=>{
         setreceiver_Id(e.target.value)
     }

     const onReceiver = async (e)=>{
        
        const receiver=e.target.value;
        setReceiver_Name(receiver);

        await ReceiverService.isReceiverExists(receiver_name)
        .then(response=>{
            if(response.data){
                seterror_Receiver("Cannot initiate Transaction. Receiver present in sanction list.");
            }
            else
                seterror_Receiver("");

        }).catch(error=>{
            if(receiver_name==="")
                seterror_Receiver("Please enter receiver name.");
            else
                seterror_Receiver("Cannot initate Transaction. Receiver present in sanction list.");
        })
    }
     
    //------------------------- Date --------------------------------

    const [date, setDate] = useState(moment().format("YYYY-MM-DD"))

    const yesterday = moment().subtract(1, 'day');

    const disableWeekends = current => {
        return current.day() !== 0 && current.day() !== 6 && current.isAfter(yesterday);
      }

    //---------------------Transfer Type----------------------------------

      const [transfer_type, setTransfer_type] = useState("Customer Type");

    //-------------------------FORM HANDLING----------------------------

    const history = useHistory();
      
    const formHandle = (e)=>{
        e.preventDefault();
        

        const error= (error_id==="")?((error_bank==="")?((error_receiver==="")?((error_amount===""?true:error_amount)):error_receiver):error_bank):error_id;
        const error1= (receiver_Id==="")?"Receiver Account Number":(receiver_name==="")?"Receiver Name":(sender_id==="")?"Sender ID":((bic==="")?("bic"):((amount==="")?"amount":true));
        
        if(error!==true || error1!==true){
            if(error!== true)
                window.alert(error);
            else
                window.alert("Please enter "+error1);
        }
        else{
            sender.clear_balance=updated_clear;
            SenderService.updateSenderDetails(sender_id,sender)
            .then(response =>{
                if(response.data){
                    window.alert("Details updated");
                    
                    let clear_balance=updated_clear;

                    let transaction_Id= moment().format("YYYYMMDDHHmmSS");
                    let transfer=transfer_fee;
                    let trans_date=date.format("YYYY-MM-DD");
                    

                    const transaction= {transaction_Id, sender_id, receiver_name, 
                                            receiver_Id, bic, amount, transfer,
                                            clear_balance, trans_date, message_real, transfer_type};
                        
                    console.log(transaction);
                    TransactionService.createTransaction(transaction)
                        .then(response => {
                            history.push("/dashboard");
                        }).catch(error => {
                            window.alert("Error in transaction");
                        })
                    

                }
                else{
                    window.alert("Transaction Failed, Try again");
                }
            }).catch(error=>{
                window.alert(error);
            })
        }
            
    }



    //-----------------------INTERFACE-----------------------------------

    return (
        <Fragment>
        <section className="transfer">
            <div className="dart-overlay1">
                <div className="transfer-inner">
                    <h1 className="large"> Fund Transfer </h1>
                    <div className="box">
                        <form >
                            
                                        <label >Calender Date</label>
                                        
                                        <DatePicker
                                            timeFormat={false}
                                            dateFormat="DD-MM-YYYY"
                                            isValidDate={disableWeekends}
                                            selected={date}
                                            onChange={date=>setDate(date)}
                                            />
                                            <label >Customer Id</label> <span style={{ color: "red" }} >*</span>
                                            <div className="error">
                                                <input  type="number" 
                                                className="form-control" id="formGroupExampleInput" 
                                                placeholder="Enter Customer ID" 
                                                pattern="[0-9]{14}" 
                                                value={sender_id}
                                                onChange={onSenderId}
                                                required/><div>

                                                {error_id} </div>
                                            </div>

                                            <label >Account Holder Name</label>
                                            <input 
                                            className="form-control-plaintext"
                                            type="text" 
                                            id="acc_name" 
                                            value={sender.name}
                                            disabled/>
                                            <label >Clear Balance</label>
                                            <input 
                                            type="number"
                                            className="form-control-plaintext" 
                                            id="clear_bal" 
                                            value={sender.clear_balance}
                                            disabled/>


                                            <label >BIC</label><span style={{ color: "red" }} >*</span>
                                            <div className="error">
                                                <input 
                                                type="text" 
                                                className="form-control" id="formGroupExampleInput" 
                                                placeholder="Enter Receiver's BIC" 
                                                value={bic}
                                                onChange={onBIC}
                                                required />
                                                <div>
                                                {error_bank}</div>
                                            </div>
                                            <label >Institute Name</label>
                                            <input 
                                            type="text" 
                                            className="form-control-plaintext"
                                            id="institute_name"  
                                            
                                            value={bank.bank_name}
                                            disabled/>

                                            <label >Account Holder Name</label><span style={{ color: "red" }} >*</span>
                                            <div className="error">
                                                <input 
                                                type="text" 
                                                className="form-control" id="formGroupExampleInput" 
                                                placeholder="Enter Receiver's Name" 
                                                value={receiver_name}
                                                onChange={onReceiver}                                            
                                                required />
                                                <div>
                                                    {error_receiver}</div>
                                            </div>
                                            <label >Account Holder Number</label><span style={{ color: "red" }} >*</span>
                                            <input
                                            type="number" 
                                            className="form-control" id="formGroupExampleInput" 
                                            placeholder="Receiver's Account Number" 
                                            value={receiver_Id}
                                            onChange={onReceiverId}
                                            pattern="[0-9]{14}" required />
                                    


                                    
                                            <label >Transfer Type</label>
                                            <select id="transfer_type" 
                                            className="form-select" 
                                            value={transfer_type}
                                            onChange={(e) => {
                                              setTransfer_type(e.target.value);
                                            }}
                                            required>
                                                <option value="customer type">Customer Type</option>
                                                <option value="bank_transfer">Bank Type</option>
                                            </select>
                                            <label >Message Code</label>
                                            <select id="message_code" className="form-select" 
                                             value={message_real}
                                             onChange={(e) => {
                                               setMessage_real(e.target.value);
                                             }}
                                             required >
                                                {
                                                    message.map((value)=>(
                                                        <option key={value.message} value={value.message}>
                                                            {value.message}-{value.description}
                                                        </option>
                                                        ) 
                                                    )    
                                                }                
                                            </select>
                                            <label >Amount</label><span style={{ color: "red" }} >*</span>
                                            <div className="error">
                                                <input 
                                                type="number" 
                                                className="form-control" id="formGroupExampleInput" 
                                                placeholder="Enter Amount" 
                                                value={amount}
                                                onChange={onAmount}
                                                required />
                                                <div>
                                                    {error_amount}</div>
                                            </div>
                                            <label >Transfer Fee</label>
                                            <input 
                                            type="number" 
                                            id="transfer_fee" 
                                            className="form-control-plaintext"
                                            value={transfer_fee}
                                            disabled/>
                                            <label >Updated Clear Balance</label>
                                            <input 
                                            type="number" 
                                            id="amount_update" 
                                            className="form-control-plaintext"
                                            value={updated_clear}
                                            disabled/>

                                        <div  id="button">       
                                            <input 
                                            type="submit" 
                                            className="btn btn-success" 
                                            value="Transfer"
                                            onClick={formHandle}
                                            />
                                        </div>
                        </form>
                    </div>
                </div>
            </div>              
        </section>
        </Fragment>
    )
}