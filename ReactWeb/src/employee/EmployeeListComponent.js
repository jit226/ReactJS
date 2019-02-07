import React from "react";
import { users } from "../data.service";

class EmployeeListComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = { users: null };

  }
  componentDidMount() {
    fetch('http://localhost:60332/api/employees')
      .then(response => response.json())
      .then(data => this.setState({ users: data }));
  }


  editRow = (user) => {
    this.props.history.push({
      pathname: '/employee',
      state: {
        user: user,
      }
    });

  }
  deleteUser = (id) => {
    //sample
    let header = {
      'Content-Type': 'application/json'
    };
    let url = "http://localhost:60332/api/employees";
    let body = {
      "id": 0,
      "name": "pinky",
      "username": "pinku"
    };

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: header
    });

    alert(id);
  }
  addUser = () => {
    this.props.history.push({
      pathname: '/employee',
      state: {
        user: { id: 0, name: '', username: '' },
      }
    });
  }
  render() {
    const users = this.state.users;
    console.log(users);
    return (
      <div>
        <button onClick={() => this.addUser()} className="button muted-button">Add New User</button>
        <hr />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              users != null && users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.userName}</td>
                    <td>
                      <button
                        onClick={() => {
                          this.editRow(user)
                        }}
                        className="button muted-button"
                      >
                        Edit
              </button>
                      <button
                        onClick={() => this.deleteUser(user.id)}
                        className="button muted-button"
                      >
                        Delete
              </button>
                    </td>
                  </tr>
                ))
              ) : (
                  <tr>
                    <td colSpan={3}>No users</td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default EmployeeListComponent;
