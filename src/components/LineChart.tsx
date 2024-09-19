import { Box, Typography, Paper, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useExecuteQuery } from '@sisense/sdk-ui';
import * as DM from '../sample-ecommerce';
import { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { filterFactory, measureFactory } from '@sisense/sdk-data';

const LineChart = () => {
    const [categories, setCategories] = useState<string[]>([]);

    const handleCategoryChange = (_event: React.MouseEvent<HTMLElement>, newCategories: string[]) => {
        setCategories(newCategories);
    };

    const chartFilters = useMemo(() =>
        categories.length > 0
            ? [filterFactory.members(DM.Commerce.AgeRange, categories)]
            : [],
        [categories]
    );

    const { data, isLoading, isError } = useExecuteQuery({
        dataSource: DM.DataSource,
        dimensions: [DM.Commerce.AgeRange],
        measures: [
            measureFactory.sum(DM.Commerce.Revenue, 'Total Spending'),
            measureFactory.sum(DM.Commerce.Cost, 'Total Cost'),
        ],
        filters: chartFilters,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error</div>;
    }

    const categoriesData = data?.rows.map((row) => row[0].data) || [];
    const spendingData = data?.rows.map((row) => row[1].data) || [];
    const costData = data?.rows.map((row) => row[2].data) || [];

    const chartData = {
        series: [
            {
                name: 'Spending',
                data: spendingData,
            },
            {
                name: 'Cost',
                data: costData,
            },
        ],
        options: {
            chart: {
                type: 'line' as 'line', // Ensure type is explicitly 'line'
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                curve: 'smooth' as 'smooth', // Explicitly set curve type
            },
            xaxis: {
                categories: categoriesData,
                title: {
                    text: 'Categories',
                },
            },
            yaxis: {
                labels: {
                    formatter: (value: number) => {
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return (value / 1000).toFixed(1) + 'K';
                        }
                        return value.toString();
                    },
                },
                title: {
                    text: 'Value',
                },
            },
            colors: ['#6366F1', '#3B82F6'],
            tooltip: {
                shared: true,
                intersect: false,
            },
        },
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 4 }}>
            <Box sx={{ width: '100%' }}>
                <ToggleButtonGroup
                    value={categories}
                    onChange={handleCategoryChange}
                    aria-label="category filter buttons"
                    sx={{ marginBottom: 2 }}
                >
                    <ToggleButton value="Category1">Category1</ToggleButton>
                    <ToggleButton value="Category2">Category2</ToggleButton>
                    <ToggleButton value="Category3">Category3</ToggleButton>
                </ToggleButtonGroup>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="flex-start"
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">$37.5K</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Spent
                        </Typography>
                        <Typography variant="body2" color="success.main">
                            +2.45%
                        </Typography>
                        <Typography variant="body2" color="success.main">
                            On track
                        </Typography>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }}>
                        <Chart
                            options={chartData.options}
                            series={chartData.series}
                            type="line"
                            height="300px"
                            width="100%"
                        />
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
};

export default LineChart;
