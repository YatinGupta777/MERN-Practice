import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Todos from "./components/Todos";
import AddTodo from "./components/AddTodo";
import About from "./components/pages/About";
//import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const clientToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWVlMzE4YzcxYzZmMDVlNjZhNWU1MzExIn0sImlhdCI6MTU5MTk0MTMyMCwiZXhwIjoxNTkxOTc3MzIwfQ.laL2tcflcpgpp5R3IGQTe6AzLeunK2syXSiEJtIafsw";
const clientToken2 =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWVlMzE4ZTRjY2I3NTZlNjc4ZDVhZTUxIn0sImlhdCI6MTU5MTk0MTM0OSwiZXhwIjoxNTkxOTc3MzQ5fQ.dLJWeNAVjujuVuFpvrdnnOMQCwxQZaXxu3PQJdqQQQk";
class App extends Component {
  state = {
    todos: [],
  };

  // show friend requests
  componentDidMount() {
    axios
      .get("http://localhost:5000/api/profile/friendRequests", {
        headers: {
          "X-Auth-Token": clientToken2,
        },
      })
      .then(res => this.setState({ todos: res.data }));
  }

  // send friend requests
  addTodo = e => {
    axios({
      method: "post",
      url: "http://localhost:5000/api/profile/sendFriendRequest",
      headers: {
        "X-Auth-Token": clientToken2,
        "Content-Type": "application/json",
      },
      data: {
        email: e,
      },
    }); //.then(res => this.setState({ todos: [...this.state.todos, res.data] }));
  };

  // accept friend request
  acceptFriendRequest = e => {
    console.log(e);
    axios({
      method: "post",
      url: "http://localhost:5000/api/profile/acceptFriendRequest",
      headers: {
        "X-Auth-Token": clientToken2,
        "Content-Type": "application/json",
      },
      data: {
        email: e,
      },
    }).then(window.location.reload());
  };

  // // Toggle Todo
  // markComplete = id => {
  //   this.setState({
  //     todos: this.state.todos.map(todo => {
  //       if (todo.id === id) {
  //         todo.completed = !todo.completed;
  //       }
  //       return todo;
  //     }),
  //   });
  // };

  // // Delete Todo

  // delTodo = id => {
  //   axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`).then(res =>
  //     this.setState({
  //       todos: [...this.state.todos.filter(todo => todo.id !== id)],
  //     })
  //   );
  // };

  render() {
    return (
      <Router>
        <div className='App'>
          <div className='container'>
            <Header />
            <Route
              exact
              path='/'
              render={props => (
                <React.Fragment>
                  <AddTodo addTodo={this.addTodo} />
                  <Todos
                    todos={this.state.todos}
                    acceptFriendRequest={this.acceptFriendRequest}
                  />
                </React.Fragment>
              )}
            />
            <Route path='/about' component={About} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
