import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConnectedSetProfile from '../SetProfile';
import event from '../../../__mocks__/event';

const profile = {};
const errors = {};
let mockState = {
  profile,
  errors
}
const mockSetProfileStore = mockStore(mockState);

it("mounts and, when all inputs are updated, then state is updated for each", () => {
  const wrapper = mount(
    <Provider store={mockSetProfileStore} displaySocialInputs={false} >
      <MemoryRouter>
        <ConnectedSetProfile />
      </MemoryRouter>
    </Provider>
  );

  const component = wrapper.find('SetProfile');

  component.find('input[name="handle"]').simulate('change', { target: event('handle', 'test_handle') });
  component.find('select[name="status"]').simulate('change', { target: event('status', 'Developer') });
  component.find('input[name="company"]').simulate('change', { target: event('company', 'test_company') });
  component.find('input[name="website"]').simulate('change', { target: event('website', 'test_website') });
  component.find('input[name="location"]').simulate('change', { target: event('location', 'test_location') });
  component.find('input[name="skills"]').simulate('change', { target: event('skills', 'test_skill0, test_skill1') });
  component.find('input[name="githubUsername"]').simulate('change', { target: event('githubUsername', 'test_githubUsername') });
  component.find('input[name="skills"]').simulate('change', { target: event('skills', 'test_skill0, test_skill1') });
  component.find('textarea[name="bio"]').simulate('change', { target: event('bio', 'test_bio') });

  expect(component.state().handle).toEqual(`test_handle`);
  expect(component.state().status).toEqual(`Developer`);
  expect(component.state().company).toEqual(`test_company`);
  expect(component.state().website).toEqual(`test_website`);
  expect(component.state().location).toEqual(`test_location`);
  expect(component.state().skills).toEqual(`test_skill0, test_skill1`);
  expect(component.state().bio).toEqual(`test_bio`);
});