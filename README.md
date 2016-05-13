

## Change log
- 3.22.20 fix more ESLint errors, fix passing leftButtonStyle property for back button
- 3.22.18 fix some ESLint errors and ignore pop for root scene
- 3.22.17 allow jump & push together - now you could call Actions.tab2_2() (`tab2_2` is next scene after `tab2`) even if `tab2` is not active
- 3.22.16 simplified syntax for sub-states
- 3.22.15 introduces support for different states inside the same screen.
- 3.22.10 simplifies customization of own NavBar. From now you could import built-in NavBar from the component and customize it. You could set it globally to all scenes by setting `navBar` property for `Router` component.
For all other scenes you may pass rightButton, leftButton for custom buttons or rightTitle & onRight, leftTitle & onLeft for text buttons.

## IMPORTANT! Breaking changes comparing with 2.x version:
- React Native 0.22 is required
- `Router` is root container now and should not be nested. For nested scenes you should use `Scene` element
- `Route` became `Scene`, now unique `key` attribute is required for each scene (it was `name` attribute before)
- Define all your scenes on top-level, not within `Router` as before (see Example)
- No `Schema` element is supported for now (for simplicity), maybe later it could be added
- No ActionSheet support
- Custom scene renderers are used instead of 'custom' types (like 'modal'), so 'modal' scenes are pushed as usual, but custom renderer will render them as popup. No `dismiss`, just usual `pop` to close such popups.
- No old navigator.sceneConfig support (instead the component uses React Native NavigationAnimatedView for better transitions)
- No onPush/onPop/etc handlers because they are not needed now. If navigation state is changed, container will be re-rendered with changed navigationState property, see `Modal` as Example.
- No header/footer properties are supported for Scene currently - you may include them into Scene component.

## Modals
To display a modal use `Modal` as root renderer, so it will render the first element as `normal` scene and all others as popups (when they are pushed), see Example for more details.

## Tabbar
Every tab has its own navigation bar. However, if you do not set its parent `<Scene tabs={true} />` with `hideNavBar={true}`, the tabs' navigation bar will be overrided by their parent.

## Custom nav bar for individual scene or even different state of scene (new feature):
Your scene `component` class could implement _static_ renderNavigationBar(props) method that could return different navbar depending from component props

## Switch (new feature)
New feature for 3.x release is custom scene renderer that should be used together with tabs={true} property. It allows to select `tab` scene to show depending from app state.
It could be useful for authentication, restricted scenes, etc. Usually you should wrap `Switch` with redux `connect` to pass application state to it:
Following example chooses scene depending from sessionID using Redux:
```jsx
<Scene key="root" component={connect(state=>({profile:state.profile}))(Switch)} tabs={true}
       selector={props=>props.profile.sessionID ? "main" : "signUp"}>
    <Scene key="signUp" component={SignUp}/>
    <Scene key="main" component={Main}>
</Scene>
```

## Split your scenes to smaller parts if needed
Scenes concept is similar to iOS storyboard where you describe all your app screens in one place. However for some large apps, you may want to split it, like iOS app could have several iOS storyboards for different areas of the app.
Luckily, you could easy split Scenes using NodeJS built-in require calls:
```jsx
            <Router>
                    {require("./scenesForTabBar")}
                    {require("./scenesForAnotherPart")}
            </Router>
```

scenesForTabBar.js:
```jsx
import React from 'react-native';
import {Scene} from 'react-native-router-flux';

module.exports = <Scene key="tabbar" tabs={true}>
   // scenes here
</Scene>;
```

## Drawer (side menu) integration
Example of Drawer custom renderer based on react-native-drawer. Note that the build-in NavBar component supports toggling of drawer. The Drawer implementation just needs to have a function: toggle();

```jsx
import React from 'react-native';
import Drawer from 'react-native-drawer';
import SideMenu from './SideMenu';
import {DefaultRenderer} from 'react-native-router-flux';

export default class extends Component {
    render(){
        const children = this.props.navigationState.children;
        return (
            <Drawer
                ref="navigation"
                type="displace"
                content={<TabView />}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                 main: { opacity:Math.max(0.54,1-ratio) }
            })}>
                <DefaultRenderer navigationState={children[0]} />
            </Drawer>
        );
    }
}

/// then wrap your tabs scene with Drawer:
            <Scene key="drawer" component={Drawer}>
                <Scene key="main" tabs={true} >
                        ....
                </Scene>
            </Scene>

```
## Sub-scenes support
You could create 'sub-scene' actions by putting them as children for needed 'base' scene without `component` prop and call such action anywhere - 'base' Scene will be updated accordingly.
Example for 'My Account' screen with edit possibility (`MyAccount` component should call `Actions.editAccount()` to enable edit mode and process `save`, `editMode` properties accordingly - display edit controls, save data, etc.):

```jsx
<Scene key="myAccount" component={MyAccount} title="My Account">
    <Scene key="viewAccount" />
    <Scene key="editAccount" editMode rightTitle="Save" onRight={()=>Actions.saveAccount()} leftTitle="Cancel" onLeft={()=>Actions.viewAccount()} />
    <Scene key="saveAccount" save />
</Scene>
```
Note, that almost empty `viewAccount` sub-state here is needed to reset MyAccount to initial params defined for this scene (remove `save`, `editMode` and other properties from original state)
Sure it could be done using Redux, however it will require more coding and programmatic setting NavBar buttons using `refresh`.


## Production Apps using react-native-router-flux
+ GuavaPass.com ([iOS](https://itunes.apple.com/en/app/guavapass-one-pass-fitness/id1050491044?l=en&mt=8), Android) - offers convenient access to top classes at boutique fitness studios across Asia.

## Support
Thanks to all who submitted PRs to 2.x release. If you like the component and want to support it, feel free to donate any amount or help with issues.
