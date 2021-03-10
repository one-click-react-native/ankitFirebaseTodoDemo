jest.mock('@react-native-firebase/auth',()=>({
    auth:jest.fn(()=>Promise.resolve())
}));