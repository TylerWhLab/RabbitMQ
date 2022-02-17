const express = require('express') // node_module에 다운로드된 express 모듈 가져오기
const app = express() // 새로운 express app 생성
const port = 6666 // 백엔드 포트 지정



// send
app.get('/send/:msg', (req, res) => {
    const amqp = require('amqplib/callback_api');
    var userMsg = req.params.msg;

    // Step 1: connection 생성
    amqp.connect('amqp://localhost', (connError, connection) => {
        if (connError) {
            throw connError;
        }
        // Step 2: channel 생성
        connection.createChannel((channelError, channel) => {
            if (channelError) {
                throw channelError;
            }
            // Step 3: queue 이름 지정
            const QUEUE = 'queueNameTest'
            channel.assertQueue(QUEUE);
            
            // Step 4: queue에 메시지 보내기
            channel.sendToQueue(QUEUE, Buffer.from(userMsg));

            // Step 4: 메시지 받기
            channel.consume(QUEUE, (msg) => {
                console.log(`Message received: ${msg.content.toString()}`)
            }, {
                noAck: true // 메시지를 받았다는 응답은 하지 않음
            })

        })
    })

    return res.status(200).json({
        success: true
    });

})


// receive
app.get('/consumerStart', (req, res) => {
    const amqp = require('amqplib/callback_api');

    // Step 1: Connection 생성
    amqp.connect('amqp://localhost', (connError, connection) => {
        if (connError) {
            throw connError;
        }
        // Step 2: Channel 생성
        connection.createChannel((channelError, channel) => {
            if (channelError) {
                throw channelError;
            }
            // Step 3: queue 이름 지정
            const QUEUE = 'queueNameTest'
            channel.assertQueue(QUEUE);
            
            // Step 4: 메시지 받기
            channel.consume(QUEUE, (msg) => {
                console.log(`Message received: ${msg.content.toString()}`)
            }, {
                noAck: true // 메시지를 받았다는 응답은 하지 않음
            })

        })
    })

    return res.status(200).json({
        success: "Consumer Start"
    });

})


// 6666 포트에서 app 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})