import React from "react";
import { Route, Switch, useRouteMatch  } from "react-router-dom";
import { Container } from "@mui/material";
import ChosenProduct from "./ChosenProduct";
import Products from "./Products";
import "../../../css/products.css";
import { CartItem } from "../../../lib/types/search";

interface ProDuctsPageProps {
  onAdd: (item: CartItem) => void;
}

export default function ProductsPage(props: ProDuctsPageProps) {
  const {onAdd} = props;
  const products = useRouteMatch();
  console.log("products:", products);

  return <div className="products-page">
    <Switch>
      <Route path={`${products.path}/:productsId`}>
        <ChosenProduct onAdd={onAdd}/>
      </Route>
      <Route path={`${products.path}`}>
        <Products onAdd={onAdd}/>
      </Route>
    </Switch>
  </div>;
}