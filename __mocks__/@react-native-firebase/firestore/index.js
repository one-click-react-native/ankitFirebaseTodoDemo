jest.mock('@react-native-firebase/firestore',()=>({
    firestore:jest.fn(()=>Promise.resolve())
}));