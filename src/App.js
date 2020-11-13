import React, {useEffect, useState} from 'react';
import { MenuItem, Select, FormControl, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData, prettyPrintStat } from './util'
import 'leaflet/dist/leaflet.css'
import './App.css';


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2
        }));

        const sortedData = sortData(data)

        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriesData();

  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode)

    /* change the data of InfoBox  as value in select menu changes */ 
    
    // https://disease.sh/v3/covid-19/countries --> for particular country
    //https://disease.sh/v3/covid-19/all  --> for worldwide

    const url = countryCode === 'worldwide' ? 
        'https://disease.sh/v3/covid-19/all' : 
        `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data);
      const mapObj = countryCode === "worldwide" ? { lat: 34.80746, lng: -40.4796 } : { lat: data.countryInfo.lat, lng: data.countryInfo.long };
      setMapCenter(mapObj);
      setMapZoom(4);
      

    })

  }

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
          <div className="app__header">
          {/* Title + Select input dropdown field */}
          <h1>COVID-19 Tracker</h1>
            
            <FormControl className = "app__dropdown">
              <Select variant="outlined" value={country} onChange={onCountryChange}>
                {/* Loop through the countries and show dropdown list of the options */}
                
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {
                    countries.map(country => (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                }
              </Select>
            </FormControl>
          </div>    
        
        {/* Info Boxes */}

        <div className="app__stats">

            <InfoBox  title="Coronavirus Cases" 
                      cases={prettyPrintStat(countryInfo.todayCases)} 
                      total={prettyPrintStat(countryInfo.cases)}
                      onClick={(e) => setCasesType("cases")}
                      active={casesType === "cases"}
                      isRed/>
            
            <InfoBox  title="Recovered" 
                      cases={prettyPrintStat(countryInfo.todayRecovered)} 
                      total={prettyPrintStat(countryInfo.recovered)}
                      onClick={(e) => setCasesType("recovered")}
                      active={casesType === "recovered"}/>
            
            <InfoBox  title="Deaths" 
                      cases={prettyPrintStat(countryInfo.todayDeaths)}
                      total={prettyPrintStat(countryInfo.deaths)}
                      onClick={(e) => setCasesType("deaths")}
                      active={casesType === "deaths"}
                      isRed/>

        </div>

        {/* Map */}

            <Map
              casesType={casesType}
              countries={mapCountries}
              center={mapCenter}
              zoom={mapZoom}
            />
      </div>
      <div>
        <Card className="app__right">
          <CardContent>
            {/* Table */}
              <h3>Live Cases by Country</h3>
              <Table countries={tableData}/>

            {/* Graph */}
              <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
              <LineGraph className="app__graph" casesType={casesType}/>
          </CardContent>
        </Card>
      </div>  
    </div>
  );
}

export default App;
