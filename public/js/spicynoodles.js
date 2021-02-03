

var carts = document.querySelectorAll('.add-cart');
var products= [
    {name:"Mỳ cay 1",tag:"food1",price:31000,image:"./image/food1.jpg",number:1,inCart: 0},
    {name:"Mỳ cay 2",tag:"food2",price:32000,image:"./image/food2.jpg",number:2,inCart: 0},
    {name:"Mỳ cay 3",tag:"food3",price:33000,image:"./image/food3.jpg",number:3,inCart: 0}
    /*{"name":"Trà sữa 2","price":18000,"image":"./image/tea2.jpg","number":2},
    {"name":"Trà sữa 2","price":18000,"image":"./image/tea2.jpg","number":2},
    {"name":"Trà sữa 3","price":19000,"image":"./image/tea3.jpg","number":3},
    {"name":"Trà sữa 4","price":20000,"image":"./image/tea4.jpg","number":4},
    {"name":"Trà sữa 5","price":21000,"image":"./image/tea5.jpg","number":5},
    {"name":"Trà sữa 6","price":22000,"image":"./image/tea6.jpg","number":6},
    {"name":"Mỳ cay 1","price":32000,"image":"./image/food1.jpg","number":7},
    {"name":"Mỳ cay 2","price":33000,"image":"./image/food2.jpg","number":8},
    {"name":"Mỳ cay 3","price":34000,"image":"./image/food3.jpg","number":9}*/
  
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
