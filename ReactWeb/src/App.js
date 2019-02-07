import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import EmployeeListComponent from './employee/EmployeeListComponent';
import EmployeeComponent from './employee/EmployeeComponent';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/employees">Employees</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={Home} />
          <Route path="/employees" component={EmployeeListComponent} />
          <Route path="/employee" component={EmployeeComponent} />
          
        </div>
      </Router>
    );
  }
}

export default App;

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About Us</h2>
  </div>
);
const Contact = () => (
  <div>
    <h2>Contact Us</h2>
  </div>
);

