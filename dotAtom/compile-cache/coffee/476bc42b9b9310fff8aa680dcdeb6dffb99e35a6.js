(function() {
  var Pigments, registry;

  registry = require('../../lib/color-expressions');

  Pigments = require('../../lib/pigments');

  beforeEach(function() {
    Pigments.loadDeserializersAndRegisterViews();
    return registry.removeExpression('pigments:variables');
  });

  afterEach(function() {
    return registry.removeExpression('pigments:variables');
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvaGVscGVycy9zcGVjLWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDZCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsb0JBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULElBQUEsUUFBUSxDQUFDLGlDQUFULENBQUEsQ0FBQSxDQUFBO1dBQ0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLG9CQUExQixFQUZTO0VBQUEsQ0FBWCxDQUhBLENBQUE7O0FBQUEsRUFPQSxTQUFBLENBQVUsU0FBQSxHQUFBO1dBQ1IsUUFBUSxDQUFDLGdCQUFULENBQTBCLG9CQUExQixFQURRO0VBQUEsQ0FBVixDQVBBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/helpers/spec-helper.coffee
