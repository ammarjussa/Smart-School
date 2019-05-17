import { Login } from '../Components/Login';
import { shallow } from 'enzyme';
import React from 'react';
import toJson from 'enzyme-to-json';

const component = shallow(<Login />);

describe('Login Component', () => {
    it('Login renders properly', () => {
        const wrapper = shallow(<Login />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('Selecting no user results in an error', () => {
        const props = { User: 'Admin'} 
        const wrapper = component.find('.UserForm').childAt(0).simulate('change', {
            target: props}) ;
        // console.log(component.state())
        expect(toJson(wrapper)).toMatchSnapshot() ;
        expect(wrapper.state.User).toBe(undefined); 

    })
})