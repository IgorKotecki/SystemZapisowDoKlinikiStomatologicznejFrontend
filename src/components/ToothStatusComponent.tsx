import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import type { Status } from '../Interfaces/Status';
import { colors } from '../utils/colors';
import { Grid } from '@mui/material';
import Item from '@mui/material/Grid';

interface TabPanelProps {
    statuses?: Status[];
    selectedStatus: Status | null;
    onStatusChange: (status : Status) => void;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
            style={{
                backgroundColor: colors.color3,
                width: '100%',
                padding: '16px',
                boxSizing: 'border-box',
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
            }}
        >
            {value === index && (
                <Grid container spacing={1}>
                    {props.statuses?.map((status) => (
                        <Grid key={status.statusId} size={{ xs: 2, sm: 4, md: 4, lg: 8 }} sx={{
                            justifyItems: 'center',
                            alignContent: 'center',
                        }}>
                            <Item sx={{
                                width: '100%',
                                margin: '2px',
                                textAlign: 'center',
                                backgroundColor: props.selectedStatus === status ? colors.color4 : colors.color2,
                                border: `2px solid ${getToothColor(status.categoryId)}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: colors.white
                            }}
                                onClick={() => props.onStatusChange(status)}
                            >
                                {status.statusName.trim()}
                            </Item>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}

type Props = {
    statusesByCategories?: Map<string, Status[]>;
    selectedStatus: Status | null;
    onStatusChange: (status: Status) => void;
};

const getToothColor = (state: number) => {
    switch (state) {
        case 1:
            return colors.greenTooth;
        case 2:
            return colors.redTooth;
        case 3:
            return colors.grayTooth;
        case 4:
            return colors.yellowTooth;
        case 5:
            return colors.blueTooth;
        default:
            return colors.white;
    }
};

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function ToothStatusComponent({ statusesByCategories, selectedStatus, onStatusChange }: Props) {
    const [currentTab, setCurrentTab] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    if (!statusesByCategories) {
        return <div>Loading...</div>;
    }


    return (
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: colors.white,
                display: 'flex',
                borderRadius: 8,
                margin: 0,
                height: 339,
            }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={currentTab}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{
                    borderRight: 1,
                    borderColor: 'divider',
                    color: colors.color1,
                    backgroundColor: colors.white,
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                }}
            >
                {Array.from(statusesByCategories.keys()).map((category, index) => (
                    <Tab
                        key={index}
                        label={category}
                        value={index}
                        sx={{
                            textTransform: 'none',
                        }}
                        {...a11yProps(index)}
                    />
                ))}
            </Tabs>
            {Array.from(statusesByCategories.entries()).map(([category, statuses], index) => (
                <TabPanel
                    key={index}
                    value={currentTab}
                    index={index}
                    statuses={statuses}
                    selectedStatus={selectedStatus}
                    onStatusChange={onStatusChange}
                />
            ))}
        </Box>
    );
}