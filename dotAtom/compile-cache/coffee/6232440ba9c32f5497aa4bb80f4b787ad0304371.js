(function() {
  var CodeContext, CodeContextBuilder, Emitter, grammarMap;

  CodeContext = require('./code-context');

  grammarMap = require('./grammars');

  Emitter = require('atom').Emitter;

  module.exports = CodeContextBuilder = (function() {
    function CodeContextBuilder(emitter) {
      this.emitter = emitter != null ? emitter : new Emitter;
    }

    CodeContextBuilder.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    CodeContextBuilder.prototype.buildCodeContext = function(editor, argType) {
      var codeContext, cursor;
      if (argType == null) {
        argType = 'Selection Based';
      }
      if (editor == null) {
        return;
      }
      codeContext = this.initCodeContext(editor);
      codeContext.argType = argType;
      if (argType === 'Line Number Based') {
        editor.save();
      } else if (codeContext.selection.isEmpty() && (codeContext.filepath != null)) {
        codeContext.argType = 'File Based';
        if (editor != null ? editor.isModified() : void 0) {
          editor.save();
        }
      }
      if (argType !== 'File Based') {
        cursor = editor.getLastCursor();
        codeContext.lineNumber = cursor.getScreenRow() + 1;
      }
      return codeContext;
    };

    CodeContextBuilder.prototype.initCodeContext = function(editor) {
      var codeContext, filename, filepath, ignoreSelection, lang, selection, textSource;
      filename = editor.getTitle();
      filepath = editor.getPath();
      selection = editor.getLastSelection();
      ignoreSelection = atom.config.get('script.ignoreSelection');
      if (selection.isEmpty() || ignoreSelection) {
        textSource = editor;
      } else {
        textSource = selection;
      }
      codeContext = new CodeContext(filename, filepath, textSource);
      codeContext.selection = selection;
      codeContext.shebang = this.getShebang(editor);
      lang = this.getLang(editor);
      if (this.validateLang(lang)) {
        codeContext.lang = lang;
      }
      return codeContext;
    };

    CodeContextBuilder.prototype.getShebang = function(editor) {
      var firstLine, lines, text;
      text = editor.getText();
      lines = text.split("\n");
      firstLine = lines[0];
      if (!firstLine.match(/^#!/)) {
        return;
      }
      return firstLine.replace(/^#!\s*/, '');
    };

    CodeContextBuilder.prototype.getLang = function(editor) {
      return editor.getGrammar().name;
    };

    CodeContextBuilder.prototype.validateLang = function(lang) {
      var valid;
      valid = true;
      if (lang === 'Null Grammar' || lang === 'Plain Text') {
        this.emitter.emit('did-not-specify-language');
        valid = false;
      } else if (!(lang in grammarMap)) {
        this.emitter.emit('did-not-support-language', {
          lang: lang
        });
        valid = false;
      }
      return valid;
    };

    CodeContextBuilder.prototype.onDidNotSpecifyLanguage = function(callback) {
      return this.emitter.on('did-not-specify-language', callback);
    };

    CodeContextBuilder.prototype.onDidNotSupportLanguage = function(callback) {
      return this.emitter.on('did-not-support-language', callback);
    };

    return CodeContextBuilder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvY29kZS1jb250ZXh0LWJ1aWxkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0MsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BSEQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLDRCQUFFLE9BQUYsR0FBQTtBQUEwQixNQUF6QixJQUFDLENBQUEsNEJBQUEsVUFBVSxHQUFBLENBQUEsT0FBYyxDQUExQjtJQUFBLENBQWI7O0FBQUEsaUNBRUEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBLEVBRE87SUFBQSxDQUZULENBQUE7O0FBQUEsaUNBZUEsZ0JBQUEsR0FBa0IsU0FBQyxNQUFELEVBQVMsT0FBVCxHQUFBO0FBQ2hCLFVBQUEsbUJBQUE7O1FBRHlCLFVBQVE7T0FDakM7QUFBQSxNQUFBLElBQWMsY0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxXQUFBLEdBQWMsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBakIsQ0FGZCxDQUFBO0FBQUEsTUFJQSxXQUFXLENBQUMsT0FBWixHQUFzQixPQUp0QixDQUFBO0FBTUEsTUFBQSxJQUFHLE9BQUEsS0FBVyxtQkFBZDtBQUNFLFFBQUEsTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFBLENBREY7T0FBQSxNQUVLLElBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUF0QixDQUFBLENBQUEsSUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/code-context-builder.coffee
