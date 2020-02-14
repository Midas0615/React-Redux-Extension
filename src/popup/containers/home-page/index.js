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
  FloatingActionButton,
} from 'material-ui';
import {
  Card,
  CardTitle,
  CardText,
} from 'material-ui/Card';
import { cyan200 } from 'material-ui/styles/colors';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import cookies from 'js-cookie';
import Item from '../../components/item';
import * as actions from '../../actions/itemActions';

const style = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
};

const iconStyle = {
  height: 120,
  width: 120,
  marginTop: 15,
  marginBottom: 15,
};

class HomePage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    session: PropTypes.object,
    error: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.handleCreate = this.handleCreate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleShowChart = this.handleShowChart.bind(this);
    this.handlePageDelete = this.handlePageDelete.bind(this);
  }

  componentWillMount() {
    if (!this.props.session) {
      this.context.router.push('/login');
    } else {
      this.props.actions.fetch();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      if (nextProps.error.statusCode === 401) {
        this.context.router.push('/login');
      } else {
        this.context.router.push({
          pathname: '/error',
          state: nextProps.error,
        });
      }
    } else if (!nextProps.session) {
      this.context.router.push('/login');
    } else if (Object.keys(nextProps.form).length > 0) {
      this.context.router.push('/create/form');
    }
  }

  handleCreate() {
    const skip = cookies.get('skipInfoStep');
    if (skip) {
      this.context.router.push('/create/form');
    } else {
      this.context.router.push('/create');
    }
  }

  handleDelete(item) {
    this.props.actions
        .remove(item._id) // eslint-disable-line no-underscore-dangle
        .then(() => {
          this.context.router.push({
            pathname: '/',
            state: { notification: 'Deleted successfully' },
          });
        })
        .catch(() => {
          this.context.router.push({
            pathname: '/',
            state: { notification: 'Failed to delete' },
          });
        });
  }

  handleDetail(item) {
    this.context.router.push({
      pathname: '/detail',
      state: item,
    });
  }

  handleShowChart(item) {
    this.context.router.push({
      pathname: '/chart',
      state: item,
    });
  }

  handlePageDelete(item, pageId) {
    this.props.actions
        .removePage(item._id, pageId) // eslint-disable-line no-underscore-dangle
        .then(() => {
          this.context.router.push({
            pathname: '/',
            state: { notification: 'Deleted successfully' },
          });
        })
        .catch(() => {
          this.context.router.push({
            pathname: '/',
            state: { notification: 'Failed to delete' },
          });
        });
  }

  handleLogout() {
    this.context.router.push('/logout');
  }

  renderEmpty(items) {
    if (items.length > 0) {
      return null;
    }

    return (
      <Card>
        <CardTitle
          title="Welcome to HappyWallet"
          subtitle="Create your first watch"
        />
        <CardText
          style={{
            textAlign: 'center',
            paddingTop: 0,
            paddingBottom: 40,
          }}
        >
          <FileCreateNewFolder style={iconStyle} color={cyan200} />
        </CardText>
      </Card>
    );
  }

  renderSnackBar() {
    const { state } = this.props.location;

    if (state && state.notification) {
      return (
        <Snackbar
          open
          message={state.notification}
          autoHideDuration={4000}
        />
      );
    }

    return null;
  }

  renderButton() {
    if (this.props.session && this.props.items &&
      this.props.items.length < this.props.session.subscription
    ) {
      return (
        <FloatingActionButton
          style={style}
          secondary
          mini
          onTouchTap={this.handleCreate}
          title="Add new watch"
        >
          <ContentAdd />
        </FloatingActionButton>
      );
    }

    return null;
  }

  render() {
    const { items } = this.props;

    return (
      <div>
        <AppBar
          title={<span>HappyWallet</span>}
          titleStyle={{ fontSize: 20 }}
          showMenuIconButton={false}
          iconElementRight={
            <IconButton onTouchTap={this.handleLogout} tooltip="Logout">
              <ActionExitToApp />
            </IconButton>
          }
        />

        { items.map((item, i) => (
          <Item
            key={i}
            model={item}
            onDelete={this.handleDelete}
            onDetail={this.handleDetail}
            onShowChart={this.handleShowChart}
            onPageDelete={this.handlePageDelete}
          />
        )) }

        {this.renderEmpty(items)}
        {this.renderButton()}
        {this.renderSnackBar()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  items: state.items,
  form: state.form,
  session: state.session,
  error: state.error,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
