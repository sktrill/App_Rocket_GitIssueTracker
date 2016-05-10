// primary app component
var App = React.createClass({
  render: function() {
    return (
      <div>
        <Header/>
        <Breadcrumb/>
        <IssuesBox route={this.props.route} urlOrig={"https://api.github.com/repos/npm/npm/issues"}/>
      </div>
    );
  }
});

// header component for the project header
var Header = React.createClass({
  render: function() {
    return (
      <div>
        <nav className = "navbar navbar-default navbar-static-top">
          <div className = "container">
            <div className = "navbar-header">
              <span className = "navbar-brand">React Experiments - Git Issues Tracker</span>
            </div>
          </div>
        </nav>
      </div>
    );
  }
});

// breadcrumb component for npm > issues
// #todo: add issues# - low priority
var Breadcrumb = React.createClass({
  render: function() {
    return (
      <div className = "container">
        <h3 className = "page-header">
          <img src="assets/issuexpress.jpg" alt="" height="50" width="50" />
          <strong>
          &nbsp;github&nbsp;/&nbsp;
          <a href="https://github.com/npm/npm">npm</a>&nbsp;/&nbsp;
          <a href="#">issues</a>
          </strong>
          </h3>
      </div>
    );
  }
});

// dashboard component for displaying stats
// #todo: call api for npm, include general issues stats
var Dashboard = React.createClass({
  render: function() {
    return (
      <div>
        <div className="container">
          <p>
            This is where the dashboard will go, using jQuery or d3.js
          </p>
        </div>
      </div>
    );
  }
});


// issues component for container of entire issues table
// #todo: handle server errors gracefully
var IssuesBox = React.createClass({
  loadIssuesFromServer: function() {
    $.ajax({
      url: this.props.urlOrig + "?per_page=25&page=",
      dataType: 'json',
      cache: true, // cache for router
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      data: [],
      pageNumber: 1 // for pagination
    };
  },
  componentDidMount: function() {
    this.loadIssuesFromServer();
  },

  handlePagination: function(pageIncrement) {
    var newPageNumber = this.state.pageNumber + pageIncrement.pageIncrement
    if (newPageNumber < 1){
      return;
    }
    this.setState({pageNumber: newPageNumber, data: []}, function(){
      $.ajax({
        url: this.props.urlOrig + "?per_page=25&page=" + this.state.pageNumber,
        dataType: 'json',
        cache: true,
        success: function(data) {
          if (data.length == 0) {
            newPageNumber--;
            return;
          }
          else {
            this.setState({data: data});
          }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  render: function() {
    // route to individual issue if router is triggered (by hash change)
    if (this.props.route.length > 0) {
      return (
        <div>
          <IssueDetailsContainer url={this.props.urlOrig} issueNumber = {this.props.route} />
        </div>
      )
    }
    // route to issues list otherwise
    // <Dashboard/>
    return (
      <div>
        <div className = "container">
          <div className = "row">
            <div className = "col-md-12">
              <div className="issuesBox">
                <div className="table-responsive">
                  <table className = "table table-striped table-hover">
                      <thead>
                        <tr className = "issues-box-container">
                          <th> </th>
                          <th><h4><strong>Issues</strong></h4></th>
                          <th></th>
                          <th></th>
                          <th><h4><strong>Owner</strong></h4></th>
                        </tr>
                      </thead>
                    <IssuesList data={this.state.data} />
                  </table>
                </div>
                <IssuePagination onPaginationClick={this.handlePagination} pageNumber={this.state.pageNumber}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

// issues list component to map issues listing json and pass to children
var IssuesList = React.createClass({
  render: function() {
    var issuesNodes = this.props.data.map(function(issue, index) {
      return (
        // `key` is a React-specific concept, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Issue
        number = {issue.number}
        title = {issue.title}
        body = {issue.body}
        state = {issue.state}
        updated_at = {issue.updated_at}
        created_at = {issue.created_at}
        user = {issue.user}
        labels = {issue.labels}
        key={index}>
        </Issue>
      );
    });
    return (
      <div>
        <tbody>
          {issuesNodes}
        </tbody>
      </div>
    );
  }
});

// issues component for each issues row
var Issue = React.createClass({
  render: function() {
    return (
        <tr>
          <td>
          <h4>
            <span className="glyphicon glyphicon-exclamation-sign glyph-open"></span>
          </h4>
          </td>
          <td>
            <a href={"index.html#" + this.props.number}>
              <span className="issues-title">
                 {this.props.title}
              </span>
            </a>
            <span>{" "}</span>
            <span dangerouslySetInnerHTML={printLabels(this.props.labels, false)} />
            <div className ="issues-body small">
            <span className="issues-number">
              {"#" + this.props.number + ": "}
            </span>
              {trimString(this.props.body)}
            </div>
          </td>
          <td> </td>
          <td> </td>
          <td>
            <a href={this.props.user.html_url}>
              <img className="img-circle gavatar-images" src={this.props.user.avatar_url} />
            </a>
            <span className = "x-small">
              &nbsp;<a href={this.props.user.html_url}>{"@" + this.props.user.login}</a>
            </span>
            <div className = "x-small">
              {"opened " + printLastUpdated(this.props.created_at)}
            </div>
          </td>
        </tr>
    );
  }
});

// issues component to paginate and update issue numbers
var IssuePagination = React.createClass({
  // go to the previous 25 issues
  // #optimize: cache for previous pagination
  handlePreviousPageClick: function(e) {
    e.preventDefault();
    this.props.onPaginationClick({pageIncrement: -1});
  },
  // go to the next 25 issues
  // #optimize: cache for next pagination
  handleNextPageClick: function(e) {
    e.preventDefault();
    this.props.onPaginationClick({pageIncrement: 1});
  },
  render: function() {
    return (
      <div>
        <nav>
          <ul className="pager">
            <li className="previous" onClick={this.handlePreviousPageClick}><a href=""><span aria-hidden="true">&larr;</span> Newer</a></li>
            <span>
              {((this.props.pageNumber - 1) * 25) + 1} to {25 * this.props.pageNumber}
            </span>
            <li className="next" onClick={this.handleNextPageClick}><a href="">Older <span aria-hidden="true">&rarr;</span></a></li>
          </ul>
        </nav>
      </div>
    );
  }
});

// issues detail component for the entire issue box
var IssueDetailsContainer = React.createClass({
  loadIssueFromServer: function() {
    $.ajax({
      url: this.props.url + "/" + this.props.issueNumber,
      dataType: 'json',
      cache: true,
      success: function(data) {
        var newData = this.state.data.concat([data]); // api returns an object literal
        this.setState({data: newData});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {
    this.loadIssueFromServer();
  },
  render: function() {
    return (
      <div>
        <div className = "container">
          <div className = "row">
            <div className = "col-md-12">
              <IssueDetailsHeader data={this.state.data}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

// issues header component to map issue details json and pass to children
var IssueDetailsHeader = React.createClass({
  render: function() {
    var issueNode = this.props.data.map(function(issue, index) {
      return (
        // `key` is a React-specific concept, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <IssueDetails
        number = {issue.number}
        title = {issue.title}
        body = {issue.body}
        state = {issue.state}
        updated_at = {issue.updated_at}
        created_at = {issue.created_at}

        comments_url = {issue.comments_url}
        comments = {issue.comments}

        user = {issue.user}
        milestone = {issue.miletstone}
        labels = {issue.labels}
        key={index}>
        </IssueDetails>
      );
    });
    return (
      <div>
          {issueNode}
      </div>
    );
  }
});

// issue details component to print issues details
var IssueDetails = React.createClass({
    render: function() {
      return (
        <div>
          <h4>
            <span className="label label-success">
            <span className="glyphicon glyphicon-exclamation-sign"></span>
            &nbsp;Open</span>
            <span>&nbsp;{" Issue #" + this.props.number}</span>
            <small>
              {" / opened by "}
              <img className="img-circle gavatar-images" src={this.props.user.avatar_url} />
              &nbsp;<a href={this.props.user.html_url}>{"@"+this.props.user.login}</a>
              {" " + printLastUpdated(this.props.created_at)}
            </small>
            <span dangerouslySetInnerHTML={printLabels(this.props.labels, true)} />
          </h4>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3><strong>
              {this.props.title}
              </strong></h3>
            </div>
            <p></p>
            <div className="panel-body issue-details-scroll">
              <span dangerouslySetInnerHTML={prettifyTextBody(this.props.body)} />
            </div>
            <div className="panel-footer">
              <CommentsContainer url={this.props.comments_url} comments = {this.props.comments}/>
            </div>
          </div>
        </div>
      );
    }
});

// comments container component for all comments
var CommentsContainer = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.setState({data: data}); // api returns an array
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {
    if (this.props.comments != 0) {
      this.loadCommentsFromServer();
    }
  },

  render: function() {
    if (this.props.comments == 0) {
      return (
        <div>
          No comments duuuude.
        </div>
      );
    }
    return (
      <div>
        <section className="comments">
          <CommentsHeader data={this.state.data}/>
        </section>
      </div>
    );
  }
});

// comments header component to map comments json and pass to children
var CommentsHeader = React.createClass({
  render: function() {
    var commentsNode = this.props.data.map(function(comment, index) {
      return (
        // `key` is a React-specific concept, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <CommentBox
        body = {comment.body}
        id = {comment.id}
        updated_at = {comment.updated_at}
        created_at = {comment.created_at}
        user = {comment.user}
        key={index}>
        </CommentBox>
      );
    });
    return (
      <div>
          {commentsNode}
      </div>
    );
  }
});

// comments component for each comment
var CommentBox = React.createClass({
    render: function() {
      return (
        <div>
          <div className="comment">
            <a className="comment-img" href={this.props.user.html_url}>
              <img className="img-circle gavatar-images-lg" src={this.props.user.avatar_url} alt="" width="50" height="50" />
            </a>
            <div className="comment-body">
              <small>
                <div className="comment-text">
                  <p>
                  <span dangerouslySetInnerHTML={prettifyTextBody(this.props.body)} />
                  </p>
                </div>
              </small>
              <div className = "comment-info">
                <small>
                  posted {printLastUpdated(this.props.created_at)} by <a href={this.props.user.html_url}>{"@"+this.props.user.login}</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      );
    }
});


function renderNow () {
  var route = window.location.hash.substr(1);
  React.render(
    <App route={route}/>, document.getElementById('app-main')
  );
}

// to handle routing
// alternatives: react-router (on github), flux
// or a proper JS MVC (backbone, meteor, express etc.)
window.addEventListener('hashchange', renderNow);
renderNow();
