import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Style/Collateral.css';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as AV from '../../sample-ecommerce';
import { measureFactory } from '@sisense/sdk-data';

const ColateralTable: React.FC = () => {
    const { data, isLoading, isError } = useExecuteQuery({
        dataSource: AV.DataSource,
        dimensions: [AV.Category.Category],
        measures: [
            measureFactory.sum(AV.Commerce.Revenue),
            measureFactory.count(AV.Category.Category),
            measureFactory.sum(AV.Commerce.Cost)
        ]
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading data</div>;
    }

    // Extract columns and rows from the data
    const columns = data?.columns || [];
    const rows = data?.rows || [];

    return (
        <div className="table-container w-50 ">
            <Table striped bordered hover className="sticky-header-table">

                <tr>

                </tr>


                <thead>
                    <tr>
                        <td style={{backgroundColor:'#1d4e8f'}} ><b>Index</b></td>
                        {rows.map((col, index) => (
                            <th key={index}>{col[0].data}</th>
                        ))}
                    </tr>

                </thead>
                <tbody>

                    <tr>
                        <td>Revenue</td>
                        {rows.map((row, rowIndex) => (
                            <td key={rowIndex}>
                                {row[1].data.toFixed(2)}
                            </td>
                        ))}
                    </tr>

                    <tr>
                        <td>cost</td>
                        {rows.map((row, rowIndex) => (
                            <td key={rowIndex}>
                                {row[3].data.toFixed(2)}
                            </td>
                        ))}
                    </tr>

                </tbody>
            </Table>
        </div>
    );
};

export default ColateralTable;
