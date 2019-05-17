import { AdminDashboard } from '../Components/Admin/AdminDashboard';
import { shallow } from 'enzyme';
import React from 'react';
import toJson from 'enzyme-to-json';

const component = shallow(<AdminDashboard />);

describe('Admin Dashboard Component', () => {
    it('Admin Dashboard renders successfully', () => {
        // const wrapper = shallow(<AdminDashboard />)
        expect(toJson(component)).toMatchSnapshot()
    }) ; 

    it('Renders a H1 tag' , () => {
        const wrapper= component.find('h1')
        expect(wrapper.length).toBe(1)
    }) ; 
    it('Renders a P tag', () => {
        const wrapper = component.find('p')
        expect(wrapper.length).toBe(1)
    }); 
});