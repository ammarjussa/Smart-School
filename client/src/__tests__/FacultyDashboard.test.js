import { FacultyDashboard } from '../Components/Faculty/FacultyDashboard';
import {shallow} from 'enzyme'; 
import React from 'react'; 
import toJson from 'enzyme-to-json'; 

const component = shallow(<FacultyDashboard/>);

describe('Login Component', () => {
    it('renders without crashing', () => {
        expect(toJson(component)).toMatchSnapshot()
    })
    
    it('Renders a H1 tag', () => {
        const wrapper = component.find('h1')
        expect(wrapper.length).toBe(1)
    });
    it('Renders a P tag', () => {
        const wrapper = component.find('p')
        expect(wrapper.length).toBe(1)
    }); 
 });