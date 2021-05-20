## Boomi Flow Google maps custom component
The objective is create a custom UI component for Boomi Flow that will let you visualize lat/long pairs on Google maps.
The custom component is based on standard React framework and has to be built and leveraged in the flow
The notes below describe an end-to-end method of doing so.
The original work belongs to... and special thanks to:
Chris Cappetta https://github.com/ccappetta
Additional thanks to Premjit Mishra (Boomi) for helping me to understand custom components

## Original repository
https://github.com/boomiflow-community/ui-component-google-map.git

## End result

![image](https://user-images.githubusercontent.com/39495790/118932567-cef61000-b965-11eb-8234-5d8c3be52acd.png)

## Modifications performed via this fork
Original code has a static lat/long defined "You are Here" marker
Modified the index.tsx to remove the second "You are Here" marker
Now the map will only populate markers that it receives from the dynamic value list in the flow presentation component

## Install nodeJS on ubuntu 18.04
sudo su
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile
nvm install v14.17.0
nvm use v14.17.0
npm config set user 0
npm config set unsafe-perm true

## Clone the modified repo
git clone https://github.com/thecloudgarage/ui-component-google-map.git
cd ui-component-google-map
npm install
npm run build
cd build

Observe the two files generated for the custom component

## Make custom component files accessible to flow player
Copy the .js and .css file either to s3 or the assets of Boomi Flow
If moved to s3, ensure they are public
aws s3 cp custom-component.js s3://<bucket-name>/ --acl public-read
aws s3 cp custom-component.css s3://<bucket-name>/ --acl public-read
Alternatively if moved to Boomi Flow assets, then the files are public by default
Copy the publicly accesible URLs

## Enable javascript API in google maps
https://console.cloud.google.com/
Select your project
Left hand menu > APIs and Services > Library > search for Maps Javascript API > Enable > Create API key (your account/project needs to be setup for billing,
else it will error)
Copy the API key (you can restrict the API key optionally to secure the consumption)

## Boomi Flow Custom Player
Create a new player based on default player.

Scroll down to where the head section begins and insert the below. Replace YOUR_API_KEY with the key generated
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY" async defer></script>

Scroll down further  to the lines as seen below and insert the new custom

    <script>
        var manywho = {
            cdnUrl: 'https://assets.manywho.com',
INSERT>>>    customResources: ["https://boomi-site.s3.amazonaws.com/custom-component.js", "https://boomi-site.s3.amazonaws.com/custom-component.css"],
            requires: ['core', 'bootstrap3'],
            initialize: function () {

Save the player

## Time to leverage the cutom components
Create a new Type named google-map with 5 properties (string-type)
lat (string), long (string), name (string), country (string), place (string)
Create a new list value based on the type created above. Edit the default object data and insert valid lat/long values along with other ones
Create a new flow
Drag a page element
On the page, drag a presentation element, name it as google-map and insert some dummy text to save the component
Once saved, edit the metadata (right hand side) and scroll down to the presentation component created above (google-map)
Edit the component type from "componentType": "presentation" to "componentType": "google-map". Save the metadata and save the page
"google-map" is the name with which our custom-component has been registered (via custom-component.js)
Re-edit the presentation component and now you will find new sections asking for data type/source, etc..
Select type as "google-map" (created above)
Select source of data > get the data from list value > select the google-map list (created above)
Scroll down to the Data Presention section and add colummns. Ensure the order of the column addition is (0)lat, (1)long, (2)name, (3)country, (4)place
Save the presentation component
Save the page
Run the flow with custom player created above

ENJOY!!!
To add more markers edit the value and add more rows of default object data

## To integrated with database saved values
The values can be created from a database object type if it adheres to the 5 properties
So instead of manually creating default object data, it can be a dynamically received sdt of values


# Original NOTES from the forked repo

## Google maps custom component
This custom component will allow you to add a custom map that places lat/long pairs, and additional data, in a Boomi Flow custom component.  It leverages the
 google maps javascript API: https://developers.google.com/maps/documentation/javascript/tutorial





## Below here are the instructions from the original ui-custom-component module here:
https://github.com/manywho/ui-custom-component
A small `webpack` based boilerplate for creating custom Boomi Flow UI components.

## Setup

- Download or clone this repo
- `npm install`

## Included Components

This boilerplate includes examples components for:

- Basic rendering `basic.tsx`
- Input `input.tsx`

## Writing a Custom Component

Create the custom component in a new `.tsx` file, then re-export them in `index.tsx` e.g. `export * from './component';`. Any custom styles can be added in a
 separate `.css` file which is imported into the `.tsx` file.

## Debugging

You can start the local development server with `npm start`. This will serve the compiled javascript and css at `http://localhost:8080/custom-component.js` a
nd `http://localhost:8080/custom-component.css`.

The easiest way to test a custom component would be to create a custom player then add references to the `custom-components.js` and `custom-components.css` a
s custom resources, more information on loading custom resources can be found here: https://docs.manywho.com/adding-custom-javascript-and-stylesheets/

By default, the local development server will be made accessible to the internet via [ngrok](https://ngrok.com/)

ngrok will provide a url like `https://ad7c2b13.ngrok.io` that will point to `http://localhost:8080`, for example you would add the following as custom resou
rces in a player:

```
customResources: ['https://ad7c2b13.ngrok.io/custom-component.js', 'https://ad7c2b13.ngrok.io/custom-component.css']
```

The ngrok url will be dislpayed in the console (just before the webpack output statistics)

After making changes to your custom component you can refresh the browser running the flow for the changes to be picked up.

## Testing

This boilerplate supports unit testing using [jest](https://jestjs.io) and integration testing using [testcafe](https://devexpress.github.io/testcafe/).

### Unit Tests

Any typescript file in the `src/__tests__/unit` folder will be run by jest, some examples for the basic and input example components can be found in there. Y
ou
can start the jest watcher by running `npm run test-unit`

### Integration Tests

Any typescript file in the `src/__tests__/integration` folder will be run by testcafe, some examples for the basic and input example components can be found
in there. You
can start the testcafe watcher by running `npm run test-integration`

By default integration tests will run in Google Chrome, you can change this by editing the following line in `package.json`:

```
"test-integration": "testcafe-live chrome ./src/__tests__/integration"
```

Documentation on supported browsers can be found here: http://devexpress.github.io/testcafe/documentation/using-testcafe/command-line-interface.html#browser-
list

## Deploying

Run the `npm run build` command to create a production build of `custom-components.js` and `custom-components.css`. These can
be uploaded to your tenants assets by running `npm run upload`, they can then be referenced in a custom player as custom
resources.

The bulit `.js` and `.css` files can be hosted anywhere that `flow.manywho.com` can access them. Uploading to your tenants
assets is a quick and easy way to get started.

> Tenant assets are publically accessible and should not contain any secrets of confidential information!

## Configuration

You can change the generated filenames from `custom-components.js` and `custom-components.css` by editing the `webpack.config.js` file:

- line 10 for `custom-components.js`
- line 55 for `custom-components.css`
