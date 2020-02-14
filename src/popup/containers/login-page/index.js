import React, {
  Component,
  PropTypes,
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
  CardTitle,
  CardText,
  CardActions,
} from 'material-ui/Card';
import {
  AppBar,
  RaisedButton,
} from 'material-ui';
import { yellow100 } from 'material-ui/styles/colors';
import * as actions from '../../actions/sessionActions';

class LoginPage extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    session: PropTypes.object,
    error: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.handleGoogleLogin = this.handleLogin.bind(this, 'google');
    this.handleFacebookLogin = this.handleLogin.bind(this, 'facebook');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      if (nextProps.error.statusCode !== 401) {
        this.context.router.push({
          pathname: '/error',
          state: nextProps.error,
        });
      }
    } else if (nextProps.session) {
      this.context.router.push('/');
    }
  }

  handleLogin(network) {
    this.props.actions.login(network);
  }

  render() {
    return (
      <div>
        <AppBar
          title={<span>HappyWallet</span>}
          titleStyle={{ fontSize: 20 }}
          showMenuIconButton={false}
        />
        <Card>
          <CardTitle
            title="Welcome"
            subtitle="Make your own deals"
          />
          <CardText style={{ paddingTop: 0 }}>
            <p>
              HappyWallet help you watch products online and notify on price
              change.
            </p>
            <p>You can sign-in using one of the following.</p>
          </CardText>
          <CardActions style={{ paddingBottom: 10 }}>
            <RaisedButton
              primary
              fullWidth
              label="Google"
              style={{ marginBottom: 10 }}
              onTouchTap={this.handleGoogleLogin}
            />
            <RaisedButton
              secondary
              fullWidth
              label="Facebook"
              style={{ marginBottom: 10 }}
              onTouchTap={this.handleFacebookLogin}
            />
          </CardActions>
          <CardText style={{ paddingTop: 0, paddingBottom: 0 }}>
            <p
              style={{
                backgroundColor: yellow100,
                margin: 0,
                padding: 5,
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              This app use browser cookies to store user preferences.
            </p>
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  session: state.session,
  error: state.error,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
