# DOCUMENTATION

## AUTHENTICATION HOOKS

All of the authentication hooks generally follow the same structure, with the exceptions of ‘useValidateUserInput’ & ‘useChangeEmail’, which I will give their own sections at the end.

Each hook returns an object with two properties. The first is a function and the second is an object which provides updates about the status of that function. For example if the function request is pending, has an error or has been completed successfully. 

**THE FUNCTION:**

All of these returned authentication hook functions are asynchronous. This is because they are connecting with and updating the Firebase Authentication service, which takes time to do. These functions also update our User Context API, so that both the User Context and the Firebase Authentication service are in sync.
Within these functions we have some conditionals, which are dictated by the isCancelled piece of state. These are our clean-up conditionals, so that if our component dismounts the state will not be updated. It is also within these functions that if you were to update an external database, like MongoDB for example, you would add use of another hook to do so within this function.

**THE OBJECT:**

The object returned usually consists of three key value pairs:
1. isPending - This tells us if the function called in the hook is still in process.
2. error - This will display the error message should one be returned from Firebase.
3. success - This tells us wether our function was successful or not. Its original default value is null.

Using these three pieces of state we can conditionally display different jsx elements in our components depending on their values.

**THE CLEAN-UP FUNCTION:**

 This is not returned but is present in our hook. It is the function ‘setIsCancelled(true);’ which is returned inside of the empty useEffect at the end of our hook. Since a useEffect clean-up function runs on mount and every subsequent re-render, at the start of our returned function we need to reset isCancelled to false.

**EXAMPLE:**

To give an example of how one of these hooks are used within a component I will use the ‘useLoginWithEmailAndPassword’ hook:
```
import { useLoginWithEmailAndPassword } from ‘../../hooks/authentication-hooks/useLoginWithEmailAndPassword’;

const Component = () => {

	const { login, loginState } = useLoginWithEmailAndPassword();

	return (
		{!loginState.isPending ? <button onClick={() => login(email, password)}>Login<button> : <button disabled>Logging in<button>}
	)

}	
```

***

 ## ROUTING

All routing can be found within the App.js file and uses React Router v6. So far there is only 3 different pages:
1. The Home page, which a user can only see when logged out.
2. The Dashboard, which only a logged in user can see.
3. The Account Settings page, which only a logged user can see.

All other authentication services happen with the use of modals.

**ROUTE GUARDING:**

The routing here so far is quite basic. For example the home path (‘/‘) will route you to a different page (either Home or Dashboard) depending on your login status. This basic route guarding also expends to the Account Settings page and should continue like this throughout the entirety app. 

**LOADING SCREEN:**

When first loading the page connecting to Firebase to check wether a user is logged in or not can take some time. So that we do not have a blank screen during this period I have added a PreLoader component, which basically tells the user that the service won’t be long and shows a loading SVG. This should help with visitor retention.

**MODALS:**

Furthermore, you will see at the top of the ‘App’ div that there are multiple lines referring to the modalState. This is so that if the Modal Context says that a modal is to be rendered on the screen, it is here we create the portal. The portal leads to a div with the id of ‘modal-root’ in the index.html file.

**ROUTE GUARDING USING MODALS:**

This line of code:
```
{!modalState && user.user !== null && !user.user.emailVerified && ReactDOM.createPortal(<UnverifiedEmail />, document.getElementById(‘modal-root’))}
```

Is route guarding, so that the user cannot use the websites’ services unless they have verified their email. This is to help prevent spam accounts.

***

## MODALS

Modals play a big part in this User Login / Authentication template. They are for a large part how users sign-up, login & reauthenticate, etc. Modals visually sit above and cover everything else on the screen, so it only makes sense if the html we render shows this. If we, for example, just rendered our modal inside of whatever component we wanted to use it with, then the html would also be nested within that component. This technically can work but isn’t ideal for accessibility. Screen readers wouldn’t know that the modal is the most important and effectively the only thing on the screen. So to get around this in React we use portals. If you don’t know about portals and want to dive deeper, please check out the React documentation on the matter. But going further I will assume you know about them. In this project, the root element for our portals is located in the index.html - it’s a div with an id of ‘modal-root’. The portal itself is located App.js file - above any of the other routing.

***MODAL CONTEXT API:***

This template uses the context API to manage which modal should be rendering on the screen, if any should be rendered at all. Otherwise we would have to create portals or ‘prop drill” all over our app, which is far from ideal. So, to solve this we have a simple context API which exports two values, essentially the values that a ‘useState’ hook returns: 
1. The modalState, which has a default value of null.
2. The setModalState function, which is what we use to define which modal should be rendered on the screen.

Furthermore, this ModalContextProvider is nested inside of the AuthContextProvider, so that all of our modals can have access to the User/Auth Context.

***RENDERING A MODAL:***

In order to build your own or change these modals it’s important you know about how the portals work inside of the App.js file. 

This piece of code in App.js is what controls if a modal is rendered or not:
```
{modalState && ReactDOM.createPortal(modalState, document.getElementById(‘modal-root’))}
```
Here you can see that, if modalState exists, React will render the ‘modalState’ inside the element with the id of ‘modal-root’. This is why it is important the default value of modalState is null. Because if there is no value in modalState, no modal will be rendered. But if we keep in mind this above code example and we’re to set the value of modalState to a component (setModalState(< LoginModal />), for example) then the ‘modalState exists’ condition will be met and < LoginModal />, will be rendered inside of the ‘root-modal’ element.

***EXAMPLE:***

That was a lot to take in, so let’s look at a more real world example before we continue and perhaps introduce how we would actually use it inside of a component:
```
// This is the React hook that lets us hook into our context
import { useContext } from ‘react’;

// This is our custom context API we use to set whether or not a modal renders
import { ModalContext } from ‘../../context/ModalContext’;

// This is the modal we want to render
import LoginModal from ‘../../components/modals/authentication-modals/LoginModal’;


export LoginButton = () => {

	// This is how we destructure and access our setModalState function
	const { setModalState } = useContext(ModalContext);

	return (
		<button 
			onClick={() => setModalState(<LoginModal />)}
			>Login
		<button>
	)
}

```

So, this example is a component that consists of a button, which when clicked will open the ‘LoginModal’ modal.

First, we import three things: The useContext hook from React, our ModalContext context API and the modal we want to render (the LoginModal modal).

Then, inside of our component we want to be able to set the ‘modalState’. So, to access that we destructure our ModalContext using the useContext hook.

Then, we set an onClick event on our button to set the modalState to our LoginModal component.

Now, when we click the button, the LoginModal should render to the screen.


If we then wanted to have an exit button on this opened LoginModal component we would simply have to add another component such as this:
```
import { useContext } from ‘react’;

import { ModalContext } from ‘../../context/ModalContext’;

// We do not need to import a modal component as we will only be setting the modalState value to null


export ExitButton = () => {

	const { setModalState } = useContext(ModalContext);

	return (
		<button 
			onClick={() => setModalState(null)}
			>Exit Modal
		<button>
	)
}
```
***