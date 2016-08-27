(function() {
  var event, mouseEvent, objectCenterCoordinates;

  event = function(type, properties) {
    if (properties == null) {
      properties = {};
    }
    return new Event(type, properties);
  };

  mouseEvent = function(type, properties) {
    var defaults, k, v;
    defaults = {
      bubbles: true,
      cancelable: type !== "mousemove",
      view: window,
      detail: 0,
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: void 0
    };
    for (k in defaults) {
      v = defaults[k];
      if (properties[k] == null) {
        properties[k] = v;
      }
    }
    return new MouseEvent(type, properties);
  };

  objectCenterCoordinates = function(target) {
    var height, left, top, width, _ref;
    _ref = target.getBoundingClientRect(), top = _ref.top, left = _ref.left, width = _ref.width, height = _ref.height;
    return {
      x: left + width / 2,
      y: top + height / 2
    };
  };

  module.exports = {
    objectCenterCoordinates: objectCenterCoordinates,
    mouseEvent: mouseEvent,
    event: event
  };

  ['mousedown', 'mousemove', 'mouseup', 'click'].forEach(function(key) {
    return module.exports[key] = function(target, x, y, cx, cy, btn) {
      var _ref;
      if (!((x != null) && (y != null))) {
        _ref = objectCenterCoordinates(target), x = _ref.x, y = _ref.y;
      }
      if (!((cx != null) && (cy != null))) {
        cx = x;
        cy = y;
      }
      return target.dispatchEvent(mouseEvent(key, {
        target: target,
        pageX: x,
        pageY: y,
        clientX: cx,
        clientY: cy,
        button: btn
      }));
    };
  });

  module.exports.mousewheel = function(target, deltaX, deltaY) {
    if (deltaX == null) {
      deltaX = 0;
    }
    if (deltaY == null) {
      deltaY = 0;
    }
    return target.dispatchEvent(mouseEvent('mousewheel', {
      target: target,
      deltaX: deltaX,
      deltaY: deltaY
    }));
  };

  module.exports.change = function(target) {
    return target.dispatchEvent(event('change', {
      target: target
    }));
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvaGVscGVycy9ldmVudHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLFVBQVAsR0FBQTs7TUFBTyxhQUFXO0tBQU87V0FBSSxJQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVksVUFBWixFQUE3QjtFQUFBLENBQVIsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxVQUFQLEdBQUE7QUFDWCxRQUFBLGNBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVztBQUFBLE1BQ1QsT0FBQSxFQUFTLElBREE7QUFBQSxNQUVULFVBQUEsRUFBYSxJQUFBLEtBQVUsV0FGZDtBQUFBLE1BR1QsSUFBQSxFQUFNLE1BSEc7QUFBQSxNQUlULE1BQUEsRUFBUSxDQUpDO0FBQUEsTUFLVCxLQUFBLEVBQU8sQ0FMRTtBQUFBLE1BTVQsS0FBQSxFQUFPLENBTkU7QUFBQSxNQU9ULE9BQUEsRUFBUyxDQVBBO0FBQUEsTUFRVCxPQUFBLEVBQVMsQ0FSQTtBQUFBLE1BU1QsT0FBQSxFQUFTLEtBVEE7QUFBQSxNQVVULE1BQUEsRUFBUSxLQVZDO0FBQUEsTUFXVCxRQUFBLEVBQVUsS0FYRDtBQUFBLE1BWVQsT0FBQSxFQUFTLEtBWkE7QUFBQSxNQWFULE1BQUEsRUFBUSxDQWJDO0FBQUEsTUFjVCxhQUFBLEVBQWUsTUFkTjtLQUFYLENBQUE7QUFpQkEsU0FBQSxhQUFBO3NCQUFBO1VBQStDO0FBQS9DLFFBQUEsVUFBVyxDQUFBLENBQUEsQ0FBWCxHQUFnQixDQUFoQjtPQUFBO0FBQUEsS0FqQkE7V0FtQkksSUFBQSxVQUFBLENBQVcsSUFBWCxFQUFpQixVQUFqQixFQXBC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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/helpers/events.coffee
