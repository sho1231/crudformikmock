import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import axios from 'axios';

function App() {
  let [product, setProduct] = useState({
    ProductName: '',
    ProductPrice: 0
  });
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  let [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [error1, setError1] = useState(false);
  const [dLoading, setDLoading] = useState(false);

  async function addProduct(product) {
    try {
      setLoading(true);
      const data = await axios.post(`https://63415c0720f1f9d79971537f.mockapi.io/Products`, product);
      products.push(product);
      setLoading(false);
      setError(false);
    }
    catch (e) {
      setError(true);
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    try {
      setDLoading(true);
      const data = await axios.delete(`https://63415c0720f1f9d79971537f.mockapi.io/Products/${id}`);
      setDLoading(false);
      setProducts(products.filter((product) => product.id !== id));
    }
    catch (e) {
      setDLoading(false);
    }
  }

  async function getProducts() {
    try {
      setLoading1(true);
      const data = await axios.get("https://63415c0720f1f9d79971537f.mockapi.io/Products");
      setProducts(data.data);
      setLoading1(false);
      setError1(false);
      console.log(products);
    }
    catch (e) {
      setLoading1(false);
      setError1(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, [])
  return (
    <div>
      <div className="prod_form text-center">
        <h3>Add Product</h3>
        <hr />
        <Formik
          onSubmit={(values) => {
            console.log(values);
            addProduct(values);
          }}
          initialValues={product}
          validate={(values) => {
            const errors = {};
            if (values.ProductName.trim().length < 3) errors.ProductName = "Must be greater than 3";
            if (values.ProductPrice < 1) errors.ProductPrice = "Must be greater than 1";
            return errors;
          }}
        >
          {({values}) => <Form className="form g-3">
            <div className="mb-3">
              <label htmlFor="ProductName" className="form-label">Product Name:</label>
              <Field type="text" name="ProductName" id="ProductName" value={values.ProductName} className="form-control" />
              <ErrorMessage name="ProductName"
                component="span"
                className='text-danger'
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ProductPrice" className="form-label">Product Price:</label>
              <Field type="number" name="ProductPrice" id="ProductPrice" value={values.ProductPrice} className="form-control" />
              <ErrorMessage
                name="ProductPrice"
                component="span"
                className='text-danger'
              />
            </div>
            <div className='mb-3'>
              <button type="submit" className='btn btn-primary' disabled={loading ? true : false}>{loading ? "Please wait" : "Add"}</button>
            </div>
          </Form>}
        </Formik>
      </div>
      <div className='prod_details'>
        {loading1 && <div>Please wait while we fetch your products</div>}
        <h3>Products:</h3>
        {products && product.length !== 0 && products.map((product) => {
          return <>
            <div className="card" style={{ "width": "20rem" }}>
              <div className="card-body">
                <h5 className="card-title">{product.ProductName}</h5>
                <p className="card-text"><b>Price:</b> Rs{product.ProductPrice}.</p>
                <div className='d-flex justify-content-center'>
                  <button className="btn btn-danger" disabled={dLoading ? true : false} onClick={() => deleteProduct(product.id)}>{dLoading ? "Please wait" : "Delete"}</button>
                </div>
              </div>
            </div>
          </>
        })}
      </div>
    </div>
  );
}

export default App;
