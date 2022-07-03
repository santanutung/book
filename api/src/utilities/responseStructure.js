

let responseCode = {
    "success": {
        "get": { "code": 200 },
        "put": { "code": 204 },
        "post": { "code": 201 },
        "patch": { "code": 204 },
        "delete": { "code": 202 }
    },
    "error": {
        "badreq": { "code": 400 },
        "unauthenticated": { "code": 401 },
        "forbidden": { "code": 403 },
        "notfound": { "code": 404 },
        "ise": { "code": 500 }
    }
};

(response) = async(method, error, data={}) => {
    if(error) {
        return ({ status: responseCode.error['badreq'].code, json: { "message": error } })
    } else if(data){
        let resJson = {};
        resJson = data;
        return({ status: responseCode.success[method.toLowerCase()].code, json: resJson,error:400});
    }
}

module.exports = {
    response
}