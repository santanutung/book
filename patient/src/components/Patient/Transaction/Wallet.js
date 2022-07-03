import React, { useState } from 'react'
import Swal from 'sweetalert2'
import axiosBaseUrl from '../../../axiosBaseUrl'
import { env } from '../../../env'

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}
function Wallet(props) {

    const {getTransactions} = props
    const [showWalletModal, setShowWalletModal] = useState(false)
    const [walletErrors, setWalletErrors] = useState({})
    const [walletData, setWalletData] = useState({ amount: '' })
    function handleWallet(e) {
        const newData = { ...walletData }
        newData[e.target.name] = e.target.value
        setWalletData(newData)
    }


    async function walletFormHandler() {
        // alert("test")
        if(walletData.amount == '') {
            setWalletErrors({'amount' : 'Please enter amount'})
        }
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        // checking if the script is added or not
        if (!res) {

            alert("Unable to load the the script")
            return
        }


        // console.log("Chargable Amount: ", chargable_amount);
        var charges = walletData.amount;

        // Making an Post api call to the server to proceed the payment
        const data = await fetch(`${env.baseUrl}razorpay?total=${charges * 100}`, { method: 'POST' }).then((t) =>
            t.json()
        )

        console.log(data);



        const options = {
            key: "rzp_test_XxgDcoUUKk6lmz", // Enter the Key ID generated from the Dashboard
            "amount": charges * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": 'INR',
            "name": "Book Care",
            "description": "Test Transaction",
            "image": "img/logo.png",
            "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response) {
                createTransaction(data.id, charges, '', response.razorpay_payment_id)
                console.log(response, "----------------------------razorpay")
            },
            "error": function (response) {
                console.log("ERRR")
                alert("ERR")
            },
            "prefill": {
                "name": "Himanshu",
                "email": "hgoyal29@example.com",
                "contact": "9964999999"
            },

        };

        // Open the payment window on the screen
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
    }


    function createTransaction(order_id, amount, appointment_id, transaction_id) {
        var data = { order_id: order_id, amount: amount, appointment_id: appointment_id, transaction_id: transaction_id, type: 'wallet' };
        console.log(data, "---transaction data");
        axiosBaseUrl.post(`patients/api/create-transaction`, data)
            .then((res) => {
                console.log(res)
                Swal.fire("Amount successfully added in wallet", 'success')
                getTransactions()
                setShowWalletModal(false)
                // setMembers(res.data.data)

            }).catch(error => {
                // Swal("", "Amount successfully added in wallet")
                // getTransactions()
                // setShowWalletModal(false)
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>. ", error)

            })
    }


    return (
        <>
            <div className='text-right'>
                <button className='btn btn-sm btn-primary' onClick={() => setShowWalletModal(true)}>Add Wallet Amount</button>
            </div>
            {
                showWalletModal ?
                    <div
                        className="modal fade show"
                        id="exampleModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog login-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => setShowWalletModal(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <form id="Login">
                                        <div className="row">
                                            <h5 className="modal-title" id="exampleModalLabel">
                                                Help us to serve you better!
                                            </h5>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group log-f">
                                                    <input
                                                        className="form-control"
                                                        name="amount"
                                                        placeholder="Amount*"
                                                        required=""
                                                        onChange={(e) => handleWallet(e)}
                                                        value={walletData.amount}
                                                    />
                                                        
                                                  
                                        
                                                    <span className='text-danger'>{walletErrors.amount}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                                <div className="modal-footer text-center">

                                    <button onClick={walletFormHandler} type="button" className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    : ''
            }

        </>
    )
}

export default Wallet
