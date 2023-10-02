import { createServerStore } from './state-manipulation';
import { combineReducers } from './combine-reducers';

export interface IUsersState {
  userName: string | null
}
export function usersReducer(draft: IUsersState, action: any): IUsersState {
  switch (action.type) {
    case 'USER_LOGIN': {
      draft.userName = action.value;
    }break;
  }
  return draft
}

const testReducer = combineReducers({
  users: usersReducer
});
function loginUser(userName: string) {
  return { type: 'USER_LOGIN', value: userName }
}
async function loginUserAsync(userName: string) {
  await new Promise((r) => setTimeout(r, 1000));
  return loginUser(userName);
}
describe('server store', () => { 
  test('synchronous dispatch', () => {
    const store = createServerStore(testReducer)
    store.dispatch(loginUser("test user"));
    expect(store.root.users.userName).toBe("test user");
  }),
  test('asynchronous dispatch', async () => {
    const store = createServerStore(testReducer)
    await store.dispatch(loginUserAsync("test user 2"));
    expect(store.root.users.userName).toBe("test user 2");
  })
})
