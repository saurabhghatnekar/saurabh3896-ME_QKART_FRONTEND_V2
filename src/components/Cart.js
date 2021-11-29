import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
    return cartData.map(CartProduct => {
        const productInfo = productsData.filter(product => CartProduct.productId === product._id)[0]
        return {...productInfo,["qyt"]:CartProduct.qty}
    })
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {

    return items.reduce( function(a, b){
        return a + (b.cost*b.qyt);
    }, 0)
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
}) => {

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={(event)=>handleDelete(event)}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={(event)=>handleAdd(event)}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

export const displayCartItem = (cartItem, handleQuantity) => {
    const handleAdd = (event) => {
        //console.log("new qty",cartItem)
        handleQuantity(cartItem._id, cartItem.qyt+1)
    }
    const handleDelete = (event) => {
        //console.log("new qty", cartItem.qyt, Math.max((cartItem.qyt-1),0))
        handleQuantity(cartItem._id, Math.max((cartItem.qyt-1),0))
    }

    return (<Box display="flex" alignItems="flex-start" padding="1rem" key={cartItem._id}>
        <Box className="image-container">
            <img
                src={cartItem.image}
                alt={cartItem.name}
                width="100%"
                height="100%"
            />
        </Box>
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="6rem"
            paddingX="1rem"
        >
            <div>{cartItem.name}</div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <ItemQuantity
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    value={cartItem.qyt}
                />
                <Box padding="0.5rem" fontWeight="700">
                    ${cartItem.cost}
                </Box>

            </Box>
        </Box>
    </Box>)
}


/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
}) => {
    const history = useHistory();
    const cartItems = generateCartItemsFrom(items, products)
    //console.log("handleQuantity", handleQuantity)
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
      <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
          {cartItems.map(cartItem => displayCartItem(cartItem, handleQuantity))}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartItems)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => history.push("/checkout")}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default Cart;
