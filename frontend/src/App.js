import React, { Component } from 'react'; // use shortcut imrc then tab
import './App.css';
import CustomModal from './components/Model'
import axios from 'axios';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false, // done because this will not stop the modal from being shown always on page load
      viewCompleted: false,
      todoList: [],
      activeItem:{ // for modal
        title: "",
        description: "",
        completed: false
      },
    };
  }

  componentDidMount(){
    this.refreshList();
  }

  refreshList = () => {
    axios
    .get("http://localhost:8000/api/tasks/")
    .then(res => this.setState({ todoList: res.data }))
    .catch(err => console.log(err))
  }
  // Create toggle property
  toggle = () => {
    this.setState({ modal: !this.state.modal })
  };

  handleSubmit = item => {
    this.toggle();
    if (item.id){
      axios
      .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
      .then(res => this.refreshList())
    }
    axios
    .post("http://localhost:8000/api/tasks/", item)
    .then(res => this.refreshList())
  }

  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(res => this.refreshList())
  };

  createItem = () =>{
    const item = { title: "",  description: "", completed: false }
    this.setState({ activeItem: item, modal: !this.state.modal })
  };

  editItem = (item) =>{
    return this.setState({ activeItem: item, modal: !this.state.modal })
  }

  displayCompleted = status => {
    if (status){
       return this.setState({ viewCompleted: true })
    }
    return this.setState({ viewCompleted: false })
  }

  renderTabList = () => {
    return(
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          completed
            </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incompleted
            </span>
      </div>
    )
  }


  //Rendering items in the list based on completed and incompleted
  renderItems = ()=> {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter( item => item.completed == viewCompleted);

    return newItems.map(item => (
      <li key={item.id} className='list-group-item d-flex justify-content-between align-items-center'>
        <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`} title = {item.title}>
          {item.title}
        </span>
        <button onClick={() => this.editItem(item)} className='btn btn-info mr-2'>Edit</button>
        <button onClick={() => this.handleDelete(item)} className='btn btn-danger mr-2'>Delete</button>
      </li>
    ))
  }



  render(){
    return(
      <main className='content p-3 mb-2 bg-info'>
        <h1 className='text-white text-uppercase text-center my-4'> Task Manager</h1>
        <div className='row'>
          <div className='col-md-6 col-sm-10 mx-auto p-0'>
            <div className='card p-3'>
              <div>
                <button onClick={this.createItem} className='btn btn-primary'>Add Task</button>
              </div>
              {this.renderTabList()}
              <ul className='list-group list-group-flush'>
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className='my-3 mb-2 bg-info text-white text-center'>
          Copyright 2021 &copy; All Rights Reserved
        </footer>
        {this.state.modal ? (
          <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ) : null}
      </main>
    )
  }
}

export default App;
