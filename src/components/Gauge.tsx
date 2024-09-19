import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState,
  } from '@mui/x-charts/Gauge';
  import { Card, CardContent, Typography, IconButton } from '@mui/material';
  import ShowChartIcon from '@mui/icons-material/ShowChart';
  import { useExecuteQuery } from '@sisense/sdk-ui';
  import * as DM from '../sample-ecommerce';
  import { measureFactory } from '@sisense/sdk-data';
  
  const numberFormatConfig = {
    name: 'Numbers',
    million: false,
    decimalScale: 2,
  };
  
  // Helper function to format numbers based on the configuration
  const formatValue = (value) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(numberFormatConfig.decimalScale)}m`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(numberFormatConfig.decimalScale)}k`;
    } else {
      return value.toFixed(numberFormatConfig.decimalScale);
    }
  };
  
  // Helper function to determine gauge color based on value
  const getGaugeColor = (value) => {
    if (value < 24_000_000) {
      return '#ff0000'; // Red
    } else if (value >= 24_000_000 && value < 40_000_000) {
      return '#0000ff'; // Blue
    } else {
      return '#00ff00'; // Green
    }
  };
  
  function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  
    if (valueAngle === null) {
      return null;
    }
  
    const target = {
      x: cx + outerRadius * Math.sin(valueAngle),
      y: cy - outerRadius * Math.cos(valueAngle),
    };
  
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="red" />
        <path
          d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
          stroke="red"
          strokeWidth={6}
        />
      </g>
    );
  }



  
  export default function GaugeChart() {
    const { data, isLoading, isError } = useExecuteQuery({
      dataSource: DM.DataSource,
      dimensions: [], // No dimensions needed for a single gauge value
      measures: [
        measureFactory.sum(DM.Commerce.Revenue, 'TotalRevenue'),
      ],
    });
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (isError) {
      return <div>Error loading data</div>;
    }
  
    console.log(data); // Log data to check its structure
  
    // Ensure data is properly defined
    const totalRevenue = data?.rows?.[0]?.[0]?.data || 0;
  
    console.log("total revenue", totalRevenue);
  
    // Determine gauge color based on the totalRevenue
    const gaugeColor = getGaugeColor(totalRevenue);
  
    return (
      <Card elevation={2} sx={{ borderRadius: 4 }}>
        <CardContent className='col-12'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="h6">Total Revenue</Typography>
            <IconButton>
              <ShowChartIcon />
            </IconButton>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 210, width: '100%' }}>
            <GaugeContainer 
              width={400}
              height={200}
              startAngle={-110}
              endAngle={110}
              value={totalRevenue}
              valueMax={50_000_000} // Set max value to 50 million
            >
              <GaugeReferenceArc />
              <GaugeValueArc
                color={gaugeColor} // Apply conditional color
              />
              <GaugePointer />
            </GaugeContainer>
          </div>
          <div className='col-12' style={{ textAlign: 'center', marginTop: 10 }}>
            <Typography variant="h6">
              {formatValue(totalRevenue)} / {formatValue(50_000_000)}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
  