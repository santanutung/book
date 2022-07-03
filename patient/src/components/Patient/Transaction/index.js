import React, {useState, useEffect} from 'react'
import axiosBaseUrl from '../../../axiosBaseUrl'
import ProcessLoader from '../../../ReusableComponents/ProcessLoader'
import Wallet from './Wallet'
const moment = require('moment')

function Transaction() {
    const [transactions, setTransactions] = useState([])
    
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getTransactions()
    }, [])

    function getTransactions()
    {
        setLoading(true)
        axiosBaseUrl.get(`patients/api/transactions`)
            .then((res) => {
                setTransactions(res.data.data)
                setLoading(false)

            }).catch(error => {
                console.log(error)

            })
    }
    return (
        <>
        <div className="row">


        <div className="col-lg-12 grid-margin stretch-card mt-5">
            <div className="card">
                <div className="card-body">
                    {/* <Wallet getTransactions={getTransactions} /> */}

                    <div className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>Transaction Id</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Amount</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                     loading ? 
                                     <tr>
                                         <td colSpan={4} className='text-center'>
                                             <ProcessLoader />
                                         </td>
                                     </tr>
                                     :

                                     transactions.length == 0 ?

                                     <tr>
                                         <td colSpan={4}>
                                             <h6 className='text-center'>Transactions are not available</h6>
                                         </td>
                                     </tr>

                                     :

                                    transactions.map((transaction, index) => {
                                        return (
                                            <tr key={"transaction"+index}>
                                                <td>{transaction.transaction_id}</td>
                                                <td>{ transaction.dateTime}</td>
                                                <td>{transaction.type}</td>
                                                <td>{transaction.amount}</td>
                                            </tr>
                                        )
                                    })
                                }
                                
                            </tbody>
                        </table>
                    </div>
                </div>
              
            </div>
        </div>


    </div>
    </>
    )
}

export default Transaction
