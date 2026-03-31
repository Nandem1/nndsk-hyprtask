/**
 * Aplana instancias de clase para usar en Zustand
 * Extrae todos los métodos, getters y setters del prototype y los expone en un objeto plano
 *
 * @example
 * const store = create<Store>()((...params) => ({
 *   ...initialState,
 *   ...flattenActions<StoreActions>([
 *     createThemeSlice(...params),
 *     createFiltersSlice(...params),
 *   ]),
 * }));
 */
export function flattenActions<T>(instances: object[]): T {
  const result = {} as T;

  for (const instance of instances) {
    const proto = Object.getPrototypeOf(instance);

    // Copy property descriptors from prototype (getters, setters, methods)
    const propertyDescriptors = Object.getOwnPropertyDescriptors(proto);
    for (const [key, descriptor] of Object.entries(propertyDescriptors)) {
      if (key === "constructor") continue;

      if (descriptor.get || descriptor.set) {
        // It's a getter/setter - copy the descriptor
        Object.defineProperty(result, key, {
          get: descriptor.get?.bind(instance),
          set: descriptor.set?.bind(instance),
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
        });
      } else if (typeof descriptor.value === "function") {
        // It's a method - bind it to the instance
        (result as Record<string, unknown>)[key] =
          descriptor.value.bind(instance);
      }
    }

    // Copy own properties (class fields)
    const ownProps = Object.getOwnPropertyNames(instance).filter(
      (name) => name !== "constructor",
    );
    for (const prop of ownProps) {
      (result as Record<string, unknown>)[prop] = (
        instance as Record<string, unknown>
      )[prop];
    }
  }

  return result;
}
