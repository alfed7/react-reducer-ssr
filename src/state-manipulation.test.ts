import { DispatchFunction, createServerStore } from './state-manipulation';
import { combineReducers } from './combine-reducers';

export interface IAdminState {
  adminName: string | null
}
export interface IUsersState {
  userName: string | null
}
export function usersReducer(state: IUsersState, action: any): IUsersState {
  switch (action.type) {
    case 'USER_LOGIN': {
      return {...state, userName: action.value};
    }break;
    case 'LOGIN_SUCCESS': {
      return {...state, userName: action.userName};
    }break;
  }
  return state;
}
export function adminReducer(draft: IAdminState, action: any): IAdminState {
  switch (action.type) {
    case 'ADMIN_LOGIN': {
      draft.adminName = action.value;
    }break;
    case 'ADMIN_LOGIN_SUCCESS': {
      console.log("ADMIN_LOGIN_SUCCESS", action.userName)
      draft.adminName = action.userName;
    }break;
  }
  return draft
}
const a = {admin: adminReducer, users: usersReducer};
const testReducer = combineReducers({
  ...a
});
function loginUser(userName: string) {
  return { type: 'USER_LOGIN', value: userName }
}
async function loginUserAsync(userName: string) {
  await new Promise((r) => setTimeout(r, 500));
  return loginUser(userName);
}
async function loginUserAsyncCreator(userName: string) {
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

function loginUserAsync2(userName: string) {
  return async (dispatch: DispatchFunction, state: any, extraArgument: any) => {
    //const { userServices } = getServices(extraArgument);
    const userServices = extraArgument;
    dispatch(request());

    // 0.5 sec timeout
    await new Promise((r) => setTimeout(r, 500));
    
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
  test('asynchronous dispatch creator', async () => {
    const store = createServerStore(testReducer, services)
    await store.dispatch(loginUserAsyncCreator("test user 4"));
    expect(store.root.users.userName).toBe("test user 4");
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
