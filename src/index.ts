import Immutable from 'immutable'

interface AllowedList extends Immutable.List<AllowedValue> {}

interface AllowedMap extends Immutable.Map<string, AllowedValue> {}

type AllowedValue =
  string |
  number |
  boolean |
  AllowedMap |
  AllowedList |
  TypedMap<any> |
  undefined;

type MapTypeAllowedData<T> = {
  [K in keyof T]: AllowedValue;
};

type Remove<T, U> = T extends U ? never : T;

interface TypedMap<T extends MapTypeAllowedData<T>> {
  toJS(): T;

  clear(): TypedMap<{}>;

  delete<K extends keyof T>(key: K): TypedMap<{ [P in Remove<keyof T, K>]: T[P] }>;
  
  get<K extends keyof T>(key: K, notSetValue?: AllowedValue): T[K];

  getIn<K1 extends keyof T>(keys: [K1]): T[K1];
  getIn<K extends string[], V extends AllowedValue>(keys: K, notSetValue?: V): V | undefined; 

  remove<K extends keyof T>(key: K): TypedMap<{ [P in Remove<keyof T, K>]: T[P] }>;

  set<K extends string, V>(key: K, value: V): TypedMap<{ [P in Remove<keyof T, K>]: T[P] } & { [k in K]: V }>;

  // TODO: fix setIn
  setIn<K extends string[], V>(keys: K, value: V): TypedMap<{}>;
}

const Map = <DataType extends MapTypeAllowedData<DataType>>
  (data: DataType): TypedMap<DataType> => Immutable.Map(data) as any

const basicMap = Map({
  id: 'lucarge',
  username: 'lucarge',
  age: 24,
  awesome: true,
})

const username = basicMap.get('id')

const mapWithWallet = basicMap.set('wallet', Map({
  credits: 50,
}))

const credits = mapWithWallet.getIn(['wallet'])

// TODO: missing type inference with setIn/getIn
const paymentMethod = mapWithWallet.setIn(['wallet', 'paymentMethod'], 'paypal').getIn(['wallet', 'paymentMethod'])

const emptyMap = basicMap.clear()

// TODO: after using `remove` membership inference is lost
const mapWithoutUsername = basicMap.remove('username').get('id')
const mapWithoutUsername2 = basicMap.delete('username')

console.log(username, mapWithWallet)
