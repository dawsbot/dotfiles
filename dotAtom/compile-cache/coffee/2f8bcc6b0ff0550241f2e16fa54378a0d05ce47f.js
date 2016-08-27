(function() {
  var ColorProjectElement, CompositeDisposable, EventsDelegation, SpacePenDSL, capitalize, registerOrUpdateElement, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-utils'), SpacePenDSL = _ref.SpacePenDSL, EventsDelegation = _ref.EventsDelegation, registerOrUpdateElement = _ref.registerOrUpdateElement;

  capitalize = function(s) {
    return s.replace(/^./, function(m) {
      return m.toUpperCase();
    });
  };

  ColorProjectElement = (function(_super) {
    __extends(ColorProjectElement, _super);

    function ColorProjectElement() {
      return ColorProjectElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(ColorProjectElement);

    EventsDelegation.includeInto(ColorProjectElement);

    ColorProjectElement.content = function() {
      var arrayField, booleanField, selectField;
      arrayField = (function(_this) {
        return function(name, label, setting, description) {
          var settingName;
          settingName = "pigments." + name;
          return _this.div({
            "class": 'control-group array'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.label({
                "class": 'control-label'
              }, function() {
                return _this.span({
                  "class": 'setting-title'
                }, label);
              });
              return _this.div({
                "class": 'control-wrapper'
              }, function() {
                _this.tag('atom-text-editor', {
                  mini: true,
                  outlet: name,
                  type: 'array',
                  property: name
                });
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  _this.div(function() {
                    _this.raw("Global config: <code>" + (atom.config.get(setting != null ? setting : settingName).join(', ')) + "</code>");
                    if (description != null) {
                      return _this.p(function() {
                        return _this.raw(description);
                      });
                    }
                  });
                  return booleanField("ignoreGlobal" + (capitalize(name)), 'Ignore Global', null, true);
                });
              });
            });
          });
        };
      })(this);
      selectField = (function(_this) {
        return function(name, label, _arg) {
          var description, options, setting, settingName, useBoolean, _ref1;
          _ref1 = _arg != null ? _arg : {}, options = _ref1.options, setting = _ref1.setting, description = _ref1.description, useBoolean = _ref1.useBoolean;
          settingName = "pigments." + name;
          return _this.div({
            "class": 'control-group array'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.label({
                "class": 'control-label'
              }, function() {
                return _this.span({
                  "class": 'setting-title'
                }, label);
              });
              return _this.div({
                "class": 'control-wrapper'
              }, function() {
                _this.select({
                  outlet: name,
                  "class": 'form-control',
                  required: true
                }, function() {
                  return options.forEach(function(option) {
                    if (option === '') {
                      return _this.option({
                        value: option
                      }, 'Use global config');
                    } else {
                      return _this.option({
                        value: option
                      }, capitalize(option));
                    }
                  });
                });
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  _this.div(function() {
                    _this.raw("Global config: <code>" + (atom.config.get(setting != null ? setting : settingName)) + "</code>");
                    if (description != null) {
                      return _this.p(function() {
                        return _this.raw(description);
                      });
                    }
                  });
                  if (useBoolean) {
                    return booleanField("ignoreGlobal" + (capitalize(name)), 'Ignore Global', null, true);
                  }
                });
              });
            });
          });
        };
      })(this);
      booleanField = (function(_this) {
        return function(name, label, description, nested) {
          return _this.div({
            "class": 'control-group boolean'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.input({
                type: 'checkbox',
                id: "pigments-" + name,
                outlet: name
              });
              _this.label({
                "class": 'control-label',
                "for": "pigments-" + name
              }, function() {
                return _this.span({
                  "class": (nested ? 'setting-description' : 'setting-title')
                }, label);
              });
              if (description != null) {
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  return _this.raw(description);
                });
              }
            });
          });
        };
      })(this);
      return this.section({
        "class": 'settings-view pane-item'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'settings-wrapper'
          }, function() {
            _this.div({
              "class": 'header'
            }, function() {
              _this.div({
                "class": 'logo'
              }, function() {
                return _this.img({
                  src: 'atom://pigments/resources/logo.svg',
                  width: 140,
                  height: 35
                });
              });
              return _this.p({
                "class": 'setting-description'
              }, "These settings apply on the current project only and are complementary\nto the package settings.");
            });
            return _this.div({
              "class": 'fields'
            }, function() {
              var themes;
              themes = atom.themes.getActiveThemeNames();
              arrayField('sourceNames', 'Source Names');
              arrayField('ignoredNames', 'Ignored Names');
              arrayField('supportedFiletypes', 'Supported Filetypes');
              arrayField('ignoredScopes', 'Ignored Scopes');
              arrayField('searchNames', 'Extended Search Names', 'pigments.extendedSearchNames');
              selectField('sassShadeAndTintImplementation', 'Sass Shade And Tint Implementation', {
                options: ['', 'compass', 'bourbon'],
                setting: 'pigments.sassShadeAndTintImplementation',
                description: "Sass doesn't provide any implementation for shade and tint function, and Compass and Bourbon have different implementation for these two methods. This setting allow you to chose which implementation use."
              });
              return booleanField('includeThemes', 'Include Atom Themes Stylesheets', "The variables from <code>" + themes[0] + "</code> and\n<code>" + themes[1] + "</code> themes will be automatically added to the\nproject palette.");
            });
          });
        };
      })(this));
    };

    ColorProjectElement.prototype.createdCallback = function() {
      return this.subscriptions = new CompositeDisposable;
    };

    ColorProjectElement.prototype.setModel = function(project) {
      this.project = project;
      return this.initializeBindings();
    };

    ColorProjectElement.prototype.initializeBindings = function() {
      var grammar;
      grammar = atom.grammars.grammarForScopeName('source.js.regexp');
      this.ignoredScopes.getModel().setGrammar(grammar);
      this.initializeTextEditor('sourceNames');
      this.initializeTextEditor('searchNames');
      this.initializeTextEditor('ignoredNames');
      this.initializeTextEditor('ignoredScopes');
      this.initializeTextEditor('supportedFiletypes');
      this.initializeCheckbox('includeThemes');
      this.initializeCheckbox('ignoreGlobalSourceNames');
      this.initializeCheckbox('ignoreGlobalIgnoredNames');
      this.initializeCheckbox('ignoreGlobalIgnoredScopes');
      this.initializeCheckbox('ignoreGlobalSearchNames');
      this.initializeCheckbox('ignoreGlobalSupportedFiletypes');
      return this.initializeSelect('sassShadeAndTintImplementation');
    };

    ColorProjectElement.prototype.initializeTextEditor = function(name) {
      var capitalizedName, editor, _ref1;
      capitalizedName = capitalize(name);
      editor = this[name].getModel();
      editor.setText(((_ref1 = this.project[name]) != null ? _ref1 : []).join(', '));
      return this.subscriptions.add(editor.onDidStopChanging((function(_this) {
        return function() {
          var array;
          array = editor.getText().split(/\s*,\s*/g).filter(function(s) {
            return s.length > 0;
          });
          return _this.project["set" + capitalizedName](array);
        };
      })(this)));
    };

    ColorProjectElement.prototype.initializeSelect = function(name) {
      var capitalizedName, optionValues, select;
      capitalizedName = capitalize(name);
      select = this[name];
      optionValues = [].slice.call(select.querySelectorAll('option')).map(function(o) {
        return o.value;
      });
      if (this.project[name]) {
        select.selectedIndex = optionValues.indexOf(this.project[name]);
      }
      return this.subscriptions.add(this.subscribeTo(select, {
        change: (function(_this) {
          return function() {
            var value, _ref1;
            value = (_ref1 = select.selectedOptions[0]) != null ? _ref1.value : void 0;
            return _this.project["set" + capitalizedName](value === '' ? null : value);
          };
        })(this)
      }));
    };

    ColorProjectElement.prototype.initializeCheckbox = function(name) {
      var capitalizedName, checkbox;
      capitalizedName = capitalize(name);
      checkbox = this[name];
      checkbox.checked = this.project[name];
      return this.subscriptions.add(this.subscribeTo(checkbox, {
        change: (function(_this) {
          return function() {
            return _this.project["set" + capitalizedName](checkbox.checked);
          };
        })(this)
      }));
    };

    ColorProjectElement.prototype.getTitle = function() {
      return 'Project Settings';
    };

    ColorProjectElement.prototype.getURI = function() {
      return 'pigments://settings';
    };

    ColorProjectElement.prototype.getIconName = function() {
      return "pigments";
    };

    ColorProjectElement.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name
      };
    };

    return ColorProjectElement;

  })(HTMLElement);

  module.exports = ColorProjectElement = registerOrUpdateElement('pigments-color-project', ColorProjectElement.prototype);

  ColorProjectElement.deserialize = function(state) {
    var element;
    element = new ColorProjectElement;
    element.setModel(atom.packages.getActivePackage('pigments').mainModule.getProject());
    return element;
  };

  ColorProjectElement.registerViewProvider = function(modelClass) {
    return atom.views.addViewProvider(modelClass, function(model) {
      var element;
      element = new ColorProjectElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1wcm9qZWN0LWVsZW1lbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQTJELE9BQUEsQ0FBUSxZQUFSLENBQTNELEVBQUMsbUJBQUEsV0FBRCxFQUFjLHdCQUFBLGdCQUFkLEVBQWdDLCtCQUFBLHVCQURoQyxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLFNBQUMsQ0FBRCxHQUFBO1dBQU8sQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLFNBQUMsQ0FBRCxHQUFBO2FBQU8sQ0FBQyxDQUFDLFdBQUYsQ0FBQSxFQUFQO0lBQUEsQ0FBaEIsRUFBUDtFQUFBLENBSGIsQ0FBQTs7QUFBQSxFQUtNO0FBQ0osMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsV0FBVyxDQUFDLFdBQVosQ0FBd0IsbUJBQXhCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLG1CQUE3QixDQURBLENBQUE7O0FBQUEsSUFHQSxtQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLHFDQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxPQUFkLEVBQXVCLFdBQXZCLEdBQUE7QUFDWCxjQUFBLFdBQUE7QUFBQSxVQUFBLFdBQUEsR0FBZSxXQUFBLEdBQVcsSUFBMUIsQ0FBQTtpQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8s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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/color-project-element.coffee
