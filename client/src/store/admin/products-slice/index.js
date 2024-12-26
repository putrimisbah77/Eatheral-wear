import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

// Add new product
export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/products/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/admin/products/get"
    );
    return result?.data;
  }
);

// Edit product
export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/products/delete/${id}`
    );
    return result?.data;
  }
);

// Update flat sale
export const updateFlatSale = createAsyncThunk(
  "/products/flat-sale",
  async ({ saleTitle, salePercentage }) => {
    const response = await axios.put('http://localhost:5000/api/admin/products/flat-sale', {
      saleTitle,
      salePercentage,
    });
    return response.data;
  }
);


// Admin product slice
const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(updateFlatSale.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFlatSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = state.productList.map((product) => {
          const salePrice = product.price * (1 - action.payload.salePercentage / 100);
          return {
            ...product,
            salePrice,
            saleTitle: action.payload.saleTitle,
            salePercentage: action.payload.salePercentage,
          };
        });
      })
      .addCase(updateFlatSale.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default AdminProductsSlice.reducer;
