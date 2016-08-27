(function() {
  var ColorProject, CompositeDisposable, Disposable, PigmentsAPI, PigmentsProvider, uris, url, _ref, _ref1;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  uris = require('./uris');

  ColorProject = require('./color-project');

  _ref1 = [], PigmentsProvider = _ref1[0], PigmentsAPI = _ref1[1], url = _ref1[2];

  module.exports = {
    config: {
      traverseIntoSymlinkDirectories: {
        type: 'boolean',
        "default": false
      },
      sourceNames: {
        type: 'array',
        "default": ['**/*.styl', '**/*.stylus', '**/*.less', '**/*.sass', '**/*.scss'],
        description: "Glob patterns of files to scan for variables.",
        items: {
          type: 'string'
        }
      },
      ignoredNames: {
        type: 'array',
        "default": ["vendor/*", "node_modules/*", "spec/*", "test/*"],
        description: "Glob patterns of files to ignore when scanning the project for variables.",
        items: {
          type: 'string'
        }
      },
      ignoredBufferNames: {
        type: 'array',
        "default": [],
        description: "Glob patterns of files that won't get any colors highlighted",
        items: {
          type: 'string'
        }
      },
      extendedSearchNames: {
        type: 'array',
        "default": ['**/*.css'],
        description: "When performing the `find-colors` command, the search will scans all the files that match the `sourceNames` glob patterns and the one defined in this setting."
      },
      supportedFiletypes: {
        type: 'array',
        "default": ['*'],
        description: "An array of file extensions where colors will be highlighted. If the wildcard `*` is present in this array then colors in every file will be highlighted."
      },
      filetypesForColorWords: {
        type: 'array',
        "default": ['css', 'less', 'styl', 'stylus', 'sass', 'scss'],
        description: "An array of file extensions where color values such as `red`, `azure` or `whitesmoke` will be highlighted. By default CSS and CSS pre-processors files are supported.\n\nYou can use `none` or whatever value that doesn't match a file extension to completely prevent color words from being highlighted."
      },
      ignoredScopes: {
        type: 'array',
        "default": [],
        description: "Regular expressions of scopes in which colors are ignored. For example, to ignore all colors in comments you can use `\\.comment`.",
        items: {
          type: 'string'
        }
      },
      autocompleteScopes: {
        type: 'array',
        "default": ['.source.css', '.source.css.less', '.source.sass', '.source.css.scss', '.source.stylus'],
        description: 'The autocomplete provider will only complete color names in editors whose scope is present in this list.',
        items: {
          type: 'string'
        }
      },
      extendAutocompleteToVariables: {
        type: 'boolean',
        "default": false,
        description: 'When enabled, the autocomplete provider will also provides completion for non-color variables.'
      },
      extendAutocompleteToColorValue: {
        type: 'boolean',
        "default": false,
        description: 'When enabled, the autocomplete provider will also provides color value.'
      },
      markerType: {
        type: 'string',
        "default": 'background',
        "enum": ['native-background', 'native-underline', 'native-outline', 'native-dot', 'native-square-dot', 'background', 'outline', 'underline', 'dot', 'square-dot', 'gutter']
      },
      sassShadeAndTintImplementation: {
        type: 'string',
        "default": 'compass',
        "enum": ['compass', 'bourbon'],
        description: "Sass doesn't provide any implementation for shade and tint function, and Compass and Bourbon have different implementation for these two methods. This setting allow you to chose which implementation to use."
      },
      sortPaletteColors: {
        type: 'string',
        "default": 'none',
        "enum": ['none', 'by name', 'by color']
      },
      groupPaletteColors: {
        type: 'string',
        "default": 'none',
        "enum": ['none', 'by file']
      },
      mergeColorDuplicates: {
        type: 'boolean',
        "default": false
      },
      delayBeforeScan: {
        type: 'integer',
        "default": 500,
        description: 'Number of milliseconds after which the current buffer will be scanned for changes in the colors. This delay starts at the end of the text input and will be aborted if you start typing again during the interval.'
      },
      ignoreVcsIgnoredPaths: {
        type: 'boolean',
        "default": true,
        title: 'Ignore VCS Ignored Paths'
      }
    },
    activate: function(state) {
      var convertMethod, copyMethod;
      this.patchAtom();
      this.project = state.project != null ? atom.deserializers.deserialize(state.project) : new ColorProject();
      atom.commands.add('atom-workspace', {
        'pigments:find-colors': (function(_this) {
          return function() {
            return _this.findColors();
          };
        })(this),
        'pigments:show-palette': (function(_this) {
          return function() {
            return _this.showPalette();
          };
        })(this),
        'pigments:project-settings': (function(_this) {
          return function() {
            return _this.showSettings();
          };
        })(this),
        'pigments:reload': (function(_this) {
          return function() {
            return _this.reloadProjectVariables();
          };
        })(this),
        'pigments:report': (function(_this) {
          return function() {
            return _this.createPigmentsReport();
          };
        })(this)
      });
      convertMethod = (function(_this) {
        return function(action) {
          return function(event) {
            var colorBuffer, editor;
            if (_this.lastEvent != null) {
              action(_this.colorMarkerForMouseEvent(_this.lastEvent));
            } else {
              editor = atom.workspace.getActiveTextEditor();
              colorBuffer = _this.project.colorBufferForEditor(editor);
              editor.getCursors().forEach(function(cursor) {
                var marker;
                marker = colorBuffer.getColorMarkerAtBufferPosition(cursor.getBufferPosition());
                return action(marker);
              });
            }
            return _this.lastEvent = null;
          };
        };
      })(this);
      copyMethod = (function(_this) {
        return function(action) {
          return function(event) {
            var colorBuffer, cursor, editor, marker;
            if (_this.lastEvent != null) {
              action(_this.colorMarkerForMouseEvent(_this.lastEvent));
            } else {
              editor = atom.workspace.getActiveTextEditor();
              colorBuffer = _this.project.colorBufferForEditor(editor);
              cursor = editor.getLastCursor();
              marker = colorBuffer.getColorMarkerAtBufferPosition(cursor.getBufferPosition());
              action(marker);
            }
            return _this.lastEvent = null;
          };
        };
      })(this);
      atom.commands.add('atom-text-editor', {
        'pigments:convert-to-hex': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToHex();
          }
        }),
        'pigments:convert-to-rgb': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToRGB();
          }
        }),
        'pigments:convert-to-rgba': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToRGBA();
          }
        }),
        'pigments:convert-to-hsl': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToHSL();
          }
        }),
        'pigments:convert-to-hsla': convertMethod(function(marker) {
          if (marker != null) {
            return marker.convertContentToHSLA();
          }
        }),
        'pigments:copy-as-hex': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsHex();
          }
        }),
        'pigments:copy-as-rgb': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsRGB();
          }
        }),
        'pigments:copy-as-rgba': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsRGBA();
          }
        }),
        'pigments:copy-as-hsl': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsHSL();
          }
        }),
        'pigments:copy-as-hsla': copyMethod(function(marker) {
          if (marker != null) {
            return marker.copyContentAsHSLA();
          }
        })
      });
      atom.workspace.addOpener((function(_this) {
        return function(uriToOpen) {
          var host, protocol, _ref2;
          url || (url = require('url'));
          _ref2 = url.parse(uriToOpen), protocol = _ref2.protocol, host = _ref2.host;
          if (protocol !== 'pigments:') {
            return;
          }
          switch (host) {
            case 'search':
              return _this.project.findAllColors();
            case 'palette':
              return _this.project.getPalette();
            case 'settings':
              return atom.views.getView(_this.project);
          }
        };
      })(this));
      return atom.contextMenu.add({
        'atom-text-editor': [
          {
            label: 'Pigments',
            submenu: [
              {
                label: 'Convert to hexadecimal',
                command: 'pigments:convert-to-hex'
              }, {
                label: 'Convert to RGB',
                command: 'pigments:convert-to-rgb'
              }, {
                label: 'Convert to RGBA',
                command: 'pigments:convert-to-rgba'
              }, {
                label: 'Convert to HSL',
                command: 'pigments:convert-to-hsl'
              }, {
                label: 'Convert to HSLA',
                command: 'pigments:convert-to-hsla'
              }, {
                type: 'separator'
              }, {
                label: 'Copy as hexadecimal',
                command: 'pigments:copy-as-hex'
              }, {
                label: 'Copy as RGB',
                command: 'pigments:copy-as-rgb'
              }, {
                label: 'Copy as RGBA',
                command: 'pigments:copy-as-rgba'
              }, {
                label: 'Copy as HSL',
                command: 'pigments:copy-as-hsl'
              }, {
                label: 'Copy as HSLA',
                command: 'pigments:copy-as-hsla'
              }
            ],
            shouldDisplay: (function(_this) {
              return function(event) {
                return _this.shouldDisplayContextMenu(event);
              };
            })(this)
          }
        ]
      });
    },
    deactivate: function() {
      var _ref2;
      return (_ref2 = this.getProject()) != null ? typeof _ref2.destroy === "function" ? _ref2.destroy() : void 0 : void 0;
    },
    provideAutocomplete: function() {
      if (PigmentsProvider == null) {
        PigmentsProvider = require('./pigments-provider');
      }
      return new PigmentsProvider(this);
    },
    provideAPI: function() {
      if (PigmentsAPI == null) {
        PigmentsAPI = require('./pigments-api');
      }
      return new PigmentsAPI(this.getProject());
    },
    consumeColorPicker: function(api) {
      this.getProject().setColorPickerAPI(api);
      return new Disposable((function(_this) {
        return function() {
          return _this.getProject().setColorPickerAPI(null);
        };
      })(this));
    },
    consumeColorExpressions: function(options) {
      var handle, name, names, priority, regexpString, registry, scopes;
      if (options == null) {
        options = {};
      }
      registry = this.getProject().getColorExpressionsRegistry();
      if (options.expressions != null) {
        names = options.expressions.map(function(e) {
          return e.name;
        });
        registry.createExpressions(options.expressions);
        return new Disposable(function() {
          var name, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = names.length; _i < _len; _i++) {
            name = names[_i];
            _results.push(registry.removeExpression(name));
          }
          return _results;
        });
      } else {
        name = options.name, regexpString = options.regexpString, handle = options.handle, scopes = options.scopes, priority = options.priority;
        registry.createExpression(name, regexpString, priority, scopes, handle);
        return new Disposable(function() {
          return registry.removeExpression(name);
        });
      }
    },
    consumeVariableExpressions: function(options) {
      var handle, name, names, priority, regexpString, registry, scopes;
      if (options == null) {
        options = {};
      }
      registry = this.getProject().getVariableExpressionsRegistry();
      if (options.expressions != null) {
        names = options.expressions.map(function(e) {
          return e.name;
        });
        registry.createExpressions(options.expressions);
        return new Disposable(function() {
          var name, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = names.length; _i < _len; _i++) {
            name = names[_i];
            _results.push(registry.removeExpression(name));
          }
          return _results;
        });
      } else {
        name = options.name, regexpString = options.regexpString, handle = options.handle, scopes = options.scopes, priority = options.priority;
        registry.createExpression(name, regexpString, priority, scopes, handle);
        return new Disposable(function() {
          return registry.removeExpression(name);
        });
      }
    },
    shouldDisplayContextMenu: function(event) {
      this.lastEvent = event;
      setTimeout(((function(_this) {
        return function() {
          return _this.lastEvent = null;
        };
      })(this)), 10);
      return this.colorMarkerForMouseEvent(event) != null;
    },
    colorMarkerForMouseEvent: function(event) {
      var colorBuffer, colorBufferElement, editor;
      editor = atom.workspace.getActiveTextEditor();
      colorBuffer = this.project.colorBufferForEditor(editor);
      colorBufferElement = atom.views.getView(colorBuffer);
      return colorBufferElement != null ? colorBufferElement.colorMarkerForMouseEvent(event) : void 0;
    },
    serialize: function() {
      return {
        project: this.project.serialize()
      };
    },
    getProject: function() {
      return this.project;
    },
    findColors: function() {
      var pane;
      pane = atom.workspace.paneForURI(uris.SEARCH);
      pane || (pane = atom.workspace.getActivePane());
      return atom.workspace.openURIInPane(uris.SEARCH, pane, {});
    },
    showPalette: function() {
      return this.project.initialize().then(function() {
        var pane;
        pane = atom.workspace.paneForURI(uris.PALETTE);
        pane || (pane = atom.workspace.getActivePane());
        return atom.workspace.openURIInPane(uris.PALETTE, pane, {});
      })["catch"](function(reason) {
        return console.error(reason);
      });
    },
    showSettings: function() {
      return this.project.initialize().then(function() {
        var pane;
        pane = atom.workspace.paneForURI(uris.SETTINGS);
        pane || (pane = atom.workspace.getActivePane());
        return atom.workspace.openURIInPane(uris.SETTINGS, pane, {});
      })["catch"](function(reason) {
        return console.error(reason);
      });
    },
    reloadProjectVariables: function() {
      return this.project.initialize().then((function(_this) {
        return function() {
          return _this.project.loadPathsAndVariables();
        };
      })(this))["catch"](function(reason) {
        return console.error(reason);
      });
    },
    createPigmentsReport: function() {
      return atom.workspace.open('pigments-report.json').then((function(_this) {
        return function(editor) {
          return editor.setText(_this.createReport());
        };
      })(this));
    },
    createReport: function() {
      var o;
      o = {
        atom: atom.getVersion(),
        pigments: atom.packages.getLoadedPackage('pigments').metadata.version,
        platform: require('os').platform(),
        config: atom.config.get('pigments'),
        project: {
          config: {
            sourceNames: this.project.sourceNames,
            searchNames: this.project.searchNames,
            ignoredNames: this.project.ignoredNames,
            ignoredScopes: this.project.ignoredScopes,
            includeThemes: this.project.includeThemes,
            ignoreGlobalSourceNames: this.project.ignoreGlobalSourceNames,
            ignoreGlobalSearchNames: this.project.ignoreGlobalSearchNames,
            ignoreGlobalIgnoredNames: this.project.ignoreGlobalIgnoredNames,
            ignoreGlobalIgnoredScopes: this.project.ignoreGlobalIgnoredScopes
          },
          paths: this.project.getPaths(),
          variables: {
            colors: this.project.getColorVariables().length,
            total: this.project.getVariables().length
          }
        }
      };
      return JSON.stringify(o, null, 2).replace(RegExp("" + (atom.project.getPaths().join('|')), "g"), '<root>');
    },
    patchAtom: function() {
      var HighlightComponent, TextEditorPresenter, requireCore, _buildHighlightRegions, _updateHighlightRegions;
      requireCore = function(name) {
        return require(Object.keys(require.cache).filter(function(s) {
          return s.indexOf(name) > -1;
        })[0]);
      };
      HighlightComponent = requireCore('highlights-component');
      TextEditorPresenter = requireCore('text-editor-presenter');
      if (TextEditorPresenter.getTextInScreenRange == null) {
        TextEditorPresenter.prototype.getTextInScreenRange = function(screenRange) {
          if (this.displayLayer != null) {
            return this.model.getTextInRange(this.displayLayer.translateScreenRange(screenRange));
          } else {
            return this.model.getTextInRange(this.model.bufferRangeForScreenRange(screenRange));
          }
        };
        _buildHighlightRegions = TextEditorPresenter.prototype.buildHighlightRegions;
        TextEditorPresenter.prototype.buildHighlightRegions = function(screenRange) {
          var regions;
          regions = _buildHighlightRegions.call(this, screenRange);
          if (regions.length === 1) {
            regions[0].text = this.getTextInScreenRange(screenRange);
          } else {
            regions[0].text = this.getTextInScreenRange([screenRange.start, [screenRange.start.row, Infinity]]);
            regions[regions.length - 1].text = this.getTextInScreenRange([[screenRange.end.row, 0], screenRange.end]);
            if (regions.length > 2) {
              regions[1].text = this.getTextInScreenRange([[screenRange.start.row + 1, 0], [screenRange.end.row - 1, Infinity]]);
            }
          }
          return regions;
        };
        _updateHighlightRegions = HighlightComponent.prototype.updateHighlightRegions;
        return HighlightComponent.prototype.updateHighlightRegions = function(id, newHighlightState) {
          var i, newRegionState, regionNode, _i, _len, _ref2, _ref3, _results;
          _updateHighlightRegions.call(this, id, newHighlightState);
          if ((_ref2 = newHighlightState["class"]) != null ? _ref2.match(/^pigments-native-background\s/) : void 0) {
            _ref3 = newHighlightState.regions;
            _results = [];
            for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
              newRegionState = _ref3[i];
              regionNode = this.regionNodesByHighlightId[id][i];
              if (newRegionState.text != null) {
                _results.push(regionNode.textContent = newRegionState.text);
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
      }
    },
    loadDeserializersAndRegisterViews: function() {
      var ColorBuffer, ColorBufferElement, ColorMarkerElement, ColorProjectElement, ColorResultsElement, ColorSearch, Palette, PaletteElement, VariablesCollection;
      ColorBuffer = require('./color-buffer');
      ColorSearch = require('./color-search');
      Palette = require('./palette');
      ColorBufferElement = require('./color-buffer-element');
      ColorMarkerElement = require('./color-marker-element');
      ColorResultsElement = require('./color-results-element');
      ColorProjectElement = require('./color-project-element');
      PaletteElement = require('./palette-element');
      VariablesCollection = require('./variables-collection');
      ColorBufferElement.registerViewProvider(ColorBuffer);
      ColorResultsElement.registerViewProvider(ColorSearch);
      ColorProjectElement.registerViewProvider(ColorProject);
      PaletteElement.registerViewProvider(Palette);
      atom.deserializers.add(Palette);
      atom.deserializers.add(ColorSearch);
      atom.deserializers.add(ColorProject);
      atom.deserializers.add(ColorProjectElement);
      return atom.deserializers.add(VariablesCollection);
    }
  };

  module.exports.loadDeserializersAndRegisterViews();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9waWdtZW50cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0dBQUE7O0FBQUEsRUFBQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBQXRCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUZmLENBQUE7O0FBQUEsRUFHQSxRQUF1QyxFQUF2QyxFQUFDLDJCQUFELEVBQW1CLHNCQUFuQixFQUFnQyxjQUhoQyxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSw4QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FERjtBQUFBLE1BR0EsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBQ1AsV0FETyxFQUVQLGFBRk8sRUFHUCxXQUhPLEVBSVAsV0FKTyxFQUtQLFdBTE8sQ0FEVDtBQUFBLFFBUUEsV0FBQSxFQUFhLCtDQVJiO0FBQUEsUUFTQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBVkY7T0FKRjtBQUFBLE1BZUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBQ1AsVUFETyxFQUVQLGdCQUZPLEVBR1AsUUFITyxFQUlQLFFBSk8sQ0FEVDtBQUFBLFFBT0EsV0FBQSxFQUFhLDJFQVBiO0FBQUEs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/pigments.coffee
