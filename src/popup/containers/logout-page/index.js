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
  IconButton,
  RaisedButton,
} from 'material-ui';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import { red300 } from 'material-ui/styles/colors';
import * as actions from '../../actions/sessionActions';

const iconStyle = {
  height: 120,
  width: 120,
  marginTop: 15,
  marginBottom: 15,
};

class LogoutPage extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    session: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    if (!this.props.session) {
      this.context.router.push('/login');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.session) {
      this.context.router.push('/login');
    }
  }

  handleClose() {
    this.context.router.push('/');
  }

  handleLogout() {
    this.props.actions.logout();
  }

  render() {
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
            title="Bye!"
            subtitle="Are you sure, you want to logout?"
          />
          <CardText style={{ textAlign: 'center' }}>
            <ActionExitToApp style={iconStyle} color={red300} />
          </CardText>
          <CardActions>
            <RaisedButton
              secondary
              fullWidth
              label="Logout"
              style={{ marginBottom: 10 }}
              onTouchTap={this.handleLogout}
            />
          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  session: state.session,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);
