import { useExecuteQuery } from "@sisense/sdk-ui";
import { Table } from "react-bootstrap";
import * as SM from '../../sample-ecommerce';
import { filterFactory, measureFactory } from '@sisense/sdk-data';
import ColateralTable from './ColateralTable';

// Function to format date to YYYY-MM-DD
const formatDate = (date: string): string => {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    return `${year}-${month}`;
};

const CustomTable = () => {
    const { data, isLoading, isError } = useExecuteQuery({
        dataSource: SM.DataSource,
        dimensions: [SM.Brand.Brand, SM.Commerce.Date.Months],
        measures: [measureFactory.sum(SM.Commerce.Revenue)],
        filters: [
            filterFactory.dateFrom(SM.Commerce.Date.Months, '2013-01-01')
        ]
    });

    if (isLoading) return <div>Loading...</div>;

    // Check if isError is true and handle error
    if (isError) {
        const errorMessage = typeof isError === 'boolean' ? "An error occurred" : (isError as { message: string }).message;
        return <div>Error: {errorMessage}</div>;
    }

    console.log("datatable", data);

    // Extract the rows from the data
    const rows = data?.rows || [];

    // Extract unique row headers (brands) from the first element of each row
    const rowHeaders = [...new Set(rows.map(row => row[0]?.data))];

    // Extract unique column headers (dates) from the second element of each row
    const columnHeaders = [...new Set(rows.map(row => formatDate(row[1]?.data)))];

    // Create a map for revenue data
    interface RevenueMap {
        [brand: string]: {
            [date: string]: string;
        };
    }

    const revenueMap: RevenueMap = {};
    rowHeaders.forEach(brand => {
        revenueMap[brand] = {};
        columnHeaders.forEach(date => {
            revenueMap[brand][date] = '-';
        });
    });

    rows.forEach(row => {
        const brand = row[0]?.data; // Optional chaining to prevent accessing undefined
        const date = formatDate(row[1]?.data); // Format date with optional chaining
        const revenue = parseFloat(row[2]?.data).toFixed(2); // Optional chaining

        if (brand && date) { // Ensure brand and date are defined
            revenueMap[brand][date] = revenue;
        }
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

            <ColateralTable />
        </>
    );
}

export default CustomTable;
