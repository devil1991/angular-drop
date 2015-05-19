(function(angular) {
  'use strict';

  var module = angular.module('angularEffDrop', ['ng']),
      extend = angular.extend;

  module.provider('dropWrapper', [function() {
    // Default template for tooltips.
    var defaultTemplateUrl = 'template/eff-drop.html'
    this.setDefaultTemplateUrl = function(templateUrl) {
      defaultTemplateUrl = templateUrl;
    };

    var defaultTetherOptions = {
    };
    this.setDefaultTetherOptions = function(options) {
      extend(defaultTetherOptions, options);
    };

    this.$get = [ '$rootScope', '$compile', '$templateCache', function($rootScope, $compile, $templateCache) {
      return function(options) {
        options = options || {};
        var templateUrl = options.templateUrl || defaultTemplateUrl,
            template    = options.template || $templateCache.get(templateUrl),
            scope       = options.scope || $rootScope.$new(),
            elem        = $compile(template)(scope),
            drop;
        var opts = {
          target: options.target[0],
          content: elem[0],
          position: options.position || 'right middle',
          openOn: options.openOn || undefined,
          constrainToWindow: options.constrainToWindow || true,
          constrainToScrollParent: options.constrainToScrollParent || true,
          classes: options.classes || 'drop-theme-arrows-bounce-dark',
          remove: false,
          tetherOptions: options.tetherOptions || defaultTetherOptions,
        };
        if ((opts.content == null) || (opts.content == undefined))
        {
          console.error('content of (', templateUrl || template, ')', opts.content);
          throw("'templateUrl' or 'template' parameter is incorrect !");
        }

        /**
         * Create a drop for the target and the template.
         */
        function attachDrop() {
          if (drop)
            detachDrop();
          drop = new Drop(opts);
          if (!drop.isOpened())
          {
            drop.open();
          }
        };

        /**
         * Detach the drop.
         */
        function detachDrop() {
          if ((drop) && (drop.isOpened()))
          {
            drop.destroy();
            drop = undefined;
          }
        };

        /**
         * Open the drop
         */
        function open(fn) {
          if (typeof(fn) == 'function')
            fn(scope, true);
          attachDrop();
        };

        /**
         * Close the drop
         */
        function close(fn) {
          if (typeof(fn) == 'function')
            fn(scope, false);
          detachDrop();
        };

        /**
         * Close the drop
         */
        function toogle(fn) {
          if ((drop) && (drop.isOpened()))
          {
            close(fn);
          }
          else
          {
            open(fn);
          }
        };

        // Close the tooltip when the scope is destroyed.
        scope.$on('$destroy', close);

        return {
          open: open,
          close: close,
          toogle: toogle
        };
      };
    }];
  }]);

  module.provider('effDropFactory', [function() {
    /**
     * Returns a factory function for building a directive for tooltips.
     *
     * @param {String} name - The name of the directive.
     */
    this.$get = [ 'dropWrapper', function(wrapper) {
      return function(name, options) {
        return {
          restrict: 'EA',
          scope: {
            content:  '@' + name,
            tether:  '=?' + name + 'Tether'
          },
          link: function(scope, elem, attrs) {
            var drop = wrapper(extend({
              target: elem,
              scope: scope
            }, options, { tether: scope.tether }));

            /**
             * Toggle the drop.
             */
            elem.hover(function() {
              scope.$apply(drop.open);
            }, function() {
              scope.$apply(drop.close);
            });
          }
        };
      };
    }];
  }]);

  module.directive('effDrop', ['effDropFactory', function(provider) {
    return provider('effDrop');
  }]);

  module.run(['$templateCache', function($templateCache) {
    $templateCache.put('template/eff-drop.html', '<div class="eff-drop">{{content}}</div>');
  }]);

})(angular);
