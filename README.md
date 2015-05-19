# angular-drop
based on drop.js (http://github.hubspot.com/drop/docs/welcome/)

# Dependencies
tether.js (http://tether.io/)
drop.js (http://github.hubspot.com/drop/docs/welcome/)

# Usage
```
<script id="drop.html" type="text/ng-template">
  <div class="drop">
    <p>
      <textarea name="paragraph_text" ng-model="text" rows="3"></textarea>
    </p>
    <p>
      <button ng-click="save(text)">Save</button>
      <button ng-click="drop.close()">Cancel</button>
    </p>
  </div>
</script>

<button drop="elem" success="reject_props" type="button">action</button>

<script>
app.directive('drop', ['dropWrapper', function($drop) {
    return {
      restrict: 'EA',
      scope: { elem: '=drop', fn: '=success' },
      link: function(scope, elem) {
        var drop = $drop({
          target: elem,
          scope: scope,
          templateUrl: 'drop.html'
        });
        scope.drop = drop;
        scope.save = function(text) {
          scope.fn(scope.elem, text);
          scope.drop.close();
        }

        elem.on('click', drop.toogle);
      }
    };
  }]);

</script>

```
