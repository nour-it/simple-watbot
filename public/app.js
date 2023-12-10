
window.addEventListener("load", function (event) {
    const canvas = document.querySelector('canvas')

    function printCode(qrcode) {
        qrcode && QRCode.toCanvas(canvas, qrcode, function (error) {
            if (error) console.error(error)
            console.log('success!');
        })
    }

    printCode(canvas.dataset.code)

    const socket = io.connect();

    socket.on('connect', () => {
        socket.on("new:qrcode", (code) => {
            canvas.dataset.code = code
            printCode(code)
        });
    });

})
