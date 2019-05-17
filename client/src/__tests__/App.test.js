import {App} from '../App';
import {shallow} from 'enzyme'; 
import React from 'react'; 
import toJson from 'enzyme-to-json'; 

const component = shallow(<App />);

describe('Login Component', () => {
    it('renders without crashing ', () => {
        const props = {}
        const wrapper = shallow(<App {...props} />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })
    
    it('Login provides login options for admin and faculty', () => {
        const wrapper = component.find('ProtectedRoute');
        expect(wrapper.length).toBe(2);
        // console.log(component.debug())

    })
})