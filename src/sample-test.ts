import type { Dimension, DateDimension, Attribute, DataSourceInfo } from '@sisense/sdk-data';

import { createAttribute, createDateDimension, createDimension } from '@sisense/sdk-data';

export const DataSource: DataSourceInfo = { title: 'SampleLogisticsCSDK', type: 'elasticube' };

interface Dim_Drop_LocationsDimension extends Dimension {
    Drop_Lat: Attribute;
    Drop_Location: Attribute;
    Drop_Lon: Attribute;
}
export const Dim_Drop_Locations = createDimension({
    name: 'Dim_Drop_Locations',
    Drop_Lat: createAttribute({
        name: 'Drop_Lat',
        type: 'numeric-attribute',
        expression: '[Dim_Drop_Locations.Drop_Lat]',
    }),
    Drop_Location: createAttribute({
        name: 'Drop_Location',
        type: 'text-attribute',
        expression: '[Dim_Drop_Locations.Drop_Location]',
    }),
    Drop_Lon: createAttribute({
        name: 'Drop_Lon',
        type: 'numeric-attribute',
        expression: '[Dim_Drop_Locations.Drop_Lon]',
    }),
}) as Dim_Drop_LocationsDimension;

interface Dim_Pickup_LocationsDimension extends Dimension {
    Pickup_Lat: Attribute;
    Pickup_Location: Attribute;
    Pickup_Lon: Attribute;
}
export const Dim_Pickup_Locations = createDimension({
    name: 'Dim_Pickup_Locations',
    Pickup_Lat: createAttribute({
        name: 'Pickup_Lat',
        type: 'numeric-attribute',
        expression: '[Dim_Pickup_Locations.Pickup_Lat]',
    }),
    Pickup_Location: createAttribute({
        name: 'Pickup_Location',
        type: 'text-attribute',
        expression: '[Dim_Pickup_Locations.Pickup_Location]',
    }),
    Pickup_Lon: createAttribute({
        name: 'Pickup_Lon',
        type: 'numeric-attribute',
        expression: '[Dim_Pickup_Locations.Pickup_Lon]',
    }),
}) as Dim_Pickup_LocationsDimension;

export const Dim_Shipment = createDimension({
    name: 'Dim_Shipment',
    ShipmentType: createAttribute({
        name: 'ShipmentType',
        type: 'text-attribute',
        expression: '[Dim_Shipment.Shipment Type]',
    }),
}) as Dimension;

interface Fact_LogisticsDimension extends Dimension {
    Carrier: Attribute;
    CosttoCustomer: Attribute;
    Customer: Attribute;
    DeliveredOn: Attribute;
    DeliveryMethod: Attribute;
    Distancekm: Attribute;
    DropLat: Attribute;
    DropLocation: Attribute;
    DropLon: Attribute;
    PickupLat: Attribute;
    PickupLocation: Attribute;
    PickupLon: Attribute;
    ROWID: Attribute;
    ShipmentSizem3: Attribute;
    ShipmentType: Attribute;
    ShipmentWeightkg: Attribute;
    Status: Attribute;
    BookedOn: DateDimension;
    PickupOn: DateDimension;
}
export const Fact_Logistics = createDimension({
    name: 'Fact_Logistics',
    Carrier: createAttribute({
        name: 'Carrier',
        type: 'text-attribute',
        expression: '[Fact_Logistics.Carrier]',
    }),
    CosttoCustomer: createAttribute({
        name: 'CosttoCustomer',
        type: 'numeric-attribute',
        expression: '[Fact_Logistics.Cost to Customer]',
    }),
    Customer: createAttribute({
        name: 'Customer',
        type: 'text-attribute',
        expression: '[Fact_Logistics.Customer]',
    }),
    DeliveredOn: createAttribute({
        name: 'DeliveredOn',
        type: 'text-attribute',
        expression: '[Fact_Logistics.Delivered On]',
    }),
    DeliveryMethod: createAttribute({
        name: 'DeliveryMethod',
        type: 'text-attribute',
        expression: '[Fact_Logistics.Delivery Method]',
    }),
    Distancekm: createAttribute({
        name: 'Distancekm',
        type: 'numeric-attribute',
        expression: '[Fact_Logistics.Distance (km)]',
    }),
    DropLat: createAttribute({
        name: 'DropLat',
        type: 'numeric-attribute',
        expression: '[Fact_Logistics.Drop Lat]',
    }),
    DropLocation: createAttribute({
        name: 'DropLocation',
        type: 'text-attribute',
        expression: '[Fact_Logistics.Drop Location]',
    }),
    DropLon: createAttribute({
        name: 'DropLon',
        type: 'numeric-attribute',
        expression: '[Fact_Logistics.Drop Lon]',
    }),
    PickupLat: createAttribute({
        name: 'PickupLat',
        type: 'numeric-attribute',
        expression: '[Fact_Logistics.Pickup Lat]',
    }),
    PickupLocation: createAttribute({
        name: 'PickupLocation',
        type: 'text-attribute',
        expression: '[Fact_Logistics.Pickup Location]',
    }),
    PickupLon: createAttribute({
        name: 'PickupLon',
        type: 'numeric-attribute',
        expression: '[Fact_Logistics.Pickup Lon]',
    }),
    ROWID: createAttribute({
        name: 'ROWID',
        type: 'numeric-attribute',
        expression: '[Fact_Logistics.ROW ID]',
    }),
    ShipmentSizem3: createAttribute({
        name: 'ShipmentSizem3',
        type: 'numeric-attribute',
        expression: '[Fact_Logistics.Shipment Size (m^3)]',
    }),
    ShipmentType: createAttribute({
        name: 'ShipmentType',
        type: 'text-attribute',
        expression: '[Fact_Logistics.Shipment Type]',
    }),
    ShipmentWeightkg: createAttribute({
        name: 'ShipmentWeightkg',
        type: 'numeric-attribute',
        expression: '[Fact_Logistics.Shipment Weight (kg)]',
    }),
    Status: createAttribute({
        name: 'Status',
        type: 'text-attribute',
        expression: '[Fact_Logistics.Status]',
    }),
    BookedOn: createDateDimension({
        name: 'BookedOn',
        expression: '[Fact_Logistics.Booked On (Calendar)]',
    }),
    PickupOn: createDateDimension({
        name: 'PickupOn',
        expression: '[Fact_Logistics.Pickup On (Calendar)]',
    }),
}) as Fact_LogisticsDimension;

interface worldcitiesDimension extends Dimension {
    admin_name: Attribute;
    capital: Attribute;
    city: Attribute;
    city_ascii: Attribute;
    country: Attribute;
    worldcities_id: Attribute;
    iso2: Attribute;
    iso3: Attribute;
    lat: Attribute;
    lng: Attribute;
    population: Attribute;
}
export const worldcities = createDimension({
    name: 'worldcities',
    admin_name: createAttribute({
        name: 'admin_name',
        type: 'text-attribute',
        expression: '[worldcities.admin_name]',
    }),
    capital: createAttribute({
        name: 'capital',
        type: 'text-attribute',
        expression: '[worldcities.capital]',
    }),
    city: createAttribute({
        name: 'city',
        type: 'text-attribute',
        expression: '[worldcities.city]',
    }),
    city_ascii: createAttribute({
        name: 'city_ascii',
        type: 'text-attribute',
        expression: '[worldcities.city_ascii]',
    }),
    country: createAttribute({
        name: 'country',
        type: 'text-attribute',
        expression: '[worldcities.country]',
    }),
    worldcities_id: createAttribute({
        name: 'worldcities_id',
        type: 'numeric-attribute',
        expression: '[worldcities.id]',
    }),
    iso2: createAttribute({
        name: 'iso2',
        type: 'text-attribute',
        expression: '[worldcities.iso2]',
    }),
    iso3: createAttribute({
        name: 'iso3',
        type: 'text-attribute',
        expression: '[worldcities.iso3]',
    }),
    lat: createAttribute({
        name: 'lat',
        type: 'numeric-attribute',
        expression: '[worldcities.lat]',
    }),
    lng: createAttribute({
        name: 'lng',
        type: 'numeric-attribute',
        expression: '[worldcities.lng]',
    }),
    population: createAttribute({
        name: 'population',
        type: 'numeric-attribute',
        expression: '[worldcities.population]',
    }),
}) as worldcitiesDimension;
