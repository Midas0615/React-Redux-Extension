import React, {
  Component,
  PropTypes,
} from 'react';
import { connect } from 'react-redux';
import {
  AppBar,
  IconButton,
} from 'material-ui';
import {
  Card,
  CardTitle,
  CardText,
} from 'material-ui/Card';
import { red300 } from 'material-ui/styles/colors';
import AlertError from 'material-ui/svg-icons/alert/error';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const iconStyle = {
  height: 120,
  width: 120,
  marginTop: 15,
  marginBottom: 15,
};

class ErrorPage extends Component {
  static propTypes = {
    location: PropTypes.object,
    error: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.context.router.push('/');
  }

  render() {
    const error = this.props.error || this.props.location.state;

    if (!error) {
      return null;
    }

    const { statusCode } = error;
    let { name, message } = error;

    if (statusCode === 0) {
      name = 'Security certificate issue';
      message = 'Please click on the link below to continue';
    }

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
          <CardTitle title={name} subtitle={message} />
          <CardText style={{ textAlign: 'center' }}>
            <AlertError style={iconStyle} color={red300} />
            {
              statusCode === 0 ?
                <div>
                  <a
                    href={`${process.env.API_URL}/api/health-check`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Continue
                  </a>
                </div> : null
            }
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
});

export default connect(mapStateToProps)(ErrorPage);
