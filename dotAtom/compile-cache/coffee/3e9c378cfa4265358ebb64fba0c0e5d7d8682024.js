(function() {
  module.exports = {
    allowLocalOverride: {
      description: 'Allow .languagebabel files to overide the settings below. Useful for project based configurations.',
      type: 'boolean',
      "default": false,
      order: 30
    },
    transpileOnSave: {
      description: 'Check source code validity on file save. Use "Create Transpiled Code" option below to save file.',
      type: 'boolean',
      "default": false,
      order: 40
    },
    createTranspiledCode: {
      description: 'Save transpiled code to Babel Transpile Path below.',
      type: 'boolean',
      "default": false,
      order: 50
    },
    disableWhenNoBabelrcFileInPath: {
      description: 'Suppress transpile when no .babelrc file is in source file path.',
      type: 'boolean',
      "default": true,
      order: 60
    },
    suppressTranspileOnSaveMessages: {
      description: 'Suppress non-error notification messages on each save.',
      type: 'boolean',
      "default": true,
      order: 70
    },
    suppressSourcePathMessages: {
      description: 'Suppress messages about file not being inside Babel Source Path.',
      type: 'boolean',
      "default": true,
      order: 75
    },
    createMap: {
      description: 'Create separate map file.',
      type: 'boolean',
      "default": false,
      order: 80
    },
    babelMapsAddUrl: {
      description: 'Append map file name to transpiled output if "Create separate map file" is set.',
      type: 'boolean',
      "default": true,
      order: 90
    },
    babelSourcePath: {
      description: 'Babel Source Root based on Project root.',
      type: 'string',
      "default": '',
      order: 100
    },
    babelTranspilePath: {
      description: 'Babel Transpile Root based on Project root.',
      type: 'string',
      "default": '',
      order: 120
    },
    babelMapsPath: {
      description: 'Babel Maps Root based on Project root.',
      type: 'string',
      "default": '',
      order: 130
    },
    createTargetDirectories: {
      description: 'Create transpile output target directories.',
      type: 'boolean',
      "default": true,
      order: 140
    },
    autoIndentJSX: {
      title: 'Auto Indent JSX',
      description: 'Auto Indent JSX using default or eslintrc rules',
      type: 'boolean',
      "default": false,
      order: 160
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9jb25maWcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGtCQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxvR0FBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQURGO0FBQUEsSUFLQSxlQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxrR0FBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQU5GO0FBQUEsSUFVQSxvQkFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEscURBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0FYRjtBQUFBLElBZUEsOEJBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLGtFQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxFQUhQO0tBaEJGO0FBQUEsSUFvQkEsK0JBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLHdEQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxFQUhQO0tBckJGO0FBQUEsSUF5QkEsMEJBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLGtFQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLE1BRUEsU0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxFQUhQO0tBMUJGO0FBQUEsSUE4QkEsU0FBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsMkJBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7S0EvQkY7QUFBQSxJQW1DQSxlQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxpRkFBYjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxNQUVBLFNBQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtLQXBDRjtBQUFBLElBd0NBLGVBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLDBDQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEVBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxHQUhQO0tBekNGO0FBQUEsSUE2Q0Esa0JBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLDZDQUFiO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsU0FBQSxFQUFTLEVBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxHQUhQO0tBOUNGO0FBQUEsSUFrREEsYUFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsd0NBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsRUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEdBSFA7S0FuREY7QUFBQSxJQXVEQSx1QkFBQSxFQUNFO0FBQUEsTUFBQSxXQUFBLEVBQWEsNkNBQWI7QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsSUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLEdBSFA7S0F4REY7QUFBQSxJQTREQSxhQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxpQkFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLGlEQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLEtBSFQ7QUFBQSxNQUlBLEtBQUEsRUFBTyxHQUpQO0tBN0RGO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/language-babel/lib/config.coffee
