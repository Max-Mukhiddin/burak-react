import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Stack,
  Typography,
  Chip,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, setChosenProduct, setProducts } from "./slice";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { retrieveProducts } from "./selector";
import { createSelector } from "reselect";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProDuctsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProDuctsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    order: "createdAt",
    page: 1,
    limit: 8,
    productCollection: ProductCollection.DISH,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    const product = new ProductService();

    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch });
    }
  }, [searchText]);

  /** HANDLERS **/
  const searchCollectionHandler = (collection: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
    setProductSearch({ ...productSearch });

    //   setProductSeach(prev => ({
    //   ...prev,
    //   page: 1,
    //   productCollection: collection,
    // }));
  };

  const searchOrderHandler = (order: string) => {
    // productSearch.page = 1;
    // productSearch.order = order;
    // setProductSearch({ ...productSearch });

    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      order: order,
    }));
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className="products">
      <Container>
        <Stack className="title-container">
          <Typography className="products-title">Burak Restaurant</Typography>
          {/* <Box className="search-container">
            <input
              type="text"
              placeholder="Type here"
              className="products-search-box"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              className="search-button"
              onClick={searchProductHandler}
            >
              SEARCH <SearchIcon />
            </Button>
          </Box> */}
          <Box className="search-container">
            <input
              type="text"
              placeholder="Type here"
              className="products-search-box"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                console.log(e.key);
                if (e.key === "Enter") searchProductHandler();
              }}
            />
            {searchText && (
              <IconButton
                className="clear-icon-button"
                onClick={() => setSearchText("")}
                size="small"
                aria-label="Clear search"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <Button
              variant="contained"
              color="primary"
              className="search-button"
              onClick={searchProductHandler}
            >
              SEARCH <SearchIcon />
            </Button>
          </Box>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          sx={{ mr: 2, mt: 10, mb: 4 }}
        >
          <Button
            variant="contained"
            color={
              productSearch.order === "createdAt" ? "primary" : "secondary"
            }
            onClick={() => searchOrderHandler("createdAt")}
          >
            NEW
          </Button>
          <Button
            variant="contained"
            color={
              productSearch.order === "productPrice" ? "primary" : "secondary"
            }
            onClick={() => searchOrderHandler("productPrice")}
          >
            PRICE
          </Button>
          <Button
            variant="contained"
            color={
              productSearch.order === "productViews" ? "primary" : "secondary"
            }
            onClick={() => searchOrderHandler("productViews")}
          >
            VIEWS
          </Button>
        </Stack>

        <Stack className="products-page-wrapper">
          <Stack direction="row" className="products-layout">
            <Stack className="category-tabs" direction="column">
              <Button
                variant="contained"
                color={
                  productSearch.productCollection === ProductCollection.DISH
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchCollectionHandler(ProductCollection.DISH)}
              >
                DISH
              </Button>
              <Button
                variant="contained"
                color={
                  productSearch.productCollection === ProductCollection.SALAD
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchCollectionHandler(ProductCollection.SALAD)}
              >
                SALAD
              </Button>
              <Button
                variant="contained"
                color={
                  productSearch.productCollection === ProductCollection.DRINK
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchCollectionHandler(ProductCollection.DRINK)}
              >
                DRINK
              </Button>
              <Button
                variant="contained"
                color={
                  productSearch.productCollection === ProductCollection.DESSERT
                    ? "primary"
                    : "secondary"
                }
                onClick={() =>
                  searchCollectionHandler(ProductCollection.DESSERT)
                }
              >
                DESERT
              </Button>
              <Button
                variant="contained"
                color={
                  productSearch.productCollection === ProductCollection.OTHER
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchCollectionHandler(ProductCollection.OTHER)}
              >
                OTHER
              </Button>
            </Stack>

            <Stack className="products-grid">
              <div className="cards-frame">
                {products.length !== 0 ? (
                  products.map((product: Product) => {
                    const imagePath = `${serverApi}/${product.productImages[0]}`;
                    const sizeVolume =
                      product.productCollection === ProductCollection.DRINK
                        ? product.productVolume + " litr"
                        : product.productSize + " size";
                    return (
                      <Stack
                        key={product._id}
                        className="card"
                        onClick={() => chooseDishHandler(product._id)}
                      >
                        <Chip label={sizeVolume} size="small" />

                        <CardMedia
                          component="img"
                          image={imagePath}
                          alt={product.productName}
                        />

                        <Box className="hover-overlay">
                          <Box className="hover-icons">
                            <button
                              className="shop-button"
                              onClick={(e) => {
                                onAdd({
                                  _id: product._id,
                                  quantity: 1,
                                  name: product.productName,
                                  price: product.productPrice,
                                  image: product.productImages[0],
                                });
                                e.stopPropagation();
                              }}
                            >
                              <img src="/icons/shopping-cart.svg" alt="shop" />
                            </button>
                            <Box className="eye-badge">
                              <img
                                src="/icons/eye.png"
                                alt="views"
                                className="eye-icon"
                              />
                              <span className="view-count">
                                {product.productViews}
                              </span>
                            </Box>
                          </Box>
                        </Box>

                        <Box className="card-info">
                          <h3 className="product-name">
                            {product.productName}
                          </h3>
                          <Box className="price-container">
                            <img
                              src="/icons/dollar-coin.png"
                              alt="price"
                              className="dollar-icon"
                            />
                            <span className="price">
                              {product.productPrice}
                            </span>
                          </Box>
                        </Box>
                      </Stack>
                    );
                  })
                ) : (
                  <Box className="no-data">New products are not available!</Box>
                )}
              </div>
            </Stack>
          </Stack>

          <Stack className={"pagination-section"}>
            <Pagination
              count={
                products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIcon,
                    next: ArrowForwardIcon,
                  }}
                  {...item}
                  color={"secondary"}
                />
              )}
              onChange={paginationHandler}
            />
          </Stack>
        </Stack>
      </Container>

      <div className="brands-logo">
        <Typography className="brands-title">Our Family Brands</Typography>
        <Stack className="brand-face-box">
          <Box className="brand-face">
            <img src="/img/gurme.webp" alt="" />
          </Box>
          <Box className="brand-face">
            <img src="/img/seafood.webp" alt="" />
          </Box>
          <Box className="brand-face">
            <img src="/img/sweets.webp" alt="" />
          </Box>
          <Box className="brand-face">
            <img src="/img/doner.webp" alt="" />
          </Box>
        </Stack>
      </div>

      <div className={"address"}>
        <Container>
          <Stack className={"address-area"}>
            <Box className={"address-title"}>Our address</Box>
            <iframe
              style={{ marginTop: "60px", marginBottom: "89px", border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d203686.4830396607!2d126.8348966!3d37.5666791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca28b61c565cd%3A0x858aedb4e4ea83eb!2sSeoul%2C%20South%20Korea!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="1320"
              height="560"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}