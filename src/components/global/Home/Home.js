import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';
import { countries } from './../../../server/countries';
import { UserContext } from './../../../context/user';
import { generateTripDocument } from './../../../server/firebase'


const Home = () => {
    const user = useContext(UserContext);

    const [destination, setDestination] = useState("");
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [error, setError] = useState(null);

    const onChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "tripDestination") {
            setDestination(value);
        } else if (name === "tripStart") {
            setStart(value);
        } else if (name === "tripEnd") {
            setEnd(value);
        }
    };

    const createTripHandler = async (event, destination, start, end) => {
        event.preventDefault();
        if (!user) {
            console.log(user);
            window.location.href = '/signin';
        } else if (user && user.trip!=null) {
            window.location.href = '/mytrip';
        } else if (user && user.trip==null) {
            try {
                await generateTripDocument(user, destination, start, end);
                console.log('trip added');
                window.location.href = '/mytrip';
            }
            catch (error) {
                setError('Error creating trip');
            }
            setDestination("");
            setStart(null);
            setEnd(null);
        }
    };

    return (
        <div className="home">
            <div className="background">
                <div className="container">
                    <div className="title">
                        <h2 className="mytrip-title">Plan the trip
                            of your dreams</h2>
                        <p>MyTrip is the new way to plan your next trip!</p>
                    </div>
                    <div className="form-container">
                        <div className="form-title">
                            Itinerary Planner
                        </div>
                        <form>
                            <input list="destination-of-trip" className="destination-input"
                                onChange={event => onChangeHandler(event)}
                                name="tripDestination" id="tripDestination" placeholder="Enter destination (Country)" />
                            <datalist id="destination-of-trip" className="destination-datalist">
                                <option value="Worldwide" defaultValue></option>
                                {countries.map(country => {
                                    return (
                                        <option value={country.name} key={country.code}></option>
                                    );
                                })}
                            </datalist>
                            <div className="start-date">
                                <label htmlFor="tripStart"> Start: </label>
                                <input id="tripStart" type="date" name="tripStart"
                                    onChange={event => onChangeHandler(event)}
                                    className="start-date-input" />
                            </div>
                            <div className="end-date">
                                <label htmlFor="tripEnd"> End: </label>
                                <input id="tripEnd" type="date" name="tripEnd"
                                    onChange={event => onChangeHandler(event)}
                                    className="end-date-input" />
                            </div>
                            <button name="form-submit"
                                onClick={event => {
                                    createTripHandler(event, destination, start, end);
                                }}
                                className="form-button">Start planning your trip</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;