import React, { Component } from "react";
import PropTypes from "prop-types";

export class SendFriendRequest extends Component {
  state = {
    title: "",
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.sendFriendRequest(this.state.title);
    this.setState({ title: "" });
  };
  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <form onSubmit={this.onSubmit} style={{ display: "flex" }}>
        <input
          type='text'
          name='title'
          placeholder='Enter Email of user'
          style={{ flex: 10, padding: "5px" }}
          value={this.state.title}
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
// PropTypes
SendFriendRequest.propTypes = {
  sendFriendRequest: PropTypes.func.isRequired,
};
export default SendFriendRequest;
