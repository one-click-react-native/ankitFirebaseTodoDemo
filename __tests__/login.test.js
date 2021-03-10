import {render} from '@testing-library/react-native'
import LoginScreen from '../screens/AuthScreens/LoginScreen'
import renderer from 'react-test-renderer';

it('render correctly',()=>{
    renderer.create(<LoginScreen/>)
});