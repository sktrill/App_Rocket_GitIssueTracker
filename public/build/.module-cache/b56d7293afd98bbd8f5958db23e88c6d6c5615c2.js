// primary app component
var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(IssuesBox, {route: this.props.route, urlOrig: "https://api.github.com/repos/npm/npm/issues"})
      )
    );
  }
});

// header component for the project header
var Header = React.createClass({displayName: "Header",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("nav", {className: "navbar navbar-default navbar-static-top"}, 
          React.createElement("div", {className: "container"}, 
            React.createElement("div", {className: "navbar-header"}, 
              React.createElement("span", {className: "navbar-brand"}, "Twitter Web Frontend Coding Audition")
            )
          )
        )
      )
    );
  }
});

// breadcrumb component for npm > issues
// #todo: add issues# - low priority
var Breadcrumb = React.createClass({displayName: "Breadcrumb",
  render: function() {
    return (
      React.createElement("div", {className: "container"}, 
        React.createElement("h3", {className: "page-header"}, 
          React.createElement("img", {src: "assets/issuexpress.jpg", alt: "", height: "50", width: "50"}), 
          React.createElement("strong", null, 
          " github / ", 
          React.createElement("a", {href: "https://github.com/npm/npm"}, "npm"), " / ", 
          React.createElement("a", {href: "/#"}, "issues")
          )
          )
      )
    );
  }
});

// dashboard component for displaying stats
// #todo: call api for npm, include general issues stats
var Dashboard = React.createClass({displayName: "Dashboard",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "container"}, 
          React.createElement("p", null, 
            "This is where the dashboard will go, using jQuery or d3.js"
          )
        )
      )
    );
  }
});


// issues component for container of entire issues table
// #todo: handle server errors gracefully
var IssuesBox = React.createClass({displayName: "IssuesBox",
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
        React.createElement("div", null, 
          React.createElement(Header, null), 
          React.createElement(Breadcrumb, null), 
          React.createElement(IssueDetailsContainer, {url: this.props.urlOrig, issueNumber: this.props.route})
        )
      )
    }
    // route to issues list otherwise
    // <Dashboard/>
    return (
      React.createElement("div", null, 
        React.createElement(Header, null), 
        React.createElement(Breadcrumb, null), 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-md-12"}, 
              React.createElement("div", {className: "issuesBox"}, 
                React.createElement("div", {className: "table-responsive"}, 
                  React.createElement("table", {className: "table table-striped table-hover"}, 
                      React.createElement("thead", null, 
                        React.createElement("tr", {className: "issues-box-container"}, 
                          React.createElement("th", null, " "), 
                          React.createElement("th", null, React.createElement("h4", null, React.createElement("strong", null, "Issues"))), 
                          React.createElement("th", null), 
                          React.createElement("th", null), 
                          React.createElement("th", null, React.createElement("h4", null, React.createElement("strong", null, "Owner")))
                        )
                      ), 
                    React.createElement(IssuesList, {data: this.state.data})
                  )
                ), 
                React.createElement(IssuePagination, {onPaginationClick: this.handlePagination, pageNumber: this.state.pageNumber})
              )
            )
          )
        )
      )
    );
  }
});

// issues list component to map issues listing json and pass to children
var IssuesList = React.createClass({displayName: "IssuesList",
  render: function() {
    var issuesNodes = this.props.data.map(function(issue, index) {
      return (
        // `key` is a React-specific concept, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        React.createElement(Issue, {
        number: issue.number, 
        title: issue.title, 
        body: issue.body, 
        state: issue.state, 
        updated_at: issue.updated_at, 
        created_at: issue.created_at, 
        user: issue.user, 
        labels: issue.labels, 
        key: index}
        )
      );
    });
    return (
      React.createElement("div", null, 
        React.createElement("tbody", null, 
          issuesNodes
        )
      )
    );
  }
});

// issues component for each issues row
var Issue = React.createClass({displayName: "Issue",
  render: function() {
    return (
        React.createElement("tr", null, 
          React.createElement("td", null, 
          React.createElement("h4", null, 
            React.createElement("span", {className: "glyphicon glyphicon-exclamation-sign glyph-open"})
          )
          ), 
          React.createElement("td", null, 
            React.createElement("a", {href: "index.html/#" + this.props.number}, 
              React.createElement("span", {className: "issues-title"}, 
                 this.props.title
              )
            ), 
            React.createElement("span", null, " "), 
            React.createElement("span", {dangerouslySetInnerHTML: printLabels(this.props.labels, false)}), 
            React.createElement("div", {className: "issues-body small"}, 
            React.createElement("span", {className: "issues-number"}, 
              "#" + this.props.number + ": "
            ), 
              trimString(this.props.body)
            )
          ), 
          React.createElement("td", null, " "), 
          React.createElement("td", null, " "), 
          React.createElement("td", null, 
            React.createElement("a", {href: this.props.user.html_url}, 
              React.createElement("img", {className: "img-circle gavatar-images", src: this.props.user.avatar_url})
            ), 
            React.createElement("span", {className: "x-small"}, 
              " ", React.createElement("a", {href: this.props.user.html_url}, "@" + this.props.user.login)
            ), 
            React.createElement("div", {className: "x-small"}, 
              "opened " + printLastUpdated(this.props.created_at)
            )
          )
        )
    );
  }
});

// issues component to paginate and update issue numbers
var IssuePagination = React.createClass({displayName: "IssuePagination",
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
      React.createElement("div", null, 
        React.createElement("nav", null, 
          React.createElement("ul", {className: "pager"}, 
            React.createElement("li", {className: "previous", onClick: this.handlePreviousPageClick}, React.createElement("a", {href: ""}, React.createElement("span", {"aria-hidden": "true"}, "←"), " Newer")), 
            React.createElement("span", null, 
              ((this.props.pageNumber - 1) * 25) + 1, " to ", 25 * this.props.pageNumber
            ), 
            React.createElement("li", {className: "next", onClick: this.handleNextPageClick}, React.createElement("a", {href: ""}, "Older ", React.createElement("span", {"aria-hidden": "true"}, "→")))
          )
        )
      )
    );
  }
});

// issues detail component for the entire issue box
var IssueDetailsContainer = React.createClass({displayName: "IssueDetailsContainer",
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
      React.createElement("div", null, 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-md-12"}, 
              React.createElement(IssueDetailsHeader, {data: this.state.data})
            )
          )
        )
      )
    );
  }
});

// issues header component to map issue details json and pass to children
var IssueDetailsHeader = React.createClass({displayName: "IssueDetailsHeader",
  render: function() {
    var issueNode = this.props.data.map(function(issue, index) {
      return (
        // `key` is a React-specific concept, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        React.createElement(IssueDetails, {
        number: issue.number, 
        title: issue.title, 
        body: issue.body, 
        state: issue.state, 
        updated_at: issue.updated_at, 
        created_at: issue.created_at, 

        comments_url: issue.comments_url, 
        comments: issue.comments, 

        user: issue.user, 
        milestone: issue.miletstone, 
        labels: issue.labels, 
        key: index}
        )
      );
    });
    return (
      React.createElement("div", null, 
          issueNode
      )
    );
  }
});

// issue details component to print issues details
var IssueDetails = React.createClass({displayName: "IssueDetails",
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement("h4", null, 
            React.createElement("span", {className: "label label-success"}, 
            React.createElement("span", {className: "glyphicon glyphicon-exclamation-sign"}), 
            " Open"), 
            React.createElement("span", null, " ", " Issue #" + this.props.number), 
            React.createElement("small", null, 
              " / opened by ", 
              React.createElement("img", {className: "img-circle gavatar-images", src: this.props.user.avatar_url}), 
              " ", React.createElement("a", {href: this.props.user.html_url}, "@"+this.props.user.login), 
              " " + printLastUpdated(this.props.created_at)
            ), 
            React.createElement("span", {dangerouslySetInnerHTML: printLabels(this.props.labels, true)})
          ), 
          React.createElement("div", {className: "panel panel-default"}, 
            React.createElement("div", {className: "panel-heading"}, 
              React.createElement("h3", null, React.createElement("strong", null, 
              this.props.title
              ))
            ), 
            React.createElement("p", null), 
            React.createElement("div", {className: "panel-body issue-details-scroll"}, 
              React.createElement("span", {dangerouslySetInnerHTML: prettifyTextBody(this.props.body)})
            ), 
            React.createElement("div", {className: "panel-footer"}, 
              React.createElement(CommentsContainer, {url: this.props.comments_url, comments: this.props.comments})
            )
          )
        )
      );
    }
});

// comments container component for all comments
var CommentsContainer = React.createClass({displayName: "CommentsContainer",
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
        React.createElement("div", null, 
          "No comments duuuude."
        )
      );
    }
    return (
      React.createElement("div", null, 
        React.createElement("section", {className: "comments"}, 
          React.createElement(CommentsHeader, {data: this.state.data})
        )
      )
    );
  }
});

// comments header component to map comments json and pass to children
var CommentsHeader = React.createClass({displayName: "CommentsHeader",
  render: function() {
    var commentsNode = this.props.data.map(function(comment, index) {
      return (
        // `key` is a React-specific concept, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        React.createElement(CommentBox, {
        body: comment.body, 
        id: comment.id, 
        updated_at: comment.updated_at, 
        created_at: comment.created_at, 
        user: comment.user, 
        key: index}
        )
      );
    });
    return (
      React.createElement("div", null, 
          commentsNode
      )
    );
  }
});

// comments component for each comment
var CommentBox = React.createClass({displayName: "CommentBox",
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement("div", {className: "comment"}, 
            React.createElement("a", {className: "comment-img", href: this.props.user.html_url}, 
              React.createElement("img", {className: "img-circle gavatar-images-lg", src: this.props.user.avatar_url, alt: "", width: "50", height: "50"})
            ), 
            React.createElement("div", {className: "comment-body"}, 
              React.createElement("small", null, 
                React.createElement("div", {className: "comment-text"}, 
                  React.createElement("p", null, 
                  React.createElement("span", {dangerouslySetInnerHTML: prettifyTextBody(this.props.body)})
                  )
                )
              ), 
              React.createElement("div", {className: "comment-info"}, 
                React.createElement("small", null, 
                  "posted ", printLastUpdated(this.props.created_at), " by ", React.createElement("a", {href: this.props.user.html_url}, "@"+this.props.user.login)
                )
              )
            )
          )
        )
      );
    }
});


function renderNow () {
  var route = window.location.hash.substr(1);
  React.render(
    React.createElement(App, {route: route}), document.getElementById('app-main')
  );
}

// to handle routing
// alternatives: react-router (on github), flux
// or a proper JS MVC (backbone, meteor, express etc.)
window.addEventListener('hashchange', renderNow);
renderNow();
