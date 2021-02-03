

var carts = document.querySelectorAll('.add-cart');
var products= [
    {name:"Trà sữa 1",tag:"tea1",price:17000,image:"./image/tea9.jpg",number:1,inCart: 0},
    {name:"Trà sữa 2",tag:"tea2",price:18000,image:"./image/tea2.jpg",number:2,inCart: 0},
    {name:"Trà sữa 3",tag:"tea3",price:19000,image:"./image/tea3.jpg",number:3,inCart: 0},
    {name:"Trà sữa 4",tag:"tea4",price:20000,image:"./image/tea4.jpg",number:4,inCart: 0},
    {name:"Trà sữa 5",tag:"tea5",price:21000,image:"./image/tea5.jpg",number:5,inCart: 0},
    {name:"Trà sữa 6",tag:"tea6",price:22000,image:"./image/tea6.jpg",number:6,inCart: 0},
    {name:"Mỳ cay 1",tag:"food1",price:31000,image:"./image/food1.jpg",number:7,inCart: 0},
    {name:"Mỳ cay 2",tag:"food2",price:32000,image:"./image/food2.jpg",number:8,inCart: 0},
    {name:"Mỳ cay 3",tag:"food3",price:33000,image:"./image/food3.jpg",number:9,inCart: 0}
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
                    <h4>${item.name}</h4>
                </div>
                <div class="product-price">${item.price}</div>
                <div class="product-quantity">
                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                    ${item.inCart}
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                </div>
                <div class="total">${item.price * item.inCart}</div>
            `
        });
        productContainer.innerHTML += `
        <div class="totalAll">
            <h4 class="totalCostName">Tổng tiền: </h4>
            <h4 class="totalCost">${cartCost} VNĐ</h4>
            <a class="payment" href="http://fullhouseee.herokuapp.com/payment.html" >Thanh toán</a>
        </div>
    `
       
    }  
}
function displayTotal(){
    let totalCost = document.querySelector(".form-horizontal");
    let detail = document.querySelector(".detail");
    let cartCost = localStorage.getItem('totalCost');
    let CartItems = localStorage.getItem("productInCart");
    CartItems = JSON.parse(CartItems);
   console.log(cartCost);
   totalCost.innerHTML =`
   <div class="form-group">
   <label class="control-label col-sm-2" for="name">Họ tên:</label>
   <div class="col-sm-10">
       <input type="text" class="form-control" id="name" placeholder="Nhập họ tên" name="name" onblur="return CheckName();">
       <span id="txtName"></span>
   </div>
</div>
<div class="form-group">
   <label class="control-label col-sm-2" for="phone">Email:</label>
   <div class="col-sm-10">          
     <input type="text" class="form-control" id="mail" placeholder="Nhập email" name="email" onblur="return CheckMail();">
     <span id="txtMail"></span>
     </div>
</div>   
<div class="form-group">
   <label class="control-label col-sm-2" for="address">Địa chỉ nhận hàng:</label>
   <div class="col-sm-10">          
     <input type="text" class="form-control" id="address" placeholder="Nhập địa chỉ" name="address" onblur="return CheckAddress();">
     <span id="txtAddress"></span>
   </div>
</div>
<div class="form-group">
   <label class="control-label col-sm-2" for="phone">Số điện thoại:</label>
   <div class="col-sm-10">          
     <input type="text" class="form-control" id="phone" placeholder="Nhập số điện thoại nhận hàng" name="phone" onblur="return CheckPhone();">
     <span id="txtPhone"></span>
   </div>
</div>
<div class="form-group">
   <label class="control-label col-sm-2" >Chi tiết đơn hàng:</label>
</div> 
   `
   if(totalCost){
    Object.values(CartItems).map(item =>{
        totalCost.innerHTML += `
        <div class="form-group">
            <div class="col-sm-10" >          
                <input type="text" class="form-control"  class="detail"  name="detail" readonly value= "${item.name}: ${item.price} VNĐ, Số lượng: ${item.inCart}">
            </div>
        </div>    
        `
   });
    totalCost.innerHTML+=`
    <div class="form-group">
    <label class="control-label col-sm-2" for="total">Tổng tiền:</label>
    <div class="col-sm-10">          
      <input type="text" class="form-control"  class="total"  name="total" readonly value= "${cartCost}">
    </div>
    </div>
  
    <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-success" >Đặt hàng</button>
    </div>
  </div>
    `
    
}  
}
displayCart();
displayTotal();
