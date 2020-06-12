import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export class Registration extends Component {
  state = {
    name: "",
    email: "",
    password: "",
  };

  sendRegistration = (name, email, password) => {
    axios({
      method: "post",
      url: "http://localhost:5000/api/users",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
    this.setState({ name: "", email: "", password: "" });
    //.then(res => this.setState({ todos: [...this.state.todos, res.data] }));
  };

  onSubmit = e => {
    e.preventDefault();
    this.sendRegistration(
      this.state.name,
      this.state.email,
      this.state.password
    );
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <form onSubmit={this.onSubmit} style={{ display: "flex" }}>
        <input
          type='text'
          name='name'
          placeholder='Enter name of user'
          style={{ flex: 10, padding: "5px" }}
          value={this.state.name}
          onChange={this.onChange}
        />
        <input
          type='text'
          name='email'
          placeholder='Enter Email of user'
          style={{ flex: 10, padding: "5px" }}
          value={this.state.email}
          onChange={this.onChange}
        />
        <input
          type='text'
          name='password'
          placeholder='Enter Password'
          style={{ flex: 10, padding: "5px" }}
          value={this.state.password}
          onChange={this.onChange}
        />
        <input
          type='submit'
          value='Submit'
          className='btn'
          style={{ flex: 1 }}
        />
      </form>
    );
  }
}

export default Registration;
