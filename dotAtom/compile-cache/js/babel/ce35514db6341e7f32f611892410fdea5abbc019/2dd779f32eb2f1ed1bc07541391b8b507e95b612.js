Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.activate = activate;
exports.deactivate = deactivate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _loophole = require('loophole');

var _atomSetText = require('atom-set-text');

var _atomSetText2 = _interopRequireDefault(_atomSetText);

var _pkgDir = require('pkg-dir');

var _pkgDir2 = _interopRequireDefault(_pkgDir);

var _loadJsonFile = require('load-json-file');

var lintText = undefined;
(0, _loophole.allowUnsafeNewFunction)(function () {
	lintText = require('xo').lintText;
});

function lint(textEditor) {
	var filePath = textEditor.getPath();
	var report = undefined;

	var dir = _pkgDir2['default'].sync(_path2['default'].dirname(filePath));

	// no package.json
	if (!dir) {
		return [];
	}

	// ugly hack to workaround ESLint's lack of a `cwd` option
	var defaultCwd = process.cwd();
	process.chdir(dir);

	var pkg = (0, _loadJsonFile.sync)(_path2['default'].join(dir, 'package.json'));

	// only lint when `xo` is a dependency
	if (!(pkg.dependencies && pkg.dependencies.xo) && !(pkg.devDependencies && pkg.devDependencies.xo)) {
		return [];
	}

	(0, _loophole.allowUnsafeNewFunction)(function () {
		report = lintText(textEditor.getText(), { cwd: dir });
	});

	process.chdir(defaultCwd);

	var ret = [];

	report.results.forEach(function (result) {
		result.messages.forEach(function (x) {
			ret.push({
				filePath: filePath,
				type: x.severity === 2 ? 'Error' : 'Warning',
				text: x.message + ' (' + x.ruleId + ')',
				range: [[x.line - 1, x.column - 1], [x.line - 1, x.column - 1]]
			});
		});
	});

	return ret;
}

var provideLinter = function provideLinter() {
	return {
		name: 'xo',
		grammarScopes: ['source.js', 'source.jsx', 'source.js.jsx'],
		scope: 'file',
		lintOnFly: true,
		lint: lint
	};
};

exports.provideLinter = provideLinter;

function activate() {
	require('atom-package-deps').install();

	this.subscriptions = new _atom.CompositeDisposable();
	this.subscriptions.add(atom.commands.add('atom-text-editor', {
		'XO:Fix': function XOFix() {
			var editor = atom.workspace.getActiveTextEditor();

			if (!editor) {
				return;
			}

			var report = undefined;

			(0, _loophole.allowUnsafeNewFunction)(function () {
				report = lintText(editor.getText(), {
					fix: true,
					cwd: _path2['default'].dirname(editor.getPath())
				});
			});

			(0, _atomSetText2['default'])(report.results[0].output);
		}
	}));
}

function deactivate() {
	this.subscriptions.dispose();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9saW50ZXIteG8vaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFDaUIsTUFBTTs7OztvQkFDVyxNQUFNOzt3QkFDSCxVQUFVOzsyQkFDM0IsZUFBZTs7OztzQkFDaEIsU0FBUzs7Ozs0QkFDRyxnQkFBZ0I7O0FBRS9DLElBQUksUUFBUSxZQUFBLENBQUM7QUFDYixzQ0FBdUIsWUFBTTtBQUM1QixTQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQztDQUNsQyxDQUFDLENBQUM7O0FBRUgsU0FBUyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3pCLEtBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN0QyxLQUFJLE1BQU0sWUFBQSxDQUFDOztBQUVYLEtBQU0sR0FBRyxHQUFHLG9CQUFPLElBQUksQ0FBQyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O0FBR2hELEtBQUksQ0FBQyxHQUFHLEVBQUU7QUFDVCxTQUFPLEVBQUUsQ0FBQztFQUNWOzs7QUFHRCxLQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDakMsUUFBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsS0FBTSxHQUFHLEdBQUcsd0JBQVMsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDOzs7QUFHckQsS0FBSSxFQUFFLEdBQUcsQ0FBQyxZQUFZLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUEsQUFBQyxJQUM3QyxFQUFFLEdBQUcsQ0FBQyxlQUFlLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUEsQUFBQyxFQUFFO0FBQ2xELFNBQU8sRUFBRSxDQUFDO0VBQ1Y7O0FBRUQsdUNBQXVCLFlBQU07QUFDNUIsUUFBTSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztFQUNwRCxDQUFDLENBQUM7O0FBRUgsUUFBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFMUIsS0FBTSxHQUFHLEdBQUcsRUFBRSxDQUFDOztBQUVmLE9BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ2hDLFFBQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxFQUFJO0FBQzVCLE1BQUcsQ0FBQyxJQUFJLENBQUM7QUFDUixZQUFRLEVBQVIsUUFBUTtBQUNSLFFBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsR0FBRyxPQUFPLEdBQUcsU0FBUztBQUM1QyxRQUFJLEVBQUssQ0FBQyxDQUFDLE9BQU8sVUFBSyxDQUFDLENBQUMsTUFBTSxNQUFHO0FBQ2xDLFNBQUssRUFBRSxDQUNOLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFDMUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUMxQjtJQUNELENBQUMsQ0FBQztHQUNILENBQUMsQ0FBQztFQUNILENBQUMsQ0FBQzs7QUFFSCxRQUFPLEdBQUcsQ0FBQztDQUNYOztBQUVNLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWE7UUFBVTtBQUNuQyxNQUFJLEVBQUUsSUFBSTtBQUNWLGVBQWEsRUFBRSxDQUNkLFdBQVcsRUFDWCxZQUFZLEVBQ1osZUFBZSxDQUNmO0FBQ0QsT0FBSyxFQUFFLE1BQU07QUFDYixXQUFTLEVBQUUsSUFBSTtBQUNmLE1BQUksRUFBSixJQUFJO0VBQ0o7Q0FBQyxDQUFDOzs7O0FBRUksU0FBUyxRQUFRLEdBQUc7QUFDMUIsUUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRXZDLEtBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUU7QUFDNUQsVUFBUSxFQUFFLGlCQUFNO0FBQ2YsT0FBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUVwRCxPQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1osV0FBTztJQUNQOztBQUVELE9BQUksTUFBTSxZQUFBLENBQUM7O0FBRVgseUNBQXVCLFlBQU07QUFDNUIsVUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDbkMsUUFBRyxFQUFFLElBQUk7QUFDVCxRQUFHLEVBQUUsa0JBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNuQyxDQUFDLENBQUM7SUFDSCxDQUFDLENBQUM7O0FBRUgsaUNBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUNsQztFQUNELENBQUMsQ0FBQyxDQUFDO0NBQ0o7O0FBRU0sU0FBUyxVQUFVLEdBQUc7QUFDNUIsS0FBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztDQUM3QiIsImZpbGUiOiIvVXNlcnMvZGF3c29uYm90c2ZvcmQvLmF0b20vcGFja2FnZXMvbGludGVyLXhvL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHthbGxvd1Vuc2FmZU5ld0Z1bmN0aW9ufSBmcm9tICdsb29waG9sZSc7XG5pbXBvcnQgc2V0VGV4dCBmcm9tICdhdG9tLXNldC10ZXh0JztcbmltcG9ydCBwa2dEaXIgZnJvbSAncGtnLWRpcic7XG5pbXBvcnQge3N5bmMgYXMgbG9hZEpzb259IGZyb20gJ2xvYWQtanNvbi1maWxlJztcblxubGV0IGxpbnRUZXh0O1xuYWxsb3dVbnNhZmVOZXdGdW5jdGlvbigoKSA9PiB7XG5cdGxpbnRUZXh0ID0gcmVxdWlyZSgneG8nKS5saW50VGV4dDtcbn0pO1xuXG5mdW5jdGlvbiBsaW50KHRleHRFZGl0b3IpIHtcblx0Y29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcblx0bGV0IHJlcG9ydDtcblxuXHRjb25zdCBkaXIgPSBwa2dEaXIuc3luYyhwYXRoLmRpcm5hbWUoZmlsZVBhdGgpKTtcblxuXHQvLyBubyBwYWNrYWdlLmpzb25cblx0aWYgKCFkaXIpIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHQvLyB1Z2x5IGhhY2sgdG8gd29ya2Fyb3VuZCBFU0xpbnQncyBsYWNrIG9mIGEgYGN3ZGAgb3B0aW9uXG5cdGNvbnN0IGRlZmF1bHRDd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXHRwcm9jZXNzLmNoZGlyKGRpcik7XG5cblx0Y29uc3QgcGtnID0gbG9hZEpzb24ocGF0aC5qb2luKGRpciwgJ3BhY2thZ2UuanNvbicpKTtcblxuXHQvLyBvbmx5IGxpbnQgd2hlbiBgeG9gIGlzIGEgZGVwZW5kZW5jeVxuXHRpZiAoIShwa2cuZGVwZW5kZW5jaWVzICYmIHBrZy5kZXBlbmRlbmNpZXMueG8pICYmXG5cdFx0IShwa2cuZGV2RGVwZW5kZW5jaWVzICYmIHBrZy5kZXZEZXBlbmRlbmNpZXMueG8pKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblx0YWxsb3dVbnNhZmVOZXdGdW5jdGlvbigoKSA9PiB7XG5cdFx0cmVwb3J0ID0gbGludFRleHQodGV4dEVkaXRvci5nZXRUZXh0KCksIHtjd2Q6IGRpcn0pO1xuXHR9KTtcblxuXHRwcm9jZXNzLmNoZGlyKGRlZmF1bHRDd2QpO1xuXG5cdGNvbnN0IHJldCA9IFtdO1xuXG5cdHJlcG9ydC5yZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcblx0XHRyZXN1bHQubWVzc2FnZXMuZm9yRWFjaCh4ID0+IHtcblx0XHRcdHJldC5wdXNoKHtcblx0XHRcdFx0ZmlsZVBhdGgsXG5cdFx0XHRcdHR5cGU6IHguc2V2ZXJpdHkgPT09IDIgPyAnRXJyb3InIDogJ1dhcm5pbmcnLFxuXHRcdFx0XHR0ZXh0OiBgJHt4Lm1lc3NhZ2V9ICgke3gucnVsZUlkfSlgLFxuXHRcdFx0XHRyYW5nZTogW1xuXHRcdFx0XHRcdFt4LmxpbmUgLSAxLCB4LmNvbHVtbiAtIDFdLFxuXHRcdFx0XHRcdFt4LmxpbmUgLSAxLCB4LmNvbHVtbiAtIDFdXG5cdFx0XHRcdF1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRyZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgY29uc3QgcHJvdmlkZUxpbnRlciA9ICgpID0+ICh7XG5cdG5hbWU6ICd4bycsXG5cdGdyYW1tYXJTY29wZXM6IFtcblx0XHQnc291cmNlLmpzJyxcblx0XHQnc291cmNlLmpzeCcsXG5cdFx0J3NvdXJjZS5qcy5qc3gnXG5cdF0sXG5cdHNjb3BlOiAnZmlsZScsXG5cdGxpbnRPbkZseTogdHJ1ZSxcblx0bGludFxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblx0cmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCk7XG5cblx0dGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0dGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsIHtcblx0XHQnWE86Rml4JzogKCkgPT4ge1xuXHRcdFx0Y29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG5cdFx0XHRpZiAoIWVkaXRvcikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCByZXBvcnQ7XG5cblx0XHRcdGFsbG93VW5zYWZlTmV3RnVuY3Rpb24oKCkgPT4ge1xuXHRcdFx0XHRyZXBvcnQgPSBsaW50VGV4dChlZGl0b3IuZ2V0VGV4dCgpLCB7XG5cdFx0XHRcdFx0Zml4OiB0cnVlLFxuXHRcdFx0XHRcdGN3ZDogcGF0aC5kaXJuYW1lKGVkaXRvci5nZXRQYXRoKCkpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNldFRleHQocmVwb3J0LnJlc3VsdHNbMF0ub3V0cHV0KTtcblx0XHR9XG5cdH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG5cdHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG59XG4iXX0=
//# sourceURL=/Users/dawsonbotsford/.atom/packages/linter-xo/index.js
