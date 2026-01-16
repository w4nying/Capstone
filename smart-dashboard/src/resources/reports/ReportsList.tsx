import { List, Datagrid, TextField, DateField, ChipField } from 'react-admin';

export const ReportsList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <TextField source="type" label="Type" />
      <ChipField source="status" label="Status" />
      <TextField source="author" label="Author" />
      <DateField source="date" label="Date" showTime />
    </Datagrid>
  </List>
);