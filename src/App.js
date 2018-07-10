import React, { Component } from 'react';
import { fetchLcboEndpoint } from './api/lcbo.js';
import GMaps from './GMaps';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchQuery: '',
      error: {},
      message: '',
      productName: '',
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      message: '',
    });
    if (this.state.searchQuery.length > 0) {
      fetchLcboEndpoint('products', {
        q: this.state.searchQuery,
      })
        .then(data => {
          const result = data.result.length > 0 && data.result[0];
          if (result) {
            this.setState({ productName: result.name });
            fetchLcboEndpoint('stores', {
              product_id: result.product_no,
            })
              .then(d => {
                const plots = d.result;
                if (plots.length > 0) {
                  this.setState({ data: plots });
                } else {
                  this.setState({
                    message: 'No stores found with that product',
                  });
                }
              })
              .catch(err => {
                this.setState({
                  err: `Something went wrong: ${err.message}`,
                  data: [],
                });
              });
          } else {
            this.setState({
              message: 'No matching product found',
              data: [],
            });
          }
        })
        .catch(err => {
          this.setState({ err: `Something went wrong: ${err.message}` });
        });
    }
  };

  transformLocationData = locationData => {
    return locationData.map(data => {
      return {
        id: data.id,
        name: data.name,
        postal_code: data.postal_code,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    });
  };

  render() {
    const transformedLocationData = this.transformLocationData(this.state.data);
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          Enter a search query:<input
            type="text"
            name="searchQuery"
            onChange={this.handleChange}
          />
          <input type="submit" name="submit" />
        </form>
        <div>
          <b>Product</b>: {this.state.productName}
        </div>
        <GMaps locationData={transformedLocationData} />
        {this.state.err && <div>Error:{this.state.err}</div>}
        {this.state.message && <div>Message: {this.state.message}</div>}
      </div>
    );
  }
}

export default App;
