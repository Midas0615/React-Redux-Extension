import url from 'url';
import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Card,
  CardActions,
  CardTitle,
} from 'material-ui/Card';
import {
  white,
  grey500,
  cyan500,
  yellow50,
  pinkA200,
} from 'material-ui/styles/colors';
import { IconButton } from 'material-ui';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import EditorShowChart from 'material-ui/svg-icons/editor/show-chart';
import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import ContentRemoveCircle from 'material-ui/svg-icons/content/remove-circle';

class Item extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDetail: PropTypes.func.isRequired,
    onShowChart: PropTypes.func.isRequired,
    onPageDelete: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.handleShowChart = this.handleShowChart.bind(this);
    this.handlePageDelete = this.handlePageDelete.bind(this);
  }

  getNumber(value) {
    return Number(value.match(/\d+(?:\.?\d{0,2})/)[0]);
  }

  handleDelete() {
    this.props.onDelete(this.props.model);
  }

  handleDetail() {
    this.props.onDetail(this.props.model);
  }

  handleShowChart() {
    this.props.onShowChart(this.props.model);
  }

  handlePageDelete(pageId) {
    this.props.onPageDelete(this.props.model, pageId);
  }

  renderTitle() {
    const { name } = this.props.model;

    return (
      <div style={{ marginTop: 0, marginBottom: 5 }}>
        {name}
      </div>
    );
  }

  renderSiteName(path, id, index, showDelete) {
    return (
      <div
        style={{
          float: 'left',
          width: 160,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {
          showDelete ?
            <IconButton
              iconStyle={{ color: grey500, height: 18, width: 18 }}
              style={{ height: 30, width: 30, padding: 6, verticalAlign: 'middle' }}
              onTouchTap={() => this.handlePageDelete(id)}
              disabled={index === 0}
            >
              <ContentRemoveCircle />
            </IconButton> : null
        }
        <a
          href={path}
          style={{
            color: cyan500,
            textDecoration: 'none',
            verticalAlign: 'middle',
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.parse(path).hostname.replace('www.', '').split('.')[0]}
        </a>
      </div>
    );
  }

  renderInfo() {
    const { prices, history, pages } = this.props.model;
    const getPrice = (id) => prices.filter((p) => p.page === id)[0];
    const getHistory = (id) => history.filter((p) => p._id === id)[0]; // eslint-disable-line no-underscore-dangle
    const length = pages.length;
    const renderPage = (page, i) => {
      const id = page._id; // eslint-disable-line no-underscore-dangle
      const price = getPrice(id);
      const currentPrice = getHistory(id);
      const hasChanged = currentPrice && currentPrice.value !== price.value;
      const hasReduced = hasChanged &&
        this.getNumber(currentPrice.value) < this.getNumber(price.value);

      return (
        <div key={i} style={{ clear: 'both', height: 30 }}>
          {this.renderSiteName(page.url, id, i, length > 1)}
          <div style={{ float: 'right' }}>
            {
              hasChanged ?
                <div>
                  <span
                    style={{
                      textDecoration: 'line-through',
                      marginRight: 10,
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                  >
                    {price.value}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: pinkA200,
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                  >
                    {currentPrice.value}
                  </span>
                  {
                    hasReduced ? <NavigationArrowDownward
                      style={{
                        color: pinkA200,
                        verticalAlign: 'middle',
                        height: 20,
                        width: 20,
                      }}
                    /> : <NavigationArrowUpward
                      style={{
                        color: grey500,
                        verticalAlign: 'middle',
                        height: 20,
                        width: 20,
                      }}
                    />
                  }
                </div> :
                <span style={{ verticalAlign: 'middle' }}>
                  {price.value}
                </span>
            }
          </div>
        </div>
      );
    };

    return (
      <div style={{ width: '100%', fontSize: 14 }}>
        {pages.map(renderPage)}
      </div>
    );
  }

  render() {
    const { notification } = this.props.model;
    return (
      <Card
        style={{
          backgroundColor: notification ? yellow50 : white,
        }}
      >
        <CardTitle
          title={this.renderTitle()}
          subtitle={this.renderInfo()}
          style={{ paddingBottom: 0 }}
          titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
          subtitleStyle={{ width: '100%' }}
        />
        <CardActions>
          <IconButton
            iconStyle={{ color: pinkA200 }}
            onTouchTap={this.handleShowChart}
            tooltip="View graph"
            tooltipPosition="top-right"
          >
            <EditorShowChart />
          </IconButton>

          <IconButton
            iconStyle={{ color: pinkA200 }}
            onTouchTap={this.handleDetail}
            tooltip="More information"
            tooltipPosition="top-right"
          >
            <ActionInfo />
          </IconButton>

          <IconButton
            onTouchTap={this.handleDelete}
            tooltip="Remove watch"
            tooltipPosition="top-right"
          >
            <ActionDeleteForever />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export default Item;
