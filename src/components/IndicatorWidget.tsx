import TableChartIcon from '@mui/icons-material/TableChart';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as DM from '../sample-ecommerce';
import { measureFactory } from '@sisense/sdk-data';

const IndicatorWidget = () => {
    const { data, isLoading, isError } = useExecuteQuery({
        dataSource: DM.DataSource,
        dimensions: [
         
        ],
        measures: [
            measureFactory.sum(DM.Commerce.Revenue, 'TotalRevenue'), // Measure (Revenue)
            measureFactory.sum(DM.Commerce.Cost, 'TotalCost'), // Another Measure (Cost)
        ],
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading data</div>;
    }

    if (!data || !Array.isArray(data.rows) || !Array.isArray(data.columns)) {
        return <div>No data available</div>;
    }

    // Limit the number of items to 6 (or fewer if there are fewer rows)
    const indicators = data.rows.slice(0, 6).map((row, index) => {
        const revenue = Number(row[0]?.data || 0);
        const cost = Number(row[1]?.data || 0);

        return {
            TotalRevenue: revenue,
            TotalCost: cost,
        };
    });

    return (
        <div className='d-flex flex-wrap p-2 col-12'>
            {indicators.map((indicator, index) => (
                <div key={index} className='col-12  p-1'>
                    <div className='p-3 bg-white rounded-4 d-flex flex-wrap align-items-center overflow-hidden'>
                        <TableChartIcon sx={{
                            backgroundColor: '#EEEEEE',
                            borderRadius: '50%',
                            fontSize: { xs: '30px', sm: '35px', md: '40px', lg: '55px' },
                            color: 'blue',
                            padding: '8px'
                        }} />
                        <div className='me-auto ps-2 text-truncate'>
                            <p className='fw-semibold p-0 m-0 pgrey mb-1'>
                                {data.columns[0].name}
                            </p>
                            <p className='fw-semibold p-0 m-0 pgrey mb-1'>
                            ${indicator.TotalRevenue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default IndicatorWidget;
