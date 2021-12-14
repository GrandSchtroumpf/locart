import { coerceBooleanProperty } from "@angular/cdk/coercion";

function coerce<T>(coerceFn: (value: any) => T,): PropertyDecorator {
  return function (target: any, propertyKey: any) {
    const _key = Symbol();
    target[_key] = target[propertyKey];
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return this[_key];
      },
      set: function (v: any) {
        this[_key] = coerceFn.call(this, v);
      }
    });
  };
}

export const bool = coerce(coerceBooleanProperty);