"use strict";var t=require("react"),r=require("react/jsx-runtime");function e(t){}function n(t){return t&&"function"==typeof t.then}function o(t,r){return function(e){return new Promise((function(o,u){n(e)?e.then((function(e){i(e,t,r,o,u)})).catch((function(t){return u(t)})):i(e,t,r,o,u)}))}}function i(t,r,e,o,i){if("function"==typeof t){var u=t(r,{},e);n(u)?u.then((function(t){o()})).catch((function(t){return i(t)})):o()}else r(t),o()}function u(t,r){return function(t){if(Array.isArray(t))return t}(t)||function(t,r){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var n,o,i,u,c=[],a=!0,f=!1;try{if(i=(e=e.call(t)).next,0===r){if(Object(e)!==e)return;a=!1}else for(;!(a=(n=i.call(e)).done)&&(c.push(n.value),c.length!==r);a=!0);}catch(t){f=!0,o=t}finally{try{if(!a&&null!=e.return&&(u=e.return(),Object(u)!==u))return}finally{if(f)throw o}}return c}}(t,r)||function(t,r){if(!t)return;if("string"==typeof t)return c(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(t);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return c(t,r)}(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}var a=t.createContext(null),f=t.createContext(null);function l(t){return l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},l(t)}function s(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n)}return e}function p(t,r,e){return(r=function(t){var r=function(t,r){if("object"!==l(t)||null===t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var n=e.call(t,r||"default");if("object"!==l(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"===l(r)?r:String(r)}(r))in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}exports.NullDispatch=e,exports.RootContextProvider=function(e){var n=e.children,i=e.reducer,c=e.customParams,l=e.initialState,s=u(t.useReducer(i,l),2),p=s[0],y=s[1];return r.jsx(a.Provider,{value:p,children:r.jsx(f.Provider,{value:o(y,c),children:n})})},exports.combineReducers=function(t){return function(r,e){r=r||{};var n=!1;return Object.keys(t).forEach((function(o){var i=t[o];if(i){var u=i(r[o]||{},e);u!==r[o]&&(r[o]=u,n=!0)}})),n?function(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{};r%2?s(Object(e),!0).forEach((function(r){p(t,r,e[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):s(Object(e)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r))}))}return t}({},r):r}},exports.createServerStore=function(t,r,e){var n={root:e||{},dispatch:o((function(r){n.root=t(n.root,r)}),r)};return n.dispatch({type:"@@INIT"}),n},exports.isPromise=n,exports.useStateDispatch=function(){return t.useContext(f)||e},exports.useStateSelectorT=function(r){var e=t.useContext(a);return r&&e?r(e):e},exports.wrapDispatchWithAsync=o;
