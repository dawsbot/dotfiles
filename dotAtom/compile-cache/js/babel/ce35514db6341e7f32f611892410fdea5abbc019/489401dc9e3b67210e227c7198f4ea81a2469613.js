'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {

  activate: function activate(state) {
    if (atom.packages.isPackageLoaded('emmet')) {
      var pkgDir = path.resolve(atom.packages.resolvePackagePath('emmet'), 'node_modules', 'emmet', 'lib');
      var emmet = require(path.join(pkgDir, 'emmet'));
      var filters = require(path.join(pkgDir, 'filter', 'main'));

      filters.add('jsx-css-modules', function (tree) {
        tree.children.forEach(function (item) {
          item.start = item.start.replace(/className="(.*)"/, "className={style.$1}");
        });
      });

      // Apply jsx-css-modules after html so we can use a simple string replacement
      // and not have to mess with how the the html filter wraps attribute values with
      // quotation marks rather than curly brace pairs
      emmet.loadSnippets({ "jsx": { "filters": "jsx, html, jsx-css-modules" } });
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9lbW1ldC1qc3gtY3NzLW1vZHVsZXMvbGliL2VtbWV0LWpzeC1jc3MtbW9kdWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHOztBQUViLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7QUFDZCxRQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQzFDLFVBQU0sTUFBTSxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ3ZHLFVBQU0sS0FBSyxHQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQ25ELFVBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQTs7QUFFNUQsYUFBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxVQUFDLElBQUksRUFBSztBQUN2QyxZQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUM5QixjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLENBQUE7U0FDNUUsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBOzs7OztBQUtGLFdBQUssQ0FBQyxZQUFZLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsNEJBQTRCLEVBQUUsRUFBQyxDQUFDLENBQUE7S0FDekU7R0FDRjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9kYXdzb25ib3RzZm9yZC8uYXRvbS9wYWNrYWdlcy9lbW1ldC1qc3gtY3NzLW1vZHVsZXMvbGliL2VtbWV0LWpzeC1jc3MtbW9kdWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgYWN0aXZhdGUoc3RhdGUpIHtcbiAgICBpZiAoYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoJ2VtbWV0JykpIHtcbiAgICAgIGNvbnN0IHBrZ0RpciAgPSBwYXRoLnJlc29sdmUoYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ2VtbWV0JyksICdub2RlX21vZHVsZXMnLCAnZW1tZXQnLCAnbGliJylcbiAgICAgIGNvbnN0IGVtbWV0ICAgPSByZXF1aXJlKHBhdGguam9pbihwa2dEaXIsICdlbW1ldCcpKVxuICAgICAgY29uc3QgZmlsdGVycyA9IHJlcXVpcmUocGF0aC5qb2luKHBrZ0RpciwgJ2ZpbHRlcicsICdtYWluJykpXG5cbiAgICAgIGZpbHRlcnMuYWRkKCdqc3gtY3NzLW1vZHVsZXMnLCAodHJlZSkgPT4ge1xuICAgICAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpdGVtLnN0YXJ0ID0gaXRlbS5zdGFydC5yZXBsYWNlKC9jbGFzc05hbWU9XCIoLiopXCIvLCBcImNsYXNzTmFtZT17c3R5bGUuJDF9XCIpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBBcHBseSBqc3gtY3NzLW1vZHVsZXMgYWZ0ZXIgaHRtbCBzbyB3ZSBjYW4gdXNlIGEgc2ltcGxlIHN0cmluZyByZXBsYWNlbWVudFxuICAgICAgLy8gYW5kIG5vdCBoYXZlIHRvIG1lc3Mgd2l0aCBob3cgdGhlIHRoZSBodG1sIGZpbHRlciB3cmFwcyBhdHRyaWJ1dGUgdmFsdWVzIHdpdGhcbiAgICAgIC8vIHF1b3RhdGlvbiBtYXJrcyByYXRoZXIgdGhhbiBjdXJseSBicmFjZSBwYWlyc1xuICAgICAgZW1tZXQubG9hZFNuaXBwZXRzKHtcImpzeFwiOiB7IFwiZmlsdGVyc1wiOiBcImpzeCwgaHRtbCwganN4LWNzcy1tb2R1bGVzXCIgfX0pXG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/dawsonbotsford/.atom/packages/emmet-jsx-css-modules/lib/emmet-jsx-css-modules.js
