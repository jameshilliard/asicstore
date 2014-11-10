var mode="embedded";//standard | embedded
var env = "production";//sandbox | production

var labelNoItem = 'No items in your cart';
var labelItems = 'items';
var labelItem = 'item';
var labelCheckout = 'Checkout';
var labelPreparingCheckout = 'Preparing ...';
var labelTotal = 'Total : ';

//default values
var currency = '$';
var currencyCode = 'USD';			
var decimal =".";
var cookieDurationDays = 10;//number of days in cookie
var useShoppingCartImage = true;
var checkoutAdditionalCostMessage = '';//if additional cost is applied, this line must not be null or empty
var checkoutAdditionalCost = 0;//required, should be 0 or more
var variableAdditionalCost = 'handling_cart';//can be tax_cart or handling_cart

var pcancel;
var preturn;
var ipn;

var win;
var thankYouPage = '';

var NO_ITEMS = '<H3>' + labelNoItem + '</H3>';


$(document).ready(function(){
  //completion code
  var completedFlag = $.getQueryString('checkoutCompleted'); 
  if(completedFlag ) {
    if(completedFlag =='true') {
      emptyCart();
    }
  }
  useShoppingCartImage = true;
  addBindings();
  fillCart();
}); 


function fadeInContent() {
  if($('#addToCartMessage')) {
    $('#container').fadeTo( 'fast', .2 );
    $('#addToCartMessage').fadeIn();
  }
}


function fadeOutContent() {
  if($('#addToCartMessage')) {
    $('#addToCartMessage').fadeOut('fast');
    $('#container').fadeTo( 'fast', 1 );
  }
}

function renderCart() {
  var CART_PREPENDER='<table class="table" style="margin-bottom: 5px"><tbody>';
  var CART_APPENDER='</tbody></table>';
  var products = $.cookie( 'sku' );
  
  if(products!=null && products!='') {
    var productsArray = products.split("|");
    var globalproducts = CART_PREPENDER;
    if(productsArray.length>1) {
      for ( var i = 0; i < productsArray .length; i++ )  {
	var skuQty = productsArray[i];
	var productLine = printProduct(skuQty,3);
	if(productLine==null) {
	  continue;
	}
	globalproducts = globalproducts + productLine + '';
      }
    } else {
      var skuQty = productsArray[0];
      var productLine = printProduct(skuQty,3);
      if(productLine!=null) {
	globalproducts = globalproducts + productLine + '';
      }
    }
    
    globalproducts = globalproducts + CART_APPENDER;

    var GRAND_TOTAL_LABEL_PREPENDER = '<div class="total-box"><div class="pull-right"><font class="total-box-label">';
    var GRAND_TOTAL_LABEL_APPENDER = '';
    var GRAND_TOTAL_AMOUNT_PREPENDER = '<font class="total-box-price">';
    var GRAND_TOTAL_AMOUNT_APPENDER = '</font></font></div></div>';

    
    if(globalproducts!='') {
      
      var checkout_total_prev = '<strong><span id="checkout-total">' ;
      var checkout_total_post = '</span></strong>';
      var total = 'TOTALS_HEADER';
      var totalLine = GRAND_TOTAL_LABEL_PREPENDER + labelTotal + GRAND_TOTAL_LABEL_APPENDER + GRAND_TOTAL_AMOUNT_PREPENDER + checkout_total_prev + renderPrice() + checkout_total_post + GRAND_TOTAL_AMOUNT_APPENDER;
      globalproducts = globalproducts + totalLine;
    } else {
      products = null;
      $.cookie('sku',null, { expires: cookieDurationDays ,path: '/'});
    }
  }

  if(products==null || products=='') {
    return NO_ITEMS;
  }
  return globalproducts;
}


function fillCart() {
  
  
  var CART_PREPENDER='<table class="table" style="margin-bottom: 5px"><tbody>';
  var CART_APPENDER='</tbody></table>';

  var products = $.cookie( 'sku' );

  if(products!=null && products!='') {
    var productsArray = products.split("|");
    var globalproducts = CART_PREPENDER;
    if(productsArray.length>1) {
      for ( var i = 0; i < productsArray .length; i++ )  {
	var skuQty = productsArray[i];
	var productLine = printProduct(skuQty,1);
	if(productLine==null) {
	  continue;
	}
	globalproducts = globalproducts + productLine + '';
      }
    } else {
      var skuQty = productsArray[0];
      var productLine = printProduct(skuQty,1);
      if(productLine!=null) {
	globalproducts = globalproducts + productLine + '';
      }
    }
    
    globalproducts = globalproducts + CART_APPENDER;

    var TOTALS_HEADER= '';

    var TOTALS_ADDITIONAL_PREPENDER= '';
    var TOTALS_ADDITIONAL_APPENDER ='';
    
    var TOTAL_ADDITIONAL_LINE_LABEL_PREPENDER='<div class="row" style="padding-right:4px;"><div class="pull-right">';
    var TOTAL_ADDITIONAL_LINE_LABEL_APPENDER=' :';
    var TOTAL_ADDITIONAL_LINE_AMOUNT_PREPENDER=' ';
    var TOTAL_ADDITIONAL_LINE_AMOUNT_APPENDER='</div></div>';
    
    var GRAND_TOTAL_LABEL_PREPENDER = '<div class="total-box"><div class="pull-right"><font class="total-box-label">';
    var GRAND_TOTAL_LABEL_APPENDER = '';
    var GRAND_TOTAL_AMOUNT_PREPENDER = '<font class="total-box-price">';
    var GRAND_TOTAL_AMOUNT_APPENDER = '</font></font></div></div>';

    
    if(globalproducts!='') {
      
      //do not edit
      var checkout_total= '<strong><span id="checkout-total"></span></strong>';
      var checkout_all_total= '<strong><span id="checkout-total-plus"></span></strong>';


      //sub-total
      var total = 'TOTALS_HEADER';

      var totalLine = GRAND_TOTAL_LABEL_PREPENDER + labelTotal + GRAND_TOTAL_LABEL_APPENDER + GRAND_TOTAL_AMOUNT_PREPENDER + checkout_total + GRAND_TOTAL_AMOUNT_APPENDER;

      var additionalCosts = '';
      if(checkoutAdditionalCostMessage!=null && checkoutAdditionalCostMessage!='') {
	additionalCosts = TOTALS_ADDITIONAL_PREPENDER;
	var additionalCostsLine = TOTAL_ADDITIONAL_LINE_LABEL_PREPENDER + checkoutAdditionalCostMessage + TOTAL_ADDITIONAL_LINE_LABEL_APPENDER;
	additionalCosts = additionalCosts + additionalCostsLine;
	if(checkoutAdditionalCost > 0) {
	  var additionalCostsLinePrice = TOTAL_ADDITIONAL_LINE_AMOUNT_PREPENDER + currency + round_decimals(checkoutAdditionalCost,2) + TOTAL_ADDITIONAL_LINE_AMOUNT_APPENDER;
	  additionalCosts = additionalCosts + additionalCostsLinePrice;
	} 
	additionalCosts = additionalCosts + TOTALS_ADDITIONAL_APPENDER;
	if(checkoutAdditionalCost > 0) {
	  totalLine = GRAND_TOTAL_LABEL_PREPENDER + labelTotal + GRAND_TOTAL_LABEL_APPENDER + GRAND_TOTAL_AMOUNT_PREPENDER + checkout_all_total + GRAND_TOTAL_AMOUNT_APPENDER;
	}
      }

      globalproducts = globalproducts + additionalCosts + totalLine;


      var FOOTER_HEADER= '';
      var MESSAGE_BLOCK = '<span id="message">&nbsp;</span>';
      var WAIT_BLOCK = '';

      var BLOCKCHAIN_LOGO = '<img src="img/bitcoin-accepted.png" border="0" width="110" alt="Checkout with paypal">';
      var CHECKOUT_BUTTON = '<input type="submit" value="Place Your Order" class="btn btn-primary btn-xlarge" onclick="window.location=\'/placeorder\'">';

      //globalproducts = globalproducts + FOOTER_HEADER;
      
      var FOOTER = FOOTER_HEADER + '<table class="table-nr" style="margin-bottom: 0px"><tbody><tr style="background-color: transparent;"><td colspan="2" style="border-top: none;">' + MESSAGE_BLOCK + '</td></tr>';
      FOOTER = FOOTER + '<tr style="background-color: transparent"><td style="border-top: none;">' + BLOCKCHAIN_LOGO + '</td><td style="border-top: none;"><div class="pull-right">' + CHECKOUT_BUTTON + '</div></td></tr>';

      FOOTER = FOOTER + '</tbody></table>';
      
      globalproducts = globalproducts + FOOTER;
      $("#shoppingcart").html(globalproducts);
      addCartBindings();
      if(checkoutAdditionalCost > 0) {
	printPriceQty(3);
      } else {
	printPriceQty(2);
      }
    } else {//garbage, delete cookie
      //delete cookie
      products = null;
      $.cookie('sku',null, { expires: cookieDurationDays ,path: '/'});
    }
  }


  printPriceQty(1);
  if(products==null || products=='') {
    $("#shoppingcart").html(NO_ITEMS);

  }
}


function addBindings() {
  $(".addToCart").click(function(){ 
    fadeInContent();
    var sku = $(this).attr("productId");
    var qty = '#quantity-productId-'+ sku;
    var prop = '#property-productId-'+ sku;
    var quantity = parseInt($(qty).val());
    var property=null;
    if(prop) {
      property = $(prop).val();
    }
    if(!quantity || quantity==null || quantity==0) {
      quantity = 1;
    }
    addProductToCart(Catalog, sku, quantity,property);
    fillCart();
    setTimeout(fadeOutContent,2000);
  });

  $(".pay").click(function(){ 
    fadeInContent();

    var sku = $(this).attr("productId");
    var qty = '#quantity-productId-'+ sku;
    var prop = '#property-productId-'+ sku;
    var quantity = $(qty).val();
    var property=null;
    if(prop) {
      property = $(prop).val();
    }
    if(!quantity || quantity==null || quantity==0) {
      quantity = 1;
    }
    addProductToCart(Catalog, sku, quantity,property);
    setTimeout(fadeOutContent,2000);
  });


}


function addCartBindings() {

  $('.removeProductIcon').click(function() {//REMOVE PRODUCT
    var id = $(this).attr('productid');
    //remove from cookie
    var obj = $('#'+id);
    obj.remove();
    removeItem(id);
    fillCart();
  });

  $('#checkout').click(function() {//CHECKOUT
    showCheckout();

  });

}


function getCartProducts() {

  var products = $.cookie( 'sku' );
  var cartProducts = new Array();
  var count = 0;
  if(products!=null) {
    var productsArray = products.split("|");
    if(productsArray.length>1) {
      for ( var i = 0; i < productsArray .length; i++ )  {
	var skuQty = productsArray[i];
	var productDetails = skuQty.split("&");
	var cartProduct = new Object();
	for ( var j = 0; j < productDetails.length; j++ )  {

	  if(j==0) {//sku	
	    sku = productDetails[j];
	    
	    //get product entity from sku
	    var product = getProductById(Catalog,sku);
	    if(product) {//delete from cookie
	      cartProduct.product = product;
	    } 
	  }

	  if(j==1) {//qty
	    qty = productDetails[j];
	    cartProduct.qty=qty;
	  }

	  if(j==2) {//property
	    property = productDetails[j];
	    cartProduct.property=property;
	  }
	  
	}
	
	
	cartProducts[count] = cartProduct;
	count ++;

      }					
    }  else {
      var skuQty = productsArray[0];
      var productDetails = skuQty.split("&");
      var cartProduct = new Object();
      for ( var j = 0; j < productDetails.length; j++ )  {


	if(j==0) {//sku	
	  sku = productDetails[j];
	  
	  //get product entity from sku
	  var product = getProductById(Catalog,sku);
	  if(product) {//delete from cookie
	    cartProduct.product = product;
	  } 
	}

	if(j==1) {//qty
	  qty = productDetails[j];
	  cartProduct.qty=qty;
	}

	if(j==2) {//property
	  property = productDetails[j];
	  cartProduct.property=property;
	}
      }

      cartProducts[count] = cartProduct;
      count ++;
    }
  }
  return cartProducts;
}


function printProduct(skuQty,mode) {
  var productDetails = skuQty.split("&");
  var line = '';
  var qtyLine = '';
  var nameLine = '';
  var priceLine = '';
  var sku = '';
  var total = 0;
  var price = 0;
  var name = '';
  var qty = 1;
  for ( var j = 0; j < productDetails.length; j++ )  {
    if(j==0) {//sku	
      sku = productDetails[j];
      
      //get product entity from sku
      var product = getProductById(Catalog,sku);
      if(!product) {//delete from cookie
	removeItem(sku);
	return null;
      } 
      name = product.name;
      price = product.price;
    }
    if(j==1) {//qty
      if(productDetails[j]=='0'){
	return null;
      }
      qty = productDetails[j];
    }					
  }
  
  var GLOBAL_PREPEND= '';
  var CART_PREPEND_ID = '<tr class="cart-product" id="';
  var CART_APPEND_ID = '">';
  
  var CART_PREPEND_QTY = '<td><strong>';
  var CART_APPEND_QTY = '</strong></td>';
  
  var CART_PREPEND_PRICE = '<td>';
  var CART_APPEND_PRICE = '</td>';
  
  var CART_PREPEND_IMAGE = '<td><img width="40" height="40" src="img/';
  var CART_APPEND_IMAGE = '"></td>';
  
  var CART_PREPEND_NAME = '<td>';
  var CART_APPEND_NAME = '</td>';
  
  var CART_PREPEND_REMOVE = '<td><button class="close removeProductIcon" productid="';
  var CART_APPEND_REMOVE = '">x</button></tr>';
  var GLOBAL_APPEND= '';


  
  line = CART_PREPEND_ID + sku + CART_APPEND_ID;
  if(mode==2) {
    qtyLine  = CART_PREPEND_QTY + qty + CART_APPEND_QTY;
  } else {
    qtyLine  = qty;
  }
  nameLine = name;
  priceLine = CART_PREPEND_PRICE + currency + price + CART_APPEND_PRICE;
  if(mode==2) {
    priceLine = CART_PREPEND_PRICE + currency + qty * price + CART_APPEND_PRICE;
  }

  var image = '';
  if(useShoppingCartImage && product.image) {
    image = CART_PREPEND_IMAGE + product.image + CART_APPEND_IMAGE;
  }
  
  var productNameLine = CART_PREPEND_NAME + qtyLine + ' ' + nameLine + CART_APPEND_NAME;
  
  var removeLine = CART_PREPEND_REMOVE + sku + CART_APPEND_REMOVE;	

  if(mode==1) {
    line = GLOBAL_PREPEND + line +  image + productNameLine + priceLine + removeLine + GLOBAL_APPEND;	
  } else if(mode==2) {
    line = line + qtyLine + '<div class="col2">' + nameLine + '</div>' + '<div class="col3">' + priceLine + '</div></div><div class="clear-float"></div>';	
  } else if(mode==3) {
    line = GLOBAL_PREPEND + line +  image + productNameLine + priceLine + GLOBAL_APPEND;	
  }

  return line;
}

function printPriceQty(mode) {
  var products = $.cookie( 'sku' );
  var total=0;
  var qty = 0;
  var lItem = labelItem;
  if(products!=null && products!='') {
    var productsArray = products.split("|");
    if(productsArray.length>1) {
      for ( var i = 0; i < productsArray.length; i++ )  {
	var skuQty = productsArray[i];
	var price = getPrice(skuQty);
	if(price==null) {
	  continue;
	}
	total = total + parseFloat(price);
	qty = qty + getQuantity(skuQty);
      }
    } else {
      var skuQty = productsArray[0];
      var price = getPrice(skuQty);
      if(price==null) {
	return;
      }
      total = total + parseFloat(price);
      qty = qty + getQuantity(skuQty);
    }
  }
  if(qty>1) {
    lItem = labelItems;
  }

  if(mode==1) {//summary
    $("#cartprice").html(currency + round_decimals(total,2));
    $("#cartqty").html('(' + qty + ' ' + lItem + ')');
  } else if(mode==2) {//checkout
    $("#checkout-total").html(currency + round_decimals(total,2));
  } else if(mode==3) {
    total = total + parseFloat(checkoutAdditionalCost);
    $("#checkout-total-plus").html(currency + round_decimals(total,2));
  }
}


function renderPrice() {
  var products = $.cookie( 'sku' );
  var total=0;
  var qty = 0;
  var lItem = labelItem;
  if(products!=null && products!='') {
    var productsArray = products.split("|");
    if(productsArray.length>1) {
      for ( var i = 0; i < productsArray.length; i++ )  {
	var skuQty = productsArray[i];
	var price = getPrice(skuQty);
	if(price==null) {
	  continue;
	}
	total = total + parseFloat(price);
	qty = qty + getQuantity(skuQty);
      }
    } else {
      var skuQty = productsArray[0];
      var price = getPrice(skuQty);
      if(price==null) {
	return;
      }
      total = total + parseFloat(price);
      qty = qty + getQuantity(skuQty);
    }
  }
  if(qty>1) {
    lItem = labelItems;
  }

  return currency + round_decimals(total,2);

}

function calculatePriceQty() {
  var products = $.cookie( 'sku' );
  var total=0;
  var qty = 0;
  var lItem = labelItem;
  if(products!=null && products!='') {
    var productsArray = products.split("|");
    if(productsArray.length>1) {
      for ( var i = 0; i < productsArray.length; i++ )  {
	var skuQty = productsArray[i];
	var price = getPrice(skuQty);
	if(price==null) {
	  continue;
	}
	total = total + parseFloat(price);
	qty = qty + getQuantity(skuQty);
      }
    } else {
      var skuQty = productsArray[0];
      var price = getPrice(skuQty);
      if(price==null) {
	return;
      }
      total = total + parseFloat(price);
      qty = qty + getQuantity(skuQty);
    }
  }
  if(qty>1) {
    lItem = labelItems;
  }


  return round_decimals(total,2);


}

function getPrice(skuQty) {
  var productDetails = skuQty.split("&");
  var qty = 1;
  var product = null;
  for ( var j = 0; j < productDetails.length; j++ )  {			
    if(j==0) {//sku	
      sku = productDetails[j];
      
      //get product entity from sku
      product = getProductById(Catalog,sku);
      if(!product) {
	return null;
      }
    } 
    if(j==1) {//qty
      qty = parseInt(productDetails[j]);
    }
    
  }

  return parseFloat(qty * product.price);
}

function getQuantity(skuQty) {
  var productDetails = skuQty.split("&");
  var qty = 1;
  for ( var j = 0; j < productDetails.length; j++ )  {
    if(j==1) {//qty
      qty = parseInt(productDetails[j]);
    }	
  }
  return qty;
}



function round_decimals(original_number, decimals) { 
  var result1 = original_number * Math.pow(10, decimals) ;
  var result2 = Math.round(result1) ;
  var result3 = result2 / Math.pow(10, decimals);
  return pad_with_zeros(result3, decimals) ;
} 

function pad_with_zeros(rounded_value, decimal_places) { 
  var value_string = rounded_value.toString();
  var decimal_location = value_string.indexOf(decimal);

  if (decimal_location == -1) { 
    decimal_part_length = 0;
    value_string += decimal_places > 0 ? decimal : "" ;
  } else { 
    decimal_part_length = value_string.length - decimal_location - 1 ;
  } 
  var pad_total = decimal_places - decimal_part_length ;
  if (pad_total > 0) { 
    for (var counter = 1; counter <= pad_total; counter++) 
      value_string += "0" ;
  } 
  return value_string;
} 




function removeItem(sku) {
  var products = $.cookie( 'sku' );
  if(products!=null) {
    var productsArray = products.split("|");
    var resultLine = '';
    if(productsArray.length>0) {
      for ( var i = 0; i < productsArray.length; i++ )  {
	var line = productsArray[i];
	var productDetails = line.split("&");
	var s = '';
	var q = 0;
	var n = 0;
	var p = 0;
	for ( var j = 0; j < productDetails.length; j++ )  {
	  if(j==0) {	
	    s = productDetails[j];
	  }
	  if(j==1) {
	    q = productDetails[j];
	  }	
	}
	if(s!=sku) {
	  if(resultLine=='') {
	    //resultLine = s + '&' +	q + '&' + n + '&' + p;
	    resultLine = s + '&' +	q;
	  } else {
	    //resultLine = resultLine + '|' + s + '&' +	q + '&' + n + '&' + p;
	    resultLine = resultLine + '|' + s + '&' +	q;
	  }
	}
      }
    }
    $.cookie('sku',resultLine, { expires: cookieDurationDays,path: '/' });
  }
  fillCart();
}

function addToCart(sku, qty, name, price, property, updateQty) {

//  alert('add to cart ' + sku + ' qty ' + qty + ' name ' + name + ' price ' + ' property ' + property + ' updateQty ' + updateQty);

  var products = $.cookie( 'sku' );
  if(products!=null) {
    var productsArray = products.split("|");
    var resultLine = '';
    var found = false;
    if(productsArray.length>0) {
      for ( var i = 0; i < productsArray.length; i++ )  {
	var line = productsArray[i];
	var productDetails = line.split("&");
	var s = '';
	var q = 0;
	var n = 0;
	var p = 0;
	var product = null;
	for ( var j = 0; j < productDetails.length; j++ )  {
	  if(j==0) {	
	    s = productDetails[j];
	    product = getProductById(Catalog,sku);
	    if(!product) {
	      return null;
	    }

	  }
	  if(j==1) {
	    q = productDetails[j];
	  }			
	}
	if(s==sku) {


	  if(product) {
	    if(product.filename || !updateQty) {//no more than 1 digital
	      return;
	    }
	  }


	  q = parseInt(q) + qty;
	  found = true;
	}
	if(i==0) {
	  //resultLine = s + '&' + q + '&' + n + '&' + p;
	  resultLine = s + '&' +	q;
	  if(property && property!=null) {
	    resultLine = resultLine + '&' + property;
	  }
	} else {
	  //resultLine = resultLine + '|' + s + '&' +	q + '&' + n + '&' + p;
	  resultLine = resultLine + '|' + s + '&' +q;
	  if(property && property!=null) {
	    resultLine = resultLine + '&' + property;
	  }
	}
      }
      if(!found) {
	var product = getProductById(Catalog,sku);
	if(!product) {
	  return null;
	}
	// if(product.filename) {
	//   qty = 1;
	// }

	resultLine = resultLine + '|' + sku + '&' + qty;
	if(property && property!=null) {
	  resultLine = resultLine + '&' + property;
	}
      }
    }
    $.cookie('sku',resultLine, { expires: cookieDurationDays ,path: '/'});
  } else {
    var resultLine = sku + '&' + qty;
    if(property && property!=null) {
      resultLine = resultLine + '&' + property;
    }
    $.cookie('sku',resultLine, { expires: cookieDurationDays ,path: '/'});
  }
  
}


function closeAdaptiveFlowWindow(){
  try {flow_Form.closeFlow();} catch(e) {}
  try {flow_Javascript.closeFlow();} catch(e) {}
}




function emptyCart() {
  $.cookie('sku',null, { expires: cookieDurationDays ,path: '/'});
  $.cookie('payKey',null, { expires: cookieDurationDays ,path: '/'});
}
