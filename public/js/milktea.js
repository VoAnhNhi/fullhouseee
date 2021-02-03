

var carts = document.querySelectorAll('.add-cart');
var products= [
    {name:"Trà sữa 1",tag:"tea1",price:17000,image:"./image/tea9.jpg",number:1,inCart: 0},
    {name:"Trà sữa 2",tag:"tea2",price:18000,image:"./image/tea2.jpg",number:2,inCart: 0},
    {name:"Trà sữa 3",tag:"tea3",price:19000,image:"./image/tea3.jpg",number:3,inCart: 0},
    {name:"Trà sữa 4",tag:"tea4",price:20000,image:"./image/tea4.jpg",number:4,inCart: 0},
    {name:"Trà sữa 5",tag:"tea5",price:21000,image:"./image/tea5.jpg",number:5,inCart: 0},
    {name:"Trà sữa 6",tag:"tea6",price:22000,image:"./image/tea6.jpg",number:6,inCart: 0},
    {name:"Trà sữa 7",tag:"tea7",price:24000,image:"./image/tea8.jpg",number:7,inCart: 0},
    {name:"Trà sữa 8",tag:"tea8",price:26000,image:"./image/tea11.jpg",number:8,inCart: 0},
    {name:"Trà sữa 9",tag:"tea9",price:28000,image:"./image/tea10.jpg",number:9,inCart: 0},
   
];
for( let i=0; i < carts.length; i++){
    carts[i].addEventListener('click', function(){ 
        cartNumbers(products[i]);
        totalCost(products[i]);
    });
}
function loadCartNumber(){
    var productNumbers = localStorage.getItem('cartNumbers');
    if(productNumbers){
        document.querySelector('.cart span').textContent = productNumbers;
    }

}
function cartNumbers(product){
    
    
    var productNumbers = localStorage.getItem('cartNumbers');

    productNumbers = parseInt(productNumbers);

    if(productNumbers){
        localStorage.setItem('cartNumbers',productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;

    }else{
        localStorage.setItem('cartNumbers',1);
        document.querySelector('.cart span').textContent =  1;
    }
    setItem(product);
}
function setItem(product){
   let cartItems = localStorage.getItem('productInCart');
   cartItems = JSON.parse(cartItems);

   if(cartItems != null ){
       if(cartItems[product.tag] == undefined){
           cartItems = {
               ...cartItems,
               [product.tag]:product
           }
       }
       cartItems[product.tag].inCart += 1; 
   }else{
       product.inCart = 1;
       cartItems = {
           [product.tag]:product
       }
   }
    localStorage.setItem('productInCart',JSON.stringify(cartItems));
}
function totalCost(product){
    let cartCost = localStorage.getItem('totalCost');
    
    if(cartCost != null){
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost',cartCost + product.price);
    }
    else{
        localStorage.setItem('totalCost',product.price);
    }
   
}
function displayCart(){
    let CartItems = localStorage.getItem("productInCart");
    CartItems = JSON.parse(CartItems);
    
    let productContainer = document.querySelector(".products");
    let cartCost = localStorage.getItem('totalCost');
    console.log(CartItems);
    if(CartItems && productContainer){
        productContainer.innerHTML = '';
        Object.values(CartItems).map(item =>{
            productContainer.innerHTML += `
                <div class="product">
                    <img src=${item.image}>
                    <h6>${item.name}</h6>
                </div>
                <div class="product-price">${item.price} VNĐ</div>
                <div class="product-quantity">
                   
                    ${item.inCart}
                   
                </div>
                <div class="total">${item.price * item.inCart} VNĐ</div>
            `
        });
        productContainer.innerHTML += `
        <div class="totalAll">
            <h4 class="totalCostName">Tổng tiền: </h4>
            <h4 class="totalCosts">${cartCost} VNĐ</h4>
            <button  class="btn"><a class="payment" href="http://localhost:8080/order.html" >Đặt hàng</a></button>
        </div>
        
    `
       
    }  
}
loadCartNumber();
displayCart();
