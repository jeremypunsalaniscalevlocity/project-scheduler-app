import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import React, { Component } from "react";
import DatePicker from "react-date-picker";


class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      projectDescription: "",
      startDate: new Date(),
      availableTask: [],
      taskViews: [],
    };
  }

  componentDidMount() {
    this.populateTask();
  }

  populateTask() {
    let url = "http://" + process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/task/all";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          availableTask: json,
        });
      });
  }

  projectNameHandler(e) {
    this.setState({ projectName: e.target.value });
  }

  projectDescriptionHandler(e) {
    this.setState({ projectDescription: e.target.value });
  }

  onChange = (date) => {
    this.setState({ startDate: date });
  };

  dependencyTaskHandler(e) {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);

    let dep = [];

    value.forEach((element) => {
      dep.push({ taskId: element });
    });

    this.setState({ taskViews: dep });
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

    let url = "http://" + process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/project/save";
    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName: this.state.projectName,
        projectDescription: this.state.projectDescription,
        startDate: this.state.startDate,
        taskViews: this.state.taskViews,
      }),
    })
      .then((res) => res.json())
      .then(() => alert("Successfully saved project!"))
      .catch(function (e) {
        alert("Error: " + e.message);
      });

    this.setState({
      projectName: "",
      projectDescription: "",
      startDate: new Date(),
      availableTask: [],
    });

    this.populateTask();
  }

  refreshComps() {
    this.populateTask();
  }

  render() {
    return (
      <div>
        <Container fluid="sm">
          <Row xl={10}>
            <h2>Create a new Project</h2>
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

export default CreateProject;
