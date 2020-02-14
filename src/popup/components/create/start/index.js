import React, { PropTypes } from 'react';
import {
  Card,
  CardTitle,
  CardText,
} from 'material-ui/Card';
import {
  cyan500,
  pinkA200,
  red500,
} from 'material-ui/styles/colors';
import ActionFindInPage from 'material-ui/svg-icons/action/find-in-page';
import ActionTouchApp from 'material-ui/svg-icons/action/touch-app';
import ActionReportProblem from 'material-ui/svg-icons/action/report-problem';
import {
  IconButton,
  Checkbox,
} from 'material-ui';

const center = {
  marginTop: 15,
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'block',
};
const btn = {
  display: 'inline-block',
  verticalAlign: 'text-bottom',
};
const info = {
  display: 'inline-block',
  width: '80%',
};

const CreateStart = (props) => (
  <Card>
    <CardTitle
      title="Add Watch"
      subtitle="How it works?"
    />
    <CardText>
      <img
        alt="Product page"
        src="./images/product-page.png"
        style={{ width: '100%' }}
      />
      <p>
        This app only works on product page currently.
        So first go to product page you want to watch. like above,
      </p>
      <p>
        There are 3 buttons on next screen.
      </p>
      <div style={{ marginBottom: 20 }}>
        <span style={btn}>
          <IconButton iconStyle={{ color: cyan500 }}>
            <ActionFindInPage />
          </IconButton>
        </span>
        <span style={info}>
          <b>Auto detect</b>, use this button to auto detect price from the page.
        </span>
        <img
          alt="Auto detect"
          src="./images/price-detect.png"
          style={center}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <span style={btn}>
          <IconButton iconStyle={{ color: pinkA200 }}>
            <ActionTouchApp />
          </IconButton>
        </span>
        <span style={info}>
          <b>Manual selection</b>, use this button to manually select price from the page using mouse.
        </span>
        <img
          alt="Manual selection"
          src="./images/price-manual.png"
          style={center}
        />
      </div>

      <div style={{ marginBottom: 50 }}>
        <span style={btn}>
          <IconButton iconStyle={{ color: red500 }}>
            <ActionReportProblem />
          </IconButton>
        </span>
        <span style={info}>
          <b>Report an issue</b>, use this button when autodetect and manual selection doesn't work on the page.
        </span>
      </div>

      <Checkbox
        label="Don't show this again."
        onCheck={props.onCheck}
      />
    </CardText>
  </Card>
);

CreateStart.propTypes = {
  onCheck: PropTypes.func,
};

export default CreateStart;
