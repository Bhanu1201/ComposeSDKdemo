// src/components/CountryList.tsx

import React, { useState } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as SM from '../../sample-ecommerce';
import { measureFactory } from '@sisense/sdk-data';
import { errorMonitor } from 'events';

interface CountryData {
    country: string;
    revenue: number;
    year: number;
}

const CountryList: React.FC = () => {
    // Fetch data from Sisense
    const { data, isLoading, isError } = useExecuteQuery({
        dataSource: SM.DataSource,
        dimensions: [
            SM.Country.Country,
            SM.Commerce.Date.Years
        ],
        measures: [
            measureFactory.sum(SM.Commerce.Revenue)
        ]
    });

    // State to track the currently selected country
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {errorMonitor.description}</div>;

    // Extract unique countries and their details
    const countryDataMap: Record<string, CountryData[]> = {};
    (data?.rows || []).forEach(row => {
        const country = row[0].data;
        const revenue = parseFloat(row[2].data);
        const year = parseInt(row[1].data, 10);

        if (!countryDataMap[country]) {
            countryDataMap[country] = [];
        }
        countryDataMap[country].push({ country, revenue, year });
    });

    const uniqueCountries = Object.keys(countryDataMap);

    // Handle row click to select a country
    const handleClick = (country: string) => () => {
        setSelectedCountry(prev => (prev === country ? null : country));
    };

    return (
        <div className='col-12'>
            <Box>
                <Typography variant="h5" gutterBottom>
                    Country Revenue Data
                </Typography>
                {uniqueCountries.map((country) => (
                    <div key={country} style={{ marginBottom: '10px' }}>
                        <Typography
                            variant="h6"
                            padding={1}
                            display={'flex'}
                            justifyContent={'space-between'}
                            onClick={handleClick(country)}
                            style={{ cursor: 'pointer', color: '#000', backgroundColor: '#FEF9D9' }}
                        >
                            {country}
                        </Typography>

                        {selectedCountry === country && (
                            <TableContainer
                                component={Paper}
                                style={{ marginTop: '10px', maxHeight: '400px' }}
                                sx={{
                                    '&::-webkit-scrollbar': {
                                        width: '2px',
                                        height: '8px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#888',
                                        borderRadius: '4px'
                                    },
                                    '&::-webkit-scrollbar-thumb:hover': {
                                        backgroundColor: '#555'
                                    },
                                    '&::-webkit-scrollbar-corner': {
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Country</TableCell>
                                            <TableCell>Year</TableCell>
                                            <TableCell>Revenue</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {countryDataMap[country].map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{data.country}</TableCell>
                                                <TableCell>{data.year}</TableCell>
                                                <TableCell>${data.revenue.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                ))}
            </Box>
        </div>
    );
};

export default CountryList;
