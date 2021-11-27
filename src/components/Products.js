import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard"


const Products = () => {
  
    const [productList, updateProductList] = useState([]);
    const [searchKey, updateSearchKey] = useState("");
    const [apiProgress, updateApiProgress] = useState(false)
    const [timerId, setTimerId] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([])

    const getProductGrid = () => {
      let productGrid = <Grid></Grid>
        if(apiProgress){
            return <Grid container
            spacing={0}
            alignItems="center"
            justifyContent="center">
                <CircularProgress></CircularProgress>
                <p>Loading Products</p>
                </Grid>
        }
        if(filteredProducts.length > 0){
            
          productGrid = filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={3} key={product._id}>
                <ProductCard product={product}/>
            </Grid>
            ))

        }
        else{
          productGrid = <Grid container
          spacing={0}
          alignItems="center"
          justifyContent="center">
          <SentimentDissatisfied>
          </SentimentDissatisfied>
          <p>No products found</p>
          </Grid>
        }
      return productGrid
    }

    const performAPICall = async () => {
        updateApiProgress(true)
        const response = await axios.get(`${config.endpoint}/products`)
        .then(response => {
            updateProductList(response.data)
            setFilteredProducts(response.data)
            updateApiProgress(false)
            return response.data})
        .catch(error => {
            if(error.response.status == 404){
                //console.log("no products");
                setFilteredProducts([])
                updateApiProgress(false)
            }
        })
        
    }
    const performSearch = async () => {

          updateApiProgress(true)
          let url = `${config.endpoint}/products/search?value=${searchKey}`
          //console.log("searchKey", searchKey, url)
          
          const searcheResult = await axios.get(url)
          .then(response => {
            //console.log("search", response.data)
            setFilteredProducts(response.data)
            updateApiProgress(false)
            return response.data})
          .catch(error => {
            //console.log(error)
            if(error.response.status == 404){
                  //qconsole.log("no products");
                  setFilteredProducts([])
                  updateApiProgress(false)
            }
          })
        
    }

    useEffect(() => {
        performAPICall()
    }, [])

    useEffect(()=>{
      if(!searchKey) {
        setFilteredProducts(productList)
      }
      else{
        if(timerId){
            clearTimeout(timerId)
        }
        const debounceTimerId = setTimeout(()=> performSearch(),500)
        setTimerId(debounceTimerId)
      }
    }, [searchKey])

  return (
    <div>
      <Header
       searchBox={
          <TextField
          value={searchKey}
          onChange={(event) => updateSearchKey(event.target.value)}
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      }
      />

      <TextField
        value={searchKey}
        onChange={(event) => updateSearchKey(event.target.value)}
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid
          item
          className="product-grid"
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        {getProductGrid()}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
