interface LocalStorageItem<T> {
  value: T; // 存储的值
  expire: number | null; // 过期时间 单位：毫秒，如果为null表示永不过期
}
/**
 * @example:
 *  storage.setItem("data1", userInfo.value.username, 1000 * 60 * 60 * 24) //设置过期时间为1天
    storage.setItem("data2", userInfo.value.password)//没有设置过期时间
    getItem返回一个Promise对象
    storage.getItem("data1").then(res1 => {
      console.log(res1) //获取到存储的数据
    })
    let res2 = await storage.getItem("data2") //获取到存储的数据, 注意顶层函数需要加上async
 */
class LocalStorage {
  private static instance: LocalStorage; // 单例模式,保证只有一个实例
  private storage: Storage; // localStorage 对象
  // private iv: Uint8Array; //加密解密所需的iv值
  private iv: Uint8Array; // 加密解密所需的iv值
  private cryptoKey: CryptoKey; // 加密解密所需的key值
  private constructor() {
    this.storage = window.localStorage; // 获取localStorage对象
    // this.iv = window.crypto.getRandomValues(new Uint8Array(12)); //创建随机的iv值，用于加密解密
    this.iv = new Uint8Array([
      61,
      253,
      90,
      90,
      142,
      0,
      61,
      254,
      174,
      1,
      218,
      251,
    ]); // 加解密需要创建同一个iv值，可以使用上行替换该值
    (async () => {
      this.cryptoKey = await this.initKey(); // 创建加密解密所需的key值
    })();
  }

  public static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      // 如果实例不存在，则创建一个新实例
      LocalStorage.instance = new LocalStorage();
      // 创建加密解密所需的key值
    }
    return LocalStorage.instance; // 返回实例
  }

  public async setItem<T>(
    key: string,
    value: T,
    expire?: number,
  ): Promise<void> {
    const item: LocalStorageItem<T> = {
      value, // 存储的值
      expire: expire ? new Date().getTime() + expire : null, // 如果有过期时间，则计算过期时间
    };
    (async () => {
      const encrypt = await this.encryptSymmetricKey(item);
      this.storage.setItem(key, JSON.stringify(encrypt)); // 将对象序列化为字符串，并存储到localStorage中
    })();
  }

  public getItem<T>(key: string): Promise<T | null> {
    return (async () => {
      const itemStr = this.storage.getItem(key); // 获取存储的字符串
      if (itemStr) {
        const arr = Object.values(JSON.parse(itemStr) as T);
        const unitArr = new Uint8Array(arr);
        const item: LocalStorageItem<T> = await this.decryptSymmetricKey(
          unitArr.buffer,
        );
        if (!item.expire || new Date().getTime() < item.expire) {
          // 如果没有设置过期时间或者还没有过期
          return item.value; // 返回存储的值
        }
        else {
          this.storage.removeItem(key); // 如果已经过期，则删除该项
          console.error('时间过期');
        }
      }
      return null; // 如果不存在或已经过期，则返回null
    })();
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key); // 删除指定的项
  }

  public clear(): void {
    this.storage.clear(); // 清空localStorage
  }

  // 设置加密解密
  async initKey(): Promise<CryptoKey> {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/SubtleCrypto/generateKey
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 128,
      },
      true,
      ['encrypt', 'decrypt'],
    );
    return key;
  }

  // 加密
  async encryptSymmetricKey<T>(data: T): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const bufferData = encoder.encode(JSON.stringify(data));
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: this.iv,
      },
      this.cryptoKey,
      bufferData,
    );
    return new Uint8Array(ciphertext);
  }

  // 解密
  async decryptSymmetricKey<T>(data: ArrayBuffer): Promise<T> {
    const plaintext = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: this.iv,
      },
      this.cryptoKey,
      data,
    );
    const decoder = new TextDecoder();
    const decodedText = decoder.decode(plaintext);
    return JSON.parse(decodedText);
  }
}

export default LocalStorage.getInstance();
