import { List, Map } from 'immutable'

interface AllowedList extends List<AllowedValue> {}

interface AllowedMap extends Map<string, AllowedValue> {}

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

// @ts-ignore
interface TypedMap<DataType extends MapTypeAllowedData<DataType>> extends Map<AllowedKey, AllowedValue> {
  toJS(): DataType;
  get<K extends keyof DataType>(key: K, notSetValue?: AllowedValue): DataType[K];
  set<T extends string, V>(t: T, v: V): TypedMap<{ [P in Remove<keyof DataType, T>]: DataType[P] } & { [k in T]: V }>;
}

const createTypedMap = <DataType extends MapTypeAllowedData<DataType>>(data: DataType): TypedMap<DataType> => Map(data as any) as TypedMap<DataType>

const basicMap = createTypedMap({
  id: 'lucarge',
  username: 'lucarge',
  age: 24,
  awesome: true,
})

const username = basicMap.get('id')

const mapWithWallet = basicMap.set('wallet', createTypedMap({
  credits: 50,
}))

console.log(username, mapWithWallet)
