(function() {
  var DotRenderer;

  module.exports = DotRenderer = (function() {
    function DotRenderer() {}

    DotRenderer.prototype.render = function(colorMarker) {
      var charWidth, color, column, index, lineHeight, markers, pixelPosition, range, screenLine, textEditor, textEditorElement;
      range = colorMarker.getScreenRange();
      color = colorMarker.color;
      if (color == null) {
        return {};
      }
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      charWidth = textEditor.getDefaultCharWidth();
      markers = colorMarker.colorBuffer.findValidColorMarkers({
        intersectsScreenRowRange: [range.end.row, range.end.row]
      }).filter(function(m) {
        return m.getScreenRange().end.row === range.end.row;
      });
      index = markers.indexOf(colorMarker);
      screenLine = this.screenLineForScreenRow(textEditor, range.end.row);
      if (screenLine == null) {
        return {};
      }
      lineHeight = textEditor.getLineHeightInPixels();
      column = this.getLineLastColumn(screenLine) * charWidth;
      pixelPosition = textEditorElement.pixelPositionForScreenPosition(range.end);
      return {
        "class": 'dot',
        style: {
          backgroundColor: color.toCSS(),
          top: (pixelPosition.top + lineHeight / 2) + 'px',
          left: (column + index * 18) + 'px'
        }
      };
    };

    DotRenderer.prototype.getLineLastColumn = function(line) {
      if (line.lineText != null) {
        return line.lineText.length + 1;
      } else {
        return line.getMaxScreenColumn() + 1;
      }
    };

    DotRenderer.prototype.screenLineForScreenRow = function(textEditor, row) {
      if (textEditor.screenLineForScreenRow != null) {
        return textEditor.screenLineForScreenRow(row);
      } else {
        return textEditor.displayBuffer.screenLines[row];
      }
    };

    return DotRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9yZW5kZXJlcnMvZG90LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs2QkFDSjs7QUFBQSwwQkFBQSxNQUFBLEdBQVEsU0FBQyxXQUFELEdBQUE7QUFDTixVQUFBLHFIQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLGNBQVosQ0FBQSxDQUFSLENBQUE7QUFBQSxNQUVBLEtBQUEsR0FBUSxXQUFXLENBQUMsS0FGcEIsQ0FBQTtBQUlBLE1BQUEsSUFBaUIsYUFBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUpBO0FBQUEsTUFNQSxVQUFBLEdBQWEsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQU5yQyxDQUFBO0FBQUEsTUFPQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsVUFBbkIsQ0FQcEIsQ0FBQTtBQUFBLE1BUUEsU0FBQSxHQUFZLFVBQVUsQ0FBQyxtQkFBWCxDQUFBLENBUlosQ0FBQTtBQUFBLE1BVUEsT0FBQSxHQUFVLFdBQVcsQ0FBQyxXQUFXLENBQUMscUJBQXhCLENBQThDO0FBQUEsUUFDdEQsd0JBQUEsRUFBMEIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVgsRUFBZ0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUExQixDQUQ0QjtPQUE5QyxDQUVSLENBQUMsTUFGTyxDQUVBLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQyxDQUFDLGNBQUYsQ0FBQSxDQUFrQixDQUFDLEdBQUcsQ0FBQyxHQUF2QixLQUE4QixLQUFLLENBQUMsR0FBRyxDQUFDLElBQS9DO01BQUEsQ0FGQSxDQVZWLENBQUE7QUFBQSxNQWNBLEtBQUEsR0FBUSxPQUFPLENBQUMsT0FBUixDQUFnQixXQUFoQixDQWRSLENBQUE7QUFBQSxNQWVBLFVBQUEsR0FBYSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsVUFBeEIsRUFBb0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUE5QyxDQWZiLENBQUE7QUFpQkEsTUFBQSxJQUFpQixrQkFBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQWpCQTtBQUFBLE1BbUJBLFVBQUEsR0FBYSxVQUFVLENBQUMscUJBQVgsQ0FBQSxDQW5CYixDQUFBO0FBQUEsTUFvQkEsTUFBQSxHQUFTLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixVQUFuQixDQUFBLEdBQWlDLFNBcEIxQyxDQUFBO0FBQUEsTUFxQkEsYUFBQSxHQUFnQixpQkFBaUIsQ0FBQyw4QkFBbEIsQ0FBaUQsS0FBSyxDQUFDLEdBQXZELENBckJoQixDQUFBO2FBdUJBO0FBQUEsUUFBQSxPQUFBLEVBQU8sS0FBUDtBQUFBLFFBQ0EsS0FBQSxFQUNFO0FBQUEsVUFBQSxlQUFBLEVBQWlCLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FBakI7QUFBQSxVQUNBLEdBQUEsRUFBSyxDQUFDLGFBQWEsQ0FBQyxHQUFkLEdBQW9CLFVBQUEsR0FBYSxDQUFsQyxDQUFBLEdBQXVDLElBRDVDO0FBQUEsVUFFQSxJQUFBLEVBQU0sQ0FBQyxNQUFBLEdBQVMsS0FBQSxHQUFRLEVBQWxCLENBQUEsR0FBd0IsSUFGOUI7U0FGRjtRQXhCTTtJQUFBLENBQVIsQ0FBQTs7QUFBQSwwQkE4QkEsaUJBQUEsR0FBbUIsU0FBQyxJQUFELEdBQUE7QUFDakIsTUFBQSxJQUFHLHFCQUFIO2VBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFkLEdBQXVCLEVBRHpCO09BQUEsTUFBQTtlQUdFLElBQUksQ0FBQyxrQkFBTCxDQUFBLENBQUEsR0FBNEIsRUFIOUI7T0FEaUI7SUFBQSxDQTlCbkIsQ0FBQTs7QUFBQSwwQkFvQ0Esc0JBQUEsR0FBd0IsU0FBQyxVQUFELEVBQWEsR0FBYixHQUFBO0FBQ3RCLE1BQUEsSUFBRyx5Q0FBSDtlQUNFLFVBQVUsQ0FBQyxzQkFBWCxDQUFrQyxHQUFsQyxFQURGO09BQUEsTUFBQTtlQUdFLFVBQVUsQ0FBQyxhQUFhLENBQUMsV0FBWSxDQUFBLEdBQUEsRUFIdkM7T0FEc0I7SUFBQSxDQXBDeEIsQ0FBQTs7dUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/renderers/dot.coffee
