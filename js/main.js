function replaceAll(find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

var dom = React.DOM;

var Router = React.createFactory(ReactRouter.Router);
var Link = React.createFactory(ReactRouter.Link);

var Caret = React.createFactory(React.createClass({
    render: function() {
        return dom.span({ style: {
            borderTop: "4px solid",
            borderRight: "4px solid transparent",
            borderLeft: "4px solid transparent",
            display: "inline-block",
            verticalAlign: "middle",
            marginLeft: "2px",
            marginRight: "2px"            
        }});
    }
}));
var DropdownMenu = React.createFactory(React.createClass({
    onHeaderClick: function() {
        this.setState({ renderList: !this.state.renderList });
    },
    getInitialState: function() {
        return {
            renderList: false
        }
    },
    render: function() {
        return dom.div(null,
            dom.div({ onClick: this.onHeaderClick }, this.props.text, Caret()), 
            this.renderList()
        );
    },
    renderList: function() {
        if (!this.state.renderList) return null; 
        var listStyle =  {
            display: "flex", 
            flexDirection: "column",
            position: "absolute",
            top: "100%",
            left: "0",
            zIndex: "3",
            background: "white",
            border: "1px solid black"
        }
        return dom.div({ style: listStyle }, this.props.children);        
    }
}));

var NavItem = React.createFactory(React.createClass({
	render: function() {
		var item = {
			marginLeft: "15px",
			marginRight: "15px",
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center"
		};
		return dom.div({ style: item }, this.props.children);
	}
}));

var NavBar = React.createFactory(React.createClass({
	render: function() {
		var navBarStyle = {
			backgroundColor: "black",
			height: "50px",
			display: "flex"
		};
		var innerNavBarStyle = {
			display: "flex",
			alignItems: "center",
			justifyContent: "initial",
			flexGrow: "1",
			color: "#777"
		};
		return dom.div({ style: navBarStyle },
		    dom.div({ style: innerNavBarStyle }, 
	            this.renderLeftSide(),
			    this.renderRightSide()
		));
	},
	renderLeftSide: function() {
		var leftStyle = {
			display: "flex",
            height: "100%"
		};
		return dom.div({ style: leftStyle }, 
		    NavItem(null, DropdownMenu({ text: "Tutorials" }, "Item1", "Item2")),
			NavItem(null, DropdownMenu({ text: "Reference" }, "Item1", "Item2"))
	    );
	},
	renderRightSide: function() {
		var rightStyle = {
			marginLeft: "auto",
			display: "flex",
            height: "100%"
		};
		return dom.div({ style: rightStyle }, 
		    NavItem(null, "Trello"),
			NavItem(null, Link({ to: "/Blog" }, "Blog")),
			NavItem(null, "Chat"),
			NavItem(null, "Source"),
			NavItem(null, "Donate"),
			NavItem(null, Link({ to: "/" }, "Home"))
	    );
	}
}));

var largePadding = "16px";
var smallPadding = "5px";

var Playground = React.createFactory(React.createClass({
    getInitialState: function() {
        return {
            files: [
                { name: "HelloWorld.wide", source: "Main() {\n    cplusplus.std.cout << \"Hello, World!\";\n}", type: "wide" },
                { name: "main.cpp", source: "#include <iostream>", type: "cpp" },
            ],
            currentFile: "HelloWorld.wide"
        };
    },
    render: function() {
        return dom.div({
                style: {
                    marginTop: largePadding,
                    marginBottom: largePadding,
                    height: "calc(100vh - 110px)"                    
                }
            }, 
            this.renderHeaderButtons(),
            dom.div({
                    style: {
                        display: "flex",
                        height: "calc(100% - 40px)"
                    }
                },
                this.renderTreeView(),
                this.renderCodeView(),
                this.renderResults()
            )
        );
    },
    renderHeaderButtons: function() {
        return dom.div({ style: { marginBottom: largePadding, marginTop: "0", display: "flex" } },
            this.renderHeaderButton(dom.button({ onClick: () => this.compile() }, "Compile")),
            this.renderHeaderButton(dom.button({ onClick: () => {} }, "Share")));
    },
    renderHeaderButton: function(button) {
        return dom.div({ style: { marginLeft: largePadding } }, button);  
    },
    renderResults: function() {
        return this.state.results;
    },
    renderTreeView: function() {
        return dom.div({
            style: {
                display: "flex",
                flexDirection: "column",
                marginLeft: largePadding,
                background: "black",
                color: "grey"
            }
        }, this.renderFileList(), this.renderNewFile());
    },
    renderFileList: function() {
        return _.map(this.state.files, file => {
            return dom.div({ key: file.name }, this.renderFileLink(file.name));
        });
    },
    renderFileLink: function(fileName) { 
        return dom.div({ style: { display: "flex" }},
            dom.div({
                style: {
                    padding: smallPadding
                },
                onClick: () => {
                    var newFiles = _.filter(this.state.files, file => file.name !== fileName);
                    if (this.state.currentFile === fileName)
                        this.setState({ currentFile: newFiles.length > 0 ? newFiles[0].name : null, files: newFiles });
                    else
                        this.setState({ files: newFiles })
                }
            }, "-"), 
            dom.div({ 
                onClick: () => this.setState({ 
                    files: this.state.files.slice(0),
                    currentFile: fileName
                }),
                style: {
                    paddingLeft: "calc(" + largePadding + " - " + smallPadding + ")",
                    paddingRight: largePadding,
                    color: "white",
                    paddingTop: smallPadding, 
                    paddingBottom: smallPadding, 
                    background: this.state.currentFile == fileName ? "grey" : "black",
                    flexGrow: "1"
                }
            }, fileName));        
    },
    renderNewFile: function() {
        var containerStyle = {
            marginLeft: "calc(" + largePadding + " + 10px)",
            marginRight: largePadding,
            marginTop: smallPadding,
            marginBottom: smallPadding,
            display: "flex"
        };
        if (!this.state.newFile) {
            return dom.div({ style: containerStyle, onClick: () => this.setState({ newFile: true }) }, "+");
        }
        return dom.div({ style: containerStyle },
            dom.div({
                ref: div => div && div.focus(),
                contentEditable: true,
                autoFocus: true,
                onBlur: event => this.addFile(event.target.textContent),
                onKeyDown: event => { if (event.keyCode === 13) this.addFile(event.target.textContent); },
                style: {
                    background: "white",
                    color: "black",
                    height: "20px",
                    flexGrow: "1"
                }
            }));
    },
    addFile: function(name) {
        if (name.trim() == "") {
            this.setState({ newFile: false });
            return;
        }
        var newFiles = this.state.files.slice(0);
        newFiles.push({
            name: name,
            source: "",
            type: name.endsWith('.wide') ? "wide" : "cpp"
        });
        this.setState({ newFile: false, currentFile: name, files: newFiles });
    },
    renderCodeView: function() {
        var currentFile = _.find(this.state.files, file => file.name == this.state.currentFile);
        return dom.div({
            style: {
                width:"50vw",
                display: "flex"
            }
        }, dom.textarea({
            style: {
                width: "100%",
                margin: "0px",
                paddingLeft: largePadding                
            },
            value: currentFile ? currentFile.source : "",
            onChange: event => {
                var newState = {
                    files: this.state.files.slice(0),
                    currentFile: this.state.currentFile
                };
                _.find(newState.files, file => file.name == this.state.currentFile).source = event.target.value;
                this.setState(newState);
            }
        }));
    },
    sendFiles: function(filter) {
        return _.map(_.filter(this.state.files, filter), file => jQuery.ajax("http://coliru.stacked-crooked.com/share", {
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                src: file.source,
                cmd: ""
            })
        }));        
    },
    compile: function() {
        var wideRequests = this.sendFiles(file => file.type == "wide");
        var cppRequests = this.sendFiles(file => file.type == "cpp");
        jQuery.when(...wideRequests).done(() => {
            var wideResults = _.filter(arguments, (value, index) => index % 3 == 0);
            jQuery.when(...cppRequests).done(() => {
                var cppResults = _.filter(arguments, (value, index) => index % 3 == 0);
                var wideLocations = _.map(wideResults, http => "/Archive2/" + http.substr(0, 2) + "/" + http.substr(2, http.length).trim() + "/main.cpp");
                var cppLocations = _.map(cppResults, http => "/Archive2/" + http.substr(0, 2) + "/" + http.substr(2, http.length).trim() + "/main.cpp");      
                var identitySrc = "Identity(x) { return Identity; } Identity() { return Identity; }";
                var usingSrc = "using cplusplus := ";
                if (cppLocations.length == 0) {
                    usingSrc = ""
                } else {
                    usingSrc += "Identity()" + _.reduce(cppLocations, (current, location) => current += "(cpp(\"" + location + "\"))","") + ";";
                }
                jQuery.ajax("http://coliru.stacked-crooked.com/compile", {
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        src: identitySrc + usingSrc,
                        cmd: "/usr/local/bin/Wide/CLI main.cpp " + _.reduce(wideLocations, (location, current) => current += location, "") + " && g++ a.o && ./a.out"
                    })
                }).then(result => {
                    this.setState({ results: replaceAll("'x86_64' is not a recognized processor for this target (ignoring processor)", "", result) });
                });             
            });
        });
    }
}));

var Blog = React.createClass({
	render: function() {
		return dom.span(null, "Hello, World!");
	}
});

var App = React.createClass({
	render: function() {
		return dom.div(null,
		    NavBar(),
			this.props.children,
            Playground()
		);
	}
});

const routes = {
  path: '/',
  component: App,
  childRoutes: [
    { path: 'Blog', component: Blog },
  ]
};

document.addEventListener('DOMContentLoaded', function() {
	document.getElementsByTagName("body")[0].style.margin = "0";
    ReactDOM.render(Router({ routes: routes }), document.getElementById("App"));	
}, false);
