import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import CreateTask from "./components/CreateTask.js";
import UpdateTask from "./components/UpdateTask.js";
import CreateProject from "./components/CreateProject.js";
import UpdateProject from "./components/UpdateProject.js";
import ViewPerProject from "./components/ViewPerProject.js";

class App extends Component {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="viewPerProject" id="tab1">
          <Tab eventKey="createTask" title="Create Task"><CreateTask /></Tab>
          <Tab eventKey="updateTask" title="Update Existing Task"><UpdateTask /></Tab>
          <Tab eventKey="createProject" title="Create Project"><CreateProject /></Tab>
          <Tab eventKey="updateProject" title="Update Existing Project"><UpdateProject /></Tab>
          <Tab eventKey="viewPerProject" title="View Project Schedule"><ViewPerProject /></Tab>
        </Tabs>
      </div>
    );
  }
}

export default App;
