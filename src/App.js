import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import ParticlesBg from "particles-bg";
import './App.css';


        const returnClarifaiRequestOptions = (imageUrl) => {
                
            const APP_ID = 'smart-brain';
            const IMAGE_URL = imageUrl;
            const PAT = '1b521d15af704066aab8cf413afad838';
            const USER_ID = 'ln6dk3xlwgca';
            const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
                const requestOptions = {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
                },
                body: raw
        };

                return requestOptions;
        }

const initialState = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'register',
            isSignedIn: false,
            user: {
                id: '', 
                name: '',
                email: '',
                entries: 0,
                joined: ''
            }
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({user: {
                id: data.id, 
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined

        }})
    }

    calculateFaceLocation = (data) => {
        console.log('Data received in calculateFaceLocation:', data);

        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        console.log('Image Dimensions:', width, height);
        return {
                leftCol: clarifaiFace.left_col * width,
                topRow: clarifaiFace.top_row * height,
                rightCol: width - (clarifaiFace.right_col * width),
                bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        this.setState({box: box});
        
    }

    onInputChange = (event) => {
        this.setState({input:event.target.value});
    }

    onButtonSubmit = () => {
        const MODEL_ID = 'face-detection';   
            // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
        this.setState({imageUrl: this.state.input});

        const requestOptions = returnClarifaiRequestOptions(this.state.input);

         fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
                 .then(response => response.json())
                 .then(response => 
                        this.displayFaceBox(this.calculateFaceLocation(response)))
                  
                 .catch(error => console.log('There was a problem with your fetch', error));
     }
    
     onRouteChange = (route) => {
        if (route === 'signout') {
                this.setState(initialState)
        } else if (route === 'home') {
                this.setState({isSignedIn: true})
        }
        this.setState({route: route});
     }

        render() {
            return (
                <div className="App">
                    
                        <ParticlesBg num='200' type='cobweb' bg={true}/>

                         <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
                         {this.state.route ==='home' 
                        ? <div>
                        <Logo />
                        <Rank />
                        <ImageLinkForm onInputChange={this.onInputChange} 
                                                   onButtonSubmit={this.onButtonSubmit} 
                        />
                        <FaceRecognition box= {this.state.box} imageUrl={this.state.imageUrl}/>
                    </div>
                    : (
                        this.state.route === 'signin'
                        ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                        )
                        }       
                </div>

            );
        }
    }


export default App;