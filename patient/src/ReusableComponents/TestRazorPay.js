import React from 'react'
import axiosBaseUrl from '../axiosBaseUrl'
import { env } from '../env'

// Adding the script to the body document
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


function TestRazorPay() {

    // Payment Gateway Code
  async function displayRazorpay(chargable_amount){
    // alert("test")
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    // checking if the script is added or not
    if(!res){

      alert("Unable to load the the script")
      return
    }


    console.log("Chargable Amount: ", chargable_amount);

    // Making an Post api call to the server to proceed the payment
    const data = await fetch(`${env.baseUrl}razorpay?total=${chargable_amount}`, { method: 'POST' }).then((t) =>
      t.json()
    )

    console.log(data);

    
    axiosBaseUrl.post(`razorpay?total=${chargable_amount}`)
            .then((res) => {
                // alert("estt")
                console.log(res)
             

            }).catch(error => {
                console.log(error.response)

            })



    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> script added ", data)

    // console.log(data)

    const options = {
      key: "rzp_test_XxgDcoUUKk6lmz", // Enter the Key ID generated from the Dashboard
      "amount": 500, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": 'INR',
      "name": "Book Care",
      "description": "Test Transaction",
      "image": "img/logo.png",
      "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": function (response){
          alert("Payment ID: ",response.razorpay_payment_id);
          alert("Order ID: ",response.razorpay_order_id);
          alert("Razorpay Signature: ",response.razorpay_signature)
          console.log(response)
        },
        "error" :  function (response){
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

    return (
        <div>
            <p> <button onClick= {() => { displayRazorpay(200) }}> BASIC PLAN </button> </p>
            <p> <button onClick= {() => { displayRazorpay(400) }}> STANDARD PLAN </button>  </p>
            <p> <button onClick= {() => { displayRazorpay(600) }}> PREMEIUM PLAN </button></p>
     
        </div>
    )
}

export default TestRazorPay
