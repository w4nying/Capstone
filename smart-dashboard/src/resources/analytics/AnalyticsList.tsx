import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ChipField,
} from 'react-admin';

export const AnalyticsList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Metric Name" />
      <NumberField source="value" label="Value" />
      <ChipField source="category" label="Category" />
      <ChipField source="status" label="Status" />
      <DateField source="date" label="Date" />
    </Datagrid>
  </List>
);