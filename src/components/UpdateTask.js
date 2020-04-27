import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import React, { Component } from "react";

class UpdateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskId: 0,
      taskName: "",
      description: "",
      duration: 1,
      availableTask: [],
      eligibleTasks: [],
      selectedTasks: [],
      dependencies: [],
    };
  }

  componentDidMount() {
    this.populateTasks();
  }

  populateTasks() {
    let val;
    let url = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/task/all";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          availableTask: json,
        });
        val = this.state.availableTask[0].taskId;
        this.initializeForm(val);
      });
  }

  populateTasksWithVal(val) {
    let url = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/task/all";

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          availableTask: json,
        });
        this.initializeForm(val);
      });
  }

  taskNameHandler(e) {
    this.setState({ taskName: e.target.value });
  }

  descriptionHandler(e) {
    this.setState({ description: e.target.value });
  }

  durationHandler(e) {
    this.setState({ duration: e.target.value });
  }

  dependencyTaskHandler(e) {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);

    this.setState({ selectedTasks: value });

    let dep = [];

    value.forEach((element) => {
      dep.push({ taskId: element });
    });

    this.setState({ dependencies: dep });
  }

  buildDurationOptions() {
    var arr = [];

    for (let i = 1; i <= 30; i++) {
      arr.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return arr;
  }

  initializeForm(val) {
    this.setState({
      taskId: val,
    });

    let url = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/task/id/" + val;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        let dep = [];

        if (json.dependencies) {
          json.dependencies.forEach((element) => {
            dep.push(element.taskId);
          });
        }

        this.setState({
          taskName: json.taskName,
          description: json.description,
          duration: json.duration,
          selectedTasks: dep,
          dependencies: json.dependencies,
        });
      });

    let url1 = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/task/eligible/" + val;

    fetch(url1)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          eligibleTasks: json,
        });
      });
  }

  updateForm(e) {
    let val = e.target.value;
    this.initializeForm(val);
  }

  saveTask() {
    if (!this.state.taskName) {
      alert("Please provide task name!");
      return;
    }

    let url = process.env.REACT_APP_SPRING_BOOT_BASE_PORT + "/rest/task/save";

    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: this.state.taskId,
        taskName: this.state.taskName,
        description: this.state.description,
        duration: this.state.duration,
        dependencies: this.state.dependencies,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Successfully saved task!");
        this.populateTasksWithVal(this.state.taskId);
      })
      .catch(function (e) {
        alert("Error: " + e.message);
      });
  }

  refreshComps() {
    this.populateTasksWithVal(this.state.taskId);
  }

  render() {
    return (
      <div>
        <Container fluid="sm">
          <Row xl={10}>
            <h2>Update Existing Task</h2>
          </Row>
          <Row>
            <Col>
              <Form.Label>Select Task to Update</Form.Label>
            </Col>
            <Col>
              <Form.Control
                as="select"
                onChange={(e) => this.updateForm(e)}
                custom
                size="md"
                value={this.state.taskId}
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
            <Col>
              <Form.Label>Task Name</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Task Name"
                value={this.state.taskName}
                onChange={(e) => this.taskNameHandler(e)}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Task Description</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Description"
                value={this.state.description}
                onChange={(e) => this.descriptionHandler(e)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Duration by Days</Form.Label>
            </Col>
            <Col>
              <Form.Control
                as="select"
                onChange={(e) => this.durationHandler(e)}
                custom
                size="sm"
                value={this.state.duration}
              >
                {this.buildDurationOptions()}
              </Form.Control>
            </Col>
          </Row>
          <Row xl>
            <Col>
              <Form.Label>Select Dependency Tasks</Form.Label>
            </Col>
            <Col>
              <Form.Control
                as="select"
                onChange={(e) => this.dependencyTaskHandler(e)}
                multiple
                custom
                size="lg"
                value={this.state.selectedTasks}
              >
                {this.state.eligibleTasks.map((item) => (
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
              <Button variant="primary" onClick={() => this.saveTask()}>
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

export default UpdateTask;
