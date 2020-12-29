var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TestUtils } from '../../test';
import { PersistenceProvider } from '../persistence/persistence';
import { ConfigProvider } from './config';
describe('Provider: Config Provider', () => {
    let persistenceProvider;
    let configProvider;
    beforeEach(() => {
        const testBed = TestUtils.configureProviderTestingModule();
        configProvider = testBed.get(ConfigProvider);
        persistenceProvider = testBed.get(PersistenceProvider);
        persistenceProvider.load();
    });
    describe('Function: Load Function', () => {
        it('resolves', () => {
            return configProvider.load().then(() => {
                expect().nothing();
            });
        });
        it('should store a config', () => {
            let newOpts = JSON.parse('{}');
            persistenceProvider.storeConfig(newOpts).then(() => {
                configProvider.load().then(() => {
                    expect(this.configCache).not.toBeNull();
                });
            });
        });
        it('should set default config if storage is empty', () => __awaiter(this, void 0, void 0, function* () {
            const defaults = configProvider.getDefaults();
            yield persistenceProvider.clearConfig();
            yield configProvider.load();
            const config = yield persistenceProvider.getConfig();
            expect(config).toBeNull();
            expect(defaults).not.toBeNull();
        }));
        it('should set config from storage', () => {
            persistenceProvider.getConfig().then(() => {
                expect(this.configCache).not.toBeNull();
            });
        });
        it('should return error if file is corrupted', () => {
            let promise = Promise.reject('Error Loading Config');
            spyOn(persistenceProvider, 'getConfig').and.returnValue(promise);
            configProvider.load().catch(() => {
                expect(this.configCache).toBeUndefined();
            });
        });
    });
    describe('Function: Set Function', () => {
        it('should store a new config with options', () => {
            let newOpts = '{}';
            expect(newOpts).toBe('{}');
            JSON.parse(newOpts);
            configProvider.set(newOpts);
            expect(this.configCache).not.toBeNull();
        });
    });
    describe('Function: Get Default Function', () => {
        it('should get default config', () => {
            let defaults = configProvider.getDefaults();
            expect(defaults).not.toBeNull();
        });
    });
});
//# sourceMappingURL=config.spec.js.map