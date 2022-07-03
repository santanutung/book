
const blood_group = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const relations = ['Mother', 'Father', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter', 'Other'];
  
const documents = ['CBC', 'KFT',' X-ray', 'creatinine test', 'Other'];
// const price_range = ['0-1000', '1000-2000',' 2000-3000', '3000-4000', '4000-5000', '5000-6000', '000-5000'];
const price_range = [
    {
        from_price : 0,
        to_price : 1000,
        lable : '0-1000'
    },
    {
        from_price : 1000,
        to_price : 2000,
        lable : '1000-2000'
    },
    {
        from_price : 2000,
        to_price : 3000,
        lable : '2000-3000'
    },
    {
        from_price : 3000,
        to_price : 4000,
        lable : '3000-4000'
    },
    {
        from_price : 4000,
        to_price : 5000,
        lable : '4000-5000'
    },
    {
        from_price : 5000,
        to_price : 6000,
        lable : '5000-6000'
    },
    {
        from_price : 6000,
        to_price : 7000,
        lable : '6000-7000'
    },
    {
        from_price : 7000,
        to_price : 8000,
        lable : '7000-8000'
    },
    {
        from_price : 8000,
        to_price : 9000,
        lable : '8000-9000'
    },
    {
        from_price : 9000,
        to_price : 10000,
        lable : '9000-10000'
    },
    {
        from_price : 10000,
        to_price : '',
        lable : '10000 plus'
    }
];




  
export {relations, documents, price_range}

export default blood_group