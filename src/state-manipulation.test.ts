import { DispatchFunction, createServerStore } from './state-manipulation';
import { combineReducers } from './combine-reducers';

export interface IUsersState {
  userName: string | null
}
export function usersReducer(draft: IUsersState, action: any): IUsersState {
  switch (action.type) {
    case 'USER_LOGIN': {
      draft.userName = action.value;
    }break;
    case 'LOGIN_SUCCESS': {
      console.log("first", action.userName)
      draft.userName = action.userName;
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
  await new Promise((r) => setTimeout(r, 500));
  return loginUser(userName);
}
async function loginUserAsync2(userName: string) {
  return async (dispatch: DispatchFunction, state: any, extraArgument: any) => {
    //const { userServices } = getServices(extraArgument);
    const userServices = extraArgument;
    dispatch(request());

    try {
      console.log("login")
      await userServices.user.login(userName);

      dispatch(success(userName));
    } catch (err) {
      dispatch(failure(err));
    }
  };

  function request() {
    return { type: "LOGIN_REQUEST" };
  }
  function success(userName: string) {
    return { type: "LOGIN_SUCCESS", userName };
  }
  function failure(error: any) {
    return { type: "LOGIN_FAILURE", error };
  }
}

async function loginUserAsync3(userName: string) {
  return (dispatch: DispatchFunction, state: any, extraArgument: any) => {
    //const { userServices } = getServices(extraArgument);
    const userServices = extraArgument;
    console.log("Dispatch", dispatch)
    dispatch(request());
    
    userServices.user.login(userName);
    try {
      console.log("login3", userName)

      dispatch(success(userName));
    } catch (err) {
      dispatch(failure(err));
    }
  };

  function request() {
    return { type: "LOGIN_REQUEST" };
  }
  function success(userName: string) {
    return { type: "LOGIN_SUCCESS", userName };
  }
  function failure(error: any) {
    return { type: "LOGIN_FAILURE", error };
  }
}

class User {
  async login(userName: string) {
    console.log("Login user service: ", userName);
  }
}
const services = {
  user: new User()
}
describe('server store', () => { 
  test('synchronous dispatch', () => {
    const store = createServerStore(testReducer, services)
    store.dispatch(loginUser("test user"));
    expect(store.root.users.userName).toBe("test user");
  }),
  test('asynchronous dispatch', async () => {
    const store = createServerStore(testReducer, services)
    await store.dispatch(loginUserAsync("test user 2"));
    expect(store.root.users.userName).toBe("test user 2");
  })
  test('asynchronous dispatch with params', async () => {
    const store = createServerStore(testReducer, services)
    await store.dispatch(loginUserAsync2("test user 2"));
    expect(store.root.users.userName).toBe("test user 2");
  })
  test('dispatch with params', async () => {
    const store = createServerStore(testReducer, services)
    await store.dispatch(loginUserAsync3("test user 3"));
    expect(store.root.users.userName).toBe("test user 3");
  })
})
