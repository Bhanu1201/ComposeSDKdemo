import type { Dimension, DateDimension, Attribute, DataSourceInfo } from '@sisense/sdk-data';

import { createAttribute, createDateDimension, createDimension } from '@sisense/sdk-data';

export const DataSource: DataSourceInfo = { title: 'Aviation', type: 'elasticube' };

interface CountrySalesDimension extends Dimension {
    Category: Attribute;
    Country: Attribute;
    Sales: Attribute;
}
export const CountrySales = createDimension({
    name: 'CountrySales',
    Category: createAttribute({
        name: 'Category',
        type: 'text-attribute',
        expression: '[CountrySales.Category]',
    }),
    Country: createAttribute({
        name: 'Country',
        type: 'text-attribute',
        expression: '[CountrySales.Country]',
    }),
    Sales: createAttribute({
        name: 'Sales',
        type: 'numeric-attribute',
        expression: '[CountrySales.Sales]',
    }),
}) as CountrySalesDimension;

interface DimLocationsDimension extends Dimension {
    DestinationLatitude: Attribute;
    DestinationLongitude: Attribute;
    DestinationState: Attribute;
    FlightNumber: Attribute;
    OriginLatitude: Attribute;
    OriginLongitude: Attribute;
    OriginState: Attribute;
}
export const DimLocations = createDimension({
    name: 'Dim Locations',
    DestinationLatitude: createAttribute({
        name: 'DestinationLatitude',
        type: 'numeric-attribute',
        expression: '[Dim Locations.Destination Latitude]',
    }),
    DestinationLongitude: createAttribute({
        name: 'DestinationLongitude',
        type: 'numeric-attribute',
        expression: '[Dim Locations.Destination Longitude]',
    }),
    DestinationState: createAttribute({
        name: 'DestinationState',
        type: 'text-attribute',
        expression: '[Dim Locations.Destination State]',
    }),
    FlightNumber: createAttribute({
        name: 'FlightNumber',
        type: 'text-attribute',
        expression: '[Dim Locations.Flight Number]',
    }),
    OriginLatitude: createAttribute({
        name: 'OriginLatitude',
        type: 'numeric-attribute',
        expression: '[Dim Locations.Origin Latitude]',
    }),
    OriginLongitude: createAttribute({
        name: 'OriginLongitude',
        type: 'numeric-attribute',
        expression: '[Dim Locations.Origin Longitude]',
    }),
    OriginState: createAttribute({
        name: 'OriginState',
        type: 'text-attribute',
        expression: '[Dim Locations.Origin State]',
    }),
}) as DimLocationsDimension;

interface FactDimension extends Dimension {
    AircraftType: Attribute;
    Airline: Attribute;
    CargoWeightkg: Attribute;
    Delaymin: Attribute;
    DestinationLatitude: Attribute;
    DestinationLongitude: Attribute;
    DestinationState: Attribute;
    Durationmin: Attribute;
    FlightNumber: Attribute;
    FuelUsedliters: Attribute;
    OntimePerformance: Attribute;
    OriginLatitude: Attribute;
    OriginLongitude: Attribute;
    OriginState: Attribute;
    Passengers: Attribute;
    WeatherConditions: Attribute;
    ArrivalTime: DateDimension;
    DepartureTime: DateDimension;
}
export const Fact = createDimension({
    name: 'Fact',
    AircraftType: createAttribute({
        name: 'AircraftType',
        type: 'text-attribute',
        expression: '[Fact.Aircraft Type]',
    }),
    Airline: createAttribute({
        name: 'Airline',
        type: 'text-attribute',
        expression: '[Fact.Airline]',
    }),
    CargoWeightkg: createAttribute({
        name: 'CargoWeightkg',
        type: 'numeric-attribute',
        expression: '[Fact.Cargo Weight (kg)]',
    }),
    Delaymin: createAttribute({
        name: 'Delaymin',
        type: 'numeric-attribute',
        expression: '[Fact.Delay (min)]',
    }),
    DestinationLatitude: createAttribute({
        name: 'DestinationLatitude',
        type: 'numeric-attribute',
        expression: '[Fact.Destination Latitude]',
    }),
    DestinationLongitude: createAttribute({
        name: 'DestinationLongitude',
        type: 'numeric-attribute',
        expression: '[Fact.Destination Longitude]',
    }),
    DestinationState: createAttribute({
        name: 'DestinationState',
        type: 'text-attribute',
        expression: '[Fact.Destination State]',
    }),
    Durationmin: createAttribute({
        name: 'Durationmin',
        type: 'numeric-attribute',
        expression: '[Fact.Duration (min)]',
    }),
    FlightNumber: createAttribute({
        name: 'FlightNumber',
        type: 'text-attribute',
        expression: '[Fact.Flight Number]',
    }),
    FuelUsedliters: createAttribute({
        name: 'FuelUsedliters',
        type: 'numeric-attribute',
        expression: '[Fact.Fuel Used (liters)]',
    }),
    OntimePerformance: createAttribute({
        name: 'OntimePerformance',
        type: 'text-attribute',
        expression: '[Fact.On-time Performance]',
    }),
    OriginLatitude: createAttribute({
        name: 'OriginLatitude',
        type: 'numeric-attribute',
        expression: '[Fact.Origin Latitude]',
    }),
    OriginLongitude: createAttribute({
        name: 'OriginLongitude',
        type: 'numeric-attribute',
        expression: '[Fact.Origin Longitude]',
    }),
    OriginState: createAttribute({
        name: 'OriginState',
        type: 'text-attribute',
        expression: '[Fact.Origin State]',
    }),
    Passengers: createAttribute({
        name: 'Passengers',
        type: 'numeric-attribute',
        expression: '[Fact.Passengers]',
    }),
    WeatherConditions: createAttribute({
        name: 'WeatherConditions',
        type: 'text-attribute',
        expression: '[Fact.Weather Conditions]',
    }),
    ArrivalTime: createDateDimension({
        name: 'ArrivalTime',
        expression: '[Fact.Arrival Time (Calendar)]',
    }),
    DepartureTime: createDateDimension({
        name: 'DepartureTime',
        expression: '[Fact.Departure Time (Calendar)]',
    }),
}) as FactDimension;
