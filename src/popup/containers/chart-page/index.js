import url from 'url';
import React, {
  Component,
  PropTypes,
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chart from 'chart.js';
import {
  AppBar,
  IconButton,
} from 'material-ui';
import {
  Card,
  CardTitle,
  CardText,
} from 'material-ui/Card';
import {
  red500,
  indigo500,
  teal500,
  yellow500,
  pink500,
  blue500,
  green500,
  amber500,
  purple500,
  lightBlue500,
  lightGreen500,
  orange500,
  deepPurple500,
  cyan500,
  lime500,
  deepOrange500,
} from 'material-ui/styles/colors';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import * as actions from '../../actions/historyActions';

const colors = [
  red500,
  indigo500,
  teal500,
  yellow500,
  pink500,
  blue500,
  green500,
  amber500,
  purple500,
  lightBlue500,
  lightGreen500,
  orange500,
  deepPurple500,
  cyan500,
  lime500,
  deepOrange500,
];

class ChartPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    history: PropTypes.array.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    const pages = this.props.location.state.pages.map((page) => page._id); // eslint-disable-line no-underscore-dangle

    this.props.actions.fetch(pages);
  }

  componentDidMount() {
    this.container = document.getElementById('chart');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.history) {
      const pages = this.props.location.state.pages;
      const datasets = nextProps.history.map((doc, i) => {
        const page = pages.filter((p) => p._id === doc.page)[0]; // eslint-disable-line no-underscore-dangle

        return {
          lineTension: 0.1,
          pointRadius: 2,
          fill: false,
          showLines: false,
          spanGaps: false,
          borderColor: colors[i],
          label: url.parse(page.url).hostname.split('.')[1],
          data: doc.values
            .map((item) => ({
              y: Number(item.value.match(/\d+(?:\.?\d{0,2})/)[0]),
              x: new Date(item.createdAt),
            })),
        };
      });

      const data = { datasets };
      const options = {
        title: {
          display: true,
          text: 'Price History',
        },
        legend: {
          display: true,
        },
        scales: {
          xAxes: [{
            type: 'time',
            position: 'bottom',
            time: {
              unit: 'week',
              unitStepSize: 5,
              displayFormats: {
                quarter: 'MMM YYYY',
              },
            },
          }],
        },
      };

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.container, {
        type: 'line',
        data,
        options,
      });
    }
  }

  handleClose() {
    this.context.router.push('/');
  }

  render() {
    const model = this.props.location.state;

    return (
      <div>
        <AppBar
          title={<span>HappyWallet</span>}
          titleStyle={{ fontSize: 20 }}
          iconElementLeft={
            <IconButton onTouchTap={this.handleClose} tooltip="Close">
              <NavigationClose />
            </IconButton>
          }
        />
        <Card>
          <CardTitle
            title={model.name}
            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
          />
          <CardText style={{ paddingTop: 0 }}>
            <canvas id="chart" width="315" height="350" />
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  history: state.history,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartPage);
