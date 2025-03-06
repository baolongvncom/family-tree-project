import { shallowReactive } from 'vue';

export function mapWritableState(store, fields) {
  const mapped = shallowReactive({});

  fields.forEach((field) => {
    mapped[field] = {
      get value() { return store[field]; },
      set value(v) { store[field] = v; }
    };
  });

  return mapped;
}

