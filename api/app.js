const app = require('./src/server');
const axois = require('axios');


async function name() {
    try {

    const config = {
        method: 'post',
        url: 'https://fcm.googleapis.com/fcm/send',
        data:{
            "notification":{
                "title":"oye pagal",
                "text":"kjhdfkjfkdsdnjksdjkfks"
            },
            "registration_ids":["eVSpIaFITUaoCaPR0kcG1p:APA91bGI4Yl-0v7Gi9cvn4w31V9zxe8ZbjnqJt0Se4I3PqDXt_-5CKZVQgXyOI9zytIYS1njtyUPS9ffB46MvS4yAXaS0ZGNuI3nyG5-ty6r4p0QYtE4v5KSwf8V1GIB2kUzAAVZ2BpK"]
        },
        headers:{
            "Authorization": "key=AAAAq_Kr-y8:APA91bHBsUbgIPVpMGjM6h8jD1EZynQpuHuAXk8yTrqDP_lE2oknL9Rggt5pTUMa0_Bm8TCY8vPE81wBT_mJYTSGqkFXGCvrCzlBOddUYNeUZ4wFi5nUuSChsfnN03fwZZ_q88VuaClq"

        }
    }

        const data = await axois(config);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

// name()

