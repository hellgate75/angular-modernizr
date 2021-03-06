'use strict';

/**
 * @ngdoc function
 * @name angularModernizrApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularModernizrApp
 */
angular.module('angularModernizrApp')
  .controller('MainCtrl', ['$scope', function($scope) {
    $scope.inputValue = '';
    $scope.syntaxInputValue = '';
    this.syntaxInputValue = '';
    $scope.listOfSysntax = [{
      elem: 'bind',
      needChild: true,
      allowChild: true,
      allowedChildren: 0,
      children: [{
        elem: 'into',
        needChild: true,
        allowChild: true,
        allowedChildren: 0,
        children: [{
          elem: 'network',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }, {
          elem: 'sub-network',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }]
      }, {
        elem: 'from',
        needChild: true,
        children: [{
          elem: 'network',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }, {
          elem: 'sub-network',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }, {
          elem: 'root',
          needChild: false,
          allowChild: false,
          allowedChildren: 0,
          children: []
        }]
      }, {
        elem: 'all',
        needChild: true,
        allowChild: true,
        allowedChildren: 0,
        children: [{
          elem: 'on',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }, {
          elem: 'for',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }]
      }]
    }, {
      elem: 'bind-all',
      needChild: true,
      allowChild: true,
      allowedChildren: 0,
      children: [{
        elem: 'as',
        needChild: true,
        allowChild: true,
        allowedChildren: 0,
        children: [{
          elem: 'network',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }, {
          elem: 'sub-network',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }, {
          elem: 'network-element',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }, {
          elem: 'network-element',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }, {
          elem: 'mo-object',
          needChild: true,
          allowChild: true,
          allowedChildren: 1,
          children: []
        }, {
          elem: 'fnd',
          needChild: true,
          allowChild: true,
          allowedChildren: 0,
          children: []
        }]
      }]
    }];
    $scope.filterSyntaxSuggestions = function(query) {
      if (typeof query === 'object' &&
        typeof query.searchText === 'string') {
        var selected = [];
        //$scope.listOfSysntax
        if (query.searchText.length === 0) {
          return selected;
        }
        var tokens = query.searchText.split(' ');
        var initialSize = tokens.length;
        tokens = tokens.filter(function(token) {
          return token && !!token.length;
        });
        var trunkedTokens = initialSize !== tokens.length;
        var listOfPrime = $scope.listOfSysntax.filter(
          function(syntaxBlock) {
            return syntaxBlock.elem.toUpperCase().indexOf(tokens[0].toUpperCase()) >=
              0;
          });
        var idx = 0;
        if (listOfPrime.length > 0) {
          if (tokens.length === 1) {
            if (trunkedTokens) {
              $scope.listOfSysntax.
              filter(function(child) {
                return child.elem.toUpperCase() === tokens[0].toUpperCase();
              }).
              forEach(function(syntaxBlock) {
                syntaxBlock.children.forEach(function(syntaxSubBlock) {
                  selected.push($scope.createAToken(++idx,
                    syntaxSubBlock.elem,
                    false));
                });
              });
            } else {
              $scope.listOfSysntax.forEach(function(syntaxBlock) {
                selected.push($scope.createAToken(++idx, syntaxBlock.elem,
                  syntaxBlock.elem.toUpperCase().indexOf(
                    tokens[0].toUpperCase()) >= 0));
              });
            }
          } else {
            var foundTabs = $scope.findTokens(idx, listOfPrime.filter(
                function(child) {
                  return child.elem.toUpperCase() === tokens[0].toUpperCase();
                }),
              tokens.slice(
                1, tokens.length),
              trunkedTokens);
            if (foundTabs.length) {
              selected = selected.concat(foundTabs);
            }
          }

        } else if (tokens.length === 1) {
          $scope.listOfSysntax.forEach(function(syntaxBlock) {
            selected.push($scope.createAToken(++idx, syntaxBlock.elem,
              false));
          });
        }
        return $scope.sortTokens(selected);
      }
      return [];
    };
    $scope.createAToken = function(id, value, enabled) {
      return {
        id: id,
        value: value,
        enabled: enabled
      };
    };
    $scope.sortTokens = function(listOfResults) {
      return listOfResults;
    };
    $scope.searchMatching = function(listOfPrime, tokens) {
      if (tokens.length > 0) {
        var results = listOfPrime.filter(function(parent) {
          return parent.elem === tokens[0] && (tokens.length > 1 || !
            parent.needChild);
        });
        var nextTokens = tokens.splice(1, tokens.length);
        if (!!results.length) {
          var found = false;
          results.forEach(function(parent) {
            if (((nextTokens.length > 0 && !parent.children.length) ||
                !
                parent.needChild) && (parent.allowChild || !
                nextTokens.length)) {
              if (parent.children.length || (!parent.allowChild ||
                  (!parent.allowedChildren || nextTokens.length <=
                    parent.allowedChildren))) {
                found = true;
              }
            } else {
              var matchRes = $scope.searchMatching(parent.children,
                nextTokens);
              if (matchRes) {
                found = true;
              }
            }

          });
          return found;
        } else {
          return false;
        }
      }
      return true;
    };
    $scope.validateSyntax = function(result) {
      if (result && typeof result.value === 'string') {
        var tokens = result.value.split(' ');
        tokens = tokens.filter(function(token) {
          return token.length > 0;
        });
        if (!!tokens.length) {
          if ($scope.searchMatching($scope.listOfSysntax, tokens)) {
            return true;
          }
        }
      }
      return false;
    };
    $scope.findTokens = function(idx, listOfPrime, tokens,
      trunkedTokens) {
      var elements = [];
      listOfPrime.forEach(function(syntaxBlock) {
        if (tokens.length === 0) {
          listOfPrime.forEach(function(parent) {
            parent.children.forEach(function(child) {
              elements.push($scope.createAToken(++idx,
                child.elem,
                false));
            });
          });

        } else if (tokens.length === 1) {
          if (trunkedTokens) {
            syntaxBlock.children.
            filter(function(child) {
              return child.elem.toUpperCase() === tokens[0].toUpperCase();
            }).
            forEach(function(child) {
              var subTabs = $scope.findTokens(idx, [child],
                tokens.splice(
                  1, tokens.length), trunkedTokens);
              if (subTabs.length) {
                elements = elements.concat(subTabs);
              }
            });
          } else {
            syntaxBlock.children.forEach(function(child) {
              elements.push($scope.createAToken(++idx, child.elem,
                child.elem.toUpperCase().indexOf(tokens[0]
                  .toUpperCase()) >=
                0));
            });
          }
        } else {
          syntaxBlock.children.
          filter(function(child) {
            return child.elem.toUpperCase() === tokens[0].toUpperCase();
          }).
          forEach(function(child) {
            var subTabs = $scope.findTokens(idx, [child],
              tokens.splice(
                1, tokens.length), trunkedTokens);
            if (subTabs.length) {
              elements = elements.concat(subTabs);
            }
          });
        }
      });
      return elements;
    };
    // $scope.disableExecution = true;
    // $scope.$watch($scope.syntaxInputValue, function() {
    //   console.log('syntaxInputValue : >' + $scope.syntaxInputValue +
    //     '<');
    //   $scope.disableExecution = !$scope.syntaxInputValue.length || !
    //     $scope
    //     .validateSyntax($scope.syntaxInputValue);
    // });
    // $scope.$watch(this.syntaxInputValue, function() {
    //   console.log('syntaxInputValue : >' + this.syntaxInputValue +
    //     '<');
    //   $scope.disableExecution = !this.syntaxInputValue.length || !
    //     $scope
    //     .validateSyntax(this.syntaxInputValue);
    // }.bind(this));
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
