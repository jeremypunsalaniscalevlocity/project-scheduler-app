import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import React, { Component } from "react";
import DatePicker from "react-date-picker";

class UpdateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: 0,
      projectName: "",
      projectDescription: "",
      startDate: new Date(),
      taskViews: [],
      availableTask: [],
      selectedTasks: [],
      listProjects: [],
    };
  }

  componentDidMount() {
    this.populateTasks();
    this.populateProject();
  }

  projectNameHandler(e) {
    this.setState({ projectName: e.target.value });
  }

  projectDescriptionHandler(e) {
    this.setState({ projectDescription: e.target.value });
  }

  onChange = (date) => this.setState({ startDate: date });

  dependencyTaskHandler(e) {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);

    this.setState({ selectedTasks: value });

    let dep = [];

    value.forEach((element) => {
      dep.push({ taskId: element });
    });

    this.setState({ taskViews: dep });
  }

  updateForm(e) {
    let val = e.target.value;
    this.initializeForm(val);
  }

  initializeForm(val) {
    this.setState({
      projectId: val,
    });

    let url = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/project/id/" +
      val;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        let dep = [];

        if (json.taskViews) {
          json.taskViews.forEach((element) => {
            dep.push(element.taskId);
          });
        }

        this.setState({
          projectName: json.projectName,
          projectDescription: json.projectDescription,
          startDate: new Date(json.startDate),
          selectedTasks: dep,
          taskViews: json.taskViews,
        });
      });
  }

  populateProject() {
    let val;
    let url = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/project/all";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          listProjects: json,
        });
        val = this.state.listProjects[0].projectId;
        this.initializeForm(val);
      });
  }

  populateProjectWithVal(val) {
    let url = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/project/all";

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          listProjects: json,
        });
        this.initializeForm(val);
      });
  }

  populateTasks() {
    let url = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/task/all";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          availableTask: json,
        });
      });
  }

  saveProject() {
    if (!this.state.projectName) {
      alert("Please provide project name!");
      return;
    }

    if (!this.state.startDate) {
      alert("Please provide start date!");
      return;
    }

    if (!this.state.taskViews || this.state.taskViews.length === 0) {
      alert("Please select at least 1 task!");
      return;
    }

    let url = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/project/save";
    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: this.state.projectId,
        projectName: this.state.projectName,
        projectDescription: this.state.projectDescription,
        startDate: this.state.startDate,
        taskViews: this.state.taskViews,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Successfully saved project!");
        this.populateTasks();
        this.populateProjectWithVal(this.state.projectId);
      })
      .catch(function (e) {
        alert("Error: " + e.message);
      });
  }

  refreshComps() {
    this.populateTasks();
    this.populateProjectWithVal(this.state.projectId);
  }

  render() {
    return (
      <div>
        <Container fluid="sm">
          <Row xl={10}>
            <h2>Update Existing Project</h2>
          </Row>
          <Row>
            <Col>
              <Form.Label>Select Project to Update</Form.Label>
            </Col>
            <Col>
              <Form.Control
                as="select"
                onChange={(e) => this.updateForm(e)}
                custom
                size="md"
                value={this.state.projectId}
              >
                {this.state.listProjects.map((item) => (
                  <option key={item.projectId} value={item.projectId}>
                    {item.projectId} - {item.projectName}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Project name</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Project name"
                value={this.state.projectName}
                onChange={(e) => this.projectNameHandler(e)}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Project Description</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Project Description"
                value={this.state.projectDescription}
                onChange={(e) => this.projectDescriptionHandler(e)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Start Date</Form.Label>
            </Col>
            <Col>
              <DatePicker
                onChange={this.onChange}
                value={this.state.startDate}
                format="y-MM-dd"
                required
              ></DatePicker>
            </Col>
          </Row>
          <Row xl>
            <Col>
              <Form.Label>Select Tasks</Form.Label>
            </Col>
            <Col>
              <Form.Control
                as="select"
                onChange={(e) => this.dependencyTaskHandler(e)}
                multiple
                custom
                size="lg"
                value={this.state.selectedTasks}
                required
              >
                {this.state.availableTask.map((item) => (
                  <option key={item.taskId} value={item.taskId}>
                    {item.taskId} - {item.taskName}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col> </Col>
          </Row>
          <Row>
            <Col> </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" onClick={() => this.saveProject()}>
                Save
              </Button>{" "}
              <Button variant="info" onClick={() => this.refreshComps()}>
                Refresh Components
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default UpdateProject;
