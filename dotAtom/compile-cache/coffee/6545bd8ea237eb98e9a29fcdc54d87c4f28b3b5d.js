(function() {
  module.exports = function(projectPath) {
    var babel, babelCoreUsed, callback, path, projectBabelCore;
    path = require('path');
    callback = this.async();
    process.chdir(projectPath);
    projectBabelCore = path.normalize(path.join(projectPath, '/node_modules/babel-core'));
    try {
      babel = require(projectBabelCore);
    } catch (_error) {
      projectBabelCore = '../node_modules/babel-core';
      babel = require(projectBabelCore);
    }
    babelCoreUsed = "Using babel-core at\n" + (require.resolve(projectBabelCore));
    return process.on('message', function(mObj) {
      var err, msgRet;
      if (mObj.command === 'transpile') {
        try {
          babel.transformFile(mObj.pathTo.sourceFile, mObj.babelOptions, (function(_this) {
            return function(err, result) {
              var msgRet;
              msgRet = {};
              msgRet.reqId = mObj.reqId;
              if (err) {
                msgRet.err = {};
                if (err.loc) {
                  msgRet.err.loc = err.loc;
                }
                if (err.codeFrame) {
                  msgRet.err.codeFrame = err.codeFrame;
                } else {
                  msgRet.err.codeFrame = "";
                }
                msgRet.err.message = err.message;
              }
              if (result) {
                msgRet.result = result;
                msgRet.result.ast = null;
              }
              msgRet.babelVersion = babel.version;
              msgRet.babelCoreUsed = babelCoreUsed;
              emit("transpile:" + mObj.reqId, msgRet);
              if (!mObj.pathTo.sourceFileInProject) {
                return callback();
              }
            };
          })(this));
        } catch (_error) {
          err = _error;
          msgRet = {};
          msgRet.reqId = mObj.reqId;
          msgRet.err = {};
          msgRet.err.message = err.message;
          msgRet.err.stack = err.stack;
          msgRet.babelCoreUsed = babelCoreUsed;
          emit("transpile:" + mObj.reqId, msgRet);
          callback();
        }
      }
      if (mObj.command === 'transpileCode') {
        try {
          msgRet = babel.transform(mObj.code, mObj.babelOptions);
          msgRet.babelVersion = babel.version;
          msgRet.babelCoreUsed = babelCoreUsed;
          emit("transpile:" + mObj.reqId, msgRet);
          if (!mObj.pathTo.sourceFileInProject) {
            callback();
          }
        } catch (_error) {
          err = _error;
          msgRet = {};
          msgRet.reqId = mObj.reqId;
          msgRet.err = {};
          msgRet.err.message = err.message;
          msgRet.err.stack = err.stack;
          msgRet.babelVersion = babel.version;
          msgRet.babelCoreUsed = babelCoreUsed;
          emit("transpile:" + mObj.reqId, msgRet);
          callback();
        }
      }
      if (mObj.command === 'stop') {
        return callback();
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi90cmFuc3BpbGVyLXRhc2suY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRCxHQUFBO0FBQ2YsUUFBQSxzREFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FEWCxDQUFBO0FBQUEsSUFFQSxPQUFPLENBQUMsS0FBUixDQUFjLFdBQWQsQ0FGQSxDQUFBO0FBQUEsSUFJQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsU0FBTCxDQUFnQixJQUFJLENBQUMsSUFBTCxDQUFXLFdBQVgsRUFBd0IsMEJBQXhCLENBQWhCLENBSm5CLENBQUE7QUFLQTtBQUNFLE1BQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUixDQUFSLENBREY7S0FBQSxjQUFBO0FBSUUsTUFBQSxnQkFBQSxHQUFtQiw0QkFBbkIsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUixDQURSLENBSkY7S0FMQTtBQUFBLElBWUEsYUFBQSxHQUFpQix1QkFBQSxHQUFzQixDQUFDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGdCQUFoQixDQUFELENBWnZDLENBQUE7V0FjQSxPQUFPLENBQUMsRUFBUixDQUFXLFNBQVgsRUFBc0IsU0FBQyxJQUFELEdBQUE7QUFDcEIsVUFBQSxXQUFBO0FBQUEsTUFBQSxJQUFHLElBQUksQ0FBQyxPQUFMLEtBQWdCLFdBQW5CO0FBQ0U7QUFDRSxVQUFBLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBaEMsRUFBNEMsSUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/language-babel/lib/transpiler-task.coffee
