import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Card,
  CardTitle,
  CardActions,
  CardText,
} from 'material-ui/Card';
import {
  IconButton,
  TextField,
  Toggle,
} from 'material-ui';
import {
  cyan500,
  pinkA200,
  red500,
} from 'material-ui/styles/colors';
import ActionFindInPage from 'material-ui/svg-icons/action/find-in-page';
import ActionTouchApp from 'material-ui/svg-icons/action/touch-app';
import ActionReportProblem from 'material-ui/svg-icons/action/report-problem';

class CreateForm extends Component {
  static propTypes = {
    data: PropTypes.object,
    onReset: PropTypes.func,
    onChange: PropTypes.func,
    onWatchToggle: PropTypes.func,
    onAutoTouchTap: PropTypes.func,
    onManualTouchTap: PropTypes.func,
    onReportTouchTap: PropTypes.func,
  };

  componentWillUnmount() {
    this.props.onReset();
  }

  render() {
    return (
      <div style={{ margin: 'auto' }}>
        <Card>
          <CardTitle
            title="Add Watch"
            subtitle="
              To add new watch to your list please click on
              'Auto detect' or 'Manual selection' button.
              Input fields will be populated automatically,
              If you want to watch this product on other websites then
              please make sure product name is clear enough
              as it will be used as a keywords for search."
          />
          <CardText>
            <TextField
              id="name"
              hintText="Please enter product name"
              floatingLabelText="Product name"
              fullWidth
              multiLine
              rows={2}
              rowsMax={4}
              value={this.props.data.name}
              onChange={this.props.onChange}
            />
            <TextField
              id="price"
              floatingLabelText="Detected current price"
              fullWidth
              disabled
              value={this.props.data.price}
            />
            <Toggle
              label="Watch other websites for similar product"
              defaultToggled={this.props.data.synced}
              onToggle={this.props.onWatchToggle}
            />
          </CardText>
          <CardActions>
            <IconButton
              iconStyle={{ color: cyan500 }}
              onTouchTap={this.props.onAutoTouchTap}
              tooltip="Auto detect"
              tooltipPosition="top-right"
            >
              <ActionFindInPage />
            </IconButton>

            <IconButton
              iconStyle={{ color: pinkA200 }}
              onTouchTap={this.props.onManualTouchTap}
              tooltip="Manual selection"
              tooltipPosition="top-right"
            >
              <ActionTouchApp />
            </IconButton>

            <IconButton
              iconStyle={{ color: red500 }}
              onTouchTap={this.props.onReportTouchTap}
              tooltip="Report an issue"
              tooltipPosition="top-right"
            >
              <ActionReportProblem />
            </IconButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default CreateForm;
