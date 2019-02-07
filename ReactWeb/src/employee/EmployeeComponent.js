import React from "react";

class EmployeeComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.location.state.user
        };
    }

    handleInputChange = event => {
        const { name, value } = event.target
        let tempUser = this.state.user;

        if (name == 'name') {
            tempUser.name = value;

        }
        else if (name == 'userName') {
            tempUser.userName = value;
        }
        this.setState({ user: tempUser });

    }
    onSubmitUser = (event) => {
        event.preventDefault()
        const user = this.state.user;
        let header = {
            'Content-Type': 'application/json'
        };
        
        
        if (user.id == 0) {
            let url = "http://localhost:60332/api/employees";
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(user),
                headers: header
            }).then(function () {
                alert("Successfully saved");
            })
        }
        else {
            let url = "http://localhost:60332/api/employees/"+user.id;
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify(user),
                headers: header
            }).then(function () {
                alert("Successfully Updated");
                
            })
        }
        this.props.history.push("/employees");        
    }
    render() {
        const user = this.state.user;
        return (

            <form onSubmit={(event) => this.onSubmitUser(event)}>
                <label>Name</label>
                <input type="text" name="name" value={user.name} onChange={this.handleInputChange} required />
                <label>Username</label>
                <input type="text" name="userName" value={user.userName} onChange={this.handleInputChange} />
                <button>Update user</button>
                <button onClick={() => this.props.history.push("employees")} className="button muted-button">
                    Cancel
            </button>
            </form >

        );
    }
}

export default EmployeeComponent;
