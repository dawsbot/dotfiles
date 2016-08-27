(function() {
  var RegionRenderer;

  module.exports = RegionRenderer = (function() {
    function RegionRenderer() {}

    RegionRenderer.prototype.includeTextInRegion = false;

    RegionRenderer.prototype.renderRegions = function(colorMarker) {
      var range, regions, row, rowSpan, textEditor, _i, _ref, _ref1;
      range = colorMarker.getScreenRange();
      if (range.isEmpty()) {
        return [];
      }
      rowSpan = range.end.row - range.start.row;
      regions = [];
      textEditor = colorMarker.colorBuffer.editor;
      if (rowSpan === 0) {
        regions.push(this.createRegion(range.start, range.end, colorMarker));
      } else {
        regions.push(this.createRegion(range.start, {
          row: range.start.row,
          column: Infinity
        }, colorMarker, this.screenLineForScreenRow(textEditor, range.start.row)));
        if (rowSpan > 1) {
          for (row = _i = _ref = range.start.row + 1, _ref1 = range.end.row; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
            regions.push(this.createRegion({
              row: row,
              column: 0
            }, {
              row: row,
              column: Infinity
            }, colorMarker, this.screenLineForScreenRow(textEditor, row)));
          }
        }
        regions.push(this.createRegion({
          row: range.end.row,
          column: 0
        }, range.end, colorMarker, this.screenLineForScreenRow(textEditor, range.end.row)));
      }
      return regions;
    };

    RegionRenderer.prototype.screenLineForScreenRow = function(textEditor, row) {
      if (textEditor.screenLineForScreenRow != null) {
        return textEditor.screenLineForScreenRow(row);
      } else {
        return textEditor.displayBuffer.screenLines[row];
      }
    };

    RegionRenderer.prototype.createRegion = function(start, end, colorMarker, screenLine) {
      var bufferRange, charWidth, clippedEnd, clippedStart, css, endPosition, lineHeight, name, needAdjustment, region, startPosition, text, textEditor, textEditorElement, value, _ref, _ref1;
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      if (textEditorElement.component == null) {
        return;
      }
      lineHeight = textEditor.getLineHeightInPixels();
      charWidth = textEditor.getDefaultCharWidth();
      clippedStart = {
        row: start.row,
        column: (_ref = this.clipScreenColumn(screenLine, start.column)) != null ? _ref : start.column
      };
      clippedEnd = {
        row: end.row,
        column: (_ref1 = this.clipScreenColumn(screenLine, end.column)) != null ? _ref1 : end.column
      };
      bufferRange = textEditor.bufferRangeForScreenRange({
        start: clippedStart,
        end: clippedEnd
      });
      needAdjustment = (screenLine != null ? typeof screenLine.isSoftWrapped === "function" ? screenLine.isSoftWrapped() : void 0 : void 0) && end.column >= (screenLine != null ? screenLine.text.length : void 0) - (screenLine != null ? screenLine.softWrapIndentationDelta : void 0);
      if (needAdjustment) {
        bufferRange.end.column++;
      }
      startPosition = textEditorElement.pixelPositionForScreenPosition(clippedStart);
      endPosition = textEditorElement.pixelPositionForScreenPosition(clippedEnd);
      text = textEditor.getBuffer().getTextInRange(bufferRange);
      css = {};
      css.left = startPosition.left;
      css.top = startPosition.top;
      css.width = endPosition.left - startPosition.left;
      if (needAdjustment) {
        css.width += charWidth;
      }
      css.height = lineHeight;
      region = document.createElement('div');
      region.className = 'region';
      if (this.includeTextInRegion) {
        region.textContent = text;
      }
      if (startPosition.left === endPosition.left) {
        region.invalid = true;
      }
      for (name in css) {
        value = css[name];
        region.style[name] = value + 'px';
      }
      return region;
    };

    RegionRenderer.prototype.clipScreenColumn = function(line, column) {
      if (line != null) {
        if (line.clipScreenColumn != null) {
          return line.clipScreenColumn(column);
        } else {
          return Math.min(line.lineText.length, column);
        }
      }
    };

    return RegionRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9yZW5kZXJlcnMvcmVnaW9uLXJlbmRlcmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtnQ0FDSjs7QUFBQSw2QkFBQSxtQkFBQSxHQUFxQixLQUFyQixDQUFBOztBQUFBLDZCQUVBLGFBQUEsR0FBZSxTQUFDLFdBQUQsR0FBQTtBQUNiLFVBQUEseURBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxXQUFXLENBQUMsY0FBWixDQUFBLENBQVIsQ0FBQTtBQUNBLE1BQUEsSUFBYSxLQUFLLENBQUMsT0FBTixDQUFBLENBQWI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQURBO0FBQUEsTUFHQSxPQUFBLEdBQVUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFWLEdBQWdCLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FIdEMsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLEVBSlYsQ0FBQTtBQUFBLE1BTUEsVUFBQSxHQUFhLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFOckMsQ0FBQTtBQVFBLE1BQUEsSUFBRyxPQUFBLEtBQVcsQ0FBZDtBQUNFLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsWUFBRCxDQUFjLEtBQUssQ0FBQyxLQUFwQixFQUEyQixLQUFLLENBQUMsR0FBakMsRUFBc0MsV0FBdEMsQ0FBYixDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLElBQUMsQ0FBQSxZQUFELENBQ1gsS0FBSyxDQUFDLEtBREssRUFFWDtBQUFBLFVBQ0UsR0FBQSxFQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FEbkI7QUFBQSxVQUVFLE1BQUEs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/renderers/region-renderer.coffee
