import Immutable from 'immutable'

interface AllowedList extends Immutable.List<AllowedValue> {}

interface AllowedMap extends Immutable.Map<string, AllowedValue> {}

type AllowedKey = string

type AllowedValue =
  string |
  number |
  boolean |
  AllowedMap |
  AllowedList |
  TypedMap<any> |
  undefined;

type MapTypeAllowedData<DataType> = {
  [K in keyof DataType]: AllowedValue;
};

type Remove<T, U> = T extends U ? never : T;

interface TypedMap<DataType
extends MapTypeAllowedData<DataType>>
extends Immutable.Map<AllowedKey, AllowedValue> {
  toJS(): DataType;
  get<K extends keyof DataType>(key: K, notSetValue?: AllowedValue): DataType[K];
  set<T extends string, V>(t: T, v: V): TypedMap<{ [P in Remove<keyof DataType, T>]: DataType[P] } & { [k in T]: V }>;
}

const Map = <DataType extends MapTypeAllowedData<DataType>>
  (data: DataType): TypedMap<DataType> => Immutable.Map(data as any) as TypedMap<DataType>

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

// TODO: missing type inference with setIn/getIn
const paymentMethod = mapWithWallet.setIn(['wallet', 'paymentMethod'], 'paypal').getIn(['wallet', 'paymentMethod'])

const emptyMap = basicMap.clear()

// TODO: after using `remove` membership inference is lost
const mapWithoutUsername = basicMap.remove('username').get('id')
const mapWithoutUsername2 = basicMap.delete('username').get('id')

console.log(username, mapWithWallet)
