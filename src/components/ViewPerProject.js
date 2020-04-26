import "bootstrap/dist/css/bootstrap.min.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Popover } from "react-bootstrap";
import { OverlayTrigger } from "react-bootstrap";

const localizer = momentLocalizer(moment);

function Event({ event }) {
  let popoverClickRootClose = (
    <Popover id="popover-trigger-click-root-close" style={{ zIndex: 10000 }}>
      <p>
        <strong>Information for Task: {event.title}</strong>
      </p>
      <Table striped hover size="sm" responsive>
          <thead>
            <tr>
              <th>Task Type</th>
              <th>Task ID</th>
              <th>Task Name</th>
              <th>Duration in Days</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Dependent Tasks</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{event.task.taskType}</td>
              <td>{event.task.taskId}</td>
              <td>{event.task.taskName}</td>
              <td>{event.task.duration}</td>
              <td>{event.task.startDate}</td>
              <td>{event.task.endDate}</td>
              <td>
                {event.task.dependencies
                  ? event.task.dependencies.map((subItem) => (
                      <p key={subItem.taskId}>
                        {subItem.taskId} - {subItem.taskName} (
                        {subItem.startDate} - {subItem.endDate})
                      </p>
                    ))
                  : "None"}
              </td>
            </tr>
          </tbody>
        </Table>
      
    </Popover>
  );

  
  return (
    <div>
      <div>
        <OverlayTrigger
          id="help"
          trigger="click"
          rootClose
          container={this}
          placement="top"
          overlay={popoverClickRootClose}
        >
          <div>{event.title}</div>
        </OverlayTrigger>
      </div>
    </div>
  );
}

class ViewPerProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: 0,
      projectName: "",
      startDate: "",
      taskViews: [],
      listProjects: [],
      events: [],
    };
  }

  componentDidMount() {
    this.populateProject();
  }

  populateProject() {
    let val;
    let url =
      "http://" +
      process.env.REACT_APP_SPRING_BOOT_BASE_PORT +
      "/rest/project/all/withtasks";
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          listProjects: json,
        });
        val = this.state.listProjects[0].projectId;
        this.initializeTable(val);
      });
  }

  initializeTable(val) {
    this.setState({
      projectId: val,
    });

    let url =
      "http://" +
      process.env.REACT_APP_SPRING_BOOT_BASE_PORT +
      "/rest/scheduler/view/" + val;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          projectName: json.projectName,
          projectDescription: json.projectDescription,
          startDate: json.startDate,
          taskViews: json.taskViews,
        });
        this.createTaskEvents(json.taskViews);
      });
  }

  createTaskEvents(taskViews) {
    this.setState({ events: [] });
    let ts = [];
    if (taskViews) {
      taskViews.forEach((item) => {
        ts.push({
          start: new Date(item.startDate),
          end: new Date(item.endDate),
          title: item.taskId + " - " + item.taskName,
          task: item
        });
      });

      this.setState({ events: ts });
    }
  }

  updateForm(e) {
    let val = e.target.value;
    this.initializeTable(val);
  }

  refreshComps() {

    let url = 'http://' + process.env.REACT_APP_SPRING_BOOT_BASE_PORT + '/rest/project/all/withtasks';

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          listProjects: json,
        });
        this.initializeTable(this.state.projectId);
      });
  }

  render() {
    return (
      <div>
        <Container fluid="sm">
          <Row md={{ span: 2 }}>
            <h2>View Project Schedule</h2>
          </Row>
          <Row>
            <Col md={{ span: 2 }}>
              <Form.Label>Select Project to View</Form.Label>
            </Col>
            <Col md={{ span: 4 }}>
              <Form.Control
                as="select"
                onChange={(e) => this.updateForm(e)}
                custom
                size="sm"
                value={this.state.projectId}
              >
                {this.state.listProjects.map((item) => (
                  <option key={item.projectId} value={item.projectId}>
                    {item.projectId} - {item.projectName}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={{span: 2}}>
              <Button variant="info" onClick={() => this.refreshComps()}>
                Refresh
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 2 }}>
              <Form.Label>Project ID</Form.Label>
            </Col>
            <Col md={{ span: 2 }}>
              <Form.Label>{this.state.projectId}</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 2 }}>
              <Form.Label>Project Name</Form.Label>
            </Col>
            <Col md={{ span: 2 }}>
              <Form.Label>{this.state.projectName}</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 2 }}>
              <Form.Label>Start Date</Form.Label>
            </Col>
            <Col md={{ span: 2 }}>
              <Form.Label>{this.state.startDate}</Form.Label>
            </Col>
          </Row>
          <Row xl={20}>
            <Table striped bordered hover variant="dark" responsive>
              <thead>
                <tr>
                  <th>Task Type</th>
                  <th>Task ID</th>
                  <th>Task Name</th>
                  <th>Duration in Days</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Dependent Tasks</th>
                </tr>
              </thead>

              <tbody>
                {this.state.taskViews.map((item) => (
                  <tr key={item.taskId}>
                    <td>{item.taskType}</td>
                    <td>{item.taskId}</td>
                    <td>{item.taskName}</td>
                    <td>{item.duration}</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>
                      {item.dependencies
                        ? item.dependencies.map((subItem) => (
                            <p key={subItem.taskId}>
                              {subItem.taskId} - {subItem.taskName} (
                              {subItem.startDate} - {subItem.endDate})
                            </p>
                          ))
                        : "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
          <Row xl={100}>
            <Col>
              <p>
                <Calendar
                  localizer={localizer}
                  defaultDate={new Date()}
                  defaultView="month"
                  events={this.state.events}
                  views={["month"]}
                  style={{ height: "50vh" }}
                  components={{
                    event: Event,
                  }}
                />
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="danger">Close</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ViewPerProject;
