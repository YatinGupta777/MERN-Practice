import React, { Component } from "react";
import PropTypes from "prop-types";

export class TodoItem extends Component {
  getStyle = () => {
    return {
      background: "#f4f4f4",
      padding: "10px",
      borderBottom: "1px #ccc dotted",
      textDecoration: this.props.todo.completed ? "line-through" : "none",
    };
  };

  render() {
    const { id, name, email } = this.props.todo;
    return (
      <div style={this.getStyle()}>
        <p>Name : {name}</p>
        <p>Email : {email}</p>
        <button
          onClick={this.props.acceptFriendRequest.bind(this, email)}
          style={btnStyle}
        >
          Accept Request
        </button>
      </div>
    );
  }
}
//       <button onClick={this.props.delTodo.bind(this, id)} style={btnStyle}>
//x
//</button>
// // PropTypes
// TodoItem.propTypes = {
//   todo: PropTypes.object.isRequired,
//   markComplete: PropTypes.func.isRequired,
//   delTodo: PropTypes.func.isRequired,
// };
const btnStyle = {
  background: "#ff0000",
  color: "white",
  border: "none",
  padding: "5px 8px",
  borderRadius: "50%",
  cursor: "pointer",
  float: "right",
};
// const itemStyle = {
//   backgroundColor: "#f4f4f4",
// };

export default TodoItem;
