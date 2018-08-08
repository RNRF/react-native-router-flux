export function getActiveStateExceptDrawer(param) {
  const state = param;
  if (!state.routes) {
    return state;
  }
  if (state.routes[state.index].routeName === 'DrawerOpen') {
    return getActiveState(state.routes[0]);
  }
  return getActiveState(state.routes[state.index]);
}

export function isActiveRoute(state, routeName) {
  if (state.routeName === routeName) {
    return true;
  }
  if (!state.routes) {
    return state.routeName === routeName;
  }
  if (state.routes[state.index].routeName === 'DrawerOpen') {
    return isActiveRoute(state.routes[0], routeName);
  }
  return isActiveRoute(state.routes[state.index], routeName);
}

export function getActiveState(param, parent) {
  const state = param;
  if (parent) {
    if (!state.routes) {
      console.log('GET ACTIVE STATE HAS ROUTES', state.routes);
      return { ...state, parent };
    } else {
      console.log('NO ROUTES FOR ACTIVE ROUTES', state.routes);
    }
    return getActiveState(state.routes[state.index], { ...state, parent });
  }
  console.log('NO PARENT FOR ACTIVE ROUTE', state.routes);
  return { routeName: null };
}

export function getParent(state, routeName, parent) {
  if (state.routeName === routeName) {
    return parent;
  }
  if (!state.routes) {
    return null;
  }
  for (let i = 0; i < state.routes.length; i += 1) {
    const res = getParent(state.routes[i], routeName, state);
    if (res) {
      return res;
    }
  }
  return null;
}
export function inject(state, key, index, routes) {
  if (!state.routes) {
    return state;
  }
  if (state.key === key) {
    if (routes) {
      return { ...state, routes, index };
    }
    return { ...state, index };
  }
  return { ...state, routes: state.routes.map(x => inject(x, key, index, routes)) };
}

export function popPrevious(state, routeName) {
  const parent = getParent(state, routeName);
  console.log('FOUND PARENT:', JSON.stringify(parent));
  const { key, index } = parent;
  if (index) {
    const routes = [...parent.routes.slice(0, index - 1), ...parent.routes.slice(index)];
    const newState = inject(state, key, index - 1, routes);
    return newState;
  }
  return state;
}
