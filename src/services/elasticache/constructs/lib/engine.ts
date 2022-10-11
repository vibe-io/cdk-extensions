export enum CacheEngineName {
    MEMCACHED = 'memcached',
    REDIS = 'redis'
}

export class CacheEngineFamily {
    public static readonly MEMCACHED_1_4 = CacheEngineFamily.of('memcached1.4');
    public static readonly MEMCACHED_1_5 = CacheEngineFamily.of('memcached1.5');
    public static readonly MEMCACHED_1_6 = CacheEngineFamily.of('memcached1.6');

    public static readonly REDIS_2_6 = CacheEngineFamily.of('redis2.6');
    public static readonly REDIS_2_8 = CacheEngineFamily.of('redis2.8');
    public static readonly REDIS_3_2 = CacheEngineFamily.of('redis3.2');
    public static readonly REDIS_4_0 = CacheEngineFamily.of('redis4.0');
    public static readonly REDIS_5_0 = CacheEngineFamily.of('redis5.0');
    public static readonly REDIS_6_X = CacheEngineFamily.of('redis6.x');

    public static of(name: string): CacheEngineFamily {
        return new CacheEngineFamily(name);
    }


    public readonly name: string;

    private constructor(name: string) {
        this.name = name;
    }
}

export interface CacheEngineOptions {
    readonly engineFamily?: CacheEngineFamily;
}

export abstract class CacheEngine {
    public abstract readonly defaultPort: number;
    public readonly engineFamily: CacheEngineFamily;
    public readonly engineName: CacheEngineName;
    public readonly engineVersion: string;

    protected constructor(name: CacheEngineName, version: string, options?: CacheEngineOptions) {
        this.engineName = name;
        this.engineVersion = version;

        this.engineFamily = options?.engineFamily ?? CacheEngineFamily.of(`${name}${version.split('.')[0]}.x`);
    }
}

export interface RedisEngineOptions extends CacheEngineOptions {
    readonly transitEncryptionSupported?: boolean;
}

export class RedisEngine extends CacheEngine {
    public static readonly V_2_6_13 = RedisEngine.of('2.6.13', {
        engineFamily: CacheEngineFamily.REDIS_2_6,
        transitEncryptionSupported: false
    });
    public static readonly V_2_8_6 = RedisEngine.of('2.8.6', {
        engineFamily: CacheEngineFamily.REDIS_2_8,
        transitEncryptionSupported: false
    });
    public static readonly V_2_8_19 = RedisEngine.of('2.8.19', {
        engineFamily: CacheEngineFamily.REDIS_2_8,
        transitEncryptionSupported: false
    });
    public static readonly V_2_8_21 = RedisEngine.of('2.8.21', {
        engineFamily: CacheEngineFamily.REDIS_2_8,
        transitEncryptionSupported: false
    });
    public static readonly V_2_8_22 = RedisEngine.of('2.8.22', {
        engineFamily: CacheEngineFamily.REDIS_2_8,
        transitEncryptionSupported: false
    });
    public static readonly V_2_8_23 = RedisEngine.of('2.8.23', {
        engineFamily: CacheEngineFamily.REDIS_2_8,
        transitEncryptionSupported: false
    });
    public static readonly V_2_8_24 = RedisEngine.of('2.8.24', {
        engineFamily: CacheEngineFamily.REDIS_2_8,
        transitEncryptionSupported: false
    });

    public static readonly V_3_2_4 = RedisEngine.of('3.2.4', {
        engineFamily: CacheEngineFamily.REDIS_3_2,
        transitEncryptionSupported: false
    });
    public static readonly V_3_2_6 = RedisEngine.of('3.2.6', {
        engineFamily: CacheEngineFamily.REDIS_3_2,
        transitEncryptionSupported: true
    });
    public static readonly V_3_2_10 = RedisEngine.of('3.2.10', {
        engineFamily: CacheEngineFamily.REDIS_3_2,
        transitEncryptionSupported: true
    });
    
    public static readonly V_4_0_10 = RedisEngine.of('4.0.10', {
        engineFamily: CacheEngineFamily.REDIS_4_0,
        transitEncryptionSupported: true
    });

    public static readonly V_5_0_0 = RedisEngine.of('5.0.0', {
        engineFamily: CacheEngineFamily.REDIS_5_0,
        transitEncryptionSupported: true
    });
    public static readonly V_5_0_3 = RedisEngine.of('5.0.3', {
        engineFamily: CacheEngineFamily.REDIS_5_0,
        transitEncryptionSupported: true
    });
    public static readonly V_5_0_4 = RedisEngine.of('5.0.4', {
        engineFamily: CacheEngineFamily.REDIS_5_0,
        transitEncryptionSupported: true
    });
    public static readonly V_5_0_5 = RedisEngine.of('5.0.5', {
        engineFamily: CacheEngineFamily.REDIS_5_0,
        transitEncryptionSupported: true
    });
    public static readonly V_5_0_6 = RedisEngine.of('5.0.6', {
        engineFamily: CacheEngineFamily.REDIS_5_0,
        transitEncryptionSupported: true
    });

    public static readonly V_6_0 = RedisEngine.of('6.0', {
        engineFamily: CacheEngineFamily.REDIS_6_X,
        transitEncryptionSupported: true
    });
    public static readonly V_6_2 = RedisEngine.of('6.2', {
        engineFamily: CacheEngineFamily.REDIS_6_X,
        transitEncryptionSupported: true
    });

    public static of(version: string, options?: RedisEngineOptions): RedisEngine {
        return new RedisEngine(version, options);
    }


    public readonly defaultPort: number = 6379;
    public readonly transitEncryptionSupported: boolean;

    private constructor(version: string, options?: RedisEngineOptions) {
        super(CacheEngineName.REDIS, version);
        this.transitEncryptionSupported = options?.transitEncryptionSupported ?? true;
    }
}