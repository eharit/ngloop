// Generated by CoffeeScript 1.8.0
(function() {
  (function($, TweenMax) {
    return $.prototype.transform = function(prop, value) {
      var target;
      if (prop == null) {
        return this.css('transform');
      } else if (!prop) {
        this.css('transform', 'none');
        return this;
      }
      if (value != null) {
        target = {};
        target[prop] = value;
        TweenMax.set(this, target);
        return this;
      } else {
        if (this[0]._gsTransform == null) {
          TweenMax.set(this, {
            x: '+=0'
          });
        }
        return this[0]._gsTransform[prop];
      }
    };
  })(window.jQuery, window.TweenMax);

}).call(this);


//# sourceMappingURL=get-transform.js.map
