API:
----
controller
----------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ApiProject.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace ApiProject.Controllers
{
    [Route("api/[controller]")]
    //[DisableCors]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        

        private readonly ApiProjectContext _context;

        public EmployeesController(ApiProjectContext context)
        {
            _context = context;

            //if (_context.TodoItems.Count() == 0)
            //{
            //    // Create a new TodoItem if collection is empty,
            //    // which means you can't delete all TodoItems.
            //    _context.TodoItems.Add(new TodoItem { Name = "Item1" });
            //    _context.SaveChanges();
            //}
        }

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<Employee>> Get()
        {
            return _context.Employees;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<Employee> Get(int id)
        {
            Employee employee = _context.Employees.Find(id);
            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        
        [HttpPost]
        public void Post([FromBody] Employee employee)
        {
            if (ModelState.IsValid)
            {
                _context.Employees.Add(employee);
                _context.SaveChanges();
            }
        }
        
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] Employee employee)
        {
            if (ModelState.IsValid)
            {
                if (id == employee.Id)
                {
                    _context.Entry(employee).State = EntityState.Modified;
                }
            }
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                
            }    
        }
        
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Employee employee = _context.Employees.Find(id);
            if (employee != null)
            {
                _context.Employees.Remove(employee);
                _context.SaveChanges();
            }
        }

    }
}
--------------------
--------
dbcontext
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiProject.Models
{
    public class ApiProjectContext : DbContext
    {
        public ApiProjectContext(DbContextOptions<ApiProjectContext> options)
            : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
    }
}
--------------
employee
---------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiProject.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }

    }
}
-----------
startup
---------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ApiProject.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiProject
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            var connection = @"Server=DESKTOP-COFJOVQ;Database=SampleDb;User Id=saPassword=asd;Trusted_Connection=True;ConnectRetryCount=0";
            services.AddDbContext<ApiProjectContext>(options => options.UseSqlServer(connection));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseCors(builder =>
            builder.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod());

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
-------------------------------------
react js
-----------
app.js
-------
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

-------------
employee
--------
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
-----------------
employeelist
------------
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
--------------------
