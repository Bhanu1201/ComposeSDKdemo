import React from 'react';
import { useExecuteQuery } from "@sisense/sdk-ui";
import { Table } from "react-bootstrap";
import * as SM from '../../sample-ecommerce';
import { filterFactory, measureFactory } from '@sisense/sdk-data';
import SolarSystem from '../background/SolarSystem';
import ColateralTable from './ColateralTable';


// Function to format date to YYYY-MM-DD
const formatDate = (date) => {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    return `${year}-${month}`;
};

const CustomTable = () => {
    const { data, isLoading, isError } = useExecuteQuery({
        dataSource: SM.DataSource,
        dimensions: [SM.Brand.Brand, SM.Commerce.Date.Months], // Use Days instead of Months
        measures: [measureFactory.sum(SM.Commerce.Revenue)],
        filters: [
            filterFactory.dateFrom(SM.Commerce.Date.Months, '2013-01-01') // Adjust filter date format
        ]
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {isError.message}</div>;

    console.log("datatable", data);

    // Extract the rows from the data
    const rows = data?.rows || [];

    // Extract unique row headers (brands) from the first element of each row
    const rowHeaders = [...new Set(rows.map(row => row[0].data))];

    // Extract unique column headers (dates) from the second element of each row
    const columnHeaders = [...new Set(rows.map(row => formatDate(row[1].data)))];

    // Create a map for revenue data
    const revenueMap = {};
    rowHeaders.forEach(brand => {
        revenueMap[brand] = {};
        columnHeaders.forEach(date => {
            revenueMap[brand][date] = '-';
        });
    });

    rows.forEach(row => {
        const brand = row[0].data;
        const date = formatDate(row[1].data); // Format date
        const revenue = parseFloat(row[2].data).toFixed(2);
        revenueMap[brand][date] = revenue;
    });

    return (
        <>
            <div className='p-2 rounded-4 col-6' style={{ height: 500, overflowY: 'auto', zIndex: '999999' }}>

                <Table striped bordered hover>
                    <thead className="thead-white sticky-top">
                        <tr>
                            <th className='bg-success text-white text-center'>Brand</th>
                            {columnHeaders.map((date, index) => (
                                <th className='bg-success text-white' key={index}>{date}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rowHeaders.map((brand, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className=''><b>{brand}</b></td>
                                {columnHeaders.map((date, colIndex) => (
                                    <td className='bg-white' key={colIndex}>{revenueMap[brand][date]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <ColateralTable/>
        </>
    );
}

export default CustomTable;
