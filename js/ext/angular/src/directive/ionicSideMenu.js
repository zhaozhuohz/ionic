(function() {
'use strict';

/**
 * @description
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

angular.module('ionic.ui.sideMenu', ['ionic.service.gesture'])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */
.controller('SideMenuCtrl', function($scope) {
  var _this = this;

  angular.extend(this, ionic.controllers.SideMenuController.prototype);

  ionic.controllers.SideMenuController.call(this, {
    left: {
      width: 270,
      pushDown: function() {
        $scope.leftZIndex = -1;
      },
      bringUp: function() {
        $scope.leftZIndex = 0;
      }
    },
    right: {
      width: 270,
      pushDown: function() {
        $scope.rightZIndex = -1;
      },
      bringUp: function() {
        $scope.rightZIndex = 0;
      }
    }
  });

  $scope.contentTranslateX = 0;

  $scope.sideMenuCtrl = this;
})

.directive('sideMenu', function() {
  return {
    restrict: 'ECA',
    controller: 'SideMenuCtrl',
    replace: true,
    transclude: true,
    template: '<div class="pane" ng-transclude></div>'
  };
})

.directive('sideMenuContent', ['Gesture', function(Gesture) {
  return {
    restrict: 'AC',
    require: '^sideMenu',
    scope: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {

        $element.addClass('menu-content');

        var defaultPrevented = false;

        ionic.on('mousedown', function(e) {
          defaultPrevented = e.defaultPrevented;
        });

        Gesture.on('drag', function(e) {
          if(defaultPrevented) {
            return;
          }
          sideMenuCtrl._handleDrag(e);
        }, $element[0]);

        Gesture.on('release', function(e) {
          if(!defaultPrevented) {
            sideMenuCtrl._endDrag(e);
          }
          defaultPrevented = false;
        }, $element[0]);

        sideMenuCtrl.setContent({
          onDrag: function(e) {},
          endDrag: function(e) {},
          getTranslateX: function() {
            return $scope.contentTranslateX || 0;
          },
          setTranslateX: function(amount) {
            $scope.contentTranslateX = amount;
            $element[0].style.webkitTransform = 'translate3d(' + amount + 'px, 0, 0)';
          },
          enableAnimation: function() {
            //this.el.classList.add(this.animateClass);
            $scope.animationEnabled = true;
            $element[0].classList.add('menu-animated');
          },
          disableAnimation: function() {
            //this.el.classList.remove(this.animateClass);
            $scope.animationEnabled = false;
            $element[0].classList.remove('menu-animated');
          }
        });
      };
    }
  };
}])


.directive('menu', function() {
  return {
    restrict: 'E',
    require: '^sideMenu',
    replace: true,
    transclude: true,
    scope: {
      side: '@'
    },
    template: '<div class="menu menu-{{side}}"></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {

        if($scope.side == 'left') {
          sideMenuCtrl.left.isEnabled = true;
        } else if($scope.side == 'right') {
          sideMenuCtrl.right.isEnabled = true;
        }

        $element.append(transclude($scope));
      };
    }
  };
});
})();
