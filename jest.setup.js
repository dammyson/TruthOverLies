const cacheStore = {};
const translationStore = {};
const asyncStorageStore = {};

const dbStub = {
  execute: (sql, params = []) => {
    const statement = String(sql).trim().toLowerCase();

    if (statement.startsWith('select val from cache')) {
      const key = params[0];
      const value = cacheStore[key];
      return {
        rows: {
          _array: value == null ? [] : [{val: JSON.stringify(value)}],
        },
      };
    }

    if (statement.startsWith('insert or replace into cache')) {
      const key = params[0];
      const rawValue = params[1];
      cacheStore[key] = JSON.parse(rawValue);
      return {rows: {_array: []}};
    }

    if (statement.startsWith('select id from translations')) {
      return {
        rows: {
          _array: Object.keys(translationStore).map(id => ({id})),
        },
      };
    }

    if (statement.startsWith('insert or replace into translations')) {
      const id = params[0];
      translationStore[id] = true;
      return {rows: {_array: []}};
    }

    if (statement.startsWith('delete from verses')) {
      return {rows: {_array: []}};
    }

    if (statement.startsWith('delete from translations')) {
      const id = params[0];
      delete translationStore[id];
      return {rows: {_array: []}};
    }

    return {rows: {_array: []}};
  },
};

jest.mock('@op-engineering/op-sqlite', () => ({
  open: () => dbStub,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async key => (key in asyncStorageStore ? asyncStorageStore[key] : null)),
    setItem: jest.fn(async (key, value) => {
      asyncStorageStore[key] = String(value);
    }),
    removeItem: jest.fn(async key => {
      delete asyncStorageStore[key];
    }),
  },
}));
