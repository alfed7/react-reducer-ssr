import { useReducer, useContext, createContext } from 'react';
import { jsx } from 'react/jsx-runtime';

function createServerStore(reducer, customParams, initialState) {
  var ssrDispatch = function ssrDispatch(action) {
    store.root = reducer(store.root, action);
  };
  var store = {
    root: initialState || {},
    dispatch: wrapDispatchWithAsync(ssrDispatch, customParams)
  };
  store.dispatch({
    type: '@@INIT'
  });
  return store;
}
function NullDispatch(s) {}
function isPromise(v) {
  return v && typeof v.then === 'function';
}
function wrapDispatchWithAsync(dispatch, customParams) {
  return function (nextState) {
    return new Promise(function (resolve, reject) {
      if (isPromise(nextState)) {
        nextState.then(function (s) {
          if (typeof s === 'function') {
            var r = s(dispatch, {}, customParams);
            if (isPromise(r)) {
              r.then(function (s) {
                resolve();
              })["catch"](function (err) {
                return reject(err);
              });
            } else {
              resolve();
            }
          } else {
            dispatch(s);
            resolve();
          }
        })["catch"](function (err) {
          return reject(err);
        });
      } else {
        dispatch(nextState);
        resolve();
      }
    });
  };
}

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var RootContext = /*#__PURE__*/createContext(null);
var DispatchContext = /*#__PURE__*/createContext(null);
function RootContextProvider(_ref) {
  var children = _ref.children,
    reducer = _ref.reducer,
    customParams = _ref.customParams,
    initialState = _ref.initialState;
  var _useReducer = useReducer(reducer, initialState),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    root = _useReducer2[0],
    dispatch = _useReducer2[1];
  return /*#__PURE__*/jsx(RootContext.Provider, {
    value: root,
    children: /*#__PURE__*/jsx(DispatchContext.Provider, {
      value: wrapDispatchWithAsync(dispatch, customParams),
      children: children
    })
  });
}
function useStateSelectorT(selector) {
  var root = useContext(RootContext);
  if (selector && root) {
    return selector(root);
  } else {
    return root;
  }
}
function useStateDispatch() {
  return useContext(DispatchContext) || NullDispatch;
}

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function combineReducers(reducers) {
  return function (rootState, action) {
    rootState = rootState || {};
    var wasChanged = false;
    Object.keys(reducers).forEach(function (k) {
      var nextReducer = reducers[k];
      if (nextReducer) {
        var nextState = nextReducer(rootState[k] || {}, action);
        if (nextState !== rootState[k]) {
          rootState[k] = nextState;
          wasChanged = true;
        }
      }
    });
    return wasChanged ? _objectSpread({}, rootState) : rootState;
  };
}

export { NullDispatch, RootContextProvider, combineReducers, createServerStore, isPromise, useStateDispatch, useStateSelectorT, wrapDispatchWithAsync };
//# sourceMappingURL=index.esm.js.map
