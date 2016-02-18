function replaceAll(find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function getServerFilePath(id) {
    return "/Archive2/" + id.substr(0, 2) + "/" + id.substr(2, id.length).trim() + "/main.cpp";
}
function getServerShareFilePath(id) {
    return "/Archive/" + id.substr(0, 2) + "/" + id.substr(2, id.length).trim() + "/main.cpp";
}


var largePadding = "16px";
var smallPadding = "5px";
var dom = React.DOM;
var Router = React.createFactory(ReactRouter.Router);
var Link = React.createFactory(ReactRouter.Link);

var BuildDependencies = [
    { name: "Boost", notes: function() { return "Must be at least v1.58. Must include Boost.ProgramOptions, which is not header-only." } },
    { name: "LLVM/Clang", notes: function() { return "Must be v3.6. Must be compiled with RTTI on Linux. Must be compiled without asserts." } },
    { name: "Premake", notes: function() { return dom.span(null, "Must be Premake 4.4. Packages available on Linux, for Windows see ", dom.a({ href: "https://bitbucket.org/DeadMG/wide/downloads/premake4.exe" }, "here"), ".") } },
    { name: "zlib", notes: function() { } },
    { name: "libarchive", notes: function() { } },
    { name: "Host toolchain", notes: function() { return "Wide uses RTTI and exceptions. Wide makes some use of C++11/14. Wide requires MSVC2015, Clang 3.6, or G++ 4.9 or later."; } }
];

var ExecutionDependencies = [
    { name: "Standard library", notes: function() { return "Wide requires an Itanium-ABI Standard library and runtime support libraries. libstdc++ is supported, libc++ is theoretically supported but untested. On Windows, MinGW is required. It must be version >=4.8. Wide can automatically find the include path directories."; } },
    { name: "Wide stdlib", notes: function() { return "Wide expects to find it's own runtime library packaged relative to either the executable or the working directory."; } }
]

var Reference = [
    { 
        name: "Building", 
        render: function() {
            return dom.div(null,
                dom.h1(null, "Building Wide"),
                dom.table(null,
                    dom.tbody(null, 
                        dom.tr(null,
                            dom.th(null, "Build Dependency"),
                            dom.th(null, "Notes")
                        ),
                        _.map(BuildDependencies, dep => {
                            return dom.tr({ key: dep.name },
                                dom.td(null, dep.name),
                                dom.td(null, dep.notes()));
                        }))
                ),
                dom.h1(null, "Running Wide"),
                dom.table(null,
                    dom.tbody(null, 
                        dom.tr(null,
                            dom.th(null, "Execution Dependency"),
                            dom.th(null, "Notes")
                        ),
                        _.map(ExecutionDependencies, dep => {
                            return dom.tr({ key: dep.name },
                                dom.td(null, dep.name),
                                dom.td(null, dep.notes()));
                        }))
                ),
                dom.p(null, "To build Wide on Linux systems, pre-defined scripts are provided. Reference Wide/Tools/version to use them. Currently Ubuntu 12.04 and 15.10 have install-deps and build scripts provided. There is also a test script and a package script. For other Linux distros, reference these files as a starting point - it should be enough to install the deps from your favourite package manager, and then run premake and make."),
                dom.p(null, "To build Wide on Windows, more fun is required. Premake can generate VS2010 projects which can be trivially upgraded to VS2015. As for the deps, you will have to build them yourself and figure out exactly how to reference them. TODO: Document this properly.")
            )    
        }
    }
]

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
            dom.div({ onClick: this.onHeaderClick, style: { cursor: "pointer" } }, this.props.text, Caret()), 
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
            borderTop: "0",
            border: "1px solid black",
            color: "black",
            marginTop: "-1px"
        }
        return dom.div({ style: listStyle }, 
            React.Children.map(this.props.children, (child, index) => new DropdownItem({ key: index }, child)));        
    }
}));

var DropdownItem = React.createFactory(React.createClass({
    render: function() {
        return dom.div({ style: { paddingLeft: largePadding, paddingRight: largePadding, paddingTop: smallPadding, paddingBottom: smallPadding }, className: "navitem" },
            this.props.children);
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
            alignItems: "center",
            color: "#777"            
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
		return dom.div({ style: navBarStyle, className: "navbar" },
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
			NavItem(null, DropdownMenu({ text: "Reference" }, _.map(Reference, item => new Link({ key: item.name, to: 'Reference/' + item.name }, item.name))))
	    );
	},
	renderRightSide: function() {
		var rightStyle = {
			marginLeft: "auto",
			display: "flex",
            height: "100%"
		};
		return dom.div({ style: rightStyle }, 
		    //NavItem(null, "Trello"),
			//NavItem(null, Link({ to: "/Blog" }, "Blog")),
			//NavItem(null, "Chat"),
			NavItem(null, dom.a({ href: "https://github.com/DeadMG/Wide" }, "GitHub")),
			//NavItem(null, "Donate"),
			NavItem(null, Link({ to: "/" }, "Home"))
	    );
	}
}));

var LoadingSpinner = React.createFactory(React.createClass({
    render: function() {
        return dom.div({ className: "spinner-loader" });
    }
}));

var Error = React.createFactory(React.createClass({
    getInitialState: function() {
        return { hovered: false };
    },
    render: function() {
        if (!this.state.hovered) {
            return dom.span(
                { 
                    style: { pointerEvents: "all", textDecoration: "underline wavy red" },
                    onMouseOver: () => this.setState({ hovered: true })
                }, 
                this.props.children);            
        }
        return dom.span({ style: { position: "relative", pointerEvents: "all", textDecoration: "underline wavy red"  }, onMouseLeave: () => this.setState({ hovered: false }) }, 
            this.props.children,
            dom.span({ style: { position: "absolute", zIndex: 2, left: "3px", top: "calc(100% + 3px)", boxShadow: "1px 1px black" } },
                dom.span({ style: { backgroundColor: "#CCCCCC" } }, this.props.errorText)));
    },
}));

var Playground = React.createFactory(React.createClass({
    getInitialState: function() {
        return {
            files: this.props.files || [
                { name: "HelloWorld.wide", source: "Main() {\n    std.cout << \"Hello, World!\";\n}", type: "wide" },
                { name: "main.cpp", source: "#include <iostream>", type: "cpp" },
            ],
            currentFile: this.props.files ? this.props.files[0].name : "HelloWorld.wide",
            requesting: false
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
            this.renderHeaderButton(dom.button({ onClick: () => this.share() }, "Share")));
    },
    renderHeaderButton: function(button) {
        return dom.div({ style: { marginLeft: largePadding } }, button);  
    },
    renderResults: function() {
        if (!this.props.helpText)
            return this.state.results;
        return dom.div({ style: { paddingLeft: largePadding }},
            dom.div(null, this.props.helpText),
            dom.div(null, this.state.requesting ? LoadingSpinner() : this.state.results));
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
                    padding: smallPadding,
                    cursor: "pointer"
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
            return dom.div({ style: _.extend(containerStyle, { cursor: "pointer" }), onClick: () => this.setState({ newFile: true }) }, "+");
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
        var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        var browserSpecificMargins = isChrome ? { marginLeft: "1px", marginTop: "-1px" } : { margin: "1px" };
        return dom.div({
            style: {
                width:"50vw",
                display: "flex",
                position: "relative",
                fontSize: "12px"
            }
        }, dom.textarea({
            className: "coliruFont",
            style: _.extend({}, browserSpecificMargins, {
                width: "100%",
                paddingLeft: largePadding,
                zIndex: 0,
                fontSize: "12px",
                backgroundColor: "transparent",
                border: "0px none"
            }),
            autoComplete: false,
            autoCorrect: false,
            autoCapitalize: false,
            spellCheck: false,
            value: currentFile ? currentFile.source : "",
            onChange: event => {
                var newState = {
                    files: this.state.files.slice(0),
                    currentFile: this.state.currentFile
                };
                _.find(newState.files, file => file.name == this.state.currentFile).source = event.target.value;
                this.setState(newState);
            }
        }),
        dom.div({ style: {
            position: "absolute",
            top: "0px",
            left: "0px",
            border: "1px solid black",
            width: "100%",
            height: "100%",
            boxSizing: "padding-box",
            zIndex: 1,
            backgroundColor: "transparent",
            pointerEvents: "none"
        }}, currentFile ? this.renderHighlightedText(currentFile.source) : ""));
    },
    renderHighlightedText: function(text) {
        var results = Module.Parse(text);        
        var lines = text.split('\n');
        return dom.div({ style: { display: "flex" } },
            dom.div({ style: { display: "flex", flexDirection: "column" } }, 
                _.map(lines, (line, index) => 
                    dom.span({ key: index, className: "coliruFont", style: { width: largePadding, display: "inline-block", backgroundColor: "#DDDDDD" }}, index + 1))),
            dom.pre({ style: { display: "inline", margin: 0 }, className: "coliruFont" }, 
                this.highlightResult(text, results))
        );
    },
    highlightResult: function(text, results) {
        if (results.lexerResult.length == 0)
            return text;
        var lastChild = this.renderCaretInText(text, _.last(results.lexerResult).where.end.offset, text.length);
        var prevOffset = { offset: 0 };
        if (results.parserResult && results.parserResult.length != 0) {
            var prevErrorOffset = 0;
            var afterAll = _.filter(results.lexerResult, token => token.where.begin.offset > _.last(results.parserResult).where.end.offset);
            
            var errors = _.map(results.parserResult, error => {
                // The parser result should cover a valid range of tokens.            
                var before = _.filter(results.lexerResult, token => token.where.begin.offset < error.where.begin.offset && token.where.begin.offset >= prevErrorOffset);
                var middle = _.filter(results.lexerResult, token => token.where.begin.offset >= error.where.begin.offset && token.where.end.offset <= error.where.end.offset);
                
                var beforeResults = this.renderLexerResults(before, text, null, prevOffset);
                var middleResults = this.renderLexerResults(middle, text, null, prevOffset);
                if (middleResults.length != 0) {
                    if (_.isString(middleResults[0])) {
                        beforeResults.push(middleResults[0]);
                        middleResults = middleResults.slice(1);
                    }
                }
                prevErrorOffset = _.last(middle).where.end.offset;
                return [
                    beforeResults,
                    new Error({ errorText: error.what }, middleResults)
                ];                
            });
            var afterResults = this.renderLexerResults(afterAll, text, lastChild, prevOffset);
            return errors.concat(afterResults);
        }
        return this.renderLexerResults(results.lexerResult, text, lastChild, prevOffset);
    },
    renderLexerResults: function(lexerResults, text, lastChild, prevOffset) {
        return _.flatten(_.map(lexerResults, token => {
            var previousOffset = prevOffset.offset;
            prevOffset.offset = token.where.end.offset;
            return [
                this.renderCaretInText(text, previousOffset, token.where.begin.offset),
                this.renderResult(text, token)
            ];
        })).concat(lastChild);        
    },
    renderResult: function(text, result) {
        var tokenText = this.renderCaretInText(text, result.where.begin.offset, result.where.end.offset);
        if (result.what) {
            return new Error({ errorText: result.what }, tokenText);
        }
        if (result.IsLiteral())
            return dom.span({ style: { color: "red" }}, tokenText);
        if (result.IsKeyword())
            return dom.span({ style: { color: "blue" }}, tokenText);
        if (result.IsComment())
            return dom.span({ style: { color: "green" }}, tokenText);
        return dom.span(null, tokenText);
    },
    renderCaretInText: function(text, begin, end) {
        var subText = text.substring(begin, end);
        if (subText == "")
            return null;
        return subText;
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
        this.setState({ requesting: true });
        var src = {
            Source: _.map(_.filter(this.state.files, file => file.type == "wide"), file => ({
                Name: file.name,
                Contents: file.source
            })),
            CppSource: _.map(_.filter(this.state.files, file => file.type == "cpp"), file => ({
                Name: file.name,
                Contents: file.source
            })),
            StdlibPath: "/usr/local/bin/Wide/WideLibrary"
        };        
        jQuery.ajax("http://coliru.stacked-crooked.com/compile", {
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                src: JSON.stringify(src),
                cmd: "python -c \"import subprocess, json; compiler_output, _ = subprocess.Popen('/usr/local/bin/Wide/Wide --interface=JSON main.cpp', stdout = subprocess.PIPE, stderr = subprocess.STDOUT, shell = True).communicate(); program_output, _ = subprocess.Popen('g++ a.o && ./a.out', stdout = subprocess.PIPE, stderr = subprocess.STDOUT, shell = True).communicate(); print(json.dumps({ 'compiler': compiler_output, 'program': program_output }))\""
            })
        }).then(result => {
            var data = JSON.parse(replaceAll("'x86_64' is not a recognized processor for this target (ignoring processor)", "", result));
            var compilerData = JSON.parse(data.compiler);
            this.setState({                
                results: data.program, 
                compilerResults: compilerData,
                requesting: false 
            });
        }); 
    },
    componentDidMount: function() {
        this.props.files && this.compile();
    },
    share: function() {
        var json = JSON.stringify(this.state);
        jQuery.ajax("http://coliru.stacked-crooked.com/share", {
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                src: json,
                cmd: "cat main.cpp"
            })
        }).then(result => {
            this.props.history.push('/Sample/' + result);
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
			this.props.children
		);
	}
});

var Home = React.createClass({
    render: function() {
        return Playground({
            helpText: "Welcome to codepuppy.co.uk",
            history: this.props.history
        });
    }
});

var Sample = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        var id = this.props.params.sampleId;
        jQuery.ajax("http://coliru.stacked-crooked.com" + getServerShareFilePath(id), {
            method: "GET"
        }).then(result => {
            this.setState({ files: JSON.parse(result).files });
        });
    },
    render: function() {
        if (this.state.files)
            return new Playground({
                history: this.props.history,
                files: this.state.files
            });
        return new LoadingSpinner();        
    }
});

var ReferencePage = React.createClass({
    render: function() {
        return dom.div({ style: { paddingLeft: largePadding, paddingBottom: largePadding } }, 
            _.find(Reference, item => item.name == this.props.params.name).render());
    }
})

const routes = {
  component: App,
  childRoutes: [
    { path: 'Sample/:sampleId', component: Sample },
    { path: 'Blog', component: Blog },
    { path: 'Reference/:name', component: ReferencePage },
    { path: '/', component: Home }
  ]
};

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(Router({ routes: routes }), document.getElementById("App"));	
}, false);

