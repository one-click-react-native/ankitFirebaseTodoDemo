jest.mock('react-native-safe-area-context',()=>({
    SafeAreaProvider:jest.fn(()=>Promise.resolve())
}));