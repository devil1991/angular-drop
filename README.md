# angular-drop
An Angular module for [drop.js](http://github.hubspot.com/drop/docs/welcome/).

# Dependencies
[drop.js](http://github.hubspot.com/drop/docs/welcome/)  
[tether.js](http://github.hubspot.com/tether/)  
[jquery](http://jquery.com/) (only when using the builtin eff-drop directive)

# Usage

Create a custom directive.  

```html
<div ng-controller="MainController">
    <script id="my-drop.html" type="text/ng-template">
      <div class="drop">
          <textarea ng-model="text" rows="3"></textarea>
        <p>
          <button ng-click="custom_close(text)">Save</button>
          <button ng-click="drop.close()">Cancel</button>
        </p>
      </div>
    </script>


    <a class="dark" my-drop callback="do">Click Me</a>


    <script type="text/javascript">
      (function(angular) { 'use strict';
        var app = angular.module('app');

        app.controller('MainController', ['$scope', function($scope) {
              $scope.checked = true;
              $scope.toggle = function toggle() {
                $scope.checked = !$scope.checked;
              };
              $scope.do = function(text) {
                console.log(text);
                $scope.checked = false;
              };
          }]);

        app.directive('myDrop', ['dropWrapper', function($drop) {
            return {
              restrict: 'EA',
              scope: { elem: '=myDrop', fn: '=callback' },
              link: function(scope, elem) {
                var drop = $drop({
                    target: elem,
                    scope: scope,
                    templateUrl: 'my-drop.html',
                    position: 'bottom left',
                    constrainToWindow: true,
                    constrainToScrollParent: true,
                    classes: 'drop-theme-arrows-bounce-dark',
                    tetherOptions:{},
                });
                scope.drop = drop;
                scope.custom_close = function(text) {
                  scope.fn(text);
                  scope.drop.close();
                }
                // easy way
                // elem.on('click', drop.toogle);
                // hard way
                elem.on('click', function(value) {
                    if (scope.drop.isOpened())
                        scope.drop.close();
                    else
                        scope.drop.open();
                    console.log(scope.drop.isOpened());
                });
              }
            };
          }]);
      })(angular);
    </script>
</div>
```

# Example

[http://effilab.github.io/angular-drop](http://effilab.github.io/angular-drop)
