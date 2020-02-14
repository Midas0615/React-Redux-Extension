import url from 'url';
import React, {
  Component,
  PropTypes,
} from 'react';
import {
  AppBar,
  IconButton,
} from 'material-ui';
import {
  grey500,
  cyan500,
  pinkA200,
} from 'material-ui/styles/colors';
import {
  Card,
  CardTitle,
  CardHeader,
  CardText,
  CardActions,
} from 'material-ui/Card';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import EditorShowChart from 'material-ui/svg-icons/editor/show-chart';
import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';

const oldPriceStyle = {
  textDecoration: 'line-through',
  marginRight: 10,
  display: 'inline-block',
};

const currentPriceStyle = {
  fontWeight: 600,
  color: pinkA200,
  display: 'inline-block',
};

const priceUpStyle = {
  color: grey500,
  verticalAlign: 'middle',
  height: 20,
  width: 20,
};

const priceDownStyle = {
  color: pinkA200,
  verticalAlign: 'middle',
  height: 20,
  width: 20,
};


class DetailPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.renderPage = this.renderPage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShowChart = this.handleShowChart.bind(this);
  }

  getFormattedDate(value) {
    const date = new Date(value);

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  getNumber(value) {
    return Number(value.match(/\d+(?:\.?\d{0,2})/)[0]);
  }

  handleClose() {
    this.context.router.push('/');
  }

  handleShowChart() {
    this.context.router.push({
      pathname: '/chart',
      state: this.props.location.state,
    });
  }

  renderPrice(id) {
    const { prices, history } = this.props.location.state;
    const price = prices.filter((p) => p.page === id)[0];
    const currentPrice = history.filter((p) => p._id === id)[0]; // eslint-disable-line no-underscore-dangle
    const hasChanged = currentPrice && currentPrice.value !== price.value;
    const hasReduced = hasChanged &&
      this.getNumber(currentPrice.value) < this.getNumber(price.value);

    return (
      <div>
        {
          hasChanged ?
            <div>
              <span style={oldPriceStyle}>{price.value}</span>
              <span style={currentPriceStyle}>{currentPrice.value}</span>
              {
                hasReduced ?
                  <NavigationArrowDownward style={priceDownStyle} /> :
                  <NavigationArrowUpward style={priceUpStyle} />
              }
            </div> : <span>{price.value}</span>
        }
      </div>
    );
  }

  renderPage(page, index) {
    const id = page._id; // eslint-disable-line no-underscore-dangle
    const keywords = page.keywords ?
      page.keywords
          .split(',')
          .map((keyword, i) => (
            <li key={i} style={{ paddingTop: 5, paddingButtom: 5 }}>
              {keyword}
            </li>
          )) : null;

    return (
      <Card key={index}>
        <CardHeader
          title={
            <span style={{ color: cyan500 }}>
              {url.parse(page.url).hostname}
            </span>
          }
          subtitle={this.renderPrice(id)}
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          <a
            href={page.url}
            style={{
              color: pinkA200,
              fontSize: 14,
              paddingBottom: 10,
              textDecoration: 'none',
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {page.title}
          </a>

          {
            page.image ?
              <div style={{ padding: 20, textAlign: 'center' }}>
                <img alt={page.title} src={page.image} style={{ width: '100%' }} />
              </div> : null
          }

          { page.description ? <p>{page.description}</p> : null }

          {
            keywords ?
              <div>
                <b>Keywords: </b>
                <ol style={{ paddingLeft: 15, fontSize: 12 }}>
                  {keywords}
                </ol>
              </div> : null
          }
        </CardText>
      </Card>
    );
  }

  renderPages(model) {
    return (
      <div style={{ width: '100%', fontSize: 14 }}>
        {model.pages.map(this.renderPage)}
      </div>
    );
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
          <CardTitle title={model.name} />
          {this.renderPages(model)}
          <CardActions>
            <IconButton
              iconStyle={{ color: pinkA200 }}
              onTouchTap={this.handleShowChart}
              tooltip="View graph"
              tooltipPosition="top-right"
            >
              <EditorShowChart />
            </IconButton>

            <CardText style={{ float: 'right', fontSize: 12 }}>
              <b>Created: </b>
              <span>{this.getFormattedDate(model.createdAt)}</span>
            </CardText>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default DetailPage;
