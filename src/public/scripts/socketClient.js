const socketClient = io() //handshake client side

let addButton= document.getElementById('addToCart')
let prodId= addButton.getAttribute("productId")
addButton.addEventListener('onclick', evt =>{
    evt.preventDefault()
    socketClient.emit(
        "addToCart",
        prodId
    )
})