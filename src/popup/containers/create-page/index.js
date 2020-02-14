import url from 'url';
import React, {
  Component,
  PropTypes,
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  AppBar,
  Snackbar,
  IconButton,
  FlatButton,
} from 'material-ui';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ContentSave from 'material-ui/svg-icons/content/save';
import cookies from 'js-cookie';
import transport from '../../../common/transport';
import logger from '../../../common/logger';
import actions from '../../actions';

class CreatePage extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    page: PropTypes.array,
    error: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      name: this.props.form.metaTags ? this.props.form.metaTags.title : '',
      price: this.props.form.content,
      synced: false,
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleAutoDetect = this.handleAutoDetect.bind(this);
    this.handleManualSelection = this.handleManualSelection.bind(this);
    this.handleReport = this.handleReport.bind(this);
  }

  componentWillMount() {
    transport
      .post('/browser/page/url')
      .then((path) => {
        this.props.actions.page.fetch({ url: url.parse(path).hostname });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.form).length > 0) {
      const state = { price: nextProps.form.content };

      if (!this.state.name) {
        state.name = nextProps.form.metaTags ?
          nextProps.form.metaTags.title : '';
      }

      this.setState(state);
    }
  }

  handleClose() {
    this.context.router.push('/');
  }

  handleNext() {
    this.context.router.push('/create/form');
  }

  handleCheck(e) {
    cookies.set('skipInfoStep', e.target.checked);
  }

  handleSave() {
    this.props.actions.item
        .create(Object.assign({
          name: this.state.name,
          synced: this.state.synced,
        }, this.props.form))
        .then(() => {
          if (!this.props.error) {
            this.props.actions.form.reset();
            this.context.router.push({
              pathname: '/',
              state: { notification: 'Added successfully' },
            });
          }
        });
  }

  handleReset() {
    this.props.actions.form.reset();
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleToggle(event, isChecked) {
    this.setState({ synced: isChecked });
  }

  handleAutoDetect() {
    this.props.actions.form
        .detect(this.props.page)
        .catch(() => {
          this.context.router.push({
            pathname: '/create/form',
            state: { notification: 'Failed to Autodetect, use manual selector' },
          });
        });
  }

  handleManualSelection() {
    transport
      .post('/browser/page/manual')
      .then((status) => {
        logger.log('/browser/page/manual', status);
        window.close();
      })
      .catch((error) => logger.log('/browser/page/manual', error));
  }

  handleReport() {
    transport
      .post('/browser/page/url')
      .then((path) => {
        transport
          .post('/api/report', { url: path })
          .then(() => {
            this.context.router.push({
              pathname: '/',
              state: {
                notification: 'Thanks for reporting issue, we will look into it.',
              },
            });
          });
      });
  }

  renderChildren(pathname) {
    switch (pathname) {
      case '/create':
        return React.cloneElement(this.props.children, {
          onCheck: this.handleCheck,
        });
      case '/create/form':
        return React.cloneElement(this.props.children, {
          data: this.state,
          onReset: this.handleReset,
          onChange: this.handleChange,
          onWatchToggle: this.handleToggle,
          onAutoTouchTap: this.handleAutoDetect,
          onManualTouchTap: this.handleManualSelection,
          onReportTouchTap: this.handleReport,
        });
      default:
        return null;
    }
  }

  renderSnackBar() {
    const { state } = this.props.location;
    let message;

    if (state && state.notification) {
      message = state.notification;
    }

    if (this.props.error) {
      message = this.props.error.name;
    }

    if (message) {
      return (
        <Snackbar
          open
          message={message}
          autoHideDuration={2000}
        />
      );
    }

    return null;
  }

  render() {
    const pathname = this.props.location.pathname;

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
          iconElementRight={
            (pathname === '/create') ?
              <FlatButton
                label="Next"
                labelPosition="before"
                icon={<NavigationChevronRight />}
                onTouchTap={this.handleNext}
              /> :
                <IconButton
                  tooltip="Save"
                  disabled={!this.state.name || !this.props.form.selector}
                  onTouchTap={this.handleSave}
                >
                  <ContentSave />
                </IconButton>
          }
        />
        {this.renderChildren(pathname)}
        {this.renderSnackBar()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  session: state.session,
  form: state.form,
  page: state.page,
  error: state.error,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    item: bindActionCreators(actions.item, dispatch),
    form: bindActionCreators(actions.form, dispatch),
    page: bindActionCreators(actions.page, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePage);
