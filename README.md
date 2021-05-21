## Boomi Flow Google maps custom component
There are situations when one would like to plot lat/long on google maps. Boomi Flow strengthens the developer's potential by extending its framework via custom react components. In this scenario, we will build and leverage a custom component for visualizing data on google maps.

The objective is create a custom UI component for Boomi Flow that will let you visualize lat/long pairs on Google maps.
The custom component is based on standard React framework and has to be built and leveraged in the flow
The notes below describe an end-to-end method of doing so.

> The original work belongs to... and special thanks to Chris Cappetta https://github.com/ccappetta

> Additional thanks to Premjit Mishra (Boomi) for helping me to understand custom components

## Original repository
https://github.com/boomiflow-community/ui-component-google-map.git

## End result: After implementing this version of the fork. Your flow output page will look like this.

![image](https://user-images.githubusercontent.com/39495790/119082099-feb31f80-ba1a-11eb-8fe0-e56c382d06ae.png)

## Modifications performed via this fork
The orignal repository has an index.tsx that adds a static lat/long defined "You are Here" marker. In this fork, we have modified the index.tsx to remove the second "You are Here" marker. Now the map will only populate markers that it receives from the dynamic value list in the flow presentation component

> If you want to skip the creation and build of the google-maps custom component, then go straight to section **Make custom component files accessible to flow player**

## Install nodeJS on ubuntu 18.04
```
sudo su
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile
nvm install v14.17.0
nvm use v14.17.0
npm config set user 0
npm config set unsafe-perm true
```

## Clone the modified repo
```
git clone https://github.com/thecloudgarage/ui-component-google-map.git
cd ui-component-google-map
npm install
npm run build
cd build
```
Observe the two files generated for the custom component

## Make custom component files accessible to flow player
* Copy the .js and .css file either to s3 or the assets of Boomi Flow
* If moved to s3, ensure they are public
```
aws s3 cp custom-component.js s3://<bucket-name>/ --acl public-read
aws s3 cp custom-component.css s3://<bucket-name>/ --acl public-read
```
Alternatively if moved to Boomi Flow assets, then the files are public by default
Copy the publicly accesible URLs

> If you want to use precompiled js files without building and uploading them to your assets/s3. then these are available via
> * https://boomi-site.s3.amazonaws.com/sample-custom-component.js
> * https://boomi-site.s3.amazonaws.com/sample-custom-component.css

## Enable javascript API in google maps
https://console.cloud.google.com/
Select your project
Left hand menu > APIs and Services > Library > search for Maps Javascript API > Enable > Create API key (your account/project needs to be setup for billing,
else it will error)
Copy the API key (you can restrict the API key optionally to secure the consumption)

## Boomi Flow Custom Player
Create a new player based on default player.

Scroll down to where the head section begins and insert the below. Replace YOUR_API_KEY with the key generated

```
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY" async defer></script>
```

Scroll down further  to the lines as seen below and insert the new custom
```
    <script>
        var manywho = {
            cdnUrl: 'https://assets.manywho.com',
INSERT>>>    customResources: ["https://boomi-site.s3.amazonaws.com/custom-component.js", "https://boomi-site.s3.amazonaws.com/custom-component.css"],
            requires: ['core', 'bootstrap3'],
            initialize: function () {
```
Save the player

## Time to leverage the cutom components
* Create a new Type named google-map with 5 properties (string-type)
** lat (string), long (string), name (string), country (string), place (string)
* Create a new list value based on the type created above. Edit the default object data and insert valid lat/long values along with other ones
* Create a new flow
* Drag a page element
* On the page, drag a presentation element, name it as google-map and insert some dummy text to save the component
* Once saved, edit the metadata (right hand side) and scroll down to the presentation component created above (google-map)
* Edit the component type from "componentType": "presentation" to "componentType": "google-map". Save the metadata and save the page
* "google-map" is the name with which our custom-component has been registered (via custom-component.js)
* Re-edit the presentation component and now you will find new sections asking for data type/source, etc..
* Select type as "google-map" (created above)
* Select source of data > get the data from list value > select the google-map list (created above)
* Scroll down to the Data Presention section and add colummns. Ensure the order of the column addition is (0)lat, (1)long, (2)name, (3)country, (4)place
* Save the presentation component
* Save the page
* Run the flow with custom player created above

ENJOY!!!
To add more markers edit the value and add more rows of default object data

## To integrated with database saved values
* The values can be created from a database object type if it adheres to the 5 properties
* So instead of manually creating default object data, it can be a dynamically received sdt of values

